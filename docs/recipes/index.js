const recipesGet = require("./get");
const recipesPut = require("./put");
const recipesDelete = require("./delete");

module.exports = {
  ...recipesPut,
  ...recipesDelete,
  ...recipesGet,
}
