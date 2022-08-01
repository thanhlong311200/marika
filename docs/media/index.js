const mediaGet = require("./get");
const mediaPut = require("./put");
const mediaDelete = require("./delete");

module.exports = {
  ...mediaPut,
  ...mediaDelete,
  ...mediaGet,
}
