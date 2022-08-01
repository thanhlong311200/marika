const {body, validationResult} = require("express-validator");
const {handlerResERROR} = require("../utils");

const create = async (req, res, next) => {
  await body('name', "field 'name' is required and must be of type string").isString().run(req);
  await body('type', "field 'type' is required and must be of type string").isString().run(req);

  let errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  errors = errors.array().filter((value, index, self) =>
    index === self.findIndex((t) => (t.param === value.param)));
  errors = errors.map((value) => ({field: value.param, message: value.msg}));
  return res.status(422).json(handlerResERROR({
    message: "Validation of the upload media category form failed",
    data: errors
  }));
}

const update = async (req, res, next) => {
  const data = {};

  if(req.body.name !== undefined) {
    await body('name', "field 'name' must be of type string").isString().run(req);
    data.name = req.body.name;
  }
  if(req.body.type !== undefined) {
    await body('type', "field 'type' must be 'video'|'image'|'audio'").isString().isIn(['video', 'image', 'audio']).run(req);
    data.type = req.body.type;
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
    message: "Validation of the chang media category form failed",
    data: errors
  }));
}

module.exports = {
  create,
  update,
}
