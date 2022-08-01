const {body, validationResult} = require("express-validator");
const {handlerResERROR} = require("../utils");

const create = async (req, res, next) => {
  await body('name', "field 'name' is required and must be of type string").isString().run(req);
  await body('categoryId', "field 'categoryId' is required and must be of type string").isString().run(req);

  let errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  errors = errors.array().filter((value, index, self) =>
    index === self.findIndex((t) => (t.param === value.param)));
  errors = errors.map((value) => ({field: value.param, message: value.msg}));
  return res.status(422).json(handlerResERROR({
    message: "Validation of the upload media form failed",
    data: errors
  }));
}

const update = async (req, res, next) => {
  const data = {};

  if(req.body.name !== undefined) {
    await body('name', "field 'name' must be of type string").isString().run(req);
    data.name = req.body.name;
  }
  if(req.body.groupSeries !== undefined) {
    await body('groupSeries', "field 'groupSeries' must be of type boolean").isBoolean().run(req);
    data.groupSeries = req.body.groupSeries;
  }
  if(req.body.subType !== undefined) {
    await body('subType', "subType 'subType' must be of type 'recipes'|'audio'|'video'|'other'").isString().isIn(['recipes', 'audio', 'video', 'other']).run(req);
    data.subType = req.body.subType;
  }
  if(req.body.categoryId !== undefined) {
    await body('categoryId', "field 'categoryId' must be of type string").isString().run(req);
    data.categoryId = req.body.categoryId;
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
    message: "Validation of the chang media form failed",
    data: errors
  }));
}

module.exports = {
  create,
  update,
}
