const Payment = require('../models/Payment.model');
const UsersInfo = require('../models/UsersInfo.model');
const {handlerResERROR, handlerResSUCCESS, stringToInt} = require("../utils");
const PromoCodes = require("../models/PromoCodes.model");
const AIACode = require("../models/AIACode.model");
const Membership = require('../models/MemberShip.model');
const stripe = require('stripe')(process.env.LIVE_MODE_API_KEY);
// const customerApiUrl = 'https://api.stripe.com/v1/customers';
const UserLogin = require('../models/UserLogin.model');
const { round } = require('lodash');

const aggPayment = [
  {$match: {}},
  {
    $addFields: {
      "userId": {$toObjectId: "$userId"},
      "membershipId": {$toObjectId: "$membershipId"}
    }
  },
  {
    $lookup: {
      from: 'profiles',
      localField: 'userId',
      foreignField: '_id',
      as: 'profile',
      pipeline: [{$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },
  {$match: {}},
  {
    $lookup: {
      from: 'memberships',
      localField: 'membershipId',
      foreignField: '_id',
      as: 'membership',
      pipeline: [
        {$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },
  {$addFields: {"membership": {$arrayElemAt: ["$membership", 0]}}},
  {$addFields: {"profile": {$arrayElemAt: ["$profile", 0]}}},
  {$sort: {"createdAt": -1}},
  {$project: {__v: 0, membershipId: 0, userId: 0}}
]

const createCustomer = async (userId = null) => {
  try {
    const info = await UsersInfo.findById(userId);
    if (!info) return null
    if (info?.paymentCustomerId) return info.paymentCustomerId
    console.log("Create new customer")
    const customer = await stripe.customers.create({
      description: `Stripe create customer payment => userId: ${userId}`,
    });
    await UsersInfo.findOneAndUpdate({_id: userId}, {
      $set: {
        paymentCustomerId: customer.id
      }
    });
    return customer.id
  } catch (e) {
    return null
  }
}

const createPayment = async (req, res) => {
  try {
    const {membershipId = '', note = ''} = req.body;

    let code = req.body.code || null
    if (code) {
      if (code.search("AIA") === 0) {
        code = await AIACode.findOne({code, status: 1})
      } else code = await PromoCodes.findOne({promoCode: code})
      if (!code) return res.status(400).send(handlerResERROR({
        message: "Code don't exist or AIA code don't active, try again!",
        code: "E_REQUEST"
      }));
    }
    const memberShip = await Membership.findOne({_id: membershipId})
    if (!memberShip) return res.status(400).send(handlerResERROR({
      message: "MemberShip id don't exist!",
      code: "E_REQUEST"
    }));
    
  
    let totalPayment = memberShip?.price
    if (code?.percent > 0 && code?.percent < 100) totalPayment = memberShip?.price - (code?.percent * memberShip?.price / 100)
    else if (code?.price > 0 && code?.price < memberShip?.price) totalPayment = memberShip?.price - code?.price
    totalPayment = (Math.floor(totalPayment * 100)/100)
    const userId = req.uid;
    const paymentCustomerId = await createCustomer(userId)
    if (!paymentCustomerId) return res.status(400).send(handlerResERROR({
      message: "Create customer error!",
      code: "E_REQUEST"
    }));
    const newPayment = new Payment({
      userId,
      membershipId,
      price: totalPayment,
      promoCode: code?.promoCode || '',
      aiaCode: code?.code || '',
      note
    });
    
    await newPayment.save();
    const params = {
      customer: paymentCustomerId,
      items: [{price: memberShip.proPriceId},
      ],
      metadata: {orderId: newPayment?._id.toString()},
    }
    if (code)params.promotion_code = code.codeId;
    let checkUser = await UserLogin.findById(userId);
    if (code && code.code && code.email != checkUser.username) return res.status(400).send(handlerResERROR({
      message: "Invalid Code, Try again",
      code: "E_REQUEST"
    }));
   
     let subscription = {}
     let resulf = {}
     let dateNow = new Date();
     let target = (checkUser.membershipExp)? new Date(checkUser.membershipExp) : new Date(1000);
      if(target.getTime() < dateNow.getTime()){
         subscription = await stripe.subscriptions.create(params)
         if(subscription.id) await UsersInfo.findByIdAndUpdate(req.uid, {
          $set: {schedule:false}
        })
         resulf = {
          data: {...newPayment._doc, paymentCustomerId, subscription: subscription.id},
          message: "Retrieve data in 3 seconds ! "
        }
      }else{
        const params = {
          customer: paymentCustomerId
        }
        params.start_date = round(target.getTime()/1000)
        params.end_behavior = 'release'
        params.phases = [
          {
            items: [
              {
                price: memberShip.proPriceId,
                quantity: 1,
              },
            ],
            iterations:12
          },
        ];
         subscription = await stripe.subscriptionSchedules.create(params)
         await UsersInfo.findByIdAndUpdate(req.uid, {
          $set: {isSubscription: true, schedule:true, scheduleId:subscription.id}
        })
         resulf = {
          data: {...newPayment._doc, paymentCustomerId, subscription: subscription.id},
          message: "Retrieve data in 5 seconds ! "
        }
        
      }
    return res.status(200).send(handlerResSUCCESS(resulf))
  } catch (e) {
    if(e?.message?.search("No such price") >= 0){
      return res.status(400).send(handlerResERROR({message: "Create payment fail: Membership not found !", code: "E_REQUEST"}));
    }
    if(e?.message)
      return res.status(400).send(handlerResERROR({message: "Create payment Fail. " + e.message + " Or check your payment card !", code: "E_REQUEST"}));
    return res.status(400).send(handlerResERROR({message: "Create payment Fail !", code: "E_REQUEST"}));
  }
}

const updatePayment = async (req, res) => {
  try {
    const {id} = req.params;
    const data = await Payment.findOneAndUpdate({_id: id}, {
      $set: {status: req.body.status}
    })
    if (data) return res.status(200).send(handlerResSUCCESS({data: {...data?._doc, ...req?.body}}))
    return res.status(200).send(handlerResSUCCESS({message: "Nothing update, check payment id !"}))
  } catch (e) {
    return res.status(400).send(handlerResERROR({message: "Update payment Fail !", code: "E_REQUEST"}));
  }
}

const getPayments = async (req, res) => {
  try {
    const userId = req.uid;
    if (req.query.itemsPerPage) {
      const pageNumber = (typeof req.query?.pageNumber === 'string') ? stringToInt(req.query?.pageNumber) : req.query?.pageNumber || 0;
      const itemsPerPage = (typeof req.query?.itemsPerPage === 'string') ? stringToInt(req.query?.itemsPerPage) : req.query?.itemsPerPage;
      let data
      if (req.query.status) {
        data = await Payment.find({
          userId: userId, status: req.query.status
        }).limit(itemsPerPage).skip(itemsPerPage * pageNumber)
      } else data = await Payment.find({userId: userId}).limit(itemsPerPage).skip(itemsPerPage * pageNumber)
      if (!data) return res.status(404).send(handlerResSUCCESS({data: [], message: "Not found"}))
      const totalItems = await Payment.countDocuments({userId})
      return res.status(200).send(handlerResSUCCESS({data, totalItems}))
    }
    const data = await Payment.find({userId: userId})
    return res.status(200).send(handlerResSUCCESS({data: data || []}))
  } catch (e) {
    return res.status(404).send(handlerResERROR({message: "Not found!", code: "E_REQUEST"}));
  }
}

const getPaymentsByAdmin = async (req, res) => {
  try {
    const query = [...aggPayment];
    query[0].$match = {}
    query[3].$match = {}
    if (req.query.status) {
      query[0].$match.status = req.query.status
    }
    if (req.query.membershipId) {
      query[0].$match.membershipId = req.query.membershipId
    }
    if (req.query.email) {
      query[3].$match["profile.email"] = new RegExp('.*' + req.query.email + '.*', 'ig')
    }
    const {start, end} = req.query
    if(start && end) {
      query[0].$match.updatedAt = {
        $gte: new Date(start),
        $lte: new Date(end),
      }
    }
    if (req.query.itemsPerPage) {
      const pageNumber = (typeof req.query?.pageNumber === 'string') ? stringToInt(req.query?.pageNumber) : req.query?.pageNumber || 0;
      const itemsPerPage = (typeof req.query?.itemsPerPage === 'string') ? stringToInt(req.query?.itemsPerPage) : req.query?.itemsPerPage;
      const skip = itemsPerPage * pageNumber;
      query.push({$facet: {data: [{$skip: skip}, {$limit: itemsPerPage}]}})
    }
    let data = await Payment.aggregate(query)
    if (req.query.itemsPerPage) {
      query.splice(query.length-1, 1)
      data = data[0].data;
    }
    if (data.length === 0) return res.status(200).send(handlerResSUCCESS({data: [], message: "Menu food not found"}))

    let totalItems = await Payment.aggregate(query).count("totalItems");
    totalItems = totalItems.length > 0 ? totalItems[0].totalItems : 0;
    return res.status(200).send(handlerResSUCCESS({data, totalItems}))
  } catch (e) {
    return res.status(404).send(handlerResERROR({message: "Not found!", code: "E_REQUEST"}));
  }
}

const getPaymentById = async (req, res) => {
  try {
    const {id} = req.params;
    const userId = req.uid;
    if (!id) return res.status(422).send(handlerResERROR({message: "Not found!", code: "E_REQUEST"}));
    let data
    if (req.roles === 'admin') {
      data = await Payment.findOne({_id: id})
    } else {
      data = await Payment.findOne({_id: id, userId: userId})
    }
    return res.status(200).send(handlerResSUCCESS({data: data}))
  } catch (e) {
    return res.status(404).send(handlerResERROR({message: "Not found !", code: "E_REQUEST"}));
  }
}

const revenue = async (req, res) => {
  try {
    const query = [
      {$match: {status: "succeeded"}},
      {$group: {
        _id: null,
          revenue: {$sum: "$price"}
      }}
    ]
    const {start, end} = req.query
    if(start && end) query[0].$match.updatedAt = {
      $gte: new Date(start),
      $lte: new Date(end),
    }
    let data = await Payment.aggregate(query)
    if(data.length === 0) return res.send({revenue: 0})
    const {revenue} = data[0]
    return res.send({revenue})
  } catch (e) {
    console.log(e)
    return res.status(404).send(handlerResERROR({message: "Not found !", code: "E_REQUEST"}));
  }
}
const handlePaymentChargeSucceeded = (charge) => {
  console.log(`payment Change Succeeded !`);
}
const handlePaymentCreated = async (paymentIntent) => {
  console.log(`Payment Intent Created !`);
}
const handlePaymentMethodAttached = (paymentMethod) => {
  console.log(`handle Payment Method Attached !`);
}

const handlePaymentIntentSucceeded = async (paymentIntent) => {
  try {
    console.log("paymentIntent.metadata", paymentIntent.metadata)
    const payment = await Payment.findOne({
      _id: paymentIntent?.metadata?.orderId,
      status: 'pending',
    })
    if (!payment || paymentIntent.amount < payment.price) return null;
    const {id, object, amount, created, currency, receipt_email, status} = paymentIntent;
    let orders = {id, object, amount, created, currency, receipt_email, status}

    const membershipDoc = await Membership.findOne({_id: payment.membershipId});

    const time = membershipDoc?.time
    const type = membershipDoc?.type
    let membershipExp = moment().add(time, type).format()
    const user = await UserLogin.findById(payment.userId)
    if (user?.membershipExp && moment(user?.membershipExp).isAfter(moment()))
      membershipExp = moment(user?.membershipExp).add(time, type).format()
    // console.log({amountTimeExp, typeAdd, membershipExp, userId: payment.userId})
    await Promise.all([
      UserLogin.findOneAndUpdate({_id: payment.userId}, {$set: {membershipExp}}),
      UsersInfo.findOneAndUpdate({_id: payment.userId}, {$set: {membershipId: payment.membershipId}})])
    const paymentUp = await Payment.findOneAndUpdate({_id: paymentIntent?.metadata?.orderId}, {
      $set: {
        status: orders?.status,
        orders
      }
    })
    if (paymentUp.aiaCode) {
      //aiaCode Logs
      const aiaCode = await AIACode.findOne({code: paymentUp.aiaCode});
      const logAIA = new LogsModel({
        type: 'aia',
        aiaCodeId: aiaCode._id,
        userId: paymentUp.userId,
        paymentId: paymentUp._id
      })
      await logAIA.save()
    } else if (paymentUp?.promoCode) {
      //promoCode Logs
      const promo = await PromoCodes.findOne({promoCode: paymentUp.promoCode});
      const promoCodeLog = new LogsModel({
        type: 'promo',
        promoCodeId: promo._id,
        userId: paymentUp.userId,
        paymentId: paymentUp._id
      })
      await promoCodeLog.save()
      //+ numberOfUse
      PromoCodes.findOneAndUpdate({promoCode: paymentUp.promoCode}, {
        $set: {
          numberOfUse: promo?.numberOfUse + 1,
        }
      });
    }
    //paymentUp Logs
    const paymentLog = new LogsModel({
      type: 'payment',
      userId: paymentUp.userId,
      paymentId: paymentUp._id,
      data: {...paymentIntent}
    })
    await paymentLog.save()
  } catch (e) {
    console.log(e)
    return null
  }
}

/*stripe listen --forward-to localhost:4000/stripe-webhooks

stripe payment_intents create \
  --amount=2000 \
  --currency=aud \
  -d "metadata[orderId]"=61d15ae91f92ecdfee222b2c

stripe payment_intents confirm pi_3KBmV1F9MnwHu4ZY1NBnJxN5 \
  --payment-method=pm_card_visa

*/
//
// const webhookStripe = (request, response) => {
//   let event = request.body;
//   // console.log("WEBHOOK STRIPE PAYMENT!", event.type)
//   switch (event.type) {
//     case 'payment_intent.created':
//       const paymentIntentCreated = event.data.object;
//       handlePaymentCreated(paymentIntentCreated);
//       break;
//     case 'charge.succeeded':
//       const paymentChangeSucceeded = event.data.object;
//       handlePaymentChargeSucceeded(paymentChangeSucceeded);
//       break;
//     case 'payment_intent.succeeded':
//       const paymentIntent = event.data.object;
//       handlePaymentIntentSucceeded(paymentIntent).then();
//       break;
//     case 'payment_method.attached':
//       const paymentMethod = event.data.object;
//       handlePaymentMethodAttached(paymentMethod);
//       break;
//     default:
//       // Unexpected event type
//       console.log(`Unhandled event type ${event.type}.`);
//   }
//   // Return a 200 response to acknowledge receipt of the event
//   response.status(200).send();
// }

module.exports = {
  createPayment,
  updatePayment,
  getPaymentById,
  getPayments,
  createCustomer,
  getPaymentsByAdmin,
  revenue
}
