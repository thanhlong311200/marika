const userLogin = require('./auth/login');
const firebaseLogin = require('./auth/firebaseLogin');
const googleLogin = require('./auth/googleLogin');
const facebookLogin = require('./auth/facebookLogin');
const userRegister = require('./auth/register');
const adminLogin = require('./auth/adminLogin');
const logout = require('./not_auth/logout');
const refreshToken = require('./auth/refreshToken');
const profile = require('./profile/user');
const cancelSubscription = require('./profile/cancelSubscription');
const AdminProfile = require('./profile/admin');
const payment = require('./payment/payment');
const customer = require('./customer/customer');
const customerID = require('./customer/customer[id]');
const paymentId = require('./payment/payment[id]');

// media
const mediaPost = require('./media/post');
const media = require('./media');
const mediaList = require('./media/list');
const mediaRandomList = require('./media/randomList');

const promoCR = require("./promo_code/get");
const promoRUD = require("./promo_code/CRUD");
const promoGetAll = require("./promo_code/promoGetAll");
const getCodes = require("./aia_code/getCodes");

// user
const listUser = require('./user/listUser');
const user = require('./user/delete');
const userAdmin = require('./user/adminDelete');
const userChangePass = require('./user/changePassword');

// membership
const membership = require('./membership/member');
const membershipId = require('./membership/member[id]');
const listMembership = require('./membership/list');

// membership type
const membershipType = require('./membership_type/create');
const membershipTypeList = require('./membership_type/list');
const membershipTypeRUD = require('./membership_type/rud[id]');

// survey answer
const survey = require('./survey_answer/create');
const surveyId = require('./survey_answer/rud[id]');
const surveyList = require('./survey_answer/list');
const report = require('./survey_answer/report');
const reportBySurveyAnswerId = require('./survey_answer/report[surveyAnswerId]');
const surveyAnswer = require('./survey_answer/c[SurveyAnswer]');
const surveyAnswerId = require('./survey_answer/r[surveyAnswerId]');
const surveyAnswerVerify = require('./survey_answer/verify[SurveyAnswer]');

// media topic
const mediaTopic = require('./media_topic/create');
const mediaTopicId = require('./media_topic/rud[id]');
const listMediaTopic = require('./media_topic/list');

// media category
const mediaCategory = require('./media_category/create');
const mediaCategoryId = require('./media_category/rud[id]');
const listMediaCategory = require('./media_category/list');

// media tag
const mediaTag = require('./media_tag/create');
const mediaTagId = require('./media_tag/rud[id]');
const mediaTagList = require('./media_tag/list');

// media tag
const mediaSeries = require('./media_series/create');
const mediaSeriesId = require('./media_series/rud[id]');
const mediaSeriesList = require('./media_series/list');
const fetchListPreview = require('./media_series/listReview');

// favorite
const favorite = require('./favorite');

// tracking
const trackingTopic = require('./tracking/trackingTopic');
const trackingTopicGetAll = require('./tracking/trackingTopicGetAll');
const trackingTopicId = require('./tracking/trackingTopic[id]');
const trackingAnswer = require('./tracking/trackingAnswer');
const trackingAnswerId = require('./tracking/trackingAnswer[id]');

//AIA code
const aiaCode = require('./aia_code/aiaCode')
const aiaCodeId = require('./aia_code/aiaCode[id]')
const aiaCodeReplace = require('./aia_code/aiaCodeReplace')
const aiaConfirm = require('./aia_code/aiaConfirm')

// recipes
const recipesName = require('./recipes/getName');
const recipesPost = require('./recipes/post');
const recipesList = require('./recipes/list');
const recipes = require('./recipes');

// recipes type
const recipesType = require('./recipes_type/create');
const recipesTypeList = require('./recipes_type/list');
const recipesTypeRUD = require('./recipes_type/rud[id]');

// recipes category
const recipesCategory = require('./recipes_category/create');
const recipesCategoryList = require('./recipes_category/list');
const recipesCategoryRUD = require('./recipes_category/rud[id]');

