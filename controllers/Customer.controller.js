const {handlerResERROR, handlerResSUCCESS} = require("../utils");
const UserInfo = require("../models/UsersInfo.model");
const {isNumber} = require("lodash");
const stripe = require('stripe')(process.env.LIVE_MODE_API_KEY);

const getCustomer = async (userId) => {
  const user = await UserInfo.findById(userId);
  return stripe.customers.retrieve(
    user?.paymentCustomerId
  );
}

const getCardInfo = (customerId = '', cardId = '') => {
  return stripe.customers.retrieveSource(customerId, cardId);
}

const createIntent = async (req, res) => {
  try {
    const {
      amount = null,
      currency = 'aud',
      paymentMethodTypes = ['card'],
      metadata = {}
    } = req.body
    if (amount <= 0 || !isNumber(amount) || !metadata?.orderId) return res.status(400).send(handlerResERROR({message: "Create payment intent fail, try again !"}))
    const result = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      payment_method_types: paymentMethodTypes,
      metadata
    });
    const {client_secret} = result
    return res.status(200).send(handlerResSUCCESS({data: {metadata: result?.metadata, client_secret}}))
  } catch (e) {
    console.log(e)
    return res.status(400).send(handlerResERROR({message: "Create payment intent fail, try again !"}))
  }
}

const createCard = async (req, res) => {
  try {
    const {
      number,
      expMonth,
      expYear,
      cvc,
    } = req.body
    const userId = req.uid;
    const user = await UserInfo.findById(userId);
    if (!user) return res.status(400).send(handlerResERROR({message: "Create fail, try again !"}))
    let customerId = user?.paymentCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        description: `Customer of User : ${userId}`,
      });
      customerId = customer.id
      await UserInfo.updateOne({_id: userId}, {$set: {paymentCustomerId: customerId}});
    }

    const token = await stripe.tokens.create({
      card: {
        number,
        exp_month: expMonth,
        exp_year: expYear,
        cvc,
      },
    });
    if (!token) return res.status(400).send(handlerResERROR({message: "Create fail, try again !"}))
    const tokenId = token.id;

    const card = await stripe.customers.createSource(
      customerId,
      {source: tokenId}
    );
    return res.status(200).send(handlerResSUCCESS({data: card}))
  } catch (e) {
    console.log(e)
    return res.status(400).send(handlerResERROR({message: "Create fail, try again !"}))
  }
}
const updateCard = async (req, res) => {
  try {
    const userId = req.uid;
    const cardId = req.params.id
    const user = await UserInfo.findById(userId);
    let customerId = user?.paymentCustomerId || null;
    if (!user || !customerId || !cardId) return res.status(400).send(handlerResERROR({message: "Update fail, try again !"}))

    const data = {}
    if (req.body.address_city) data.address_city = req.body.address_city
    if (req.body.address_country) data.address_country = req.body.address_country
    if (req.body.address_state) data.address_state = req.body.address_state
    if (req.body.address_line1) data.address_line1 = req.body.address_line1
    if (req.body.address_line2) data.address_line2 = req.body.address_line2
    if (req.body.address_zip) data.address_zip = req.body.address_zip
    if (req.body.exp_month) data.exp_month = req.body.exp_month
    if (req.body.exp_year) data.exp_year = req.body.exp_year
    if (req.body.metadata) data.metadata = req.body.metadata
    if (req.body.name) data.name = req.body.name

    const card = await stripe.customers.updateSource(
      customerId,
      cardId,
      {...data}
    );
    return res.status(200).send(handlerResSUCCESS({data: card}))
  } catch (e) {
    console.log(e)
    return res.status(400).send(handlerResERROR({message: "Update fail, try again !"}))
  }
}
const deleteCard = async (req, res) => {
  try {
    const userId = req.uid;
    const cardId = req.params.id
    const user = await UserInfo.findById(userId);
    let customerId = user?.paymentCustomerId || null;
    if (!user || !customerId || !cardId) return res.status(400).send(handlerResERROR({message: "Delete fail, try again !"}))
    const card = await stripe.customers.deleteSource(
      customerId,
      cardId,
    );
    return res.status(200).send(handlerResSUCCESS({data: card}))
  } catch (e) {
    console.log(e)
    return res.status(400).send(handlerResERROR({message: "Delete fail, try again !"}))
  }
}

const getCard = async (req, res) => {
  try {
    const userId = req.uid;
    const user = await UserInfo.findById(userId);
    if (!user) return res.status(400).send(handlerResERROR({message: "Get customer fail, try again !"}))
    let customerId = user?.paymentCustomerId;
    if (!customerId) return res.status(200).send(handlerResSUCCESS({data: [], message: "No data customer"}))
    const cards = await stripe.customers.listSources(
      customerId,
      {object: 'card'}
    );
    return res.status(200).send(handlerResSUCCESS({data: cards}))
  } catch (e) {
    console.log(e)
    return res.status(400).send(handlerResERROR({message: "Get customer error, try again !"}))
  }
}

module.exports = {
  createCard,
  updateCard,
  deleteCard,
  getCard
}
