const ENV = require('../utils/Env');
const JWS_SECRET = ENV.get("JWS_SECRET", 'RW5jb2RlIHRvIEJhc2U2NCBmb3JtYXQ=');
const JWS_SECRET_ADMIN = ENV.get("JWS_SECRET_ADMIN", 'DKAS22RlIHRvIE567jkhBmb3OJQ09');
const ALG = ENV.get("JWS_ALG", 'HS256');
const ALG_ADMIN = ENV.get("JWS_ALG_ADMIN", 'HS256');
const jws = require('jws');
const {handlerResERROR} = require("../utils");

function adminMiddleware(req, res, next) {
  try {
    let accessToken = req?.headers?.authorization;
    if (!accessToken) return res.status(401).send(handlerResERROR({
      message: "Invalid access token permission !",
      code: "E_PERMISSION"
    }));
    accessToken = accessToken.split("Bearer ")[1];
    const alg = ENV.get("JWS_ALG_ADMIN", 'HS512');
    const verified = jws.verify(accessToken, alg, JWS_SECRET_ADMIN);
    if (!verified)
      return res.status(401).send(handlerResERROR({
        message: "Invalid access token permission !",
        code: "E_PERMISSION_ADMIN"
      }));

    const jwsData = jws.decode(accessToken);
    let iat = Math.floor(new Date() / 1000);
    if (jwsData.payload.exp < iat)
      return res.status(401).send(handlerResERROR({
        message: "The access token has expired !",
        code: "E_JWT_TOKEN_EXPIRED"
      }));

    req.roles = jwsData.payload.roles;
    req.uid = jwsData.payload.uid;
    if (jwsData.payload.roles !== "admin")
      return res.status(401).send(handlerResERROR({message: "Invalid access token permission !", code: "E_PERMISSION_ADMIN"}));
    return next();
    } catch (e) {
    return res.status(401).send(handlerResERROR({message: "Invalid access token permission !", code: "E_PERMISSION"}));
  }
}

function memberMiddleware(req, res, next) {
  try {
    let accessToken = req.headers.authorization;
    if (!accessToken) return res.status(401).send(handlerResERROR({
      message: "Invalid access token !",
      code: "E_PERMISSION"
    }));
    accessToken = accessToken.split("Bearer ")[1];
    const alg = ENV.get("JWS_ALG", 'HS256');
    const verified = jws.verify(accessToken, alg, JWS_SECRET);
    if (!verified)
      return res.status(401).send(handlerResERROR({message: "Invalid access token !", code: "E_PERMISSION"}));

    const jwsData = jws.decode(accessToken);
    const {uid, roles, status, isMembership} = jwsData.payload
    req.roles = roles;
    req.uid = uid;

    if (!status)
      return res.status(401).send(handlerResERROR({
        message: "Invalid access token permission !",
        code: "E_PERMISSION"
      }));
    if (!isMembership)
      return res.status(403).send(handlerResERROR({message: "not a membership !", code: "E_PERMISSION_MEMBERSHIP"}));

    let iat = Math.floor(new Date() / 1000);
    if (jwsData.payload.exp < iat)
      return res.status(401).send(handlerResERROR({
        message: "The access token has expired !",
        code: "E_JWT_TOKEN_EXPIRED"
      }));

    return next();
  } catch (e) {
    return res.status(401).send(handlerResERROR({message: "Invalid access token permission !", code: "E_PERMISSION"}));
  }
}

function userMiddleware(req, res, next) {
  try {
    let accessToken = req.headers.authorization;
    if (!accessToken) return res.status(401).send(handlerResERROR({
      message: "Invalid access token !",
      code: "E_PERMISSION"
    }));
    accessToken = accessToken.split("Bearer ")[1];
    const alg = ENV.get("JWS_ALG", 'HS256');
    const verified = jws.verify(accessToken, alg, JWS_SECRET);
    if (!verified)
      return res.status(401).send(handlerResERROR({message: "Invalid access token !", code: "E_PERMISSION"}));

    const jwsData = jws.decode(accessToken);
    const {uid, roles, status} = jwsData.payload
    if (roles !== "admin" && !status)
      return res.status(401).send(handlerResERROR({
        message: "Invalid access token permission !",
        code: "E_PERMISSION"
      }));

    req.roles = roles;
    req.uid = uid;
    let iat = Math.floor(new Date() / 1000);
    if (jwsData.payload.exp < iat)
      return res.status(401).send(handlerResERROR({
        message: "The access token has expired !",
        code: "E_JWT_TOKEN_EXPIRED"
      }));

    return next();
  } catch (e) {
    return res.status(401).send(handlerResERROR({message: "Invalid access token permission !", code: "E_PERMISSION"}));
  }
}

