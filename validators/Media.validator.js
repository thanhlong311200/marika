const {body, validationResult} = require("express-validator");
const {unlink} = require('fs/promises');
const ENV = require('../utils/Env');
const {handlerResERROR} = require("../utils");
const Topic = require("../models/MediaTopic.model");
const Category = require("../models/MediaCategory.model");

const regexURL = new RegExp('^http://|^https://', 'i')

const create = async (req, res, next) => {

  await body('name', "field 'name' is required and must be of type string").isString().run(req);
  await body('status', "field 'status' is required and must be 'draft'|'published'").isString().isIn(['draft', 'published']).run(req);
  await body('topicId', "field 'topicId' is required and must be of type string").isString().run(req);

  let errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  errors = errors.array().filter((value, index, self) =>
    index === self.findIndex((t) => (t.param === value.param))
  );
  errors = errors.map((value) => ({field: value.param, message: value.msg}));
  return res.status(422).json(handlerResERROR({
    message: "Validation of the upload media form failed",
    data: errors
  }));
}

const change = async (req, res, next) => {
  const data = {};

  if (req.body.type !== undefined) {
    await body('type', "field 'type' must be 'video'|'image'|'audio'").isString().isIn(['video', 'image', 'audio']).run(req);
    data.type = req.body.type;
  }
  if (req.body.name !== undefined) {
    await body('name', "field 'name' must be of type string").isString().run(req);
    data.name = req.body.name;
  }
  if (req.body.status !== undefined) {
    await body('status', "field 'status' must be 'draft'|'published'").isString().isIn(['draft', 'published']).run(req);
    data.status = req.body.status;
  }
  if (req.body.tagIds !== undefined) {
    await body('tagIds', "field 'tagIds' must be of type array").isArray().run(req);
    await body('tagIds.*', "items in tagIds must be of type string").isString().run(req);
    data.tagIds = req.body.tagIds;
  }
  if (req.body.seriesId !== undefined) {
    if(req.body.seriesId !== '' && req.body.seriesId !== null) {
      await body('seriesId', "field 'seriesId' must be of type string").isString().run(req);
      await body('episode', "if seriesId is exist then field 'episode' is required and must be of type number").isNumeric().run(req);
      data.episode = req.body.episode;
      data.seriesId = req.body.seriesId;
    } else {
      data.episode = null;
      data.seriesId = null;
    }
  }
  if (req.body.topicId !== undefined) {
    await body('topicId', "field 'topicId' must be of type string").isString().run(req);
    data.topicId = req.body.topicId;
  }
  if (req.body.categoryId !== undefined) {
    await body('categoryId', "field 'categoryId' must be of type string").isString().run(req);
    data.categoryId = req.body.categoryId;
  }
  if (req.body.subtype !== undefined) {
    await body('subtype', "field 'subtype' must be 'full'|'trailer'|'bonus'").isString().isIn(['full', 'trailer', 'bonus']).run(req);
    data.subtype = req.body.subtype;
  }
  if (req.body.description !== undefined) {
    await body('description', "field 'description' must be of type string").isString().run(req);
    data.description = req.body.description;
  }
  if (req.body.detailInfo !== undefined) {
    await body('detailInfo', "field 'detailInfo' must be of type string").isString().run(req);
    data.detailInfo = req.body.detailInfo;
  }
  if (req.body.type !== 'image' && req.body.mp4Link !== undefined) {
    if(req.body.mp4Link !== '')await body('mp4Link', "field 'mp4Link' must be of type http link")
      .custom((value) => regexURL.test(value)).run(req);
    else data.mp4Link = null
  }
  if (req.body.thumbnail !== undefined) {
    if(req.body.thumbnail !== '' && req.body.thumbnail !== null)await body('thumbnail', "field 'thumbnail' must be of type http link")
      .custom((value) => regexURL.test(value)).run(req);
    else data.thumbnail = null;
  }
  if (req.body.thumbnailMobile !== undefined) {
    if(req.body.thumbnailMobile !== '' && req.body.thumbnailMobile !== null)await body('thumbnailMobile', "field 'thumbnailMobile' must be of type link")
      .custom((value) => regexURL.test(value)).run(req);
    data.thumbnailMobile = req.body.thumbnailMobile;
  }

  let errors = validationResult(req);
  if (errors.isEmpty()) {
    data.urlFile = req.body.urlFile;
    req.body = data;
    return next();
  }

  if (req.file) await unlink(req.file.path);
  return res.status(422).json(handlerResERROR({
    message: "Validation of the upload media form failed",
    data: errors.array().map((value) => ({field: value.param, message: value.msg}))
  }));
}

const checkURLFile = async (req) => {
  const data = req.body;

  if (req.file) {
    data.urlFile = ENV.getOrFail("DOMAIN") + '/uploads/' + req.file.filename
    req.body = data;
    return false;
  }

  const topic = await Topic.findById(req.body.topicId);
  if (!topic)
    return handlerResERROR({message: "topicId do not exist !", code: "E_REQUEST"});
  const cat = await Category.findById(topic._doc.categoryId);
  if (!cat)
    return handlerResERROR({message: "categoryId do not exist !", code: "E_REQUEST"});

  req.body.type = cat._doc.type;
  req.body.categoryId = cat._id.toString();

  if (data.type === "video") {
    await body('urlFile', "field 'urlFile' must be 'http link' if type is video")
      .custom((value) => regexURL.test(value)).run(req);
    return false;
  }

  return handlerResERROR({
    message: "Validation of the upload media form failed",
    data: [{field: "urlFile", message: "field 'urlFile' does not match the type of the request"}]
  });
}

module.exports = {
  create,
  change,
  checkURLFile,
}
