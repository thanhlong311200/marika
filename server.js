require('dotenv').config();
// const helmet = require("helmet");
const cors = require("cors");
const express = require('express');
const ENV = require('./utils/Env');
const mongoConnect = require('./config/Database');

const main = () => new Promise(async (resolve, reject) => {
  try {
    const domain = ENV.get("DOMAIN", "https://apiv2.marika.tobele.com");
    const domainCookie = ENV.get("DOMAIN_COOKIE", '.tobele.com');
    const env = ENV.get("NODE_ENV", "developer");
    const app = express();

    await mongoConnect();

    const regexDomain = new RegExp(`${domainCookie}$`)
    const whitelist = [domain, regexDomain];
    const corsOptions = {
      origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
      },
      methods: 'GET,POST,PUT,DELETE',
      credentials: true,
    }
    if(env !== "production") corsOptions.origin = true

    app.disable('x-powered-by');
    app.use(cors(corsOptions));
    // app.use(helmet());
    app.use('/uploads', express.static('uploads'));
    app.use('/avatar', express.static('avatars'));
    if(env !== 'production') app.use('/test-firebase',express.static('public'));

    resolve(app);
  } catch (err) {
    console.log(err)
    reject(err)
  }
})

main()
  .then(app => {
    // require('./config/LoggerCustom')(app);
    require('./start/Routes')(app);
    const port = ENV.get("PORT", 3000)
    app.listen(port, () => {
      console.log(`Server started on ${port}`);
    });
  })
  .catch((e) => {
    console.log(e);
    process.exit(0)
  });

