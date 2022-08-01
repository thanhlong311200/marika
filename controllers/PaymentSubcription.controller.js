const {handlerResERROR, handlerResSUCCESS, addMemberMailChimp} = require("../utils");
const Payment = require('../models/Payment.model');
const UserLogin = require('../models/UserLogin.model');
const PromoCodes = require('../models/PromoCodes.model');
const moment = require("moment");
const UsersInfo = require("../models/UsersInfo.model");
const Logs = require("../models/Logs");
const System = require("../models/System.model");
const {SURVEY_COMPLETION, WELCOME_LIST} = require("../config/Constant");
const stripe = require('stripe')(process.env.LIVE_MODE_API_KEY);
const endpointSecret = process.env.STRIPE_SECRET;

const createPaymentSub = async (req, res) => {
  try {

    return res.status(200).send(handlerResSUCCESS())
  } catch (e) {
    console.log(e);
    return res.status(400).send(handlerResERROR({message: "Create payment Fail !", code: "E_REQUEST"}));
  }
}

const updatePaymentSub = async (req, res) => {
  try {

    return res.status(200).send(handlerResSUCCESS({message: "Nothing update, check payment id !"}))
  } catch (e) {
    console.log(e);
    return res.status(400).send(handlerResERROR({message: "Update payment Fail !", code: "E_REQUEST"}));
  }
}

const getPaymentSubs = async (req, res) => {
  try {
    const userId = req.uid;

    return res.status(200).send(handlerResSUCCESS({data: data || []}))
  } catch (e) {
    return res.status(404).send(handlerResERROR({message: "Not found!", code: "E_REQUEST"}));
  }
}

const handlePaymentIntentSucceeded = async (paymentSuccess) => {
  // console.log({paymentSuccess})
}

const handlePaymentChargeSucceeded = (charge) => {
  // console.log(`payment Change Succeeded !`, charge);
}
const handlerPlanUpdated = (plan) => {
  // console.log(`handler Plan Updated !`, plan);
}
const handlerPriceUpdated = (price) => {
  // console.log(`handler Price Updated !`, price);
}
const handleInvoiceSuccess = async (invoice) => {
  try {
    console.log(`handle Invoice Success !`, invoice.id);
    const {id, charge, currency, customer, payment_intent, subtotal, total,} = invoice
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
    const payment = await Payment.findOne({_id: subscription?.metadata?.orderId})
    if (!payment) return null;
    const paymentIntent = await stripe.paymentIntents.retrieve(
      payment_intent
    );
    if (paymentIntent.amount / 100 < payment?.price) return null
    let membershipExp = moment().add(subscription?.plan?.interval_count, subscription?.plan?.interval).format()
    const user = await UserLogin.findById(payment?.userId)
    if (user?.membershipExp && moment(new Date(user?.membershipExp)).isAfter(moment()))
      membershipExp = moment(new Date(user?.membershipExp)).add(subscription?.plan?.interval_count, subscription?.plan?.interval).format()
    const userInfo = await UsersInfo.findOne({_id: user?._id})
    if (userInfo?.membershipId) {
      // Cancel all old subscription
      const subscriptions = (await stripe.subscriptions.list({customer}))?.data || [];
      const cancelSubs = subscriptions.filter(sub => sub.id !== invoice.subscription)
      // logs and cancel sub
      console.log("New subscription:", invoice.subscription, "Customer: ", customer);
      // console.log(subscriptions);
      if (cancelSubs?.length) {
        console.log("cancelSubs old sub:", cancelSubs.map(sub => ({id: sub?.id})));
        await Promise.all(cancelSubs.map(async sub => {
          await stripe.subscriptions.del(sub?.id);
        }))
      }
    }
    await Promise.all([
      UserLogin.findOneAndUpdate({_id: payment?.userId}, {$set: {membershipExp}}),
      UsersInfo.findOneAndUpdate({_id: payment?.userId}, {
        $set: {
          membershipId: payment?.membershipId,
          isSubscription: true
        }
      })])

    let orders = {
      id: paymentIntent.id,
      amount: paymentIntent?.amount,
      created: paymentIntent?.created,
      currency: paymentIntent?.currency,
      receipt_email: paymentIntent?.receipt_email,
      status: paymentIntent?.status
    }

    await Payment.findOneAndUpdate({_id: payment?._id}, {
      $set: {
        status: orders?.status,
        orders,
        updatedAt: new Date()
      }
    })

    //paymentUp Logs
    const paymentLog = new Logs({
      type: 'payment',
      userId: payment?.userId,
      paymentId: payment?._id,
      data: {...paymentIntent}
    })
    await paymentLog.save()

    if (payment.promoCode) {
      const promo = await PromoCodes.findOne({promoCode: payment.promoCode})
      if (!promo) return;
      const newCount = promo.numberOfUse + 1 || 1;
      // console.log(payment.promoCode, newCount)
      await PromoCodes.updateOne({_id: promo._id}, {$set: {numberOfUse: newCount}});
    }

    // Thêm mail chimp
    let mailChimp = await System.findOne({field: 'mailChimp'});
    if (mailChimp) {
      let fullName = userInfo.name;
      if (fullName) fullName = fullName.split(' ');
      if (!Array.isArray(fullName)) fullName = ['', ''];
      await addMemberMailChimp(SURVEY_COMPLETION, mailChimp, user.username, fullName[0], fullName[fullName.length - 1]);
      await addMemberMailChimp(WELCOME_LIST, mailChimp, user.username, fullName[0], fullName[fullName.length - 1]);
    }

    console.log("Payment save data and log => Done!")
  } catch (e) {
    console.log(e)
  }
}
const handlerSubcriptionCancel = (sub) => {
  // console.log(`handle Invoice Success !`, sub);
}

