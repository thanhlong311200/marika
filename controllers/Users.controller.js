'use strict';
const {unlink} = require("fs/promises");
const UserLogin = require('../models/UserLogin.model');
const UsersInfo = require('../models/UsersInfo.model');
const Dietary = require('../models/Dietary.model');
const MealPlan = require('../models/MealPlan.model');
const MembershipType = require('../models/MembershipType.model');
const Token = require('../models/Token.model');
const {hashPass, checkPass} = require('../utils/Password');
const {handlerResERROR, handlerResSUCCESS, stringToInt, resizeImage, addMemberMailChimp} = require("../utils");
const {ObjectId} = require("mongodb");
const ENV = require("../utils/Env");
const moment = require("moment");
const MenuFood = require("../models/MenuFood.model");
const AIACode = require("../models/AIACode.model");
const System = require("../models/System.model");
const {MEMBER_CANCEL_SUB} = require("../config/Constant");
const stripe = require('stripe')(process.env.LIVE_MODE_API_KEY);
const regexDomain = new RegExp(ENV.getOrFail("DOMAIN"), 'i');
const firebase = require("../config/FirebaseInit");

const aggUserInfo = [
  {$match: {}},
  {$project: {__v: 0, dietaryId: 0, createdAt: 0, updatedAt: 0,}},
  {
    $lookup: {
      from: "profiles",
      localField: "_id",
      foreignField: "_id",
      as: "profile",
      pipeline: [{$project: {__v: 0}}],
    }
  },
  {$replaceRoot: {newRoot: {$mergeObjects: [{$arrayElemAt: ["$profile", 0]}, "$$ROOT"]}}},
  {$match: {}},
  {
    $lookup: {
      from: "dietaries",
      localField: "dietary",
      foreignField: "_id",
      as: "dietary_data",
      pipeline: [{$project: {__v: 0, createdAt: 0, updatedAt: 0}}],
    }
  },
  {
    $lookup: {
      from: "memberships",
      localField: "membershipId",
      foreignField: "_id",
      as: "memberships",
      pipeline: [{$project: {__v: 0}}],
    }
  },
  {
    $addFields: {
      "dietary_data": {$arrayElemAt: ["$dietary_data", 0]},
      "memberships": {$arrayElemAt: ["$memberships", 0]},
    }
  },
  {$project: {__v: 0, profile: 0, password: 0}},
]

const aggregate = [
  {$match: {}},
  {
    $lookup: {
      from: 'profiles',
      localField: '_id',
      foreignField: '_id',
      as: 'profile',
      pipeline: [{$project: {_id: 0, createdAt: 0}},],
    }
  },
  {$replaceRoot: {newRoot: {$mergeObjects: [{$arrayElemAt: ["$profile", 0]}, "$$ROOT"]}}},
  {$project: {password: 0, profile: 0}},
  {$sort: {"createdAt": -1}}
]

const changePass = async (req, res) => {
  try {
    const userId = req.uid;
    let {oldPassword, password} = req.body;
    const user = await UserLogin.findOne({"_id": userId, 'roles': 'admin'});
    if (!user || user.isDelete) return res.status(400).send(handlerResERROR({
      message: "User not found !",
      code: "E_REQUEST"
    }));
    const hashPassword = await hashPass(password);
    const check = await checkPass(oldPassword, user.password);
    if (!check) return res.status(400).send(handlerResERROR({message: "Change password Fail !", code: "E_REQUEST"}));
    await Token.remove({userId});
    await UserLogin.updateOne({_id: userId}, {$set: {password: hashPassword}});
    return res.status(200).send(handlerResSUCCESS({message: 'Change password success !'}));
  } catch (error) {
    return res.status(400).send(handlerResERROR({message: "Change password Fail !", code: "E_REQUEST"}));
  }
};

