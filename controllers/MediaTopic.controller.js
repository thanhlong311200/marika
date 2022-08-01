const MediaTopic = require('../models/MediaTopic.model');
const MediaCategory = require('../models/MediaCategory.model');
const {handlerResERROR, handlerResSUCCESS, stringToInt} = require("../utils");

const aggTopic = [
  {$match: {}},
  {$addFields: {"categoryId": {"$toObjectId": "$categoryId"}}},
  {
    $lookup: {
      from: "mediacategories",
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
    const {categoryId} = req.body
    const cat = await MediaCategory.findById(categoryId);
    if (!cat) return res.status(400).send(handlerResERROR({message: "category do not exist !", code: "E_REQUEST"}));
    req.body.type = cat._doc.type;
    const data = new MediaTopic({...req.body})
    await data.save();
    return res.status(200).send(handlerResSUCCESS({data}));
  } catch (e) {
    console.log(e);
    return res.status(400).send(handlerResERROR({message: "Create Media Topic Fail !", code: "E_REQUEST"}));
  }
}

const change = async (req, res) => {
  try {
    const {categoryId} = req.body
    if (categoryId) {
      const cat = await MediaCategory.findById(categoryId);
      if (!cat) return res.status(400).send(handlerResERROR({message: "category do not exist !", code: "E_REQUEST"}));
      req.body.type = cat._doc.type;
    }
    req.body.updatedAt = new Date()
    const data = await MediaTopic.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if (!data) return res.status(400).send(handlerResERROR({message: "Media Topic not found", code: "E_REQUEST"}));
    return res.status(200).send(handlerResSUCCESS({data}));
  } catch (e) {
    console.log(e);
    return res.status(400).send(handlerResERROR({message: "Change Media Topic Fail !", code: "E_REQUEST"}));
  }
}

const fetch = async (req, res) => {
  try {
    const data = await MediaTopic.findById(req.params.id);
    if (!data) return res.status(200).send(handlerResSUCCESS({data: {}, message: "Media Topic not found"}))
    return res.status(200).send(handlerResSUCCESS({data}))
  } catch (e) {
    res.status(400).send(handlerResERROR({message: "Media Topic not found", code: "E_REQUEST"}))
  }
}

const fetchList = async (req, res) => {
  try {
    const {categoryId} = req.query
    const query = [...aggTopic];
    query[0].$match = {}

    if (categoryId && categoryId !== "") query[0].$match.categoryId = categoryId
    if (req.query.type) query[0].$match.type = req.query.type
    if (req.query.subType) query[0].$match.subType = req.query.subType
    if (req.query.name)
      query[0].$match.name = new RegExp('.*' + req.query.name + '.*', 'gi');

    if (req.query.itemsPerPage) {
      const pageNumber = (typeof req.query?.pageNumber === 'string') ? stringToInt(req.query?.pageNumber) : req.query?.pageNumber || 0;
      const itemsPerPage = (typeof req.query?.itemsPerPage === 'string') ? stringToInt(req.query?.itemsPerPage) : req.query?.itemsPerPage;
      let skip = itemsPerPage * pageNumber;
      query.push({$facet: {data: [{$skip: skip}, {$limit: itemsPerPage}]}})
    }

    let data = await MediaTopic.aggregate(query);
    if(req.query.itemsPerPage) {
      query.splice(query.length-1, 1);
      data = data[0].data;
    }
    if (data.length === 0) return res.status(200).send(handlerResSUCCESS({data: []}))
    let totalItems = await MediaTopic.aggregate([query[0]]).count("totalItems");
    totalItems = totalItems.length > 0 ? totalItems[0].totalItems : 0;
    return res.status(200).send(handlerResSUCCESS({data, totalItems}))
  } catch (e) {
    res.status(400).send(handlerResERROR({message: "Media Topic not found", code: "E_REQUEST"}))
  }
}

// Lấy ra tất cả topic theo category
// const fetchListByCategory = async (req, res) => {
//   try {
//     const cat = await MediaCategory.findById(req.params.id);
//     if(!cat) return res.status(400).send(handlerResERROR({message:"category do not exist !", code: "E_REQUEST"}));
//     const data = await MediaTopic.find({categoryId: req.params.id});
//     if(!data) return res.status(200).send(handlerResSUCCESS({data: {}, message: "Media Topic not found"}))
//     return res.status(200).send(handlerResSUCCESS({data}))
//   } catch (e) {
//     res.status(400).send(handlerResERROR({message: "Media Topic not found", code: "E_REQUEST"}))
//   }
// }

const deleteMediaTopic = async (req, res) => {
  try {
    const {id} = req.params
    const data = await MediaTopic.findByIdAndDelete(id);
    if (!data) return res.status(400).send(handlerResERROR({message: "Media Topic not found", code: "E_REQUEST"}))
    return res.status(200).send(handlerResSUCCESS())
  } catch (e) {
    return res.status(400).send(handlerResERROR({message: "Delete Media Topic fail!", code: "E_REQUEST"}))
  }
}

module.exports = {
  create,
  change,
  fetch,
  deleteMediaTopic,
  fetchList,
  // fetchListByCategory,
}
