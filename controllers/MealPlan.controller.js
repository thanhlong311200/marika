const MealPlan = require('../models/MealPlan.model');
const MenuFood = require("../models/MenuFood.model");
const Dietary = require("../models/Dietary.model");
const {handlerResERROR, handlerResSUCCESS, stringToInt} = require("../utils");
const _ = require("lodash");
const {ObjectId} = require("mongodb");
const {cloneDeep} = require("lodash");

const aggMealPlanDetail = [
  {$match: {}},
  {
    $lookup: {
      from: "dietaries",
      localField: "dietaryId",
      foreignField: "_id",
      as: "dietary",
      pipeline: [{$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },
  {$addFields: {"dietary": {$arrayElemAt: ["$dietary", 0]}}},
  {$unwind: {path: "$data"}},
  {$unwind: {path: "$data.menuFood"}},
  {
    $lookup: {
      from: "menufoods",
      localField: "data.menuFood",
      foreignField: "_id",
      as: "dataMenu",
      pipeline: [{$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },
  {$addFields: {"dataMenu": {$arrayElemAt: ["$dataMenu", 0]}}},
  {
    $lookup: {
      from: "recipes",
      localField: "dataMenu.recipe",
      foreignField: "_id",
      as: "dataMenu.dataRecipe",
      pipeline: [{$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },
  {$addFields: {"dataMenu.recipe": {$arrayElemAt: ["$dataMenu.dataRecipe", 0]}}},
  {
    $lookup: {
      from: "recipesmeals",
      localField: "dataMenu.mealId",
      foreignField: "_id",
      as: "dataMenu.meal",
      pipeline: [{$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },
  {$addFields: {"dataMenu.meal": {$arrayElemAt: ["$dataMenu.meal", 0]}}},
]

const aggMealPlan = [
  {$match: {}},
  {
    $lookup: {
      from: "dietaries",
      localField: "dietaryId",
      foreignField: "_id",
      as: "dietary",
      pipeline: [{$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },
  {$addFields: {"dietary": {$arrayElemAt: ["$dietary", 0]}}},
  {$project: {__v: 0, dietaryId: 0}},
  {$sort: {"createdAt": -1}},
]

const create = async (req, res) => {
  try {
    const {data, dietaryId} = req.body;

    const dietary = await Dietary.findById(dietaryId);
    if (!dietary) return res.status(400).send(handlerResERROR({
      message: "id of dietary do not exist !",
      code: "E_REQUEST"
    }));

    let arrayMenu = [].concat.apply([], data.map(value => value.menuFood));
    arrayMenu = _.union(arrayMenu);
    let menuFood = await Promise.all(arrayMenu.map(value => MenuFood.findById(value)));
    for (let i = 0; i < menuFood.length; i++) {
      if (!menuFood[i]) return res.status(400).send(handlerResERROR({
        message: "id of menu food do not exist !",
        code: "E_REQUEST"
      }));
    }

    const result = new MealPlan({...req.body})
    await result.save();
    return res.status(200).send(handlerResSUCCESS({data: result}));
  } catch (e) {
    console.log(e);
    return res.status(400).send(handlerResERROR({message:"Upload Meal Plan Fail !", code: "E_REQUEST"}));
  }
}

const change = async (req, res) => {
  try {
    const {data, dietaryId} = req.body;

    if(data) {
      let arrayMenu = [].concat.apply([], data.map(value => value.menuFood));
      arrayMenu = _.union(arrayMenu);
      let menuFood = await Promise.all(arrayMenu.map(value => MenuFood.findById(value)));
      for (let i = 0; i < menuFood.length; i++) {
        if (!menuFood[i]) return res.status(400).send(handlerResERROR({
          message: "id of menu food do not exist !",
          code: "E_REQUEST"
        }));
      }
    }
    if(dietaryId) {
      let result = await Dietary.findById(dietaryId);
      if (!result) return res.status(400).send(handlerResERROR({
        message: "id of dietary do not exist !",
        code: "E_REQUEST"
      }));
    }
    req.body.updatedAt = new Date()
    const result = await MealPlan.findByIdAndUpdate(req.params.id, req.body, {new: true});
    
    if (!result) return res.status(400).send(handlerResERROR({message:"Meal Plan not found", code: "E_REQUEST"}));
    result.dietary = await Dietary.findById(result.dietaryId.toString());
    result._doc.dietary = result.dietary._doc;
    return res.status(200).send(handlerResSUCCESS({data: result}));
  } catch (e) {
    console.log(e);
    return res.status(400).send(handlerResERROR({message: "Change Meal Plan Fail !", code: "E_REQUEST"}));
  }
}

const fetch = async (req, res) => {
  try {
    const query = [...aggMealPlanDetail];
    query[0].$match = {_id: ObjectId(req.params.id)};
    let data = await MealPlan.aggregate(query);

    const result = {data: []};
    let value = {_id: ""}
    for(let val of data){
      const {dataMenu} = val;
      if(value._id !== val.data._id.toString()) {
        if(value._id !== "") result.data.push(cloneDeep(value));
        value._id = val.data._id.toString();
        value.day = val.data.day;
        value.menuFood = [{_id: dataMenu._id, meal: dataMenu.meal, recipe: dataMenu.recipe}]
      } else {
        value.menuFood.push({_id: dataMenu._id, meal: dataMenu.meal, recipe: dataMenu.recipe})
      }
    }
    result.data.push(cloneDeep(value));

    result.name = data[0].name;
    result.description = data[0].description;
    result._id = data[0]._id;
    result.dietary = data[0].dietary;
    result.numberOfSnack = data[0].numberOfSnack;
    result.createdAt = data[0].createdAt;
    result.updatedAt = data[0].updatedAt;
    if(!data) return res.status(400).send(handlerResSUCCESS({data: {}, message: "Meal Plan not found"}))
    return res.status(200).send(handlerResSUCCESS({data: result}))
  } catch (e) {
    res.status(400).send(handlerResERROR({message: "Meal Plan not found", code: "E_REQUEST"}))
  }
}

const fetchList = async (req, res) => {
  try {
    const query = [...aggMealPlan];
    query[0].$match = {};
    if (req.query.name) query[0].$match.name = new RegExp('.*' + req.query.name + '.*', 'gi');
    if (req.query.dietaryId) query[0].$match.dietaryId = ObjectId(req.query.dietaryId);
    if (req.query.itemsPerPage) {
      const pageNumber = (typeof req.query?.pageNumber === 'string') ? stringToInt(req.query?.pageNumber) : req.query?.pageNumber || 0;
      const itemsPerPage = (typeof req.query?.itemsPerPage === 'string') ? stringToInt(req.query?.itemsPerPage) : req.query?.itemsPerPage;
      const skip = itemsPerPage * pageNumber;
      query.push({$facet: {data: [{$skip: skip}, {$limit: itemsPerPage}]}})
    }
    let data = await MealPlan.aggregate(query);
    if(!data) return res.status(200).send(handlerResSUCCESS({data: {}, message: "Meal Plan not found"}))
    if (req.query.itemsPerPage) {
      query.splice(query.length-1, 1);
      data = data[0].data;
    }
    let totalItems = await MealPlan.aggregate([query[0]]).count("totalItems");
    totalItems = totalItems.length > 0 ? totalItems[0].totalItems : 0;
    return res.status(200).send(handlerResSUCCESS({data, totalItems}))
  } catch (e) {
    res.status(400).send(handlerResERROR({message: "Meal Plan not found", code: "E_REQUEST"}))
  }
}

const listName = async (req, res) => {
  try {
    let query = [{$match: {}}];
    query.push({$group: {_id: "$name", createdAt: {$first: "$createdAt"}}})
    if (req.query.itemsPerPage) {
      const pageNumber = (typeof req.query?.pageNumber === 'string') ? stringToInt(req.query?.pageNumber) : req.query?.pageNumber || 0;
      const itemsPerPage = (typeof req.query?.itemsPerPage === 'string') ? stringToInt(req.query?.itemsPerPage) : req.query?.itemsPerPage;
      const skip = itemsPerPage * pageNumber;
      query.push({$facet: {data: [{$skip: skip}, {$limit: itemsPerPage}]}})
    }
    let data = await MealPlan.aggregate(query);
    if (!data) return res.status(200).send(handlerResSUCCESS({data: {}, message: "Meal Plan not found"}));
    if (req.query.itemsPerPage) {
      query.splice(query.length-1, 1);
      data = data[0].data;
    }
    data = data.map(value => value._id);
    return res.status(200).send(handlerResSUCCESS({data}))
  } catch (error) {
    console.log(error);
    res.status(400).send(handlerResERROR({message: "Meal Plan not found", code: "E_REQUEST"}))
  }
}

const deleteMealPlan = async (req, res) => {
  try {
    const {id} = req.params
    const data = await MealPlan.findByIdAndDelete(id);
    if(!data) return res.status(400).send(handlerResERROR({message:"Meal Plan not found", code: "E_REQUEST"}))
    return res.status(200).send(handlerResSUCCESS())
  }catch (e) {
    return res.status(400).send(handlerResERROR({message:"Delete Meal Plan fail!", code: "E_REQUEST"}))
  }
}

module.exports = {
  create,
  change,
  fetch,
  deleteMealPlan,
  fetchList,
  listName,
}