const createProfile = async (req, res) => {
  try {
    const user = await UserLogin.findById(req.uid);
    if (user._doc.isDelete) return res.status(400).send(handlerResERROR({
      message: "User not found !",
      code: "E_REQUEST"
    }));

    if (req.body.dietary) {
      const result = await Dietary.findById(req.body.dietary);
      if (!result) return res.status(400).send(handlerResERROR({
        message: "Dietary id not found !",
        code: "E_REQUEST"
      }));
    }

    if (req.body.mealPlan && !req.body.dietary) return res.status(400).send(handlerResERROR({
      message: "meal plan not found !",
      code: "E_REQUEST"
    }));
    if (req.body.mealPlan && req.body.dietary) {
      const regex = new RegExp(`^${req.body.mealPlan}$`, "i");
      const result = await MealPlan.findOne({name: regex, dietaryId: req.body.dietary});
      if (!result) return res.status(400).send(handlerResERROR({
        message: "meal plan not found !",
        code: "E_REQUEST"
      }));
      req.body.mealPlan = result._doc.name;
    }

    const data = new UsersInfo({
      _id: req.uid,
      ...req.body,
    });
    await data.save();
    return res.status(200).send(handlerResSUCCESS({data}));
  } catch (error) {
    console.log(error);
    return res.status(400).send(handlerResERROR({message: "Create user profile Fail !", code: "E_REQUEST"}));
  }
};

const changeProfile = async (req, res) => {
  try {
    const userId = req.uid;
    let data = await UserLogin.findById(userId);
    if (!data || data.isDelete) return res.status(400).send(handlerResERROR({
      message: "User not found !",
      code: "E_REQUEST"
    }));

    if (req.body.mealPlan && !req.body.dietary) {
      const regex = new RegExp(`^${req.body.mealPlan}$`, "i");
      const meal = await MealPlan.findOne({name: regex});
      if (!meal) return res.status(400).send(handlerResERROR({
        message: "meal plan not found !",
        code: "E_REQUEST"
      }));
      req.body.mealPlan = meal._doc.name;
    }

    if (req.body.dietary && !req.body.mealPlan) {
      const dietary = await Dietary.findById(req.body.dietary);
      if (!dietary) return res.status(400).send(handlerResERROR({
        message: "Dietary id not found !",
        code: "E_REQUEST"
      }));
    }

    if (req.body.mealPlan && req.body.dietary) {
      const dietary = await Dietary.findById(req.body.dietary);
      if (!dietary) return res.status(400).send(handlerResERROR({
        message: "Dietary id not found !",
        code: "E_REQUEST"
      }));

      const regex = new RegExp(`^${req.body.mealPlan}$`, "i");
      const meal = await MealPlan.findOne({name: regex, dietaryId: req.body.dietary});
      if (!meal) return res.status(400).send(handlerResERROR({
        message: "meal plan not found !",
        code: "E_REQUEST"
      }));
      req.body.mealPlan = meal._doc.name;

      const mealPlan = meal.data
      let startDate = Date.now();
      if(req.body.mealPlanStartDate) startDate = req.body.mealPlanStartDate;
      const date = moment(startDate);
      let i = date.day() - 1;
      if(i < 0) i = 6;
      await MenuFood.remove({userId: ObjectId(userId)});
      let j = 0;
      for (let length = mealPlan.length; i < length; i++) {
        const {menuFood} = mealPlan[i];
        const result = await Promise.all(menuFood.map(id => MenuFood.findById(id.toString())));
        let dayOfWeek = moment(date).add(j,'days').format('YYYY-MM-DD')
      
        await Promise.all(result.map(val => {
          const menu = new MenuFood({
            mealId: val.mealId,
            recipe: val.recipe || null,
            date: dayOfWeek,
            swap: false,
            userId
          })
          return menu.save();
        }));
        ++j;
      }
    }

    if(req.body.myProgram === 0) await MenuFood.remove({userId: ObjectId(userId)});

    req.body.updatedAt = new Date()
    data = await UsersInfo.findByIdAndUpdate(data._id, req.body, {new: true});
    if (!data) return res.status(400).send(handlerResERROR({message: "User not found !", code: "E_REQUEST"}));
    return res.status(200).send(handlerResSUCCESS({data}));
  } catch (error) {
    console.log(error);
    return res.status(400).send(handlerResERROR({message: "Change user profile Fail !", code: "E_REQUEST"}));
  }
};

