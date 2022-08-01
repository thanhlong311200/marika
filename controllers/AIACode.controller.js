const AIACode = require('../models/AIACode.model');
const PromoCodes = require("../models/PromoCodes.model");
const {handlerResERROR, handlerResSUCCESS, generatePromoCode, sendMailAIACode, stringToInt, addMemberMailChimp} = require("../utils");
const ENV = require("../utils/Env");
const JWS_SECRET = ENV.get("JWS_SECRET");
const jws = require("jws");
const transporter = require("../config/SendMail");
const {AIA_SIGN_UP} = require("../config/Constant");
const System = require("../models/System.model");
const UsersInfo = require("../models/UsersInfo.model");
const stripe = require('stripe')(process.env.LIVE_MODE_API_KEY);

const createCode = async (req, res) => {
  try {
    const {email, price = 0, percent = 0} = req.body;
    if (!email) return res.status(400).send(handlerResERROR({message: "Create Fail !", code: "E_REQUEST"}));
    let code = "AIA" + generatePromoCode(10)
    let count = await PromoCodes.countDocuments({promoCode: code})
    if (count > 0) return res.status(400).send(handlerResERROR({
      message: "CODE EXIST!", code: "E_REQUEST"
    }));
    count = await AIACode.countDocuments({code})
    if (count > 0) return res.status(400).send(handlerResERROR({
      message: "CODE EXIST!", code: "E_REQUEST"
    }));
    if (!percent || percent <= 0) return res.status(422).send(handlerResERROR({
      message: "Invalid field !",
      code: "E_VALIDATION"
    }));

    const coupon = await stripe.coupons.create({
      // amount_off: price * 100,
      // duration: 'forever',
      // currency: 'aud',
      percent_off: percent,
      duration: 'forever',
    });
    const promotionCode = await stripe.promotionCodes.create({
      coupon: coupon.id,
      code: code,
      active: false
    });
    const newCode = new AIACode({
      email,
      code,
      percent,
      couponId: coupon.id,
      codeId: promotionCode.id
    });
    await newCode.save();
    const alg = ENV.get("JWS_ALG", 'HS256');
    let iat = Math.floor(new Date() / 1000);
    const confirmToken = jws.sign({
      header: {alg, typ: 'JWT'},
      payload: {id: newCode._id, iat, exp: iat + 900},
      secret: JWS_SECRET,
    });

    // Thêm mail chimp
    let mailChimp = await System.findOne({field: 'mailChimp'});
    if(mailChimp) {
      const userInfo = await UsersInfo.findOne({email});
      let fullName = userInfo ? userInfo.name : null;
      if (fullName) fullName = fullName.split(' ');
      if (!Array.isArray(fullName)) fullName = ['', ''];
      await addMemberMailChimp(AIA_SIGN_UP, mailChimp, email, fullName[0], fullName[fullName.length - 1]);
    }

    // SEND confirmToken TO EMAIL sendMailAIACode()
    await transporter.sendMail(sendMailAIACode(confirmToken, email, code));
    return res.status(200).send(handlerResSUCCESS({
      data: newCode,
      message: "Please check your email inbox to activate the code !"
    }))
  } catch (e) {
    console.log(e);
    return res.status(400).send(handlerResERROR({message: "Create Fail !", code: "E_REQUEST"}));
  }
}

const updateCode = async (req, res) => {
  try {
    const {id} = req.params;
    req.body.updatedAt = new Date()
    delete req.body.email;
    const oldAIA = await AIACode.findOne({_id: id})
    if (!oldAIA) return res.status(404).send(handlerResERROR({message: "Not found!"}))
    let coupon
    if (req.body.price) {
      coupon = await stripe.coupons.create({
        // amount_off: req.body.price * 100,
        // duration: 'forever',
        // currency: 'aud',
        percent_off: req.body.percent,
        duration: 'forever'
      });
    }
    if (coupon) {
      // console.log({coupon})
      await stripe.coupons.del(oldAIA?.couponId);
      const promotionCode = await stripe.promotionCodes.create({
        coupon: coupon.id,
        code: oldAIA?.code,
        active: true
      });
      req.body.couponId = coupon.id
      req.body.codeId = promotionCode.id
    } else if (req.body.status !== undefined) {
      await stripe.promotionCodes.update(
        oldAIA.codeId,
        {active: !!req.body.status}
      );
      req.body.status = req.body.status ? 1 : 0;
    }
    const data = await AIACode.findOneAndUpdate({_id: id}, {
      $set: req.body
    })
    if (data) return res.status(200).send(handlerResSUCCESS({data: {...data?._doc, ...req?.body}}))
    return res.status(200).send(handlerResSUCCESS({message: "Nothing update, check your  ID !"}))
  } catch (e) {
    console.log(e);
    return res.status(400).send(handlerResERROR({message: "Update  error!", code: "E_REQUEST"}));
  }
}