function surveyMiddleware(req, res, next) {
  try {
    let accessToken = req.headers.authorization;
    let email = req.body?.email;
    if (!accessToken && !email)
      return res.status(401).send(
        handlerResERROR({
          message: "Invalid access token !",
          code: "E_PERMISSION",
        })
      );
    if (email) return next();
    accessToken = accessToken.split("Bearer ")[1];
    const alg = ENV.get("JWS_ALG", "HS256");
    const verified = jws.verify(accessToken, alg, JWS_SECRET);
    if (!verified) {
      return res.status(401).send(
        handlerResERROR({
          message: "Invalid access token !",
          code: "E_PERMISSION",
        })
      );
    }
    const jwsData = jws.decode(accessToken);
    const {uid, roles, status} = jwsData.payload
    if(roles !== "admin" && !status)
      return res.status(401).send(handlerResERROR({message: "Invalid access token permission !", code: "E_PERMISSION"}));

    let iat = Math.floor(new Date() / 1000);
    if (jwsData.payload.exp < iat)
      return res.status(401).send(handlerResERROR({message: "The access token has expired !", code: "E_JWT_TOKEN_EXPIRED"}));

    req.uid = uid;
    return next();
  } catch (error) {
    return res.status(401).send(handlerResERROR({
      message: "Invalid access token permission !",
      code: "E_PERMISSION"
    }));
  }
}

function commonMiddleware(req, res, next) {
  try {
    // const path = req.path.split("/");
    let accessToken = req.headers.authorization;
    if (!accessToken) return res.status(401).send(handlerResERROR({
      message: "Invalid access token !",
      code: "E_PERMISSION"
    }));
    accessToken = accessToken.split("Bearer ")[1];

    const jwsData = jws.decode(accessToken);
    const {uid, roles, status, isMembership} = jwsData.payload
    if(roles !== "admin" && !isMembership)
      return res.status(403).send(handlerResERROR({message: "not a membership !", code: "E_PERMISSION_MEMBERSHIP"}));
    if(roles !== "admin" && !status)
      return res.status(401).send(handlerResERROR({message: "Invalid access token permission !", code: "E_PERMISSION"}));

    let iat = Math.floor(new Date() / 1000);
    if(jwsData.payload.exp < iat)
      return res.status(401).send(handlerResERROR({message: "The access token has expired !", code: "E_JWT_TOKEN_EXPIRED"}));

    const secret = roles === "member" ? JWS_SECRET : JWS_SECRET_ADMIN;
    const alg = roles === "member" ? ALG : ALG_ADMIN;

    const verified = jws.verify(accessToken, alg, secret);
    if (!verified)
      return res.status(401).send(handlerResERROR({message: "Invalid access token !", code: "E_PERMISSION"}));

    req.uid = uid;
    req.roles = roles
    return next();
  } catch (error) {
    return res.status(401).send(handlerResERROR({message: "Invalid access token permission !", code: "E_PERMISSION"}));
  }
}

const rolesMiddleware = (req, res, next) => {
  try {
    let accessToken = req.headers.authorization;
    if (!accessToken) return next();
    accessToken = accessToken.split("Bearer ")[1];
    const jwsData = jws.decode(accessToken);
    let iat = Math.floor(new Date() / 1000);
    if (jwsData.payload.exp < iat) return next();
    const {roles, uid} = jwsData.payload;
    const secret = roles === "member" ? JWS_SECRET : JWS_SECRET_ADMIN;
    const alg = roles === "member" ? ALG : ALG_ADMIN;
    const verified = jws.verify(accessToken, alg, secret);
    if (!verified) return next();
    req.uid = uid;
    req.roles = roles;
    return next();
  } catch (e) {
    return next();
  }
}

module.exports = {
  adminMiddleware,
  memberMiddleware,
  commonMiddleware,
  surveyMiddleware,
  rolesMiddleware,
  userMiddleware,
}
