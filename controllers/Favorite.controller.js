const Favorites = require("../models/Favorites.model");
const Media = require("../models/Media.model");
const MenuFoodModel = require("../models/MenuFood.model");
const Recipes = require("../models/Recipes.model");
const MediaCategory = require("../models/MediaCategory.model");
const RecipesCategory = require("../models/RecipesCategory.model");
const { handlerResSUCCESS, handlerResERROR } = require("../utils");
const _ = require("lodash");

const create = async (req, res) => {
  try {
    const favType = req.body.type;
    let liked = await Favorites.findOne({
      userId: req.uid,
      type: favType,
    });

    // Validate media
    if (favType === "media") {
      const media = await Media.findOne({ _id: req.body.itemId });
      if (!media)
        return res
          .status(404)
          .send(
            handlerResERROR({ message: "Media not found !", code: "E_REQUEST" })
          );
    }
    if (favType === "recipe") {
      const recipe = await Recipes.findOne({ _id: req.body.itemId });
      if (!recipe)
        return res.status(404).send(
          handlerResERROR({
            message: "Recipe not found !",
            code: "E_REQUEST",
          })
        );
    }
    if (favType === "menu") {
      const menu = await MenuFoodModel.findOne({ _id: req.body.itemId });
      if (!menu)
        return res.status(404).send(
          handlerResERROR({
            message: "Menu not found !",
            code: "E_REQUEST",
          })
        );
    }

    if (liked) {
      const mediaIndex = liked.data.findIndex((it) => it === req.body.itemId);
      if (mediaIndex > -1) {
        liked.data.splice(mediaIndex, 1);
        await liked.save();
        return res.status(200).send(handlerResSUCCESS({ data: liked }));
      }
      liked.data.push(req.body.itemId);
    } else {
      liked = new Favorites({
        userId: req.uid,
        type: favType,
        data: [req.body.itemId],
      });
    }

    await liked.save();

    return res.status(200).send(handlerResSUCCESS({ data: liked }));
  } catch (e) {
    return res.status(400).send(
      handlerResERROR({
        message: `Create Favorite Fail !  ${e?.message}`,
        code: "E_REQUEST",
      })
    );
  }
};

const fetch = async (req, res) => {
  try {
    const isAll = req.query.isAll || false;
    const favType = req.query.type || "";
    const userId = req.uid;

    const mediaCategory = await MediaCategory.find({});
    const recipeCategory = await RecipesCategory.find({});

    let mediaByCategory = {};
    let recipeByCategory = {};
    let menus = [];
    let result = {
      data: {
        medias: mediaByCategory,
        recipes: recipeByCategory,
        menus: menus,
        mediaCategory: mediaCategory,
        recipeCategory: recipeCategory
      },
    };

    if (!favType) {
      mediaByCategory = await fetchFav("media", isAll, userId);
      result.data.medias = mediaByCategory;

      recipeByCategory = await fetchFav("recipe", isAll, userId);
      result.data.recipes = recipeByCategory;

      menus = await fetchFavMenu("menu", isAll, userId);
      result.data.menus = menus;
    }

    if (favType === "media") {
      mediaByCategory = await fetchFav("media", isAll, userId);
      result.data.medias = mediaByCategory;
    }
    if (favType === "recipe") {
      recipeByCategory = await fetchFav("recipe", isAll, userId);
      result.data.recipes = recipeByCategory;
    }
    if (favType === "menu") {
      menus = await fetchFavMenu("menu", isAll, userId);
      result.data.menus = menus;
    }

    res.status(200).send(result);
  } catch (e) {
    return res.status(404).send(
      handlerResERROR({
        message: `Not found ! ${e?.message}`,
        code: "E_REQUEST",
      })
    );
  }
};

async function fetchFav(type, isAll, userId) {
  const modelEntity = fetchModel(type);
  const data = await Favorites.find({
    userId: userId,
    type: type,
  });
  const favIds = data.find((it) => it.type === type)?.data || [];
  if (favIds.length == 0) return {};
  const items = await modelEntity.find({
    _id: {
      $in: isAll ? favIds : favIds.length > 5 ? favIds.slice(0, 5) : favIds,
    },
  });
  let itemsByCategory = {};
  if (items.length > 0) {
    itemsByCategory = _.groupBy(items, "categoryId");
  }
  return itemsByCategory;
}

async function fetchFavMenu(type, isAll, userId) {
  const modelEntity = fetchModel(type);
  const data = await Favorites.find({
    userId: userId,
    type: type,
  });
  const favIds = data.find((it) => it.type === type)?.data || [];
  if (favIds.length == 0) return [];
  const items = await modelEntity.find({
    _id: {
      $in: isAll ? favIds : favIds.length > 5 ? favIds.slice(0, 5) : favIds,
    },
  });
  return items;
}

function fetchModel(type) {
  switch (type) {
    case "media":
      return Media;
    case "recipe":
      return Recipes;
    case "menu":
      return MenuFoodModel;
    default:
      return null;
  }
}

module.exports = {
  create,
  fetch,
};