const confirmAiaCode = async (req, res) => {
  try {
    const {tokenConfirm} = req.query;
    if (!tokenConfirm) return res.status(400).send(handlerResERROR({message: "Confirm error !"}))
    const alg = ENV.get("JWS_ALG", 'HS256');
    const verified = jws.verify(tokenConfirm, alg, JWS_SECRET);
    // console.log({verified})
    if (!verified) return res.status(400).send(handlerResERROR({message: "Confirm error !"}))
    const jwsData = jws.decode(tokenConfirm);
    const data = await AIACode.findOneAndUpdate({_id: jwsData.payload.id}, {
      $set: {
        status: 1
      }
    })
    await stripe.promotionCodes.update(
      data.codeId,
      {active: true}
    );
    return res.status(200).send(handlerResSUCCESS({message: "Confirm code successful !", data: {active: true}}))
  } catch (e) {
    return res.status(400).send(handlerResERROR({message: "Update  error!", code: "E_REQUEST"}));
  }
}
//1aGvoOFXnh
const deleteCodeById = async (req, res) => {
  try {
    const {id} = req.params;
    if (!id) return res.status(404).send(handlerResERROR({message: "Not found !", code: "E_REQUEST"}));
    const dataDel = await AIACode.findById({_id: id})
    await stripe.coupons.del(dataDel?.couponId);
    const data = await AIACode.deleteOne({_id: id})
    if (data?.deletedCount === 0) return res.status(404).send(handlerResERROR({
      message: "Not found !", code: "E_REQUEST"
    }));
    return res.status(200).send(handlerResSUCCESS({data}))
  } catch (e) {
    return res.status(404).send(handlerResERROR({message: "Not found !", code: "E_REQUEST"}));
  }
}

const replaceCode = async (req, res) => {
  try {
    const {email} = req.body;
    const data = await AIACode.findOne({email})
    if (!data) return res.status(400).send({message: "Email don't exist!"})

    // check AIA exist
    let newCode = "AIA" + generatePromoCode(10)
    let count = await PromoCodes.countDocuments({promoCode: newCode})
    if (count > 0) return res.status(400).send(handlerResERROR({
      message: "Duplicate aia code and  !", code: "E_REQUEST"
    }));
    count = await AIACode.countDocuments({code: newCode})
    if (count > 0) return res.status(400).send(handlerResERROR({
      message: "AIA CODE EXIST!", code: "E_REQUEST"
    }));
    let coupon = await stripe.coupons.create({
      percent_off: data?.percent * 100,
      duration: 'forever'
    });
    // console.log({coupon})
    await stripe.coupons.del(data?.couponId);
    const promotionCode = await stripe.promotionCodes.create({
      coupon: coupon.id,
      code: data?.code,
      active: true
    });
    const newAIA = await AIACode.findOneAndUpdate({email}, {
      $set: {
        code: newCode,
        status: 1,
        couponId: coupon.id,
        codeId: promotionCode.id
      },
    }, {new: true})
    return res.status(200).send(handlerResSUCCESS({data: newAIA}))
  } catch (e) {
    console.log(e)
    return res.status(404).send(handlerResERROR({message: "Not found !", code: "E_REQUEST"}));
  }
}

const getCodeById = async (req, res) => {
  try {
    const {id} = req.params;
    if (!id) return res.status(404).send(handlerResERROR({message: "Not found !", code: "E_REQUEST"}));
    const data = await AIACode.findOne({_id: id})
    return res.status(200).send({data: data})
  } catch (e) {
    return res.status(404).send(handlerResERROR({message: "Not found !", code: "E_REQUEST"}));
  }
}

const getCodeByAdmin = async (req, res) => {
  try {
    if (req.roles !== 'admin') return res.status(400).send(handlerResERROR({message: "Get fail !", code: "E_REQUEST"}));
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
      // aggregate[0].$match.email = new RegExp('.*' + req.query.email + '.*', 'gi');
      aggregate[0].$match.code = new RegExp('.*' + req.query.code + '.*', 'gi');
    }
    let data = await AIACode.aggregate(aggregate)
    if (req.query.itemsPerPage) {
      aggregate.splice(aggregate.length-1, 1);
      data = data[0].data;
    }

    if(!data?.length) return res.status(200).send(handlerResSUCCESS({data: [], message: "Not found"}))
    let totalItems = await AIACode.aggregate(aggregate).count("totalItems");
    totalItems = totalItems?.length > 0 ? totalItems[0]?.totalItems : 0;
    return res.status(200).send(handlerResSUCCESS({data, totalItems}))
  } catch (e) {
    return res.status(404).send(handlerResERROR({message: "Not found !", code: "E_REQUEST"}));
  }
}

const getCodes = async (req, res) => {
  try {
    const {code} = req.query;
    if (!code) return res.status(404).send(handlerResERROR({message: "Code not found !"}))
    const position = code.search("AIA");
    // const regex = new RegExp('.*' + code + '.*', 'gi');
    let codeFind
    if (position >= 0) {
      codeFind = await AIACode.findOne({code: code})
    } else {
      codeFind = await PromoCodes.findOne({promoCode: code})
    }
    if (!codeFind) return res.status(404).send(handlerResERROR({message: "Code not found !"}))
    if(codeFind._doc.promoCode) {
      codeFind._doc.code = codeFind._doc.promoCode
      delete codeFind._doc.promoCode
    }
    if(!codeFind._doc.percent) {
      codeFind._doc.percent = 0
    }
    return res.status(200).send(handlerResSUCCESS({data: codeFind}))
  } catch (e) {
    return res.status(404).send(handlerResERROR({message: "Code not found !"}))
  }
}

module.exports = {
  createCode,
  updateCode,
  deleteCodeById,
  getCodeById,
  replaceCode,
  confirmAiaCode,
  getCodes,
  getCodeByAdmin
}
