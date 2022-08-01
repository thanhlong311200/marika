const {body, validationResult} = require("express-validator");
const {handlerResERROR} = require("../utils");

const checkString = async (req, field, data) => {
  if (req.body[`${field}`] !== undefined) {
    await body(`${field}`, `field '${field}' must be of type string`).isString().run(req)
    data[`${field}`] = req.body[`${field}`];
  }
}

const requireInfo = async (req, res, next) => {
  await body('email').notEmpty().run(req)
  await body('name').notEmpty().run(req)
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(422).json(handlerResERROR({
      message: "Validation of the upload media form failed",
      data: errors.array().map(value => ({'field': value.param, 'message': value.msg}))},
  ));
}

const adminHandlerInfo = async (req, res, next) => {
  const {userId} = req.params;
  if(userId !== "admin")
    req.uid = req.params.userId;
  return next();
}

const updateInfo = async (req, res, next) => {
  const data = {};
  await checkString(req, 'name', data)
  await checkString(req, 'nickname', data)
  await checkString(req, 'phone', data)
  await checkString(req, 'birthday', data)
  await checkString(req, 'address', data)
  await checkString(req, 'city', data)
  await checkString(req, 'postcode', data)
  await checkString(req, 'state', data)
  await checkString(req, 'mealPlan', data)
  await checkString(req, 'dietary', data)
  if (req.body.avatar !== undefined) {
    await body('avatar').isURL({protocols: ["http", "https"]}).run(req)
    data.avatar = req.body.avatar;
  }
  if (req.body.email !== undefined) {
    await body('email').isEmail().run(req)
    data.email = req.body.email;
  }
  if (req.body.sex !== undefined) {
    await body('sex').isIn(['male', 'female', 'other']).run(req)
    data.sex = req.body.sex;
  }
  if(req.body.myProgram !== undefined) {
    await body('myProgram', "field 'myProgram' must be of type number").isNumeric().run(req);
    data.myProgram = req.body.myProgram;
  }
  if(req.body.mealPlanStartDate !== undefined) {
    await body('mealPlanStartDate', "field 'mealPlanStartDate' must be of type date").isDate().run(req);
    data.mealPlanStartDate = req.body.mealPlanStartDate;
  }
  if(req.body.showNutritional !== undefined) {
    await body('showNutritional', "field 'showNutritional' must be number 0 or 1").isNumeric().isIn([0, 1]).run(req);
    data.showNutritional = req.body.showNutritional;
  }
  const fields = req.body.customField
  if (fields !== undefined && Array.isArray(fields) && fields.length > 0) {
    await body('customField', "field 'customField' must be of type array").isArray().run(req);
    const msg = "items in group must be of type object and object value must be of type string";
    await body('customField.*.field', msg).isString().run(req);
    await body('customField.*.value', msg).isString().run(req);
    data.customField = req.body.customField;
  }
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    req.body = data
    return next();
  }
  return res.status(422).json(handlerResERROR({
    message: "Validation of the Update information form failed",
    data: errors.array().map(value => ({'field': value.param, 'message': value.msg}))}
  ));
}

const changePassword = async (req, res, next) => {
  await body('oldPassword', "field 'oldPassword' is required and must be of type string").isString().run(req);
  await body('password', "field 'password' is required and must contain 1 uppercase, 1 lowercase, 1 numbers, 1 symbols, min length 8 letter in string").isStrongPassword().run(req);
  await body('confirmPassword', "field 'confirmPassword' is required and 'confirmPassword' must be equal to 'password'").equals(req.body.password || '').run(req);

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

module.exports = {
  requireInfo,
  updateInfo,
  adminHandlerInfo,
  changePassword,
}
