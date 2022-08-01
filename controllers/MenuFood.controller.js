const moment = require('moment');
const MenuFood = require('../models/MenuFood.model');
const Recipes = require('../models/Recipes.model');
const Meals = require('../models/RecipesMeal.model');
const {handlerResERROR, handlerResSUCCESS, stringToInt, isFavorite} = require("../utils");
const {ObjectId} = require("mongodb");
const MealPlan = require("../models/MealPlan.model");
const Favorites = require("../models/Favorites.model");

const aggMenuFood = [
  {$match: {}},
  {
    $lookup: {
      from: 'recipes',
      localField: 'recipe',
      foreignField: '_id',
      as: 'recipe_data',
      pipeline: [{$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },
  {$addFields: {"recipe_data": {$arrayElemAt: ["$recipe_data", 0]}}},
  {
    $lookup: {
      from: 'recipesmeals',
      localField: 'mealId',
      foreignField: '_id',
      as: 'meal',
      pipeline: [{$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },
  {$addFields: {"meal": {$arrayElemAt: ["$meal", 0]}}},
  {$addFields: {"recipe_data.mediaId": {$toObjectId: "$recipe_data.mediaId"}}},
  {
    $lookup: {
      from: 'media',
      localField: 'recipe_data.mediaId',
      foreignField: '_id',
      as: 'recipe_data.media',
      pipeline: [
        {$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },
  {$addFields: {"recipe_data.media": {$arrayElemAt: ["$recipe_data.media", 0]}}},
  {$addFields: {"thumbnail": "$recipe_data.media.thumbnail",}},
  {$sort: {"createdAt": -1}},
  {$project: {__v: 0, recipe: 0, mealId: 0, userId: 0}}
]

const create = async (req, res) => {
  try {
    const {recipe, mealId, date} = req.body;
    if (recipe) {
      const result = await Recipes.findById(recipe);
      if (!result) return res.status(400).send(handlerResERROR({
        message: "id of recipe do not exist !",
        code: "E_REQUEST"
      }));
    }
    if (recipe === "") delete req.body.recipe
    const meal = await Meals.findById(mealId);
    if (!meal) return res.status(400).send(handlerResERROR({
      message: "id of meal do not exist !",
      code: "E_REQUEST"
    }));

    const query = {mealId, date: {$eq: new Date(date)}}
    if (req.roles === "member") {
      req.body.userId = req.uid
      query.userId = req.uid;
    }

    if (req.roles === "member") {
      const checkMenuFood = await MenuFood.findOne(query)
      if (checkMenuFood) {
        const data = await MenuFood.findByIdAndUpdate(checkMenuFood._doc._id, req.body, {new: true})
        return res.status(200).send(handlerResSUCCESS({data}));
      }
    }
    const data = new MenuFood({...req.body})
    await data.save();
    return res.status(200).send(handlerResSUCCESS({data}));
  } catch (e) {
    console.log(e);
    return res.status(400).send(handlerResERROR({message: "Upload Menu food Fail !", code: "E_REQUEST"}));
  }
}

const createByArray = async (req, res) => {
  try {
    const result = await Promise.all(req.body.map(value => Recipes.findById(value.recipe)));
    // for (let i = 0; i < result.length; i++) {
    //   if (!result[i]) return res.status(400).send(handlerResERROR({
    //     message: "id of recipe do not exist !",
    //     code: "E_REQUEST"
    //   }));
    // }
    const meal = await Promise.all(req.body.map(value => Meals.findById(value.mealId)));
    for (let i = 0; i < meal.length; i++) {
      if (!meal[i]) return res.status(400).send(handlerResERROR({
        message: "id of meal do not exist !",
        code: "E_REQUEST"
      }));
      if (req.roles === "member") req.body[i].userId = req.uid;
    }
    const data = await Promise.all(req.body.map(async value => {
      const {mealId, date} = value;
      const query = {mealId, date: {$eq: new Date(date)}}
      if (req.roles === "member") {
        req.body.userId = req.uid
        query.userId = req.uid;
      }

      if (req.roles === "member") {
        const checkMenuFood = await MenuFood.findOne(query)
        if (checkMenuFood) {
          return MenuFood.findByIdAndUpdate(checkMenuFood._id, value, {new: true});
        }
      }
      const menuFood = new MenuFood(value);
      return menuFood.save();
    }))
    return res.status(200).send(handlerResSUCCESS({data}));
  } catch (e) {
    console.log(e);
    return res.status(400).send(handlerResERROR({message: "Upload Menu food Fail !", code: "E_REQUEST"}));
  }
}

const change = async (req, res) => {
  try {
    let data = await MenuFood.findById(req.params.id);
    if (!data) return res.status(400).send(handlerResERROR({message: "Menu food not found", code: "E_REQUEST"}));

    if (req.roles === "member" && data._doc.userId.toString() !== req.uid)
      return res.status(401).send(handlerResERROR({
        message: "You do not have permission to edit !",
        code: "E_PERMISSION"
      }));

    const {recipe, mealId} = req.body;
    if (recipe === "" || recipe === null) {
      req.body.recipe = null;
    } else if (recipe) {
      const result = await Recipes.findById(recipe);
      if (!result) return res.status(400).send(handlerResERROR({
        message: "id of recipe do not exist !",
        code: "E_REQUEST"
      }));
    }

    if (mealId) {
      const meal = await Meals.findById(mealId);
      if (!meal) return res.status(400).send(handlerResERROR({
        message: "id of meal do not exist !",
        code: "E_REQUEST"
      }));
    }

    req.body.updatedAt = new Date()
    if (req.body.recipe === null) {
      delete req.body.recipe
      req.body = {$set: req.body, $unset: {recipe: 1}}
    }
    data = await MenuFood.findByIdAndUpdate(req.params.id, req.body, {new: true});
    return res.status(200).send(handlerResSUCCESS({data}));
  } catch (e) {
    console.log(e);
    return res.status(400).send(handlerResERROR({message: "Change Menu food Fail !", code: "E_REQUEST"}));
  }
}

const fetch = async (req, res) => {
  try {
    const query = [...aggMenuFood];
    query[0].$match = {};
    query[0].$match._id = ObjectId(req.params.id);
    let data = await MenuFood.aggregate(query);
    data = data[0]
    if (!data) return res.status(200).send(handlerResSUCCESS({data: {}, message: "Menu food not found"}))
    const {recipe_data} = data;
    if (recipe_data._id) data.recipe = recipe_data;
    delete data.recipe_data;
    if (req.roles === "member" && data.recipe)
      data.recipe.isFavorite = await isFavorite(req.uid, "recipe", data.recipe._id);
    return res.status(200).send(handlerResSUCCESS({data}))
  } catch (e) {
    console.log(e)
    return res.status(400).send(handlerResERROR({message: "Menu food not found", code: "E_REQUEST"}))
  }
}

const fetchMenuOfUser = async (req, res) => {
  try {
    if(req.query.isFavorite === "true") return fetchFavoriteMenuOfUser(req, res);
    const query = [...aggMenuFood];
    query[0].$match = {}
    const {start, end, recipe} = req.query;

    if(req.query.isFavorite === 'false') {
      let menuId = await Favorites.aggregate([{$match: {type: "menu", userId: req.uid}}]);
      if(menuId) {
        menuId = menuId[0].data;
        query[0].$match._id = {$nin: menuId.map(val => ObjectId(val))};
      }
    }

    if (recipe) query[0].$match.recipe = ObjectId(recipe);

    if (start && end) {
      query[0].$match.date = {
        $gte: new Date(start),
        $lte: new Date(end),
      }
    } else if (start) {
      query[0].$match.date = {
        $gte: new Date(start),
      }
    } else if (end) {
      query[0].$match.date = {
        $lte: new Date(end),
      }
    }

    if (req.query.swap === "true" || req.query.swap === "false")
      query[0].$match.swap = req.query.swap === "true";

    if (req.query.itemsPerPage) {
      const pageNumber = (typeof req.query?.pageNumber === 'string') ? stringToInt(req.query?.pageNumber) : req.query?.pageNumber || 0;
      const itemsPerPage = (typeof req.query?.itemsPerPage === 'string') ? stringToInt(req.query?.itemsPerPage) : req.query?.itemsPerPage;
      const skip = itemsPerPage * pageNumber;
      query.push({$facet: {data: [{$skip: skip}, {$limit: itemsPerPage}]}})
    }

    let userId = req.roles === "member" ? req.uid : req.query.userId;
    if (userId) query[0].$match.userId = ObjectId(userId);

    let result = await MenuFood.aggregate(query);
    if (req.query.itemsPerPage) {
      query.splice(query.length-1, 1);
      result = result[0].data;
    }
    if (result.length === 0) return res.status(200).send(handlerResSUCCESS({data: [], message: "Menu food not found"}))

    const favorites = await Promise.all(result.map(value => isFavorite(req.uid, "recipe", value?.recipe_data?._id?.toString())))
    const data = [];
    for (let i = 0, length = result.length; i < length; i++) {
      const value = result[i]
      if (value?.recipe_data?._id) value.recipe = value.recipe_data;
      delete value?.recipe_data;
      if (value?.recipe) value.recipe.isFavorite = favorites[i];
      data.push(value);
    }
    let totalItems = await MenuFood.aggregate([query[0]]).count("totalItems");
    totalItems = totalItems.length > 0 ? totalItems[0].totalItems : 0;
    return res.status(200).send(handlerResSUCCESS({data, totalItems}))
  } catch (e) {
    console.log(e)
    return res.status(400).send(handlerResERROR({message: "Menu food not found", code: "E_REQUEST"}))
  }
}

const aggFavoriteMenuFood = [
  {$match: {}},
  {$unwind: { path: "$data", preserveNullAndEmptyArrays: true }},
  {$addFields: {"data": {"$toObjectId": "$data"},}},
  {
    $lookup: {
      from: "menufoods",
      localField: "data",
      foreignField: "_id",
      as: "menu",
    }
  },
  {$unwind: { path: "$menu", preserveNullAndEmptyArrays: true }},
  {$replaceRoot: {newRoot: {$mergeObjects: ["$$ROOT", "$menu"] }}},
  {$match: {}},
  {
    $lookup: {
      from: 'recipes',
      localField: 'recipe',
      foreignField: '_id',
      as: 'recipe_data',
      pipeline: [{$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },
  {$addFields: {"recipe_data": {$arrayElemAt: ["$recipe_data", 0]}}},
  {
    $lookup: {
      from: 'recipesmeals',
      localField: 'mealId',
      foreignField: '_id',
      as: 'meal',
      pipeline: [{$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },
  {$addFields: {"meal": {$arrayElemAt: ["$meal", 0]}}},
  {$addFields: {"recipe_data.mediaId": {$toObjectId: "$recipe_data.mediaId"}}},
  {
    $lookup: {
      from: 'media',
      localField: 'recipe_data.mediaId',
      foreignField: '_id',
      as: 'recipe_data.media',
      pipeline: [
        {$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },
  {$addFields: {"recipe_data.media": {$arrayElemAt: ["$recipe_data.media", 0]}}},
  {$addFields: {"thumbnail": "$recipe_data.media.thumbnail",}},
  {$sort: {"createdAt": -1}},
  {$project: {__v: 0, recipe: 0, mealId: 0, userId: 0, menu: 0, type: 0, data: 0}}
]

const fetchFavoriteMenuOfUser = async (req, res) => {
  try {
    let userId = req.roles === "member" ? req.uid : req.query.userId;
    const query = [...aggFavoriteMenuFood];
    query[0].$match = {type: "menu", userId};
    query[6].$match = {}
    const {start, end, recipe} = req.query;

    if (recipe) query[6].$match.recipe = ObjectId(recipe);

    if (start && end) {
      query[6].$match.date = {
        $gte: new Date(start),
        $lte: new Date(end),
      }
    } else if (start) {
      query[6].$match.date = {
        $gte: new Date(start),
      }
    } else if (end) {
      query[6].$match.date = {
        $lte: new Date(end),
      }
    }

    if (req.query.swap === "true" || req.query.swap === "false")
      query[6].$match.swap = req.query.swap === "true";

    if (req.query.itemsPerPage) {
      const pageNumber = (typeof req.query?.pageNumber === 'string') ? stringToInt(req.query?.pageNumber) : req.query?.pageNumber || 0;
      const itemsPerPage = (typeof req.query?.itemsPerPage === 'string') ? stringToInt(req.query?.itemsPerPage) : req.query?.itemsPerPage;
      const skip = itemsPerPage * pageNumber;
      query.push({$facet: {data: [{$skip: skip}, {$limit: itemsPerPage}]}})
    }

    if (userId) query[6].$match.userId = ObjectId(userId);

    let data = await Favorites.aggregate(query);
    if (req.query.itemsPerPage) {
      query.splice(query.length-1, 1);
      data = data[0].data;
    }
    if (data.length === 0) return res.status(200).send(handlerResSUCCESS({data: [], totalItems: 0, message: "Menu food not found"}))
    data.forEach(val => {val.isFavorite = true;})
    let totalItems = await Favorites.aggregate(query).count("totalItems");
    totalItems = totalItems.length > 0 ? totalItems[0].totalItems : 0;
    return res.status(200).send(handlerResSUCCESS({data, totalItems}))
  } catch (e) {
    console.log(e)
    return res.status(400).send(handlerResERROR({message: "Menu food not found", code: "E_REQUEST"}))
  }
}

const deleteMenuFood = async (req, res) => {
  try {
    const {id} = req.params
    const data = await MenuFood.findByIdAndDelete(id);
    if (!data) return res.status(400).send(handlerResERROR({message: "Menu food not found", code: "E_REQUEST"}))
    return res.status(200).send(handlerResSUCCESS())
  } catch (e) {
    return res.status(400).send(handlerResERROR({message: "Delete Menu food fail!", code: "E_REQUEST"}))
  }
}

const upListMenuByMealPlan = async (req, res) => {
  try {
    let {mealPlanId, startDate} = req.body;

    let mealPlan = await MealPlan.findById(mealPlanId);
    if(!mealPlan) return res.status(400).send(handlerResERROR({message: "Upload menu food by meal plan fail!", code: "E_REQUEST"}))
    mealPlan = mealPlan.data

    if(!startDate) startDate = Date.now();
    const date = moment(startDate);
    let i = date.day() - 1;
    if(i < 0) i = 7

    const data = [];
    const userId = req.uid;
    await MenuFood.remove({userId: ObjectId(userId)});
    let j = 0;

    for (let length = mealPlan.length; i < length; i++) {
      const {menuFood} = mealPlan[i];
      const result = await Promise.all(menuFood.map(id => MenuFood.findById(id.toString())));
      let dayOfWeek = moment(date).add(j,'days').format('YYYY-MM-DD')

      const value = await Promise.all(result.map(val => {
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

      data.push(...value)
    }

    return res.status(200).send(handlerResSUCCESS({data}))
  } catch (e) {
    return res.status(400).send(handlerResERROR({message: "Upload menu food by meal plan fail!", code: "E_REQUEST"}))
  }
}

module.exports = {
  createByArray,
  create,
  change,
  fetch,
  deleteMenuFood,
  fetchMenuOfUser,
  upListMenuByMealPlan,
}
