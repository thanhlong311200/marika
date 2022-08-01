const bodyParser = require('body-parser');
const express = require('express');
const cookieParser = require("cookie-parser");
const swaggerUI = require("swagger-ui-express");
const multer = require('multer');
const upload = multer();

const {configDocs} = require("../config/Docs");

const {verifyRefreshToken, revokeToken} = require('../middleware/VeryRefreshToken');
const {adminMiddleware, memberMiddleware} = require("../middleware/RoleMiddleware");

const Auth = require('../routes/Auth.route');
const User = require('../routes/User.route');
const Profile = require('../routes/Profile.route');
const Payment = require('../routes/Payment.route');
const PaymentSubscription = require('../routes/PaymentSubscription.route');
const PromoCode = require('../routes/PromoCode.route');
const AIACode = require('../routes/AIACode.route');
const Survey = require('../routes/Survey.route');
const TrackTopic = require('../routes/TrackTopic.route');
const TrackAnswer = require('../routes/TrackAnswer.route');
const Customer = require('../routes/Customer.route');
const SurveyAnswer = require('../routes/SurveyAnswer.route');
const Favorite = require('../routes/Favorite.route');

const Membership = require('../routes/Membership.route');
const MembershipType = require('../routes/MembershipType.route');
const Campaign = require('../routes/Campaign.route')
const {webhookStripe} = require("../controllers/PaymentSubcription.controller");

// Media
const Media = require('../routes/Media.route');
const MediaCategory = require('../routes/MediaCategory.route');
const MediaTag = require('../routes/MediaTag.route');
const MediaSeries = require('../routes/MediaSeries.route');
const MediaTopic = require('../routes/MediaTopic.route');

// Recipes
const Recipes = require('../routes/Recipes.route');
const RecipesType = require('../routes/RecipesType.route');
const RecipesCategory = require('../routes/RecipesCategory.route');
const RecipesTags = require('../routes/RecipesTags.route');
const RecipesMeal = require('../routes/RecipesMeal.route');
const RecipesDietary = require('../routes/RecipesDietary.route');

const Ingredients = require('../routes/Ingredients.route');
const IngredientsCategory = require('../routes/IngredientsCategory.route');

const MenuFood = require('../routes/MenuFood.route');
const Dietary = require('../routes/Dietary.route');
const MealPlan = require('../routes/MealPlan.route');

const ShoppingList = require('../routes/ShoppingList.route');
const AIACodeCtrl = require("../controllers/AIACode.controller");

const MyProgram = require('../routes/myProgram.route');
const MailChimp = require('../routes/MailChimp.route');

const ActitonExp = require('../routes/Actiton.route');

const System = require('../routes/System.route');

function Routes(app) {
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));
  app.use(express.json());

  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(configDocs));

  app.use('/auth', Auth);

  app.use('/admin', adminMiddleware);

  app.use('/promo-codes', PromoCode);

  app.use('/aia-codes', AIACode);

  app.get('/codes', AIACodeCtrl.getCodes);

  app.use('/user', User);

  app.use('/profile', Profile);

  app.use('/payment', Payment);

  app.use('/campaign', Campaign);

  // app.use('/payment-subscription', memberMiddleware, PaymentSubscription);

  // app.post('/payment-intent', userMiddleware, createIntent);

  app.use('/customer/cards', Customer);

  app.use('/refresh-token', upload.none(), verifyRefreshToken);

  app.post('/logout', upload.none(), revokeToken)

  app.use('/survey', Survey);

  app.use('/survey-answer', SurveyAnswer);

  app.use('/track-topic', TrackTopic);

  app.use('/track-answer', TrackAnswer);

  app.use('/action-data', ActitonExp);

  app.use('/media', Media);
  app.use('/media-category', MediaCategory);
  app.use('/media-tag', MediaTag);
  app.use('/media-series', MediaSeries);
  app.use('/media-topic', MediaTopic);

  app.use('/favorite', memberMiddleware, Favorite);

  app.use('/membership', Membership);
  app.use('/membership-type', MembershipType);

  app.post('/stripe-webhooks', bodyParser.raw({type: 'application/json'}), webhookStripe);

  app.use('/recipes', Recipes);
  app.use('/recipes-type', RecipesType);
  app.use('/recipes-category', RecipesCategory);
  app.use('/recipes-tags', RecipesTags);
  app.use('/recipes-meal', RecipesMeal);
  app.use('/recipes-dietary', RecipesDietary);

  app.use('/ingredients', Ingredients);
  app.use('/ingredients-category', IngredientsCategory);

  app.use('/menu-food', MenuFood);
  app.use('/dietary', Dietary);
  app.use('/meal-plan', MealPlan);

  app.use('/shopping-list', ShoppingList);

  app.use('/my-program', MyProgram);

  app.use('/mail-chimp', MailChimp)

  app.use('/system', System)
}

module.exports = Routes;
