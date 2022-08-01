const {body, validationResult} = require("express-validator");
const {handlerResERROR} = require("../utils");

const msgIngredients = "items in ingredients must be of type object and object value must be of type ";
const msgNutritionInformation = "items in nutritionInformation must be of type object and object value must be of type string";
const msgMethod = "items in method must be of type object and object value must be of type string";

const create = async (req, res, next) => {
  await body('name', "field 'name' is required and must be of type string").notEmpty().isString().run(req);
  await body('mealId', "field 'mealId' is required and must be of type string").notEmpty().isString().run(req);
  // await body('ingredients', "field 'ingredients' is required and must be of type array").isArray({min: 1}).run(req);
  // await body('ingredients.*._id', msgIngredients + "string").notEmpty().isString().run(req);
  // await body('ingredients.*.qty', msgIngredients + "number").notEmpty().isNumeric().run(req);
  await body('price', "field 'price' is required and must be of type number").notEmpty().isNumeric().run(req);
  // await body('nutritionInformation', "field 'nutritionInformation' is required and must be of type array").isArray({min: 1}).run(req);
  // await body('nutritionInformation.*.field', msgNutritionInformation).notEmpty().isString().run(req);
  // await body('nutritionInformation.*.value', msgNutritionInformation).notEmpty().isString().run(req);
  // await body('method', "field 'method' is required and must be of type array").isArray({min: 1}).run(req);
  // await body('method.*.step', msgMethod).notEmpty().isNumeric().run(req);
  // await body('method.*.content', msgMethod).notEmpty().isString().run(req);
  if(!req.body.mediaId) delete req.body.mediaId
  if(!req.body.categoryId) delete req.body.categoryId
  if(!req.body.typeId) delete req.body.typeId

  let errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  errors = errors.array().filter((value, index, self) =>
    index === self.findIndex((t) => (t.param === value.param)));
  errors = errors.map((value) => ({field: value.param, message: value.msg}));
  return res.status(422).json(handlerResERROR({
    message: "Validation of the upload recipes form failed",
    data: errors
  }));
}

const update = async (req, res, next) => {
  const data = {};

  if(req.body.name !== undefined) {
    await body('name', "field 'name' must be of type string").isString().run(req);
    data.name = req.body.name;
  }
  if(req.body.mealId !== undefined) {
    await body('mealId', "field 'mealId' must be of type string").isString().run(req);
    data.mealId = req.body.mealId;
  }
  if(req.body.tags !== undefined) {
    await body('tags', "field 'tags' must be of type array").isArray().run(req);
    await body('tags.*', "items in tags must be of type string").notEmpty().isString().run(req);
    data.tags = req.body.tags;
  }
  if(req.body.dietary !== undefined) {
    await body('dietary', "field 'dietary' must be of type array").isArray().run(req);
    await body('dietary.*', "items in dietary must be of type string").isString().run(req);
    data.dietary = req.body.dietary;
  }
  if(req.body.categoryId !== undefined) {
    await body('categoryId', "field 'categoryId' must be of type string").isString().run(req);
    data.categoryId = req.body.categoryId;
  }
  if(req.body.ingredients !== undefined) {
    await body('ingredients', "field 'ingredients' must be of type array").isArray().run(req);
    await body('ingredients.*._id', msgIngredients + "string").isString().run(req);
    await body('ingredients.*.qty', msgIngredients + "number or null").optional({nullable: true}).isFloat().run(req);
    await body('ingredients.*.displayQty', msgIngredients + "string or null").optional({nullable: true}).isString().run(req);
    data.ingredients = req.body.ingredients;
  }
  if(req.body.typeId !== undefined) {
    await body('typeId', "field 'typeId' must be of type string").isString().run(req);
    data.typeId = req.body.typeId;
  }
  if(req.body.size !== undefined) {
    if(req.body.size !== null) await body('size', "field 'size' must be of type number").isFloat().run(req);
    data.size = req.body.size;
  }
  if(req.body.price !== undefined) {
    await body('price', "field 'price' must be of type number").isFloat().run(req);
    data.price = req.body.price;
  }
  if(req.body.status !== undefined) {
    await body('status', "field 'status' must be of type string and value status can be 'draft' or 'published'").isString().isIn(['draft', 'published']).run(req);
    data.status = req.body.status;
  }
  if(req.body.nutritionInformation !== undefined) {
    await body('nutritionInformation', "field 'nutritionInformation' must be of type array").isArray().run(req);
    await body('nutritionInformation.*.field', msgNutritionInformation).isString().run(req);
    await body('nutritionInformation.*.value', msgNutritionInformation).isString().run(req);
    data.nutritionInformation = req.body.nutritionInformation;
  }
  if(req.body.method !== undefined) {
    // if(typeof req.body.method === "string") req.body.method = JSON.parse(req.body.method);
    await body('method', "field 'method' must be of type array").isArray().run(req);
    await body('method.*.step', msgMethod).isInt().run(req);
    await body('method.*.content', msgMethod).isString().run(req);
    data.method = req.body.method;
  }
  if(req.body.mediaId !== undefined) {
    await body('mediaId', "field 'mediaId' must be of type string").isString().run(req);
    data.mediaId = req.body.mediaId;
  }
  if(req.body.mediaMobileId !== undefined) {
    await body('mediaMobileId', "field 'mediaMobileId' must be of type string").isString().run(req);
    data.mediaMobileId = req.body.mediaMobileId;
  }
  if(req.body.description !== undefined) {
    await body('description', "field 'description' must be of type string").isString().run(req);
    data.description = req.body.description;
  }
  if(req.body.note !== undefined) {
    await body('note', "field 'note' must be of type string").isString().run(req);
    data.note = req.body.note;
  }
  if(req.body.time !== undefined) {
    await body('time', "field 'time' must be of type cooking time eg: 30 mins").isString().run(req);
    data.time = req.body.time;
  }
  if(req.body.serves !== undefined) {
    await body('serves', "field 'serves' must be of type string").isString().run(req);
    data.serves = req.body.serves;
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
    message: "Validation of the chang recipes form failed",
    data: errors
  }));
}

module.exports = {
  create,
  update,
}