const changeProfileByAdmin = async (req, res) => {
  try {
    let data = await UserLogin.findOne({_id: req.uid, roles: 'admin'});
    if (!data || data?.isDelete) return res.status(400).send(handlerResERROR({
      message: "User not found !",
      code: "E_REQUEST"
    }));
    const dataUpdate = {}
    req.body.updatedAt = new Date()
    dataUpdate.name = req.body.name || "";
    dataUpdate.sex = req.body.sex || "other";
    dataUpdate.phone = req.body.phone || "";
    dataUpdate.address = req.body.address || "";
    dataUpdate.city = req.body.city || "";
    dataUpdate.birthday = req.body.birthday || "";
    data = await UsersInfo.findByIdAndUpdate(data._id, dataUpdate, {new: true});
    if (!data) return res.status(400).send(handlerResERROR({message: "User not found !", code: "E_REQUEST"}));
    return res.status(200).send(handlerResSUCCESS({data}));
  } catch (error) {
    console.log(error);
    return res.status(400).send(handlerResERROR({message: "Change user profile Fail !", code: "E_REQUEST"}));
  }
};

const readProfile = async (req, res) => {
  try {
    const query = [...aggUserInfo];
    query[0].$match = {_id: ObjectId(req.uid)};
    query[4].$match = {};

    let data = await UserLogin.aggregate(query);
    if (data.length === 0 || data.isDelete === true || data.status === false) return res.status(400).send(handlerResERROR({
      message: "User not found !",
      code: "E_REQUEST"
    }));
    data = data[0];
    if (data.paymentCustomerId) {
      try {
        const cards = await stripe.customers.listSources(
          data.paymentCustomerId,
          {object: 'card'}
        );
        if (!cards) delete data.paymentCustomerId
        data.paymentCustomer = cards;
      } catch (e) {
        console.log(e);
        delete data.paymentCustomerId
      }
    }
    data.aiaCode = await AIACode.findOne({email: data?.username}).select(['price','code','status','-_id'])
    if(data?.memberships?.typeMembershipId) {
      data.memberships.typeName = (await MembershipType.findOne({_id: data?.memberships?.typeMembershipId}))?.name
    }
    return res.status(200).send(handlerResSUCCESS({data}));
  } catch (error) {
    return res.status(400).send(handlerResERROR({message: "Read user profile Fail !", code: "E_REQUEST"}));
  }
};

const deleteProfile = async (req, res) => {
  try {
    let data = await UserLogin.findById(req.uid);
    if (!data || data?.isDelete) return res.status(400).send(handlerResERROR({
      message: "User not found !",
      code: "E_REQUEST"
    }));

    data = await UsersInfo.findById(req.uid);
    if (!data) return res.status(400).send(handlerResERROR({message: "profile not found", code: "E_REQUEST"}));
    await UsersInfo.deleteOne({"_id": req.uid});
    return res.status(200).send(handlerResSUCCESS());
  } catch (error) {
    return res.status(400).send(handlerResERROR({message: "delete user profile Fail !", code: "E_REQUEST"}));
  }
};