// recipes tags
const recipesTags = require('./recipes_tags/create');
const recipesTagsList = require('./recipes_tags/list');
const recipesTagsRUD = require('./recipes_tags/rud[id]');

// recipes meal
const recipesMeal = require('./recipes_meal/create');
const recipesMealList = require('./recipes_meal/list');
const recipesMealAll = require('./recipes_meal/all');
const recipesMealRUD = require('./recipes_meal/rud[id]');

// recipes dietary
const recipesDietary = require('./recipes_dietary/create');
const recipesDietaryList = require('./recipes_dietary/list');
const recipesDietaryRUD = require('./recipes_dietary/rud[id]');

// Ingredients
const ingredients = require('./ingredients/create');
const ingredientsList = require('./ingredients/list');
const ingredientsRUD = require('./ingredients/rud[id]');

// ingredients category
const ingredientsCategory = require('./ingredients_category/create');
const ingredientsCategoryList = require('./ingredients_category/list');
const ingredientsCategoryRUD = require('./ingredients_category/rud[id]');

// menu food
const menuFood = require('./menu_food/create');
const menuFoodList = require('./menu_food/list');
const menuFoodRUD = require('./menu_food/rud[id]');
const menuFoodRecipes = require('./menu_food/recipes');
const menuFoodMealPlan = require('./menu_food/mealPlan');

// dietary
const dietary = require('./dietary/create');
const dietaryList = require('./dietary/list');
const dietaryRUD = require('./dietary/rud[id]');

// meal plan
const mealPlan = require('./meal_plan/create');
const mealPlanName = require('./meal_plan/names');
const mealPlanList = require('./meal_plan/list');
const mealPlanRUD = require('./meal_plan/rud[id]');

// shopping list
const shoppingList = require('./shopping_list');
const shoppingListAll = require('./shopping_list/list');
const shoppingListU = require('./shopping_list/put');

// my program
const myProgram = require('./my_program/create');
const myProgramList = require('./my_program/list');
const myProgramRUD = require('./my_program/rud[id]');

// dietary
const system = require('./system/create');
const systemList = require('./system/list');
const systemRUD = require('./system/rud[field]');

