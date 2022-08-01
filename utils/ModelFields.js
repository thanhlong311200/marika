const SurveyAnswer = require("../models/SurveyAnswer.model");
const RecipesTags = require("../models/RecipesTags.model");
const MenuFood = require("../models/MenuFood.model");
const MyProgram = require("../models/MyProgram.model");
const Surveys = require("../models/Surveys.model");
const Profiles = require("../models/UsersInfo.model");
const Recipes = require("../models/Recipes.model");
const Payment = require("../models/Payment.model");
const IngredientsCategory = require("../models/IngredientsCategory.model");
const Ingredients = require("../models/Ingredients.model");
const MediaCategory = require("../models/MediaCategory.model");
const Token = require("../models/Token.model");
const PromoCodes = require("../models/PromoCodes.model");
const RecipesCategory = require("../models/RecipesCategory.model");
const SurveyAnswerTemp = require("../models/SurveyAnswerTemp.model");
const ShoppingList = require("../models/ShoppingList.model");
const Favorites = require("../models/Favorites.model");
const MediaTag = require("../models/MediaTag.model");
const RecipesType = require("../models/RecipesType.model");
const TrackingTopic = require("../models/TrackingTopic.model");
const RecipesDietary = require("../models/RecipesDietary.model");
const AIACode = require("../models/AIACode.model");
const Dietary = require("../models/Dietary.model");
const Logs = require("../models/Logs");
const Media = require("../models/Media.model");
const MediaTopic = require("../models/MediaTopic.model");
const RecipesMeal = require("../models/RecipesMeal.model");
const Users = require("../models/UserLogin.model");
const MealPlan = require("../models/MealPlan.model");
const MemberShip = require("../models/MemberShip.model");
const MediaSeries = require("../models/MediaSeries.model");
const TrackingAnswers = require("../models/TrackingAnswers.model");
const Systems = require("../models/System.model");

const getFieldsInCollection = (name = '') => {
  if (name === 'surveyanswers') return Object.keys(SurveyAnswer.schema.obj)
  if (name === 'recipestags') return Object.keys(RecipesTags.schema.obj)
  if (name === 'menufoods') return Object.keys(MenuFood.schema.obj)
  if (name === 'myprograms') return Object.keys(MyProgram.schema.obj)
  if (name === 'surveys') return Object.keys(Surveys.schema.obj)
  if (name === 'profiles') return Object.keys(Profiles.schema.obj)
  if (name === 'recipes') return Object.keys(Recipes.schema.obj)
  if (name === 'payments') return Object.keys(Payment.schema.obj)
  if (name === 'ingredientscategories') return Object.keys(IngredientsCategory.schema.obj)
  if (name === 'ingredients') return Object.keys(Ingredients.schema.obj)
  if (name === 'mediacategories') return Object.keys(MediaCategory.schema.obj)
  if (name === 'tokens') return Object.keys(Token.schema.obj)
  if (name === 'promocodes') return Object.keys(PromoCodes.schema.obj)
  if (name === 'recipescategories') return Object.keys(RecipesCategory.schema.obj)
  if (name === 'surveyanswertemps') return Object.keys(SurveyAnswerTemp.schema.obj)
  if (name === 'shoppinglists') return Object.keys(ShoppingList.schema.obj)
  if (name === 'favorites') return Object.keys(Favorites.schema.obj)
  if (name === 'mediatags') return Object.keys(MediaTag.schema.obj)
  if (name === 'recipestypes') return Object.keys(RecipesType.schema.obj)
  if (name === 'trackingtopics') return Object.keys(TrackingTopic.schema.obj)
  if (name === 'recipesdietaries') return Object.keys(RecipesDietary.schema.obj)
  if (name === 'aiacodes') return Object.keys(AIACode.schema.obj)
  if (name === 'dietaries') return Object.keys(Dietary.schema.obj)
  if (name === 'logs') return Object.keys(Logs.schema.obj)
  if (name === 'media') return Object.keys(Media.schema.obj)
  if (name === 'mediatopics') return Object.keys(MediaTopic.schema.obj)
  if (name === 'recipesmeals') return Object.keys(RecipesMeal.schema.obj)
  if (name === 'users') return Object.keys(Users.schema.obj)
  if (name === 'mealplans') return Object.keys(MealPlan.schema.obj)
  if (name === 'memberships') return Object.keys(MemberShip.schema.obj)
  if (name === 'mediaseries') return Object.keys(MediaSeries.schema.obj)
  if (name === 'trackinganswers') return Object.keys(TrackingAnswers.schema.obj)
  if (name === 'systems') return Object.keys(Systems.schema.obj)
  return []
}
const getModel = (name = '') => {
  if (name === 'surveyanswers') return SurveyAnswer
  if (name === 'recipestags') return RecipesTags
  if (name === 'menufoods') return MenuFood
  if (name === 'myprograms') return MyProgram
  if (name === 'surveys') return Surveys
  if (name === 'profiles') return Profiles
  if (name === 'recipes') return Recipes
  if (name === 'payments') return Payment
  if (name === 'ingredientscategories') return IngredientsCategory
  if (name === 'ingredients') return Ingredients
  if (name === 'mediacategories') return MediaCategory
  if (name === 'tokens') return Token
  if (name === 'promocodes') return PromoCodes
  if (name === 'recipescategories') return RecipesCategory
  if (name === 'surveyanswertemps') return SurveyAnswerTemp
  if (name === 'shoppinglists') return ShoppingList
  if (name === 'favorites') return Favorites
  if (name === 'mediatags') return MediaTag
  if (name === 'recipestypes') return RecipesType
  if (name === 'trackingtopics') return TrackingTopic
  if (name === 'recipesdietaries') return RecipesDietary
  if (name === 'aiacodes') return AIACode
  if (name === 'dietaries') return Dietary
  if (name === 'logs') return Logs
  if (name === 'media') return Media
  if (name === 'mediatopics') return MediaTopic
  if (name === 'recipesmeals') return RecipesMeal
  if (name === 'users') return Users
  if (name === 'mealplans') return MealPlan
  if (name === 'memberships') return MemberShip
  if (name === 'mediaseries') return MediaSeries
  if (name === 'trackinganswers') return TrackingAnswers
  if (name === 'systems') return Systems
  return null
}
const getFieldArrayInCollection = (name = '') => {
  if (name === 'surveyanswers') return ['result']
  if (name === 'surveys') return ['questions']
  if (name === 'media') return ['tagIds','acast']
  if (name === 'recipes') return ['dietary', 'ingredients', 'nutritionInformation', 'method','tags']
  if (name === 'surveyanswertemps') return ['result']
  if (name === 'shoppinglists') return ['data']
  if (name === 'favorites') return ['data']
  if (name === 'trackingtopics') return ['options']
  if (name === 'mealplans') return ['data']
  if (name === 'profiles') return ['customField']
  return []
}
module.exports = {
  getFieldsInCollection,
  getModel,
  getFieldArrayInCollection
}
