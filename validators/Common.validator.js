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

  if(req.body.note !== undefined) {
    await body('note', "field 'note' must be of type string").isString().run(req);
    data.note = req.body.note;
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

const campaignCreate = async (req, res, next) => {
  await body('name', "field 'name' must be of type string and not empty").isString().notEmpty().run(req);
  await body('idsMembership', "field 'idsMembership' must be of type array and not empty").isArray().notEmpty().run(req);

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

const campaignUpdate = async (req, res, next) => {
  const data = {}
  if(req.body.name) {
    await body('name', "field 'name' must be of type string and not empty").isString().notEmpty().run(req);
    data.name = req.body.name
  }
  if(req.body.idsMembership) {
    await body('idsMembership', "field 'idsMembership' must be of type array and not empty").isArray().notEmpty().run(req);
    data.idsMembership = req.body.idsMembership
  }
  if(req.body.start) {
    await body('start', "field 'start' must be of type date and not empty").isString().notEmpty().run(req);
    data.start = req.body.start
  }
  if(req.body.end) {
    await body('end', "field 'end' must be of type date and not empty").isString().notEmpty().run(req);
    data.end = req.body.end
  }
  if(!Object.keys(data)?.length)
    return res.status(422).json(handlerResERROR({
    message: "Field is empty !",
  }));
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
  exportCollections,
  campaignCreate,
  campaignUpdate
}