const cancelSubscription = async (req, res) => {
  try {
    // if (!req.body.password) return res.status(400).send(handlerResERROR({
    //   message: "Please enter your password !",
    //   code: "E_REQUEST"
    // }));
    const user = await UserLogin.findById(req.uid);
    if (!user) return res.status(400).send(handlerResERROR({
      message: "Cancel Subscription fail !",
      code: "E_REQUEST"
    }));
    const userCustomer = await UsersInfo.findById(user._id);
    const customer = userCustomer.paymentCustomerId;
    if (!customer) return res.status(400).send(handlerResERROR({
      message: "Your customer id dont exist !",
      code: "E_REQUEST"
    }));

    // Thêm mail chimp
    let mailChimp = await System.findOne({field: 'mailChimp'});
    if(mailChimp) {
      let fullName = userCustomer.name;
      if (fullName) fullName = fullName.split(' ');
      if (!Array.isArray(fullName)) fullName = ['', ''];
      await addMemberMailChimp(MEMBER_CANCEL_SUB, mailChimp, user.username, fullName[0], fullName[fullName.length - 1]);
    }

    if(userCustomer.schedule){
      let subscriptionSchedule  = await stripe.subscriptionSchedules.cancel(userCustomer.scheduleId)
      if(subscriptionSchedule.status=="canceled"){
        await UsersInfo.findByIdAndUpdate(user._id, {
          $set: {isSubscription: false, schedule:false}
        })
        return res.status(200).send(handlerResSUCCESS({
          message: "Cancel subscription schedule successful !",
          data: subscriptionSchedule?.length
        }));
      }

    }else{
      let subscriptions = (await stripe.subscriptions.list({customer}))?.data || [];
      if (subscriptions?.length) {
        await Promise.all(subscriptions.map(async sub => {
          await stripe.subscriptions.del(sub?.id);
        }))
        await UsersInfo.findByIdAndUpdate(user._id, {
          $set: {isSubscription: false}
        })
        return res.status(200).send(handlerResSUCCESS({
          message: "Cancel subscription successful !",
          data: subscriptions?.length
        }));
      }
    }
   
    return res.status(400).send(handlerResERROR({
      message: "You are not register payment subscription !",
      data: null,
      code: 'E_REQUEST'
    }));
  } catch (error) {
    console.log(error)
    return res.status(400).send(handlerResERROR({message: "Cancel Subscription fail !", code: "E_REQUEST"}));
  }
};

const deleteUser = async (req, res) => {
  try {
    if (req.params.userId === 'admin') return res.status(400).send(handlerResERROR({
      message: "Delete Fail !",
      code: "E_REQUEST"
    }));
    const data = await UserLogin.findById(req.uid);
   const fire = await firebase.auth().getUserByEmail(data.username)
   await firebase.auth().deleteUser(fire.uid)    
    if (!data || data.isDelete) return res.status(400).send(handlerResERROR({
      message: "User not found",
      code: "E_REQUEST"
    }));
    data.isDelete = true;
    await data.save()
    
    await UsersInfo.findByIdAndUpdate(req.uid, {isDelete: true});
    return res.status(200).send(handlerResSUCCESS());
  } catch (error) {
    console.log(error)
    return res.status(400).send(handlerResERROR({message: "delete user profile Fail !", code: "E_REQUEST"}));
  }
};
const updateStatus = async (req, res) => {
  try {
    const {status} = req.body
    const userId = req.params.id
    // console.log({userId, status})
    const user = await UserLogin.findByIdAndUpdate(userId, {status}, {new: true});
    if (!user) return res.status(404).send(handlerResSUCCESS({message: "User not found !"}));
    return res.status(200).send(handlerResSUCCESS({
      data: {
        _id: user._id,
        status: user.status
      }
    }));
  } catch (error) {
    console.log(error)
    return res.status(400).send(handlerResERROR({message: "Update Fail !", code: "E_REQUEST"}));
  }
};

