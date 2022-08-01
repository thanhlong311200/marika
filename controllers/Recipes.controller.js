const Recipes = require('../models/Recipes.model');
const RecipesType = require('../models/RecipesType.model');
const RecipesMeal = require('../models/RecipesMeal.model');
const RecipesCategory = require('../models/RecipesCategory.model');
const Ingredients = require('../models/Ingredients.model');
const RecipesTags = require('../models/RecipesTags.model');
const RecipesDietary = require('../models/RecipesDietary.model');
const {handlerResERROR, handlerResSUCCESS, stringToInt, isFavorite} = require("../utils");
const {ObjectId} = require("mongodb");
const Media = require("../models/Media.model");
const Favorites = require("../models/Favorites.model");

const aggRecipe = [
  {$match: {}},
  {
    $addFields: {
      "typeId": {"$toObjectId": "$typeId"},
      "mealId": {"$toObjectId": "$mealId"},
      "categoryId": {"$toObjectId": "$categoryId"},
      "mediaId": {"$toObjectId": "$mediaId"},
      "mediaMobileId": {"$toObjectId": "$mediaMobileId"},
    }
  },
  {
    $lookup: {
      from: 'recipestypes',
      localField: 'typeId',
      foreignField: '_id',
      as: 'type',
      pipeline: [
        {$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },
  {$addFields: {"type": {$arrayElemAt: ["$type", 0]}}},
  {
    $lookup: {
      from: 'recipesmeals',
      localField: 'mealId',
      foreignField: '_id',
      as: 'meal',
      pipeline: [
        {$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },
  {$addFields: {"meal": {$arrayElemAt: ["$meal", 0]}}},
  {
    $lookup: {
      from: 'recipescategories',
      localField: 'categoryId',
      foreignField: '_id',
      as: 'category',
      pipeline: [
        {$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },
  {$addFields: {"category": {$arrayElemAt: ["$category", 0]}}},
  {
    $lookup: {
      from: 'media',
      localField: 'mediaId',
      foreignField: '_id',
      as: 'media',
      pipeline: [
        {$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },
  {
    $lookup: {
      from: 'media',
      localField: 'mediaMobileId',
      foreignField: '_id',
      as: 'mediaMobile',
      pipeline: [
        {$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },
  {$addFields: {"media": {$arrayElemAt: ["$media", 0]}}},
  {$addFields: {"mediaMobile": {$arrayElemAt: ["$mediaMobile", 0]}}},
  {$unwind: {path: "$tags", preserveNullAndEmptyArrays: true }},
  {
    $lookup: {
      from: "recipestags",
      localField: "tags",
      foreignField: "_id",
      as: "dataTags",
      pipeline: [{$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },
  {$addFields: {"dataTags": {$arrayElemAt: ["$dataTags", 0]}}},
  {
    $group: {
      "_id": "$_id",
      "name": {$first: "$name"},
      "ingredients": {$first: "$ingredients"},
      "price": {$first: "$price"},
      "status": {$first: "$status"},
      "nutritionInformation": {$first: "$nutritionInformation"},
      "method": {$first: "$method"},
      "description": {$first: "$description"},
      "note": {$first: "$note"},
      "time": {$first: "$time"},
      "serves": {$first: "$serves"},
      "dietary": {$first: "$dietary"},
      "meal": {$first: "$meal"},
      "media": {$first: "$media"},
      "mediaMobile": {$first: "$mediaMobile"},
      "tags": {$push: "$dataTags"},
      "category": {$first: "$category"},
      "type": {$first: "$type"},
      "size": {$first: "$size"},
      "createdAt": {$first: "$createdAt"},
      "updatedAt": {$first: "$updatedAt"},
    }
  },
  {$unwind: {path: "$dietary", preserveNullAndEmptyArrays: true }},
  {$addFields: {"dietaryId": {"$toObjectId": "$dietary"}}},
  {
    $lookup: {
      from: "recipesdietaries",
      localField: "dietaryId",
      foreignField: "_id",
      as: "dataDietary",
      pipeline: [{$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },
  {$addFields: {"dataDietary": {$arrayElemAt: ["$dataDietary", 0]}}},
  {
    $group: {
      "_id": "$_id",
      "name": {$first: "$name"},
      "ingredients": {$first: "$ingredients"},
      "price": {$first: "$price"},
      "status": {$first: "$status"},
      "nutritionInformation": {$first: "$nutritionInformation"},
      "method": {$first: "$method"},
      "description": {$first: "$description"},
      "note": {$first: "$note"},
      "time": {$first: "$time"},
      "serves": {$first: "$serves"},
      "dietary": {$push: "$dataDietary"},
      "meal": {$first: "$meal"},
      "media": {$first: "$media"},
      "mediaMobile": {$first: "$mediaMobile"},
      "tags": {$first: "$tags"},
      "category": {$first: "$category"},
      "type": {$first: "$type"},
      "size": {$first: "$size"},
      "createdAt": {$first: "$createdAt"},
      "updatedAt": {$first: "$updatedAt"},
    }
  },
  {$unwind: {path: "$ingredients", preserveNullAndEmptyArrays: true }},
  {$addFields: {"ingredients._id": {"$toObjectId": "$ingredients._id"}}},
  {
    $lookup: {
      from: "ingredients",
      localField: "ingredients._id",
      foreignField: "_id",
      as: "dataIngredients",
      pipeline: [{$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },
  {$addFields: {"dataIngredients": {$arrayElemAt: ["$dataIngredients", 0]}}},
  {$addFields: {"dataIngredients.categoryId": {"$toObjectId": "$dataIngredients.categoryId"}}},
  {
    $lookup: {
      from: "ingredientscategories",
      localField: "dataIngredients.categoryId",
      foreignField: "_id",
      as: "dataIngredients.category",
      pipeline: [{$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },
  {$addFields: {"dataIngredients.category": {$arrayElemAt: ["$dataIngredients.category", 0]}}},
  {
    $group: {
      "_id": "$_id",
      "name": {$first: "$name"},
      "ingredients": { $push: {
        "_id": "$dataIngredients._id",
        "name": "$dataIngredients.name",
        "type": "$dataIngredients.type",
        "unit": "$dataIngredients.unit",
        "qty": "$ingredients.qty",
        "displayQty": "$ingredients.displayQty",
        "category": "$dataIngredients.category",
        "note": "$dataIngredients.note",
      }},
      "price": {$first: "$price"},
      "status": {$first: "$status"},
      "nutritionInformation": {$first: "$nutritionInformation"},
      "method": {$first: "$method"},
      "description": {$first: "$description"},
      "note": {$first: "$note"},
      "time": {$first: "$time"},
      "serves": {$first: "$serves"},
      "dietary": {$first: "$dietary"},
      "meal": {$first: "$meal"},
      "media": {$first: "$media"},
      "mediaMobile": {$first: "$mediaMobile"},
      "tags": {$first: "$tags"},
      "category": {$first: "$category"},
      "type": {$first: "$type"},
      "size": {$first: "$size"},
      "createdAt": {$first: "$createdAt"},
      "updatedAt": {$first: "$updatedAt"},
    }
  },
  {$sort: {"name": 1}},
  {$project: {__v: 0, mediaId: 0, categoryId: 0, mealId: 0, typeId: 0}},
]

const create = async (req, res) => {
  try {
    const {typeId, mealId, categoryId, ingredients, mediaId, mediaMobileId, tags, dietary} = req.body;

    if(typeId) {
      const type = await RecipesType.findById(typeId);
      if (!type)
        return res.status(400).send(handlerResERROR({message: "typeId do not exist !", code: "E_REQUEST"}));
    }

    const meal = await RecipesMeal.findById(mealId);
    if (!meal)
      return res.status(400).send(handlerResERROR({message: "mealId do not exist !", code: "E_REQUEST"}));

    if (mediaId) {
      const result = await Media.findById(mediaId);
      if (!result || result._doc.type !== "image")
        return res.status(400).send(handlerResERROR({message: "id media do not exist or type media is not image !", code: "E_REQUEST"}));
    }

    if (mediaMobileId) {
      const result = await Media.findById(mediaMobileId);
      if (!result || result.type !== "image")
        return res.status(400).send(handlerResERROR({message: "id media do not exist or type media is not image !", code: "E_REQUEST"}));
    }

    if(categoryId) {
      const category = await RecipesCategory.findById(categoryId);
      if (!category)
        return res.status(400).send(handlerResERROR({message: "categoryId do not exist !", code: "E_REQUEST"}));
    }

    if (tags) {
      const listTag = await Promise.all(tags.map(value => RecipesTags.findById(value)));
      for (let i = 0, length = listTag.length; i < length; i++) {
        if (!listTag[i]) return res.status(400).send(handlerResERROR({
          message: "id of tags do not exist !",
          code: "E_REQUEST"
        }));
      }
    }

    if (dietary) {
      const dietaries = await Promise.all(dietary.map(value => RecipesDietary.findById(value)));
      for (let i = 0, length = dietaries.length; i < length; i++) {
        if (!dietaries[i]) return res.status(400).send(handlerResERROR({
          message: "id of dietary do not exist !",
          code: "E_REQUEST"
        }));
      }
    }

    if (ingredients) {
      const ing = await Promise.all(ingredients.map(value => Ingredients.findById(value._id)));
      const array = [];
      for (let i = 0; i < ing.length; i++) {
        if (!ing[i]) return res.status(400).send(handlerResERROR({
          message: "id of ingredients do not exist !",
          code: "E_REQUEST"
        }));
        array.push({_id: ing[i]._id, qty: ingredients[i].qty, displayQty: ingredients[i].displayQty,});
      }
      req.body.ingredients = array;
    }
    const data = new Recipes({...req.body});
    await data.save();

    return res.status(200).send(handlerResSUCCESS({data}));
  } catch (e) {
    console.log(e);
    return res.status(400).send(handlerResERROR({message: "Upload food Fail !", code: "E_REQUEST"}));
  }
}

const change = async (req, res) => {
  try {
    const {mediaMobileId, typeId, mealId, categoryId, ingredients, mediaId, tags, dietary} = req.body;

    if (typeId && typeId !== "") {
      const type = await RecipesType.findById(typeId);
      if (!type)
        return res.status(400).send(handlerResERROR({message: "typeId do not exist !", code: "E_REQUEST"}));
    }

    if (mealId && mealId !== "") {
      const meal = await RecipesMeal.findById(mealId);
      if (!meal)
        return res.status(400).send(handlerResERROR({message: "mealId do not exist !", code: "E_REQUEST"}));
    }

    if (categoryId && categoryId !== "") {
      const category = await RecipesCategory.findById(categoryId);
      if (!category)
        return res.status(400).send(handlerResERROR({message: "categoryId do not exist !", code: "E_REQUEST"}));
    }

    if (tags) {
      const listTag = await Promise.all(tags.map(value => RecipesTags.findById(value)));
      for (let i = 0, length = listTag.length; i < length; i++) {
        if (!listTag[i]) return res.status(400).send(handlerResERROR({
          message: "id of tags do not exist !",
          code: "E_REQUEST"
        }));
      }
    }

    if (dietary) {
      const dietaries = await Promise.all(dietary.map(value => RecipesDietary.findById(value)));
      for (let i = 0, length = dietaries.length; i < length; i++) {
        if (!dietaries[i]) return res.status(400).send(handlerResERROR({
          message: "id of dietary do not exist !",
          code: "E_REQUEST"
        }));
      }
    }

    if (ingredients) {
      const ing = await Promise.all(ingredients.map(value => Ingredients.findById(value._id)));
      const array = [];
      for (let i = 0; i < ing.length; i++) {
        if (!ing[i]) return res.status(400).send(handlerResERROR({
          message: "id of ingredients do not exist !",
          code: "E_REQUEST"
        }));
        array.push({_id: ing[i]._id.toString(), qty: ingredients[i].qty, displayQty: ingredients[i].displayQty,})
      }
      req.body.ingredients = array;
    }

    if (mediaId && mediaId !== "") {
      const result = await Media.findById(mediaId);
      if (!result || result.type !== "image")
        return res.status(400).send(handlerResERROR({message: "id media do not exist or type media is not image !", code: "E_REQUEST"}));
    }

    if (mediaMobileId && mediaMobileId !== "") {
      const result = await Media.findById(mediaMobileId);
      if (!result || result.type !== "image")
        return res.status(400).send(handlerResERROR({message: "id media do not exist or type media is not image !", code: "E_REQUEST"}));
    }

    req.body.updatedAt = Date.now();
    const data = await Recipes.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if (!data) return res.status(400).send(handlerResERROR({message: "Recipes not found", code: "E_REQUEST"}));

    return res.status(200).send(handlerResSUCCESS({data}));
  } catch (e) {
    return res.status(400).send(handlerResERROR({message: "Change recipes Fail !", code: "E_REQUEST"}));
  }
}

const fetch = async (req, res) => {
  try {
    const query = [...aggRecipe]
    query[0].$match._id = ObjectId(req.params.id)
    let data = await Recipes.aggregate(query);
    data = data[0]
    if (req.roles === "member" && data.status && data.status === "draft")
      return res.status(400).send(handlerResERROR({message: "recipes not found", code: "E_REQUEST"}))
    if (!data) return res.status(200).send(handlerResSUCCESS({data: {}, message: "recipes not found"}))

    const {_id} = data;
    data.isFavorite = await isFavorite(req.uid, "recipe", _id);
    if(data.ingredients.length === 1 && !data.ingredients[0]._id) data.ingredients = [];
    return res.status(200).send(handlerResSUCCESS({data}))
  } catch (e) {
    console.log(e);
    return res.status(400).send(handlerResERROR({message: "recipes not found", code: "E_REQUEST"}))
  }
}

const filter = async (req, res) => {
  try {
    if(req.query.isFavorite === "true") return filterFavorite(req, res);
    const {name, typeId, mealId, categoryId, ingredients, dietaryId} = req.query;
    const type = typeId && typeId !== "" ? typeId : null
    const meal = mealId && mealId !== "" ? mealId : null
    const category = categoryId && categoryId !== "" ? categoryId : null

    const query = [...aggRecipe]
    query[0].$match = {}

    if(req.query.isFavorite === 'false') {
      let recipeId = await Favorites.aggregate([{$match: {type: "recipe", userId: req.uid}}]);
      if(recipeId) {
        recipeId = recipeId[0].data;
        query[0].$match._id = {$nin: recipeId.map(val => ObjectId(val))};
      }
    }
    if(dietaryId && dietaryId.toLowerCase() !== "all") query[0].$match.dietary = {$all: [dietaryId]};
    if(type && type.toLowerCase() !== "all") query[0].$match.typeId = type;
    if(meal && meal.toLowerCase() !== "all") query[0].$match.mealId = meal;
    if(category && category.toLowerCase() !== "all") query[0].$match.categoryId = category;

    if(Array.isArray(ingredients)) query[0].$match.ingredients = {$all: ingredients.map(val => ({$elemMatch: {_id: val}}))};
    else if(ingredients) query[0].$match.ingredients = {$elemMatch: {_id: ingredients}};
    if(req.roles === "member") query[0].$match.status = "published";

    const regex = new RegExp('.*' + name + '.*', 'gi');
    if(name) query[0].$match.name = regex;

    const tags = req.query.tags && req.query.tags !== "" ? req.query.tags : null;
    if(Array.isArray(tags)) query[0].$match.tags = {$all: tags.map(val => (val))}
    else if(tags) query[0].$match.tags = {$all: [tags]}

    if (req.query.itemsPerPage) {
      const pageNumber = (typeof req.query?.pageNumber === 'string') ? stringToInt(req.query?.pageNumber) : req.query?.pageNumber || 0;
      const itemsPerPage = (typeof req.query?.itemsPerPage === 'string') ? stringToInt(req.query?.itemsPerPage) : req.query?.itemsPerPage;
      const skip = itemsPerPage * pageNumber;
      query.push({$facet: {data: [{$skip: skip}, {$limit: itemsPerPage}]}})
    }
    let data = await Recipes.aggregate(query);
    if(req.query.itemsPerPage) {
      query.splice(query.length-1, 1);
      data = data[0].data;
    }
    if(data.length === 0) return res.status(200).send(handlerResSUCCESS({data: [], message: "recipes not found"}))
    let totalItems = await Recipes.aggregate(query).count("totalItems");
    totalItems = totalItems.length > 0 ? totalItems[0].totalItems : 0;
    const checkFavorite = await Promise.all(data.map(value => isFavorite(req.uid, "recipe", value._id)));
    const result = [];
    const favorite = req.query.isFavorite;
    for(let i = 0; i < data.length; i++){
      if (!checkFavorite[i]) {
        data[i].isFavorite = false;
        if(favorite === "false") result.push(data[i]);
        continue;
      }
      data[i].isFavorite = true;
      if(favorite === "true") result.push(data[i]);
    }
    if(favorite === "true" || favorite === "false") data = result;
    for (let val of data){
      if(val.ingredients.length === 1 && !val.ingredients[0]._id) val.ingredients = [];
    }
    return res.status(200).send(handlerResSUCCESS({data, totalItems}))
  } catch (e) {
    console.log(e);
    res.status(400).send(handlerResERROR({message: "recipes not found", code: "E_REQUEST"}))
  }
}

const aggFavoriteRecipe = [
  {$match: {}},
  {$unwind: {path: "$data", preserveNullAndEmptyArrays: true}},
  {$addFields: {"data": {"$toObjectId": "$data"},}},
  {
    $lookup: {
      from: "recipes",
      localField: "data",
      foreignField: "_id",
      as: "recipes",
    }
  },
  {$unwind: {path: "$recipes", preserveNullAndEmptyArrays: true}},
  {$replaceRoot: {newRoot: {$mergeObjects: ["$$ROOT", "$recipes"]}}},
  {$match: {}},
  {
    $addFields: {
      "typeId": {"$toObjectId": "$typeId"},
      "mealId": {"$toObjectId": "$mealId"},
      "categoryId": {"$toObjectId": "$categoryId"},
      "mediaId": {"$toObjectId": "$mediaId"},
      "mediaMobileId": {"$toObjectId": "$mediaMobileId"},
    }
  },
  {
    $lookup: {
      from: 'recipestypes',
      localField: 'typeId',
      foreignField: '_id',
      as: 'type',
      pipeline: [
        {$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },
  {$addFields: {"type": {$arrayElemAt: ["$type", 0]}}},
  {
    $lookup: {
      from: 'recipesmeals',
      localField: 'mealId',
      foreignField: '_id',
      as: 'meal',
      pipeline: [
        {$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },
  {$addFields: {"meal": {$arrayElemAt: ["$meal", 0]}}},
  {
    $lookup: {
      from: 'recipescategories',
      localField: 'categoryId',
      foreignField: '_id',
      as: 'category',
      pipeline: [
        {$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },
  {$addFields: {"category": {$arrayElemAt: ["$category", 0]}}},
  {
    $lookup: {
      from: 'media',
      localField: 'mediaId',
      foreignField: '_id',
      as: 'media',
      pipeline: [
        {$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },
  {
    $lookup: {
      from: 'media',
      localField: 'mediaMobileId',
      foreignField: '_id',
      as: 'mediaMobile',
      pipeline: [
        {$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },
  {$addFields: {"media": {$arrayElemAt: ["$media", 0]}}},
  {$addFields: {"mediaMobile": {$arrayElemAt: ["$mediaMobile", 0]}}},
  {$unwind: {path: "$tags", preserveNullAndEmptyArrays: true }},
  {
    $lookup: {
      from: "recipestags",
      localField: "tags",
      foreignField: "_id",
      as: "dataTags",
      pipeline: [{$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },
  {$addFields: {"dataTags": {$arrayElemAt: ["$dataTags", 0]}}},
  {
    $group: {
      "_id": "$_id",
      "name": {$first: "$name"},
      "ingredients": {$first: "$ingredients"},
      "price": {$first: "$price"},
      "status": {$first: "$status"},
      "nutritionInformation": {$first: "$nutritionInformation"},
      "method": {$first: "$method"},
      "description": {$first: "$description"},
      "note": {$first: "$note"},
      "time": {$first: "$time"},
      "serves": {$first: "$serves"},
      "dietary": {$first: "$dietary"},
      "meal": {$first: "$meal"},
      "media": {$first: "$media"},
      "mediaMobile": {$first: "$mediaMobile"},
      "tags": {$push: "$dataTags"},
      "category": {$first: "$category"},
      "type": {$first: "$type"},
      "size": {$first: "$size"},
      "createdAt": {$first: "$createdAt"},
      "updatedAt": {$first: "$updatedAt"},
    }
  },
  {$unwind: {path: "$dietary", preserveNullAndEmptyArrays: true }},
  {$addFields: {"dietaryId": {"$toObjectId": "$dietary"}}},
  {
    $lookup: {
      from: "recipesdietaries",
      localField: "dietaryId",
      foreignField: "_id",
      as: "dataDietary",
      pipeline: [{$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },
  {$addFields: {"dataDietary": {$arrayElemAt: ["$dataDietary", 0]}}},
  {
    $group: {
      "_id": "$_id",
      "name": {$first: "$name"},
      "ingredients": {$first: "$ingredients"},
      "price": {$first: "$price"},
      "status": {$first: "$status"},
      "nutritionInformation": {$first: "$nutritionInformation"},
      "method": {$first: "$method"},
      "description": {$first: "$description"},
      "note": {$first: "$note"},
      "time": {$first: "$time"},
      "serves": {$first: "$serves"},
      "dietary": {$push: "$dataDietary"},
      "meal": {$first: "$meal"},
      "media": {$first: "$media"},
      "mediaMobile": {$first: "$mediaMobile"},
      "tags": {$first: "$tags"},
      "category": {$first: "$category"},
      "type": {$first: "$type"},
      "size": {$first: "$size"},
      "createdAt": {$first: "$createdAt"},
      "updatedAt": {$first: "$updatedAt"},
    }
  },
  {$unwind: {path: "$ingredients", preserveNullAndEmptyArrays: true }},
  {$addFields: {"ingredients._id": {"$toObjectId": "$ingredients._id"}}},
  {
    $lookup: {
      from: "ingredients",
      localField: "ingredients._id",
      foreignField: "_id",
      as: "dataIngredients",
      pipeline: [{$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },
  {$addFields: {"dataIngredients": {$arrayElemAt: ["$dataIngredients", 0]}}},
  {$addFields: {"dataIngredients.categoryId": {"$toObjectId": "$dataIngredients.categoryId"}}},
  {
    $lookup: {
      from: "ingredientscategories",
      localField: "dataIngredients.categoryId",
      foreignField: "_id",
      as: "dataIngredients.category",
      pipeline: [{$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },
  {$addFields: {"dataIngredients.category": {$arrayElemAt: ["$dataIngredients.category", 0]}}},
  {
    $group: {
      "_id": "$_id",
      "name": {$first: "$name"},
      "ingredients": { $push: {
          "_id": "$dataIngredients._id",
          "name": "$dataIngredients.name",
          "type": "$dataIngredients.type",
          "unit": "$dataIngredients.unit",
          "qty": "$ingredients.qty",
          "displayQty": "$ingredients.displayQty",
          "category": "$dataIngredients.category",
          "note": "$dataIngredients.note",
        }},
      "price": {$first: "$price"},
      "status": {$first: "$status"},
      "nutritionInformation": {$first: "$nutritionInformation"},
      "method": {$first: "$method"},
      "description": {$first: "$description"},
      "note": {$first: "$note"},
      "time": {$first: "$time"},
      "serves": {$first: "$serves"},
      "dietary": {$first: "$dietary"},
      "meal": {$first: "$meal"},
      "media": {$first: "$media"},
      "mediaMobile": {$first: "$mediaMobile"},
      "tags": {$first: "$tags"},
      "category": {$first: "$category"},
      "type": {$first: "$type"},
      "size": {$first: "$size"},
      "createdAt": {$first: "$createdAt"},
      "updatedAt": {$first: "$updatedAt"},
    }
  },
  {$sort: {"name": 1}},
  {$project: {__v: 0, mediaId: 0, categoryId: 0, mealId: 0, typeId: 0, recipes: 0, type: 0, data: 0}},
]

const filterFavorite = async (req, res) => {
  try {
    const {name, typeId, mealId, categoryId, ingredients, dietaryId} = req.query;
    const type = typeId && typeId !== "" ? typeId : null
    const meal = mealId && mealId !== "" ? mealId : null
    const category = categoryId && categoryId !== "" ? categoryId : null

    const query = [...aggFavoriteRecipe];
    query[0].$match = {type: "recipe", userId: req.uid};

    query[6].$match = {};
    if(dietaryId && dietaryId.toLowerCase() !== "all") query[6].$match.dietary = {$all: [dietaryId]};
    if(type && type.toLowerCase() !== "all") query[6].$match.typeId = type;
    if(meal && meal.toLowerCase() !== "all") query[6].$match.mealId = meal;
    if(category && category.toLowerCase() !== "all") query[6].$match.categoryId = category;

    if(Array.isArray(ingredients)) query[6].$match.ingredients = {$all: ingredients.map(val => ({$elemMatch: {_id: val}}))};
    else if(ingredients) query[6].$match.ingredients = {$elemMatch: {_id: ingredients}};
    if(req.roles === "member") query[6].$match.status = "published";

    const regex = new RegExp('.*' + name + '.*', 'gi');
    if(name) query[6].$match.name = regex;

    const tags = req.query.tags && req.query.tags !== "" ? req.query.tags : null;
    if(Array.isArray(tags)) query[6].$match.tags = {$all: tags.map(val => (val))}
    else if(tags) query[6].$match.tags = {$all: [tags]}

    if (req.query.itemsPerPage) {
      const pageNumber = (typeof req.query?.pageNumber === 'string') ? stringToInt(req.query?.pageNumber) : req.query?.pageNumber || 0;
      const itemsPerPage = (typeof req.query?.itemsPerPage === 'string') ? stringToInt(req.query?.itemsPerPage) : req.query?.itemsPerPage;
      const skip = itemsPerPage * pageNumber;
      query.push({$facet: {data: [{$skip: skip}, {$limit: itemsPerPage}]}})
    }
    let data = await Favorites.aggregate(query);
    if(req.query.itemsPerPage) {
      query.splice(query.length-1, 1);
      data = data[0].data;
    }
    if(data.length === 0) return res.status(200).send(handlerResSUCCESS({data: [], message: "recipes not found"}))
    let totalItems = await Favorites.aggregate(query).count("totalItems");
    totalItems = totalItems.length > 0 ? totalItems[0].totalItems : 0;

    for (let val of data){
      val.isFavorite = true;
      if(val.ingredients.length === 1 && !val.ingredients[0]._id) val.ingredients = [];
    }
    return res.status(200).send(handlerResSUCCESS({data, totalItems}))
  } catch (e) {
    console.log(e);
    res.status(400).send(handlerResERROR({message: "recipes not found", code: "E_REQUEST"}))
  }
}

const deleteRecipes = async (req, res) => {
  try {
    const data = await Recipes.findByIdAndDelete(req.params.id);
    if (!data) return res.status(400).send(handlerResERROR({message: "recipes not found", code: "E_REQUEST"}))
    return res.status(200).send(handlerResSUCCESS())
  } catch (e) {
    return res.status(400).send(handlerResERROR({message: "Delete recipes fail!", code: "E_REQUEST"}))
  }
}


const fetchRecipesName = async (req, res) => {
  try {
    const data = await Recipes.findById(req.params.id);
    if (!data) return res.status(200).send(handlerResSUCCESS({data: {}, message: "recipes not found"}))

    return res.status(200).send(handlerResSUCCESS({data: {name: data._doc.name}}))
  } catch (e) {
    console.log(e);
    return res.status(400).send(handlerResERROR({message: "recipes not found", code: "E_REQUEST"}))
  }
}

module.exports = {
  create,
  change,
  fetch,
  filter,
  deleteRecipes,
  fetchRecipesName,
}
