const {body, validationResult} = require("express-validator");
const {handlerResERROR} = require("../utils");

const create = async (req, res, next) => {
  await body('name', "field 'name' is required and must be of type string").isString().run(req);

  let errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  errors = errors.array().filter((value, index, self) =>
    index === self.findIndex((t) => (t.param === value.param)));
  errors = errors.map((value) => ({field: value.param, message: value.msg}));
  return res.status(422).json(handlerResERROR({
    message: "Validation of the upload form failed",
    data: errors
  }));
}

const update = async (req, res, next) => {
  const data = {};

  if(req.body.name !== undefined) {
    await body('name', "field 'name' must be of type string").isString().run(req);
    data.name = req.body.name;
  }
  if(req.body.categoryId !== undefined) {
    if(req.body.categoryId !== null) await body('categoryId', "field 'categoryId' must be of type string").isString().run(req);
    data.categoryId = req.body.categoryId;
  }
  if(req.body.topicId !== undefined) {
    if(req.body.topicId !== null) await body('topicId', "field 'topicId' must be of type string").isString().run(req);
    data.topicId = req.body.topicId;
  }
  if(req.body.description !== undefined) {
    await body('description', "field 'description' must be of type string").isString().run(req);
    data.description = req.body.description;
  }

  let errors = validationResult(req);
  if (errors.isEmpty()) {
    req.body = data;
    return next();
  }

  errors = errors.array().filter((value, index, self) =>
    index === self.findIndex((t) => (t.param === value.param)));
  errors = errors.map((value) => ({field: value.param, message: value.msg}));
  return res.status(422).json(handlerResERROR({
    message: "Validation of the chang form failed",
    data: errors
  }));
}

const createIngredients = async (req, res, next) => {
  await body('name', "field 'name' is required and must be of type string").isString().run(req);
  await body('unit', "field 'unit' is required and must be of type string").isString().run(req);
  await body('categoryId', "field 'categoryId' is required and must be of type string").isString().run(req);

  let errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  errors = errors.array().filter((value, index, self) =>
    index === self.findIndex((t) => (t.param === value.param)));
  errors = errors.map((value) => ({field: value.param, message: value.msg}));
  return res.status(422).json(handlerResERROR({
    message: "Validation of the upload form failed",
    data: errors
  }));
}

const ingredients = async (req, res, next) => {
  const data = {};

  if(req.body.name !== undefined) {
    await body('name', "field 'name' must be of type string").isString().run(req);
    data.name = req.body.name;
  }
  if(req.body.type !== undefined) {
    await body('type', "field 'type' must be 'normal'|'toServe'. Default 'normal'").isString().isIn(['normal', 'toServe']).run(req);
    data.type = req.body.type;
  }
  if(req.body.unit !== undefined) {
    await body('unit', "field 'unit' must be of type string").isString().run(req);
    data.unit = req.body.unit;
  }
  if(req.body.categoryId !== undefined) {
    await body('categoryId', "field 'categoryId' must be of type string").isString().run(req);
    data.categoryId = req.body.categoryId;
  }

  let errors = validationResult(req);
  if (errors.isEmpty()) {
    req.body = data;
    return next();
  }

  errors = errors.array().filter((value, index, self) =>
    index === self.findIndex((t) => (t.param === value.param)));
  errors = errors.map((value) => ({field: value.param, message: value.msg}));
  return res.status(422).json(handlerResERROR({
    message: "Validation of the chang form failed",
    data: errors
  }));
}

const exportCollections = async (req, res, next) => {
  await body('collections', "field 'collections' must be of type array and not empty").isArray().notEmpty().run(req);

  let errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  errors = errors.array().filter((value, index, self) =>
    index === self.findIndex((t) => (t.param === value.param)));
  errors = errors.map((value) => ({field: value.param, message: value.msg}));
  return res.status(422).json(handlerResERROR({
    message: "Validation export failed",
    data: errors
  }));
}


module.exports = {
  create,
  update,
  ingredients,
  createIngredients,
  exportCollections
}
