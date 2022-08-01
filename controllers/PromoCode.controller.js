const PromoCodes = require('../models/PromoCodes.model');
const {handlerResERROR, handlerResSUCCESS, generatePromoCode, stringToInt} = require("../utils");
const stripe = require('stripe')(process.env.LIVE_MODE_API_KEY);

const createPromoCode = async (req, res) => {
  try {
    const {percent, price, autoGenerate = false, numberOfUse = 0} = req.body;
    const userId = req.uid
    let promoCode = req.body.promoCode;
    if (autoGenerate) promoCode = generatePromoCode()
    const count = await PromoCodes.countDocuments({promoCode})
    if (count > 0) return res.status(400).send(handlerResERROR({message: "PromoCode exists !", code: "E_REQUEST"}));
    if (!percent && !price || price < 0 || percent < 0) return res.status(400).send(handlerResERROR({
      message: "Value code must percent > 0 or price > 0 !",
      code: "E_REQUEST"
    }));
    let coupon
    if (percent) {
      coupon = await stripe.coupons.create({
        percent_off: percent,
        duration: 'forever',
      });
      req.body.price = 0
    } else {
      coupon = await stripe.coupons.create({
        amount_off: price * 100,
        duration: 'forever',
        currency: 'aud'
      });
      req.body.percent = 0
    }
    const promotionCode = await stripe.promotionCodes.create({
      coupon: coupon.id,
      code: promoCode,
      active: true
    });
    // console.log({promotionCode, coupon})
    const newPromoCodes = new PromoCodes({
      userId,
      promoCode,
      percent: req.body.percent || 0,
      price : req.body.price || 0,
      autoGenerate,
      numberOfUse,
      couponId: coupon.id,
      codeId: promotionCode.id
    });
    await newPromoCodes.save();
    return res.status(200).send(handlerResSUCCESS({
      data: {
        ...newPromoCodes?._doc,
        promoCode,
      }
    }))
  } catch (e) {
    console.log(e);
    return res.status(400).send(handlerResERROR({message: "Create Fail !", code: "E_REQUEST"}));
  }
}

const updatePromoCode = async (req, res) => {
  try {
    const {id} = req.params;
    req.body.updatedAt = new Date()
    const {price, percent, numberOfUse} = req.body
    const oldPromo = await PromoCodes.findOne({_id: id})
    if (!price && !percent && !numberOfUse) return res.status(200).send(handlerResSUCCESS({message: "Nothing update, check your promo code !"}))
    if (!oldPromo) return res.status(404).send(handlerResERROR({message: "Not found!"}))
    let coupon
    // console.log({oldPromo})
    const dataBody = req?.body
    if (percent) {
      coupon = await stripe.coupons.create({
        percent_off: percent,
        duration: 'forever',
      });
      dataBody.price = 0
    } else if (price) {
      coupon = await stripe.coupons.create({
        amount_off: price * 100,
        duration: 'forever',
        currency: 'aud'
      });
      dataBody.percent = 0
    }
    if (coupon) {
      // console.log({coupon})
      await stripe.coupons.del(oldPromo?.couponId);
      const promotionCode = await stripe.promotionCodes.create({
        coupon: coupon.id,
        code: oldPromo?.promoCode,
        active: true
      });
      dataBody.couponId = coupon.id
      dataBody.codeId = promotionCode.id
    }
    const data = await PromoCodes.findOneAndUpdate(
      {_id: id},
      {
        $set: dataBody
      })
    if (data)
      return res.status(200).send(handlerResSUCCESS({data: {...data?._doc, ...req?.body}}))
    return res.status(200).send(handlerResSUCCESS({message: "Nothing update, check your promo code ID !"}))
  } catch (e) {
    console.log(e);
    return res.status(400).send(handlerResERROR({message: "Update Promo Code Fail!", code: "E_REQUEST"}));
  }
}

const deletePromoCodeById = async (req, res) => {
  try {
    const {id} = req.params;
    if (!id) return res.status(404).send(handlerResERROR({message: "Not found !", code: "E_REQUEST"}));
    const dataDel = await PromoCodes.findById({_id: id})
    await stripe.coupons.del(dataDel?.couponId);
    const data = await PromoCodes.deleteOne({_id: id})
    if (data?.deletedCount === 0) return res.status(404).send(handlerResERROR({
      message: "Not found !",
      code: "E_REQUEST"
    }));
    return res.status(200).send(handlerResSUCCESS({data}))
  } catch (e) {
    return res.status(400).send(handlerResERROR({message: "Delete fail !", code: "E_REQUEST"}));
  }
}

const getPromoCodes = async (req, res) => {
  try {
    if (req.roles === "admin" && !req.query.promoCode) {
      const aggregate = [
        {$match: {}},
        {$project: {__v: 0}},
        {$sort: {"createdAt": -1}}
      ]
      if (req.query.itemsPerPage) {
        const pageNumber = (typeof req.query?.pageNumber === 'string') ? stringToInt(req.query?.pageNumber) : req.query?.pageNumber || 0;
        const itemsPerPage = (typeof req.query?.itemsPerPage === 'string') ? stringToInt(req.query?.itemsPerPage) : req.query?.itemsPerPage;
        let skip = itemsPerPage * pageNumber;
        aggregate.push({$facet: {data: [{$skip: skip}, {$limit: itemsPerPage}]}})
      }
      if(req.query.code){
        aggregate[0].$match.promoCode = new RegExp('.*' + req.query.code + '.*', 'gi');
      }
      let data = await PromoCodes.aggregate(aggregate)
      if (req.query.itemsPerPage) {
        aggregate.splice(aggregate.length-1, 1);
        data = data[0].data;
      }

      if(!data?.length) return res.status(200).send(handlerResSUCCESS({data: [], message: "Not found"}))
      let totalItems = await PromoCodes.aggregate(aggregate).count("totalItems");
      totalItems = totalItems?.length > 0 ? totalItems[0]?.totalItems : 0;
      return res.status(200).send(handlerResSUCCESS({data, totalItems}))
    } else if (req.query.promoCode) {
      const data = await PromoCodes.findOne({promoCode: req.query.promoCode})
      if (!data) return res.status(404).send({message: "Not found !"})
      return res.status(200).send({data: data})
    }
    return res.status(200).send({message: "No data query!"})
  } catch (e) {
    // console.log(e)
    return res.status(400).send(handlerResERROR({message: "Get fail !", code: "E_REQUEST"}));
  }
}

const getPromoCodeById = async (req, res) => {
  try {
    const {id} = req.params;
    if (!id) return res.status(404).send(handlerResERROR({message: "Not found !", code: "E_REQUEST"}));
    const data = await PromoCodes.findOne({_id: id})
    return res.status(200).send({data: data})
  } catch (e) {
    return res.status(400).send(handlerResERROR({message: "Get fail !", code: "E_REQUEST"}));
  }
}

module.exports = {
  createPromoCode,
  updatePromoCode,
  deletePromoCodeById,
  getPromoCodeById,
  getPromoCodes
}
