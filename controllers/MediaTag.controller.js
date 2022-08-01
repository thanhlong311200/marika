const MediaTag = require('../models/MediaTag.model');
const {handlerResERROR, handlerResSUCCESS, stringToInt} = require("../utils");
const Topic = require("../models/MediaTopic.model");
const Category = require("../models/MediaCategory.model");
const {ObjectId} = require("mongodb");

const aggTags = [
  {$match: {}},
  {$addFields: {
    "categoryId": {"$toObjectId": "$categoryId"},
    "topicId": {"$toObjectId": "$topicId"},
  }},
  {
    $lookup: {
      from: "mediacategories",
      localField: "categoryId",
      foreignField: "_id",
      as: "category",
      pipeline: [{$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },
  {
    $lookup: {
      from: "mediatopics",
      localField: "topicId",
      foreignField: "_id",
      as: "topic",
      pipeline: [{$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },

  {$addFields: {
    "category": {$arrayElemAt: ["$category", 0]},
    "topic": {$arrayElemAt: ["$topic", 0]},
  }},
  {$sort: {"createdAt": -1}}
]

const create = async (req, res) => {
  try {
    const {topicId, categoryId} = req.body;

    if(topicId) {
      const topic = await Topic.findById(topicId);
      if (!topic)
        return res.status(400).send(handlerResERROR({message: "topicId do not exist !", code: "E_REQUEST"}));
      const cat = await Category.findById(topic._doc.categoryId);
      if(!cat)
        return res.status(400).send(handlerResERROR({message: "categoryId do not exist !", code: "E_REQUEST"}));
      req.body.categoryId = cat._doc._id;
    }

    if(categoryId && !topicId) {
      const cat = await Category.findById(categoryId);
      if(!cat)
        return res.status(400).send(handlerResERROR({message: "categoryId do not exist !", code: "E_REQUEST"}));
    }

    const data = new MediaTag({...req.body})
    await data.save();
    return res.status(200).send(handlerResSUCCESS({data}));
  } catch (e) {
    console.log(e);
    return res.status(400).send(handlerResERROR({message:"Upload Media Tag Fail !", code: "E_REQUEST"}));
  }
}

const change = async (req, res) => {
  try {
    const {topicId, categoryId} = req.body;

    if(topicId) {
      const topic = await Topic.findById(topicId);
      if (!topic)
        return res.status(400).send(handlerResERROR({message: "topicId do not exist !", code: "E_REQUEST"}));
      const cat = await Category.findById(topic._doc.categoryId);
      if(!cat)
        return res.status(400).send(handlerResERROR({message: "categoryId do not exist !", code: "E_REQUEST"}));
      req.body.categoryId = cat._doc._id;
    }

    if(categoryId && !topicId) {
      const cat = await Category.findById(categoryId);
      if(!cat)
        return res.status(400).send(handlerResERROR({message: "categoryId do not exist !", code: "E_REQUEST"}));
    }

    req.body.updatedAt = new Date()
    const data = await MediaTag.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if (!data) return res.status(400).send(handlerResERROR({message:"Media Tag not found", code: "E_REQUEST"}));
    return res.status(200).send(handlerResSUCCESS({data}));
  } catch (e) {
    console.log(e);
    return res.status(400).send(handlerResERROR({message: "Change Media Tag Fail !", code: "E_REQUEST"}));
  }
}

const fetch = async (req, res) => {
  try {
    const query = [...aggTags];
    query[0].$match = {_id: ObjectId(req.params.id)};
    let data = await MediaTag.aggregate(query);
    data = data[0]
    if(!data) return res.status(200).send(handlerResSUCCESS({data: {}, message: "Media Tag not found"}))
    return res.status(200).send(handlerResSUCCESS({data}))
  } catch (e) {
    res.status(400).send(handlerResERROR({message: "Media Tag not found", code: "E_REQUEST"}))
  }
}

const fetchList = async (req, res) => {
  try {
    const {categoryId, topicId} = req.query;
    const query = [...aggTags];
    query[0].$match = {};
    if (req.query.name)
      query[0].$match.name = new RegExp('.*' + req.query.name + '.*', 'gi');

    const or = [];
    if(categoryId && topicId) or.push(...[{categoryId, topicId}, {categoryId: {$exists: false}, topicId: {$exists: false}}, {categoryId: null}, {topicId: null}]);
    if(categoryId && !topicId) or.push(...[{categoryId}, {categoryId: {$exists: false}}, {categoryId: null}]);
    if(!categoryId && topicId) or.push(...[{topicId}, {topicId: {$exists: false}}, {topicId: null}]);
    if(or.length > 0) query[0].$match.$or = or;

    if (req.query.itemsPerPage) {
      const pageNumber = (typeof req.query?.pageNumber === 'string') ? stringToInt(req.query?.pageNumber) : req.query?.pageNumber || 0;
      const itemsPerPage = (typeof req.query?.itemsPerPage === 'string') ? stringToInt(req.query?.itemsPerPage) : req.query?.itemsPerPage;
      const skip = itemsPerPage * pageNumber;
      query.push({$facet: {data: [{$skip: skip}, {$limit: itemsPerPage}]}})
    }

    let data = await MediaTag.aggregate(query);
    console.log(query[0].$match.$or)
    if (req.query.itemsPerPage) {
      query.splice(query.length-1, 1);
      data = data[0].data;
    }
    if (data.length === 0) return res.status(200).send(handlerResSUCCESS({data: {}, message: "Media Tag not found"}))
    let totalItems = await MediaTag.aggregate([query[0]]).count("totalItems");
    totalItems = totalItems.length > 0 ? totalItems[0].totalItems : 0;
    return res.status(200).send(handlerResSUCCESS({data, totalItems}))
  } catch (e) {
    res.status(400).send(handlerResERROR({message: "Media Tag not found", code: "E_REQUEST"}))
  }
}

const deleteMediaTag = async (req, res) => {
  try {
    const {id} = req.params
    const data = await MediaTag.findByIdAndDelete(id);
    if(!data) return res.status(400).send(handlerResERROR({message:"Media Tag not found", code: "E_REQUEST"}))
    return res.status(200).send(handlerResSUCCESS())
  }catch (e) {
    return res.status(400).send(handlerResERROR({message:"Delete Media Tag fail!", code: "E_REQUEST"}))
  }
}

module.exports = {
  create,
  change,
  fetch,
  deleteMediaTag,
  fetchList,
}
