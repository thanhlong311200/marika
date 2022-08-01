const {decryptToken} = require('../utils/Encryption');
const ENV = require('../utils/Env');
const Tokens = require('../models/Token.model');
const {REFRESH_TOKEN} = require("../config/Constant");
const {handlerResSUCCESS, handlerResERROR, generateAccessToken} = require("../utils");
const UserLogin = require("../models/UserLogin.model");
const moment = require("moment");
const durationRefresh = parseInt(ENV.get('REFRESH_DURATION') || '31536000');

module.exports.checkRefreshToken = async function (req, res, next) {
  let {refreshToken} = req.body;
  if (!refreshToken)
    refreshToken = req.cookies[REFRESH_TOKEN]
  if (!refreshToken)
    return res.status(401).send(handlerResERROR({message: "Token is not exist!", code: "E_PERMISSION"}));
  try {
    let tokenUid = decryptToken(refreshToken)
    const tokenSuccess = await Tokens.findOne({uidToken: tokenUid, userId: req.uid, isRevoke: false})
    if (!tokenSuccess) {
      return res.status(401).send(handlerResERROR({message: "Token invalid!", code: "E_PERMISSION"}));
    }
    next()
  } catch (e) {
    return res.status(401).send(handlerResERROR({message: "Token invalid!", code: "E_PERMISSION"}));
  }
}
module.exports.verifyRefreshToken = async function (req, res) {
  let {refreshToken} = req.body;
  if (!refreshToken)
    refreshToken = req.cookies[REFRESH_TOKEN];

  if (!refreshToken)
    return res.status(401).send(handlerResERROR({message: "Token is not exist!", code: "E_PERMISSION"}));

  try {
    let tokenUid = decryptToken(refreshToken)
    const tokenSuccess = await Tokens.findOne({"uidToken": tokenUid, "isRevoke": false})
    if (!tokenSuccess) {
      res.clearCookie(REFRESH_TOKEN)
      return res.status(401).send(handlerResERROR({message: "Token invalid!", code: "E_PERMISSION"}));
    }

    const user = await UserLogin.findById(tokenSuccess.userId);
    const {roles, membershipExp, status} = user
    if (!user || user?.isDelete || (user?.roles === 'member' && !user?.status)) {
      res.clearCookie(REFRESH_TOKEN)
      return res.status(401).send(handlerResERROR({message: "Token invalid!", code: "E_PERMISSION"}));
    }

    const now = Math.floor(new Date() / 1000);
    if (now - tokenSuccess?.updatedAt >= durationRefresh) {
      tokenSuccess.isRevoke = true;
      await tokenSuccess.save();
      res.clearCookie(REFRESH_TOKEN)
      return res.status(401).send(handlerResERROR({message: "Token invalid!", code: "E_PERMISSION"}));
    }
    let isMembership = false
    const exp = new Date(membershipExp)
    if (membershipExp && moment().isBefore(exp)) isMembership = true;
    const newAccessToken = generateAccessToken(tokenSuccess.userId, isMembership, status, roles !== 'admin');
    return res.status(200).send(handlerResSUCCESS({message: 'Created access token', data: newAccessToken}));
  } catch (error) {
    res.clearCookie(REFRESH_TOKEN)
    return res.status(401).send(handlerResERROR({message: "Token invalid!", code: "E_PERMISSION"}));
  }
}

module.exports.revokeToken = async (req, res) => {
  let {refreshToken} = req.body;
  if (!refreshToken)
    refreshToken = req.cookies[REFRESH_TOKEN];
  if (!refreshToken)
    return res.status(401).send(handlerResERROR({message: "Token refresh invalid!", code: "E_PERMISSION"}));
  res.clearCookie(REFRESH_TOKEN)
  try {
    let tokenUid = decryptToken(refreshToken);
    const tokenSuccess = await Tokens.findOne({"uidToken": tokenUid, "isRevoke": false})
    if (!tokenSuccess) {
      return res.status(401).send(handlerResERROR({message: "Token invalid!", code: "E_PERMISSION"}));
    }
    tokenSuccess.isRevoke = true;
    await tokenSuccess.save();
    return res.status(200).send(handlerResSUCCESS({message: "Logout successful !"}))
  } catch (e) {
    return res.status(401).send(handlerResERROR({message: "Token invalid!", code: "E_PERMISSION"}));
  }
}
