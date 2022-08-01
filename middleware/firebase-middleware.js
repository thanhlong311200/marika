const firebase = require("../config/FirebaseInit");
const {handlerResERROR} = require("../utils");
const cot = require("../config/Constant");

function authMiddleware(req, res, next) {
  let token = "";

  if(req.body.idToken) token = req.body.idToken

  const {authorization} = req.headers;
  if (!token && authorization && authorization.split(" ")[0] === "Bearer")
    token = authorization.split(" ")[1];
  if (!token)
    return res.status(401).send(handlerResERROR({code: cot.E_PERMISSION, message: "No token provided" }));

  firebase
    .auth()
    .verifyIdToken(token)
    .then((decodedToken) => {
      req.userInfo = decodedToken;
      next()
    })
    .catch(() => {
      res.status(401).send(handlerResERROR({code: cot.E_PERMISSION, message: "Could not authorize"}))
    });
}

module.exports = authMiddleware;
