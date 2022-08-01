const ShoppingList = require('../models/ShoppingList.model');
const Ingredients = require("../models/Ingredients.model");
const RecipesMeal = require("../models/RecipesMeal.model");
const {handlerResERROR, handlerResSUCCESS, stringToInt} = require("../utils");
const {shoppingList} = require("../validators");
const {ObjectId} = require("mongodb");

const aggShoppingList = [
  {$match: {}},
  {$unwind: {path: "$data", preserveNullAndEmptyArrays: true}},
  {$addFields: {"data.mealId": {"$toObjectId": "$data.mealId"}}},
  {
    $lookup: {
      from: "recipesmeals",
      localField: "data.mealId",
      foreignField: "_id",
      as: "data.meal",
      pipeline: [{$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },
  {$addFields: {"data.meal": {$arrayElemAt: ["$data.meal", 0]}}},
  {$unwind: {path: "$data.ingredients", preserveNullAndEmptyArrays: true}},
  {$addFields: {"data.ingredients._id": {"$toObjectId": "$data.ingredients._id"}}},
  {
    $lookup: {
      from: "ingredients",
      localField: "data.ingredients._id",
      foreignField: "_id",
      as: "data.ingredient_data",
      pipeline: [{$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },
  {$addFields: {"data.ingredient_data": {$arrayElemAt: ["$data.ingredient_data", 0]}}},
  {$addFields: {"data.ingredient_data.categoryId": {"$toObjectId": "$data.ingredient_data.categoryId"}}},
  {
    $lookup: {
      from: "ingredientscategories",
      localField: "data.ingredient_data.categoryId",
      foreignField: "_id",
      as: "data.ingredient_data.category",
      pipeline: [{$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },
  {$addFields: {"data.ingredient_data.category": {$arrayElemAt: ["$data.ingredient_data.category", 0]}}},
  {$addFields:{"data.ingredients": {"$mergeObjects": ["$data.ingredients", "$data.ingredient_data"]}}},
  {$project: {__v: 0, "data.ingredients.categoryId": 0, "data.ingredient_data": 0}},
  {
    $group: {
      "_id": "$data._id",
      "id": {$first: "$_id"},
      "totalIngredientsMain": {$first: "$totalIngredients"},
      "ingredients": { $addToSet: "$data.ingredients" },
      "date": {$first: "$data.date"},
      "mealId": {$first: "$data.mealId"},
      "meal": {$first: "$data.meal"},
      "dataId": {$first: "$data._id"},
      "totalIngredients": {$first: "$data.totalIngredients"},
      "status": {$first: "$status"},
      "createdAt": {$first: "$createdAt"},
      "updatedAt": {$first: "$updatedAt"},
    }
  },
  {
    $group: {
      "_id": "$id",
      "totalIngredients": {$first: "$totalIngredientsMain"},
      "status": {$first: "$status"},
      "data": {$push: {
        "id": "$dataId",
        "totalIngredients": "$totalIngredients",
        "date": "$date",
        "mealId": "$mealId",
        "meal": "$meal",
        "ingredients": "$ingredients",
      }},
      "createdAt": {$first: "$createdAt"},
      "updatedAt": {$first: "$updatedAt"},
    }
  },
  {$sort: {"createdAt": -1}}
]

const create = async (req, res) => {
  try {
    const {data} = req.body;
    const meal = await Promise.all(data.map((value) => RecipesMeal.findById(value.mealId)));
    for(let i = 0, length = meal.length; i < length; i++) {
      if (!meal[i]) return res.status(400).send(handlerResERROR({
        message: "id of meal do not exist !",
        code: "E_REQUEST"
      }));
    }
    let totalLength = 0;
    for (let i = 0, length = data.length; i < length; i++) {
      const ing = await Promise.all(data[i].ingredients.map((value) => Ingredients.findById(value._id)));
      for (let i = 0; i < ing.length; i++) {
        if (!ing[i]) return res.status(400).send(handlerResERROR({
          message: "id of ingredients do not exist !",
          code: "E_REQUEST"
        }));
      }
      req.body.data[i].totalIngredients = data[i].ingredients.length;
      totalLength += data[i].ingredients.length;
    }
    req.body.totalIngredients = totalLength;

    let userId = req.uid
    const result = new ShoppingList({_id: userId, ...req.body})
    await result.save();
    return res.status(200).send(handlerResSUCCESS({data: result}));
  } catch (e) {
    console.log(e);
    return res.status(400).send(handlerResERROR({message: "Upload Shopping List Fail !", code: "E_REQUEST"}));
  }
}

const change = async (req, res) => {
  try {
    const {data} = req.body;
    if(data) {
      const meal = await Promise.all(data.map((value) => RecipesMeal.findById(value.mealId)));
      for(let i = 0, length = meal.length; i < length; i++) {
        if (!meal[i]) return res.status(400).send(handlerResERROR({
          message: "id of meal do not exist !",
          code: "E_REQUEST"
        }));
      }
      let totalLength = 0;
      for (let i = 0, length = data.length; i < length; i++) {
        const ing = await Promise.all(data[i].ingredients.map((value) => Ingredients.findById(value._id)));
        for (let i = 0; i < ing.length; i++) {
          if (!ing[i]) return res.status(400).send(handlerResERROR({
            message: "id of ingredients do not exist !",
            code: "E_REQUEST"
          }));
        }
        req.body.data[i].totalIngredients = data[i].ingredients.length;
        totalLength += data[i].ingredients.length;
      }
      req.body.totalIngredients = totalLength;
    }
    req.body.updatedAt = new Date()
    const result = await ShoppingList.findByIdAndUpdate(req.uid, req.body, {new: true});
    if (!result) return res.status(400).send(handlerResERROR({message: "Shopping List not found", code: "E_REQUEST"}));
    return res.status(200).send(handlerResSUCCESS({data: result}));
  } catch (e) {
    console.log(e);
    return res.status(400).send(handlerResERROR({message: "Change Shopping List Fail !", code: "E_REQUEST"}));
  }
}

const fetch = async (req, res) => {
  try {
    let userId = req.uid
    if (req.query.id) userId = req.query.id
    if (!userId)
      return res.status(400).send(handlerResERROR({message: "Shopping List not found", code: "E_REQUEST"}))

    const query = [...aggShoppingList]
    query[0].$match = {};
    query[0].$match._id = ObjectId(userId);
    let data = await ShoppingList.aggregate(query);
    if (!data) return res.status(200).send(handlerResSUCCESS({data: {}, message: "Shopping List not found"}))
    return res.status(200).send(handlerResSUCCESS({data}))
  } catch (e) {
    console.log(e);
    res.status(400).send(handlerResERROR({message: "Shopping List not found", code: "E_REQUEST"}))
  }
}

const fetchShoppingListOfUser = async (req, res) => {
  try {
    const query = [...aggShoppingList]
    query[0].$match = {};
    if (req.query.itemsPerPage) {
      const pageNumber = (typeof req.query?.pageNumber === 'string') ? stringToInt(req.query?.pageNumber) : req.query?.pageNumber || 0;
      const itemsPerPage = (typeof req.query?.itemsPerPage === 'string') ? stringToInt(req.query?.itemsPerPage) : req.query?.itemsPerPage;
      const skip = itemsPerPage * pageNumber;
      query.push({$facet: {data: [{$skip: skip}, {$limit: itemsPerPage}]}})
    }
    let data = await ShoppingList.aggregate(query);
    if (req.query.itemsPerPage) {
      query.splice(query.length-1, 1);
      data = data[0].data;
    }
    if (data.length === 0) return res.status(200).send(handlerResSUCCESS({data: [], message: "Shopping List not found"}))
    let totalItems = await ShoppingList.aggregate([query[0]]).count("totalItems");
    totalItems = totalItems.length > 0 ? totalItems[0].totalItems : 0;
    return res.status(200).send(handlerResSUCCESS({data, totalItems}))
  } catch (e) {
    res.status(400).send(handlerResERROR({message: "Shopping List not found", code: "E_REQUEST"}))
  }
}

const deleteShoppingList = async (req, res) => {
  try {
    let userId = req.uid
    if (req.roles === "admin") {
      if(!req.query.id)
        return res.status(400).send(handlerResERROR({message: "Shopping List not found", code: "E_REQUEST"}))
      userId = req.query.id
    }
    const data = await ShoppingList.findByIdAndDelete(userId);
    if (!data) return res.status(400).send(handlerResERROR({message: "Shopping List not found", code: "E_REQUEST"}))
    return res.status(200).send(handlerResSUCCESS())
  } catch (e) {
    return res.status(400).send(handlerResERROR({message: "Delete Shopping List fail!", code: "E_REQUEST"}))
  }
}

const handleShoppingList = async (req, res) => {
  try {
    const data = await ShoppingList.findById(req.uid);
    if(data) return change(req, res);
    let result = await shoppingList.create(req, res);
    if(result) return res.status(422).json(handlerResERROR({
      message: "Validation of the upload shopping list form failed",
      data: result
    }));
    return create(req, res);
  } catch (err) {
    return res.status(400).send(handlerResERROR({message: "Upload Shopping List Fail !", code: "E_REQUEST"}));
  }
}

const handleBuyStatus = async (req, res) => {
  try {
    const {id} = req.params
    const {date, mealId, ingredientId, buyStatus} = req.body

    const checkIng = await ShoppingList.findOne({
      _id: ObjectId(id),
      data: {$all: [
          {$elemMatch: {date, mealId}},
          {$elemMatch: {ingredients: {$all: [{$elemMatch: {_id: ingredientId}}]}}},
      ]}
    });
    if (!checkIng) return res.status(400).send(handlerResERROR({message: "Shopping List not found", code: "E_REQUEST"}));
    const data = checkIng.data
    for(let i = 0, length = data.length; i < length; i++) {
      const val = data[i];
      if(date !== val.date || mealId !== val.mealId) continue;
      let ingIdx = val.ingredients.findIndex((value => value._id === ingredientId));
      if(ingIdx === -1) continue;
      data[i].ingredients[ingIdx].buyStatus = buyStatus;
      break;
    }
    const result = await ShoppingList.findByIdAndUpdate(id, {data}, {new: true});
    return res.status(200).send(handlerResSUCCESS({data: result}));
  } catch (e) {
    console.log(e);
    return res.status(400).send(handlerResERROR({message: "Change Shopping List Fail !", code: "E_REQUEST"}));
  }
}

module.exports = {
  handleShoppingList,
  fetch,
  deleteShoppingList,
  fetchShoppingListOfUser,
  handleBuyStatus,
}
