const ENV = require("../utils/Env");
const components = require("../docs/components");
const docs = require("../docs");
const configDocs = {
  openapi: "3.0.1",
  info: {
    version: "0.0.1",
    title: "Marikaday",
    description: "Marikaday API",
    contact: {
      name: "Marikaday",
      email: "marikaday@gmail.com",
      url: "https://marikaday.com"
    }
  },
  servers: [
    {
      url: ENV.get("DOMAIN", "https://apiv2.marika.tobele.com"),
      description: "Server"
    },
  ],
  tags: {
    name: 'operations'
  },
  security: [{
    bearerAuth: []
  }],
  components,
  ...docs,
}
module.exports = {
  configDocs
}
