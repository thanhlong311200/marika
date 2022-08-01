const Media = require('../models/Media.model');
const Topic = require('../models/MediaTopic.model');
const Category = require('../models/MediaCategory.model');
const Tag = require('../models/MediaTag.model');
const Series = require('../models/MediaSeries.model');
const {handlerResERROR, handlerResSUCCESS, stringToInt, isFavorite, resizeImage} = require("../utils");
const ENV = require("../utils/Env");
const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");
const {unlink} = require("fs/promises");
const {checkURLFile} = require("../validators/Media.validator");
const {validationResult} = require("express-validator");
const {ObjectId} = require("mongodb");
const Favorites = require("../models/Favorites.model");
const {cloneDeep} = require("lodash");

const ACAST_URL = ENV.getOrFail("A_CAST_URL");
const ACAST_KEY = ENV.getOrFail("A_CAST_KEY");
const ACAST_SHOW_ID = ENV.getOrFail("A_CAST_SHOW_ID");
const acast_uri = `${ACAST_URL}/shows/${ACAST_SHOW_ID}/episodes`;
const regexMV = new RegExp('\/manage\/videos', 'i')

const aggMedia = [
  {$match: {}},
  {$addFields: {
    "categoryId": {"$toObjectId": "$categoryId"},
    "topicId": {"$toObjectId": "$topicId"}
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
  {
    $lookup: {
      from: "mediaseries",
      localField: "seriesId",
      foreignField: "_id",
      as: "series",
      pipeline: [{$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },
  {$addFields: {
    "category": {$arrayElemAt: ["$category", 0]},
    "topic": {$arrayElemAt: ["$topic", 0]},
    "series": {$arrayElemAt: ["$series", 0]},
  }},
  // {$project: {__v: 0, categoryId: 0, seriesId: 0}},
  {$unwind: { path: "$tagIds", preserveNullAndEmptyArrays: true }},
  {$addFields: {"tagIds": {"$toObjectId": "$tagIds"}}},
  {
    $lookup: {
      from: "mediatags",
      localField: "tagIds",
      foreignField: "_id",
      as: "tags",
      pipeline: [{$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },
  {$addFields: {"tags": {$arrayElemAt: ["$tags", 0]}}},
  {
    $group: {
      "_id": "$_id",
      "name": {$first: "$name"},
      "type": {$first: "$type"},
      "urlFile": {$first: "$urlFile"},
      "mp4Link": {$first: "$mp4Link"},
      "thumbnail": {$first: "$thumbnail"},
      "thumbnailMobile": {$first: "$thumbnailMobile"},
      "seriesId": {$first: "$seriesId"},
      "series": {$first: "$series"},
      "episode": {$first: "$episode"},
      "category": {$first: "$category"},
      "topic": {$first: "$topic"},
      "tags": {$push: "$tags"},
      "description": {$first: "$description"},
      "detailInfo": {$first: "$detailInfo"},
      "subtype": {$first: "$subtype"},
      "status": {$first: "$status"},
      "acast": {$first: "$acast"},
      "createdAt": {$first: "$createdAt"},
      "updatedAt": {$first: "$updatedAt"},
    }
  },
  {$sort: {"name": 1}}
];

const groupBySeries = {
  $group: {
    "_id": "$series",
    "dataSeries": {
      $push: {
        "_id": "$_id",
        "name": "$name",
        "type": "$type",
        "urlFile": "$urlFile",
        "mp4Link": "$mp4Link",
        "thumbnail": "$thumbnail",
        "thumbnailMobile": "$thumbnailMobile",
        "seriesId": "$seriesId",
        "episode": "$episode",
        "category": "$category",
        "topic": "$topic",
        "tags": "$tags",
        "description": "$description",
        "detailInfo": "$detailInfo",
        "subtype": "$subtype",
        "status": "$status",
        "acast": "$acast",
        "createdAt": "$createdAt",
        "updatedAt": "$updatedAt",
      }
    }
  }
}

const uploadACast = (req) => {
  return new Promise((resolve, reject) => {
    const {name, status, subtype, description = '', detailInfo} = req.body;
    const file = fs.createReadStream(req.file.path);
    const data = new FormData();
    data.append('title', name);
    data.append('status', status);
    if(description && description !== "")
      data.append('subtitle', description);
    if(detailInfo && detailInfo !== "")
      data.append('summary', detailInfo);
    if(subtype) data.append('type', subtype);
    data.append('audio', file);

    const headers = { ...data.getHeaders() };
    headers["x-api-key"] = ACAST_KEY;

    axios.post(acast_uri, data, {headers})
      .then(function (res) {
        resolve(res.data);
      })
      .catch(function (err) {
        reject(err)
      });
  })
}

const removeACast = (episodeId) => {
  return new Promise((resolve, reject) => {
    const headers = { "x-api-key": ACAST_KEY };
    axios.delete(`${acast_uri}/${episodeId}`, {headers})
      .then(function (res) {
        resolve(res.data);
      })
      .catch(function (err) {
        reject(err)
      });
  })
}

const getThumbnailVimeo = (id) => new Promise((resolve) => {
  axios.get(`https://vimeo.com/api/oembed.json?url=https%3A%2F%2Fvimeo.com%2F${id}`)
    .then(res => resolve(res.data))
    .catch(() => resolve({}))
})

const upMedia = async (req, res) => {
  try {
    let data = await checkURLFile(req);
    if(data) return res.status(422).send(data);

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      if(req.file) await unlink(req.file.path);
      return res.status(422).json(handlerResERROR({
        message: "Validation of the upload media form failed",
        data: errors.array().map((value) => ({field: value.param, message: value.msg}))
      }));
    }

    const {tagIds, seriesId} = req.body;

    if(tagIds){
      const tags = await Promise.all(tagIds.map(value => Tag.findById(value)));
      for (let i = 0; i < tags.length; i++) {
        if (!tags[i]) return res.status(400).send(handlerResERROR({
          message: "id of tag do not exist !",
          code: "E_REQUEST"
        }));
      }
    }

    if(seriesId){
      const series = await Series.findById(seriesId);
      if(!series)
        return res.status(400).send(handlerResERROR({message: "seriesId do not exist !", code: "E_REQUEST"}));
    }

    switch (req.body.type) {
      case "audio":
        if(!req.file) break;
        const acast = await uploadACast(req);
        req.body.urlFile = acast.audio;
        req.body.acast = acast;
        req.body._id = acast._id;
        await unlink(req.file.path);
        break;
      case "image":
        if(!req.file) break;
        req.body.thumbnail = await resizeImage(req);
        break;
      case "video":
        if (req.body.thumbnail || req.body.thumbnailMobile) break;
        if(regexMV.test(req.body.urlFile)) req.body.urlFile = req.body.urlFile.replace(regexMV, '');
        let id = req.body.urlFile.split('//vimeo.com/')[1];
        if (!id) break;
        const result = await getThumbnailVimeo(id);
        if (!result || !result.thumbnail_url) {
          req.body.thumbnail = "";
          break
        }
        req.body.thumbnail = result.thumbnail_url
        req.body.thumbnailMobile = result.thumbnail_url
        break;
      default:
        break;
    }
    data = new Media({
      userId: req.uid,
      ...req.body,
    });
    await data.save();
    if(req.body.type === "audio") {
      data = req.body.acast;
      data.urlFile = data.audio;
    }
    return res.status(200).send(handlerResSUCCESS({data}));
  } catch (e) {
    console.log(e);
    if(req.file) await unlink(req.file.path);
    return res.status(400).send(handlerResERROR({message:"Upload media Fail !", code: "E_REQUEST"}));
  }
}

const changeMedia = async (req, res) => {
  try {
    const {topicId, urlFile, tagIds, seriesId, status} = req.body;
    delete req.body.type;
    const media = await Media.findById(req.params.id);
    const {type} = media._doc;

    if(topicId) {
      const topic = await Topic.findById(topicId);
      if (!topic)
        return res.status(400).send(handlerResERROR({message: "topicId do not exist !", code: "E_REQUEST"}));
      const cat = await Category.findById(topic._doc.categoryId);
      if(!cat)
        return res.status(400).send(handlerResERROR({message: "categoryId do not exist !", code: "E_REQUEST"}));
      req.body.type = cat._doc.type;
      req.body.categoryId = cat._doc._id;
    }

    if(urlFile){
      if(!req.body.type) req.body.type = type
      let data = await checkURLFile(req);
      if(data) return res.status(422).send(data);

      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        if (req.file) await unlink(req.file.path);
        return res.status(422).json(handlerResERROR({
          message: "Validation of the upload media form failed",
          data: errors.array().map((value) => ({field: value.param, message: value.msg}))
        }));
      }
      if(req.body.type === "video" && regexMV.test(req.body.urlFile))
        req.body.urlFile = req.body.urlFile.replace(regexMV, '');
    }

    if(tagIds){
      const tags = await Promise.all(tagIds.map(value => Tag.findById(value)));
      for (let i = 0; i < tags.length; i++) {
        if (!tags[i]) return res.status(400).send(handlerResERROR({
          message: "id of tag do not exist !",
          code: "E_REQUEST"
        }));
      }
    }

    if(seriesId){
      const series = await Series.findById(seriesId);
      if(!series)
        return res.status(400).send(handlerResERROR({message: "seriesId do not exist !", code: "E_REQUEST"}));
    }

    if(req.body.type === "audio" && req.file) {
      if(media._doc.acast && media._doc.acast.episodeId)
        await removeACast(media._doc.acast.episodeId);

      const acast = await uploadACast(req);
      req.body.urlFile = acast.audio;
      req.body.acast = acast;
      await unlink(req.file.path);
    }

    if(req.body.type === "image" && req.file)
      req.body.thumbnail = await resizeImage(req);

    req.body.updatedAt = new Date()
    if(type === "audio" && req.body.urlFile && !req.body.acast) req.body.acast = {};
    let data = await Media.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if (!data) return res.status(400).send(handlerResERROR({message:"Media not found", code: "E_REQUEST"}));
    if(data.type === "audio") {
      data = data.acast;
      data.urlFile = data.audio;
    }
    return res.status(200).send(handlerResSUCCESS({data}));
  } catch (e) {
    if(req.file) await unlink(req.file.path);
    console.log(e)
    return res.status(400).send(handlerResERROR({message: "Change media Fail !", code: "E_REQUEST"}));
  }
}

const getMedia = async (req, res) => {
  try {
    const query = [...aggMedia];
    query[0].$match = {_id: ObjectId(req.params.id)};

    let data = await Media.aggregate(query);
    data = data[0]
    if(!data) return res.status(200).send(handlerResSUCCESS({data: {}, message: "Media not found"}))
    const check = await isFavorite(req.uid, "media", data._id);
    data.isFavorite = check;
    if(data.type === "audio" && data.acast) {
      if(data.category) data.acast.category = data.category;
      if(data.topic) data.acast.topic = data.topic;
      if(data.tags && data.tags.length > 0) data.acast.tags = data.tags;
      if(data.series) {
        data.acast.series = data.series;
        data.acast.episode = data.episode;
      }
      data.acast.thumbnail = data.thumbnail;
      data.acast.thumbnailMobile = data.thumbnailMobile;
      data.acast.name = data.name;
      data = data.acast;
      data.urlFile = data.audio;
      data.isFavorite = check;
    }
    return res.status(200).send(handlerResSUCCESS({data}))
  } catch (e) {
    res.status(400).send(handlerResERROR({message: "Media not found", code: "E_REQUEST"}))
  }
}

const getList = async (req, res) => {
  try {
    if(req.query.isFavorite === "true") return listFavoriteMedias(req, res);
    let {type} = req.params;
    type = type.toLowerCase();
    if(type !== "video" && type !== "audio" && type !== "image")
      return res.status(400).send(handlerResERROR({message: "Media not found", code: "E_REQUEST"}))

    const query = [...aggMedia];
    query[0].$match = {type}

    if(req.query.isFavorite === 'false') {
      let mediaId = await Favorites.aggregate([{$match: {type: "media", userId: req.uid}}]);
      if(mediaId) {
        mediaId = mediaId[0].data;
        query[0].$match._id = {$nin: mediaId.map(val => ObjectId(val))};
      }
    }

    const categoryId = req.query.categoryId && req.query.categoryId !== "" ? req.query.categoryId : null;
    if(categoryId && categoryId.toLowerCase() !== "all") query[0].$match.categoryId = categoryId;

    const thumbnail = req.query.thumbnail && req.query.thumbnail !== "" ? req.query.thumbnail : null;
    if(thumbnail) query[0].$match.$or = [{thumbnail}, {urlFile: thumbnail}];

    const tagIds = req.query.tagIds && req.query.tagIds !== "" ? req.query.tagIds : null;
    if(Array.isArray(tagIds)) query[0].$match.tagIds = {$all: tagIds.map(val => (val))}
    else if(tagIds) query[0].$match.tagIds = {$all: [tagIds]};

    const seriesId = req.query.seriesId && req.query.seriesId !== "" ? req.query.seriesId : null;
    if(seriesId && seriesId.toLowerCase() !== "all") query[0].$match.seriesId = ObjectId(seriesId);

    const topicId = req.query.topicId && req.query.topicId !== "" ? req.query.topicId : null;
    if(topicId && topicId.toLowerCase() !== "all") {
      const topic = await Topic.findById(topicId);
      if(categoryId && categoryId.toLowerCase() !== "all") {
        if(categoryId !== topic.categoryId)
          res.status(400).send(handlerResERROR({message: `topicId '${topicId}' does not belong to categoryId '${categoryId}'`, code: "E_REQUEST"}))
      }
      if(topic) query[0].$match.topicId = topicId
    }

    const name = req.query.name && req.query.name !== "" ? req.query.name : null;
    if(name && name.trim()) query[0].$match.name = new RegExp('.*' + name.trim() + '.*', 'gi');

    const isSeries = req.query.isSeries;
    if(isSeries === "true" && !seriesId) query[0].$match.seriesId = {$exists:true}
    else if (isSeries === "false") query[0].$match.seriesId = {$exists: null}

    const groupSeries = req.query.groupSeries === "true";
    if(groupSeries && (!isSeries || isSeries === "true" )) {
      if(!seriesId) query[0].$match.seriesId = {$exists:true}
      query.push(groupBySeries);
    }

    if (req.query.itemsPerPage) {
      const pageNumber = (typeof req.query?.pageNumber === 'string') ? stringToInt(req.query?.pageNumber) : req.query?.pageNumber || 0;
      const itemsPerPage = (typeof req.query?.itemsPerPage === 'string') ? stringToInt(req.query?.itemsPerPage) : req.query?.itemsPerPage;
      let skip = itemsPerPage * pageNumber;
      query.push({$facet: {data: [{$skip: skip}, {$limit: itemsPerPage}]}})
    }
    let data = await Media.aggregate(query);
    if (data.length === 0) return res.status(200).send(handlerResSUCCESS({data: [], message: "Not found"}));
    if(req.query.itemsPerPage) {
      query.splice(query.length - 1, 1);
      data = data[0].data;
    }
    if (data.length && groupSeries)data = data.sort((a,b)=>{
      const nameA = a._id.name.toUpperCase(); // ignore upper and lowercase
      const nameB = b._id.name.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      // names must be equal
      return 0;
    })
    let totalItems = await Media.aggregate(query).count("totalItems");
    totalItems = totalItems.length > 0 ? totalItems[0].totalItems : 0;
    if(type === "image") return res.status(200).send(handlerResSUCCESS({data, totalItems}));

    if(groupSeries && (!isSeries || isSeries === "true" )) {
      query.splice(query.length - 1, 1);
      for(let i = 0, length = data.length; i < length; i++) {
        data[i].dataSeries = await handleFavorite(req.uid, type, data[i].dataSeries, req.query.isFavorite)
      }
      return res.status(200).send(handlerResSUCCESS({data, totalItems}));
    }

    data = await handleFavorite(req.uid, type, data, req.query.isFavorite)
    return res.status(200).send(handlerResSUCCESS({data, totalItems}));
  } catch (e) {
    console.log(e);
    res.status(400).send(handlerResERROR({message: "Media not found", code: "E_REQUEST"}))
  }
}

const aggFavoriteMedia = [
  {$match: {}},
  {$unwind: {path: "$data", preserveNullAndEmptyArrays: true}},
  {$addFields: {"data": {"$toObjectId": "$data"},}},
  {
    $lookup: {
      from: "media",
      localField: "data",
      foreignField: "_id",
      as: "media",
    }
  },
  {$unwind: {path: "$media", preserveNullAndEmptyArrays: true}},
  {$replaceRoot: {newRoot: {$mergeObjects: ["$$ROOT", "$media"]}}},
  {$match: {}},
  {$project: {__v: 0, media: 0}},
  {$addFields: {
      "categoryId": {"$toObjectId": "$categoryId"},
      "topicId": {"$toObjectId": "$topicId"}
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
  {
    $lookup: {
      from: "mediaseries",
      localField: "seriesId",
      foreignField: "_id",
      as: "series",
      pipeline: [{$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },
  {$addFields: {
      "category": {$arrayElemAt: ["$category", 0]},
      "topic": {$arrayElemAt: ["$topic", 0]},
      "series": {$arrayElemAt: ["$series", 0]},
    }},
  // {$project: {__v: 0, categoryId: 0, seriesId: 0}},
  {$unwind: { path: "$tagIds", preserveNullAndEmptyArrays: true }},
  {$addFields: {"tagIds": {"$toObjectId": "$tagIds"}}},
  {
    $lookup: {
      from: "mediatags",
      localField: "tagIds",
      foreignField: "_id",
      as: "tags",
      pipeline: [{$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },
  {$addFields: {"tags": {$arrayElemAt: ["$tags", 0]}}},
  {
    $group: {
      "_id": "$_id",
      "name": {$first: "$name"},
      "type": {$first: "$type"},
      "urlFile": {$first: "$urlFile"},
      "mp4Link": {$first: "$mp4Link"},
      "thumbnail": {$first: "$thumbnail"},
      "thumbnailMobile": {$first: "$thumbnailMobile"},
      "seriesId": {$first: "$seriesId"},
      "series": {$first: "$series"},
      "episode": {$first: "$episode"},
      "category": {$first: "$category"},
      "topic": {$first: "$topic"},
      "tags": {$push: "$tags"},
      "description": {$first: "$description"},
      "detailInfo": {$first: "$detailInfo"},
      "subtype": {$first: "$subtype"},
      "status": {$first: "$status"},
      "acast": {$first: "$acast"},
      "createdAt": {$first: "$createdAt"},
      "updatedAt": {$first: "$updatedAt"},
    }
  },
  {$sort: {"name": 1}}
];

const listFavoriteMedias = async (req, res) => {
  try {
    const userId = req.uid;
    let {type} = req.params;
    type = type.toLowerCase();
    if(type !== "video" && type !== "audio" && type !== "image")
      return res.status(400).send(handlerResERROR({message: "Media not found", code: "E_REQUEST"}))

    const query = [...aggFavoriteMedia];
    query[0].$match = {type: "media", userId};
    query[6].$match = {type};

    const categoryId = req.query.categoryId && req.query.categoryId !== "" ? req.query.categoryId : null;
    if(categoryId && categoryId.toLowerCase() !== "all") query[6].$match.categoryId = categoryId;

    const thumbnail = req.query.thumbnail && req.query.thumbnail !== "" ? req.query.thumbnail : null;
    if(thumbnail) query[6].$match.$or = [{thumbnail}, {urlFile: thumbnail}];

    const tagIds = req.query.tagIds && req.query.tagIds !== "" ? req.query.tagIds : null;
    if(Array.isArray(tagIds)) query[6].$match.tagIds = {$all: tagIds.map(val => (val))}
    else if(tagIds) query[6].$match.tagIds = {$all: [tagIds]};

    const seriesId = req.query.seriesId && req.query.seriesId !== "" ? req.query.seriesId : null;
    if(seriesId && seriesId.toLowerCase() !== "all") query[6].$match.seriesId = ObjectId(seriesId);

    const topicId = req.query.topicId && req.query.topicId !== "" ? req.query.topicId : null;
    if(topicId && topicId.toLowerCase() !== "all") {
      const topic = await Topic.findById(topicId);
      if(categoryId && categoryId.toLowerCase() !== "all") {
        if(categoryId !== topic.categoryId)
          res.status(400).send(handlerResERROR({message: `topicId '${topicId}' does not belong to categoryId '${categoryId}'`, code: "E_REQUEST"}))
      }
      if(topic) query[6].$match.topicId = topicId
    }

    const name = req.query.name && req.query.name !== "" ? req.query.name : null;
    if(name && name.trim()) query[6].$match.name = new RegExp('.*' + name.trim() + '.*', 'gi');

    const isSeries = req.query.isSeries;
    if(isSeries === "true" && !seriesId) query[6].$match.seriesId = {$exists:true}
    else if (isSeries === "false") query[6].$match.seriesId = {$exists: null}

    const groupSeries = req.query.groupSeries === "true";
    if(groupSeries && (!isSeries || isSeries === "true" )) {
      if(!seriesId) query[6].$match.seriesId = {$exists:true}
      query.push(groupBySeries);
    }

    if (req.query.itemsPerPage) {
      const pageNumber = (typeof req.query?.pageNumber === 'string') ? stringToInt(req.query?.pageNumber) : req.query?.pageNumber || 0;
      const itemsPerPage = (typeof req.query?.itemsPerPage === 'string') ? stringToInt(req.query?.itemsPerPage) : req.query?.itemsPerPage;
      let skip = itemsPerPage * pageNumber;
      query.push({$facet: {data: [{$skip: skip}, {$limit: itemsPerPage}]}})
    }

    let data = await Favorites.aggregate(query);
    if (data.length === 0) return res.status(200).send(handlerResSUCCESS({data: [], message: "Not found"}));
    if(req.query.itemsPerPage) {
      query.splice(query.length - 1, 1);
      data = data[0].data;
    }
    for (let idx in data) {
      let value = data[idx];
      if(type === "audio") {
        if(value?.category) value.acast.category = value.category;
        if(value?.topic) value.acast.topic = value.topic;
        if(value?.tags && value.tags.length > 0) value.acast.tags = value.tags;
        if(value?.series) {
          value.acast.series = value.series;
          value.acast.episode = value.episode;
        }
        value.acast.thumbnail = value.thumbnail;
        value.acast.thumbnailMobile = value.thumbnailMobile;
        value.acast.name = value.name;
        value = cloneDeep(value.acast);
        value.urlFile = value.audio;
      } else {
        delete value.acast;
      }
      value.isFavorite = req.query.isFavorite === 'true'
      data[idx] = cloneDeep(value);
    }
    let totalItems = await Favorites.aggregate(query).count("totalItems");
    totalItems = totalItems.length > 0 ? totalItems[0].totalItems : 0;
    if(type === "image") return res.status(200).send(handlerResSUCCESS({data, totalItems}));

    if(groupSeries && (!isSeries || isSeries === "true" )) {
      query.splice(query.length - 1, 1);
      return res.status(200).send(handlerResSUCCESS({data, totalItems}));
    }
    return res.status(200).send(handlerResSUCCESS({data, totalItems}));
  } catch (e) {
    console.log(e);
    res.status(400).send(handlerResERROR({message: "Media not found", code: "E_REQUEST"}));
  }
}

const handleFavorite = async (userId, type, data, favorite) => {
  const checkFavorite = await Promise.all(data.map(value => isFavorite(userId, "media", value._id)));
  const result = [];
  // const favorite = req.query.isFavorite;
  for(let i = 0; i < data.length; i++){
    if(type === "audio") {
      if(!data[i].acast) {
        data.splice(i, 1);
        continue;
      }
      if(data[i]?.category) data[i].acast.category = data[i].category;
      if(data[i]?.topic) data[i].acast.topic = data[i].topic;
      if(data[i]?.tags && data[i].tags.length > 0) data[i].acast.tags = data[i].tags;
      if(data[i]?.series) {
        data[i].acast.series = data[i].series;
        data[i].acast.episode = data[i].episode;
      }
      data[i].acast.thumbnail = data[i].thumbnail;
      data[i].acast.thumbnailMobile = data[i].thumbnailMobile;
      data[i].acast.name = data[i].name;
      data[i] = data[i].acast;
      data[i].urlFile = data[i].audio;
    } else {
      delete data[i].acast;
    }
    if(!data[i]) continue;
    if (!checkFavorite[i]) {
      data[i].isFavorite = false;
      if(favorite === "false") result.push(data[i]);
      continue;
    }
    data[i].isFavorite = true;
    if(favorite === "true") result.push(data[i]);
  }
  if(favorite === "true" || favorite === "false") data = result;
  return data
}

const deleteMedia = async (req, res) => {
  try {
    const {id} = req.params
    const data = await Media.findByIdAndDelete(id);
    if(!data) return res.status(400).send(handlerResERROR({message:"Media not found", code: "E_REQUEST"}))
    if(data.type === "audio") await removeACast(id);
    return res.status(200).send(handlerResSUCCESS());
  }catch (e){
    console.log(e)
    return res.status(400).send(handlerResERROR({message:"Delete media fail!", code: "E_REQUEST"}))
  }
}

const getRandomList = async (req, res) => {
  try {
    const {type} = req.params;
    const {notSeriesId, notId, numberItems, topicId} = req.query;

    const query = [{$match: {type}}];
    if (numberItems) {
      const number = (typeof numberItems === 'string') ? stringToInt(numberItems) : numberItems;
      query.push({$sample: {size: number}})
    }
    if (notSeriesId) query[0].$match.seriesId = {$ne: ObjectId(notSeriesId)};
    if (notId) query[0].$match._id = {$ne: ObjectId(notId)};

    const idTopic = topicId && topicId !== "" ? topicId : null;
    if(idTopic && idTopic.toLowerCase() !== "all") query[0].$match.topicId = idTopic;

    let data = await Media.aggregate(query);
    if (data.length === 0) return res.status(200).send(handlerResSUCCESS({data: [], message: "Not found"}));
    let totalItems = await Media.aggregate([query[0]]).count("totalItems");
    totalItems = totalItems.length > 0 ? totalItems[0].totalItems : 0;
    if(type === "image") return res.status(200).send(handlerResSUCCESS({data, totalItems}));
    const checkFavorite = await Promise.all(data.map(value => isFavorite(req.uid, "media", value._id)));
    for(let i = 0; i < data.length; i++){
      if(type === "audio") {
        if(!data[i].acast) {
          data.splice(i, 1);
          continue;
        }
        if(data[i]?.category) data[i].acast.category = data[i].category;
        if(data[i]?.topic) data[i].acast.topic = data[i].topic;
        if(data[i]?.tags && data[i].tags.length > 0) data[i].acast.tags = data[i].tags;
        if(data[i]?.series) {
          data[i].acast.series = data[i].series;
          data[i].acast.episode = data[i].episode;
        }
        data[i].acast.thumbnail = data[i].thumbnail;
        data[i].acast.thumbnailMobile = data[i].thumbnailMobile;
        data[i].acast.name = data[i].name;
        data[i] = data[i].acast;
        data[i].urlFile = data[i].audio;
      }
      if(!data[i]) continue;
      if (!checkFavorite[i]) {
        data[i].isFavorite = false;
        continue;
      }
      data[i].isFavorite = true;
    }
    return res.status(200).send(handlerResSUCCESS({data, totalItems}));
  } catch (e) {
    console.log(e);
    res.status(400).send(handlerResERROR({message: "Media not found", code: "E_REQUEST"}))
  }
}

module.exports = {
  upMedia,
  changeMedia,
  getMedia,
  deleteMedia,
  getList,
  getRandomList,
}
