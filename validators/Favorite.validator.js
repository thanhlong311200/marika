const { handlerResERROR } = require("../utils");
const FAVORITE_TYPE = ["menu", "recipe", "media"];

const validateOnCreate = (req, res, next) => {
  const { type, itemId = "" } = req.body;
  if (!type || FAVORITE_TYPE.indexOf(type) === -1) {
    return res.status(422).send(
      handlerResERROR({
        message: "Favorite type is invalid!",
        code: "E_VALIDATION",
      })
    );
  }
  if (!itemId)
    return res.status(422).send(
      handlerResERROR({
        message: "Favorite item id is invalid!",
        code: "E_VALIDATION",
      })
    );
  next();
};

module.exports = {
  validateOnCreate,
};