const listUsers = async (req, res) => {
  try {

    const query = [...aggUserInfo];
    query[0].$match = { $or: [ { isDelete: {$exists: false} }, { isDelete: false } ] }
    query[4].$match = {}

    if (req.query.roles === "member") query[0].$match.roles = "member";
    if (req.query.roles === "admin") query[0].$match.roles = "admin";
    if (req.query.status === "true") query[0].$match.status = true
    else if (req.query.status === "false") query[0].$match.status = false

    if (req.query.name)
      query[4].$match['name'] = new RegExp('.*' + req.query.name + '.*', 'gi');
    if (req.query.email)
      query[4].$match['email'] = new RegExp('.*' + req.query.email + '.*', 'gi');
    if (req.query.membershipId)
      query[4].$match['membershipId'] = ObjectId(req.query.membershipId)
    if (req.query.program)
      query[4].$match['myProgram'] = stringToInt(req.query.program)

    if (req.query.itemsPerPage) {
      const pageNumber = (typeof req.query?.pageNumber === 'string') ? stringToInt(req.query?.pageNumber) : req.query?.pageNumber;
      const itemsPerPage = (typeof req.query?.itemsPerPage === 'string') ? stringToInt(req.query?.itemsPerPage) : req.query?.itemsPerPage;
      let skip = itemsPerPage * pageNumber;
      query.push({$facet: {data: [{$skip: skip}, {$limit: itemsPerPage}]}})
    }
    let data = await UserLogin.aggregate(query);
    if (req.query.itemsPerPage) {
      query.splice(query.length-1, 1)
      data = data[0].data;
    }
    if (data.length === 0) return res.status(200).send(handlerResSUCCESS({data: [], message: "User not found"}));
    let totalItems = await UserLogin.aggregate(query).count("totalItems");
    totalItems = totalItems.length > 0 ? totalItems[0].totalItems : 0;
    for (let i = 0, length = data.length; i < length; i++) {
      if (data[i].paymentCustomerId) {
        try {
          const cards = await stripe.customers.listSources(
            data[i].paymentCustomerId,
            {object: 'card'}
          );
          if (!cards) delete data[i].paymentCustomerId
          data[i].paymentCustomer = cards;
        } catch (e) {
          console.log(e);
          delete data[i].paymentCustomerId
        }
      }
    }
    return res.status(200).send(handlerResSUCCESS({data, totalItems}))
  } catch (error) {
    console.log(error);
    return res.status(401).send(handlerResERROR({message: "Get list Fail !", code: 'E_REQUEST'}));
  }
};

const removeAvatar = (path) => new Promise((resolve) => unlink(path).then(resolve).catch(resolve))

const upAvatar = async (req, res, next) => {
  try {
    let linkAvatar = await resizeImage(req, true);
    await unlink(req.file.path);

    const userInfo = await UsersInfo.findById(req.uid);
    if (regexDomain.test(userInfo.avatar))
      await removeAvatar(req.file.destination + userInfo.avatar.split("/avatar")[1]);

    let data = await UsersInfo.findByIdAndUpdate(req.uid, {avatar: linkAvatar}, {new: true});
    if (!data) return res.status(400).send(handlerResERROR({message: "User not found !", code: "E_REQUEST"}));
    return res.status(200).send(handlerResSUCCESS({data: {avatar: linkAvatar}}));
  } catch (error) {
    await unlink(req.file.path);
    return res.status(400).send(handlerResERROR({message: "Change user profile Fail !", code: "E_REQUEST"}));
  }
}

const countMember = async (req, res, next) => {
  try {
    let totalItems = await UserLogin.aggregate([{$match: {roles: 'member'}}]).count("totalItems");
    totalItems = totalItems.length > 0 ? totalItems[0].totalItems : 0;
    return res.status(200).send({totalItems});
  } catch (e) {
    return res.status(400).send(handlerResERROR({message: "Count user Fail !", code: "E_REQUEST"}));
  }
}

module.exports = {
  changePass,
  createProfile,
  changeProfile,
  readProfile,
  deleteProfile,
  deleteUser,
  listUsers,
  updateStatus,
  upAvatar,
  changeProfileByAdmin,
  cancelSubscription,
  countMember,
}
