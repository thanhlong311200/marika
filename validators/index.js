const media = require('./Media.validator')
const mediaTopic = require('./MediaTopic.validator')
const mediaCategory = require('./MediaCategory.validator')
const mediaTag = require('./MediaTag.validator')
const profile = require('./Profile.validator')
const recipes = require('./Recipes.validator')
const membership = require('./Membership.validator')
const favorite = require('./Favorite.validator')
const survey = require('./Survey.validator')
const surveyAnswer = require('./SurveyAnswer.validator')
const common = require('./Common.validator')
const menuFood = require('./MenuFood.validator')
const shoppingList = require('./ShoppingList.validator')
const mealPlan = require('./MealPlan.validator')
const system = require('./System.validator')
const recipesMeal = require('./RecipesMeal.validator')

module.exports = {
  profile,
  media,
  mediaTopic,
  mediaCategory,
  mediaTag,
  recipes,
  membership,
  favorite,
  survey,
  surveyAnswer,
  common,
  menuFood,
  shoppingList,
  mealPlan,
  system,
  recipesMeal,
}
