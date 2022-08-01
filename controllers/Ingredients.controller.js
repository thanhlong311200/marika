const Ingredients = require('../models/Ingredients.model');
const {handlerResERROR, handlerResSUCCESS, stringToInt} = require("../utils");
const IngredientsCategory = require("../models/IngredientsCategory.model");

const aggIngredients = [
  {$match: {}},
  {$addFields: {"categoryId": {"$toObjectId": "$categoryId"}}},
  {
    $lookup: {
      from: "ingredientscategories",
      localField: "categoryId",
      foreignField: "_id",
      as: "category",
      pipeline: [{$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },
  {$addFields: {"category": {$arrayElemAt: ["$category", 0]}}},
  {$sort: {"createdAt": -1}}
];

const create = async (req, res) => {
  try {
    const {categoryId} = req.body;
    const category = await IngredientsCategory.findById(categoryId);
    if (!category)
      return res.status(400).send(handlerResERROR({message: "categoryId do not exist !", code: "E_REQUEST"}));

    const data = new Ingredients({...req.body})
    await data.save();
    return res.status(200).send(handlerResSUCCESS({data}));
  } catch (e) {
    console.log(e);
    return res.status(400).send(handlerResERROR({message: "Upload Ingredients Fail !", code: "E_REQUEST"}));
  }
}

const change = async (req, res) => {
  try {
    const {categoryId} = req.body;
    if (categoryId) {
      const category = await IngredientsCategory.findById(categoryId);
      if (!category)
        return res.status(400).send(handlerResERROR({message: "categoryId do not exist !", code: "E_REQUEST"}));
    }

    req.body.updatedAt = new Date()
    const data = await Ingredients.findByIdAndUpdate(req.params.id, req.body, {new: true});
    console.log(data)
    if (!data) return res.status(400).send(handlerResERROR({message: "Ingredients not found", code: "E_REQUEST"}));
    return res.status(200).send(handlerResSUCCESS({data}));
  } catch (e) {
    console.log(e);
    return res.status(400).send(handlerResERROR({message: "Change Ingredients Fail !", code: "E_REQUEST"}));
  }
}

const fetch = async (req, res) => {
  try {
    const data = await Ingredients.findById(req.params.id);
    if (!data) return res.status(200).send(handlerResSUCCESS({data: {}, message: "Ingredients not found"}))
    return res.status(200).send(handlerResSUCCESS({data}))
  } catch (e) {
    res.status(400).send(handlerResERROR({message: "Ingredients not found", code: "E_REQUEST"}))
  }
}

const fetchList = async (req, res) => {
  try {
    const {name, categoryId, type} = req.query
    const query = [...aggIngredients];
    query[0].$match = {}

    if (type) query[0].$match.type = type;
    if (categoryId && categoryId.toLowerCase() !== 'all') query[0].$match.categoryId = categoryId;
    if (name) query[0].$match.name = new RegExp('.*' + name + '.*', 'gi');

    if (req.query.name)
      query[0].$match['name'] = new RegExp('.*' + req.query.name + '.*', 'gi');
    if (req.query.categoryId)
      query[0].$match['categoryId'] = req.query.categoryId;
    if (req.query.type)
      query[0].$match['type'] = req.query.type

    if (req.query.itemsPerPage) {
      const pageNumber = (typeof req.query?.pageNumber === 'string') ? stringToInt(req.query?.pageNumber) : req.query?.pageNumber || 0;
      const itemsPerPage = (typeof req.query?.itemsPerPage === 'string') ? stringToInt(req.query?.itemsPerPage) : req.query?.itemsPerPage;
      const skip = itemsPerPage * pageNumber;
      query.push({$facet: {data: [{$skip: skip}, {$limit: itemsPerPage}]}})
    }

    let data = await Ingredients.aggregate(query);
    if (req.query.itemsPerPage) {
      query.splice(query.length-1, 1);
      data = data[0].data
    }
    if (data.length === 0) return res.status(200).send(handlerResSUCCESS({data: [], message: "Ingredients not found"}))
    let totalItems = await Ingredients.aggregate([query[0]]).count("totalItems");
    totalItems = totalItems.length > 0 ? totalItems[0].totalItems : 0;
    return res.status(200).send(handlerResSUCCESS({data, totalItems}))
  } catch (e) {
    res.status(400).send(handlerResERROR({message: "Ingredients not found", code: "E_REQUEST"}))
  }
}

const deleteIngredients = async (req, res) => {
  try {
    const {id} = req.params
    const data = await Ingredients.findByIdAndDelete(id);
    if (!data) return res.status(400).send(handlerResERROR({message: "Ingredients not found", code: "E_REQUEST"}))
    return res.status(200).send(handlerResSUCCESS())
  } catch (e) {
    return res.status(400).send(handlerResERROR({message: "Delete Ingredients fail!", code: "E_REQUEST"}))
  }
}

module.exports = {
  create,
  change,
  fetch,
  deleteIngredients,
  fetchList,
}