module.exports = {
  paths: {
    '/auth/login': userLogin,
    // '/auth/google': googleLogin,
    // '/auth/facebook': facebookLogin,
    // '/auth/register': userRegister,
    '/auth/firebase': firebaseLogin,
    '/auth/admin-login': adminLogin,
    '/logout': logout,
    '/refresh-token': refreshToken,
    '/user/list': listUser,
    '/user': user,
    '/user/change-password': userChangePass,
    '/user/{userId}': userAdmin,
    '/profile': profile,
    '/profile/cancel-subscription': cancelSubscription,
    '/profile/{userId}': AdminProfile,

    // survey
    '/survey': surveyList, //pagination ok
    '/survey ': survey,
    '/survey/{id}': surveyId,

    // survey answer
    '/survey-answer': surveyAnswer,
    '/survey-answer/verify': surveyAnswerVerify,
    '/survey-answer/{surveyAnswerId}': surveyAnswerId,
    '/survey-answer/report': report,
    '/survey-answer/report/{surveyAnswerId}': reportBySurveyAnswerId,

    '/promo-codes': promoCR,
    '/promo-codes?type=list': promoGetAll, //pagination ok
    '/promo-codes/{id}': promoRUD,

    '/track-topic': trackingTopic, //pagination ok
    // '/track-topic ': trackingTopicGetAll,
    '/track-topic/{id}': trackingTopicId,
    '/track-answer': trackingAnswer,
    '/track-answer/{id}': trackingAnswerId,

    '/payment': payment,
    '/payment/{id}': paymentId,

    '/customer/cards': customer,
    '/customer/cards/{id}': customerID,

    // membership
    '/membership': membership,
    '/membership/{id}': membershipId,
    '/membership/list': listMembership, //pagination ok

    // membership type
    '/membership-type': membershipType,
    '/membership-type/{id}': membershipTypeRUD,
    '/membership-type/list': membershipTypeList, //pagination ok

    // media
    '/media': mediaPost,
    '/media/{id}': media,
    '/media/list/{type}': mediaList,
    '/media/random-list/{type}': mediaRandomList, //pagination ok

    // media topic
    '/media-topic': mediaTopic,
    '/media-topic/{id}': mediaTopicId,
    '/media-topic/list': listMediaTopic, //pagination ok

    // media category
    '/media-category': mediaCategory,
    '/media-category/{id}': mediaCategoryId,
    '/media-category/list': listMediaCategory, //pagination ok

    // media tag
    '/media-tag': mediaTag,
    '/media-tag/{id}': mediaTagId,
    '/media-tag/list': mediaTagList, //pagination ok

    // media series
    '/media-series': mediaSeries,
    '/media-series/{id}': mediaSeriesId,
    '/media-series/list': mediaSeriesList, //pagination ok
    '/media-series/preview': fetchListPreview,

    // favorite
    '/favorite': favorite,

    //aia_code
    '/aia-codes': aiaCode,
    '/aia-codes/{id}': aiaCodeId,
    '/aia-codes/renew-code': aiaCodeReplace,
    '/aia-codes/confirm': aiaConfirm,
    '/codes': getCodes,

    // recipes
    '/recipes': recipesPost,
    '/recipes/{id}': recipes,
    '/recipes/list': recipesList,
    '/recipes/name/{id}': recipesName,

    // recipes type
    '/recipes-type': recipesType,
    '/recipes-type/{id}': recipesTypeRUD,
    '/recipes-type/list': recipesTypeList, //pagination ok

    // recipes category
    '/recipes-category': recipesCategory,
    '/recipes-category/{id}': recipesCategoryRUD,
    '/recipes-category/list': recipesCategoryList, //pagination ok

    // recipes tags
    '/recipes-tags': recipesTags,
    '/recipes-tags/{id}': recipesTagsRUD,
    '/recipes-tags/list': recipesTagsList, //pagination ok

    // recipes meal
    '/recipes-meal': recipesMeal,
    '/recipes-meal/{id}': recipesMealRUD,
    // '/recipes-meal/all': recipesMealAll,
    '/recipes-meal/list': recipesMealList, //pagination ok

    // recipes dietary
    '/recipes-dietary': recipesDietary,
    '/recipes-dietary/{id}': recipesDietaryRUD,
    '/recipes-dietary/list': recipesDietaryList,  //pagination ok

    // ingredients
    '/ingredients': ingredients,
    '/ingredients/{id}': ingredientsRUD,
    '/ingredients/list': ingredientsList, //pagination ok

    // recipes category
    '/ingredients-category': ingredientsCategory,
    '/ingredients-category/{id}': ingredientsCategoryRUD,
    '/ingredients-category/list': ingredientsCategoryList, //pagination ok

    // menu food
    '/menu-food': menuFood,
    '/menu-food/{id}': menuFoodRUD,
    '/menu-food/list': menuFoodList,
    '/menu-food/recipes': menuFoodRecipes,
    '/menu-food/meal-plan': menuFoodMealPlan,

    // dietary
    '/dietary': dietary,
    '/dietary/{id}': dietaryRUD,
    '/dietary/list': dietaryList, //pagination ok

    // meal plan
    '/meal-plan': mealPlan,
    '/meal-plan/names': mealPlanName,
    '/meal-plan/{id}': mealPlanRUD,
    '/meal-plan/list': mealPlanList, //pagination ok

    // shopping list
    '/shopping-list': shoppingList,
    '/shopping-list/list': shoppingListAll,
    '/shopping-list/buy-status/{id}': shoppingListU,

    // my program
    '/my-program': myProgram,
    '/my-program/{id}': myProgramRUD,
    '/my-program/list': myProgramList, //pagination ok

    // system
    '/system': system,
    '/system/{field}': systemRUD,
    '/system/list': systemList, //pagination ok

  }
}