const handlePaymentCreated = async (paymentIntent) => {
  try {
    if (paymentIntent?.metadata?.orderId) {
      const payment = await Payment.findOne({
        _id: paymentIntent?.metadata?.orderId,
      })
      const paymentLog = new Logs({
        type: 'payment',
        userId: payment.userId,
        paymentId: payment._id,
        data: {...paymentIntent}
      })
      await paymentLog.save()
    }else{
      const paymentLog = new Logs({
        type: 'payment',
        data: {...paymentIntent}
      })
      await paymentLog.save()
    }
  }catch (e) {
    return null
  }
}

const webhookStripe = (request, response) => {
  console.log("Trigger webhook Stripe ...!")
  const sig = request.headers['stripe-signature'];
  //    console.log({sig,body: request.body,endpointSecret})
  let event
  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
   // response.status(400).send(`Webhook Error: ${err.message}`);
  } 
  event = request.body
  switch (event.type) {
    case 'charge.succeeded':
      const paymentChangeSucceeded = event.data.object;
      handlePaymentChargeSucceeded(paymentChangeSucceeded);
      break;
    case 'invoice.created':
      const paymentIntentCreated = event.data.object;
      handlePaymentCreated(paymentIntentCreated).then();
      break;
    case 'invoice.payment_succeeded':
      const invoiceSuccess = event.data.object;
      handleInvoiceSuccess(invoiceSuccess).then();
      break;
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      handlePaymentIntentSucceeded(paymentIntent).then();
      break;
    case 'plan.updated':
      const plan = event.data.object;
      handlerPlanUpdated(plan)
      break;
    case 'price.updated':
      const price = event.data.object;
      handlerPriceUpdated(price);
      break;
    case 'customer.subscription.deleted':
      const subCancel = event.data.object;
      handlerSubcriptionCancel(subCancel);
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`,event);
  }
  // Return a 200 response to acknowledge receipt of the event
  response.status(200).send();
}

module.exports = {
  createPaymentSub,
  updatePaymentSub,
  getPaymentSubs,
  webhookStripe
}
