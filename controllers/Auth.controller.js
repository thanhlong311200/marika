'use strict';

const ENV = require('../utils/Env');
const axios = require("axios");
const qs = require("qs");
const UsersLogin = require('../models/UserLogin.model');
const {encryptToken} = require('../utils/Encryption');
const Token = require('../models/Token.model');
const UsersInfo = require("../models/UsersInfo.model");
const AIACode = require("../models/AIACode.model");
const {v4: uuidV4} = require('uuid');
const {hashPass} = require('../utils/Password');
const {checkUserLogin, checkAdminLogin} = require('../utils/LoginChecked');
const con = require("../config/Constant");
const {generateAccessToken, handlerResSUCCESS, handlerResERROR, addMemberMailChimp} = require("../utils");
const moment = require("moment");
const System = require("../models/System.model");
const {WELCOME_LIST, WELCOME_PROGRAM} = require("../config/Constant");
const refreshDuration = parseInt(ENV.get("REFRESH_DURATION", '2400'));
const domain = ENV.get("DOMAIN_COOKIE", '.tobele.com');

const optionCookies = {
  domain: domain,
  httpOnly: true,
  secure: true,
  sameSite: "None",
  path: "/",
}

const adminLogin = async (req, res) => {
  try {
    const {username, password} = req.body;
    if (username && password) {
      const uid = await checkAdminLogin(username, password);
      if (!uid)
        return res.status(400).send(handlerResERROR({message: "Login Fail !", code: "E_REQUEST_ADMIN"}))
      const tokens = generateAccessToken(uid, true, true, false);
      const uidToken = uuidV4();
      const refreshToken = encryptToken(uidToken);
      optionCookies.maxAge = refreshDuration + Math.floor(new Date() / 1000);
      res.cookie(con.REFRESH_TOKEN, refreshToken, optionCookies);
      const newToken = new Token({userId: uid, uidToken, isRevoke: false});
      await newToken.save();
      tokens.refreshToken = refreshToken;
      tokens._id = uid;
      const profile = await UsersInfo.findById(uid).select('-_id')
      return res.status(200).send(handlerResSUCCESS({data: {...tokens, profile}}));
    }
  } catch (error) {
    return res.status(400).send(handlerResERROR({message: "Login Fail !", code: "E_REQUEST_ADMIN"}))
  }
};

const userLogin = async (req, res) => {
  try {
    const {username, password} = req.body;
    const user = await checkUserLogin(username, password);
    const {status, membershipExp, roles} = user
    const userId = user._id;
    let isMembership = false
    if (!userId)
      return res.status(400).send(handlerResERROR({message: "Login Fail !", code: "E_REQUEST"}))
    const exp = new Date(membershipExp)
    if (membershipExp && moment().isBefore(exp)) isMembership = true
    const tokens = generateAccessToken(userId, isMembership, status, roles === "member");
    const uidToken = uuidV4();
    const refreshToken = encryptToken(uidToken)
    optionCookies.maxAge = refreshDuration + Math.floor(new Date() / 1000);
    res.cookie(con.REFRESH_TOKEN, refreshToken, optionCookies);
    const newToken = new Token({userId: userId, uidToken, isRevoke: false});
    await newToken.save();
    tokens.refreshToken = refreshToken
    tokens.userId = userId;
    const profile = await UsersInfo.findById(userId).select('-_id')
    const aia = await AIACode.findOne({email: profile?.email}).select(['price','code','status','-_id'])
    return res.status(200).send(handlerResSUCCESS({data: {...tokens, isMembership, status, profile, aiaCode: aia}}));
  } catch (error) {
    console.log(error)
    return res.status(400).send(handlerResERROR({message: "Login Fail !", code: "E_REQUEST"}))
  }
};

/**
 * lấy accessToken từ google.
 * @param {string} code
 * @returns {Promise}
 */
const getTokenGG = (code) => {
  return new Promise((resolve, reject) => {
    const url = con.GG_API_OAUTH;
    const data = {
      client_id: ENV.getOrFail("GG_CLIENT_ID"),
      client_secret: ENV.getOrFail("GG_CLIENT_SECRET"),
      code,
      grant_type: con.GG_GRANT_TYPE,
      redirect_uri: ENV.getOrFail("GG_REDIRECT_URI"),
    };
    const options = {
      method: "POST",
      headers: {"content-type": "application/x-www-form-urlencoded"},
      data: qs.stringify(data),
      url,
    };
    axios(options)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
};

/**
 * Lấy ra user info Google
 * @param {string} accessToken
 * @returns {Promise}
 */
const getProfileGG = (accessToken) => {
  const url = con.GG_API_INFO;
  return new Promise((resolve, reject) => {
    const options = {
      method: "GET",
      headers: {Authorization: `Bearer ${accessToken}`},
      url: url,
    };
    axios(options)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
};

/**
 * Xử lý tài khoản Google
 * @param {object} profile
 * @returns {Promise<null|string>}
 */
const handlerUserGG = async (profile) => {
  try {
    let user = await UsersLogin.findOne({"username": profile.email});
    if (user !== null) {
      if (!user.isGoogle) {
        user.isGoogle = true;
        await user.save();
      }
      return user;
    }
    user = new UsersLogin({username: profile.email, isGoogle: true});
    await user.save();
    const newUserInfo = new UsersInfo({
      _id: user._id,
      avatar: profile.picture || "",
      name: profile.name,
      email: profile.email,
    });
    await newUserInfo.save();
    return user;
  } catch (error) {
    return null;
  }
}

/**
 * Login by account google
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const googleLogin = async (req, res) => {
  try {
    const {code} = req.body;

    const {access_token} = await getTokenGG(code);
    const profile = await getProfileGG(access_token);
    const user = await handlerUserGG(profile);
    if (user === null) return res.status(400).send(handlerResERROR({message: "Login Fail !", code: "E_REQUEST"}))

    return handlerResLogin(req, res, user._id);
  } catch (error) {
    console.log(error)
    return res.status(400).send(handlerResERROR({message: "Login Fail !", code: "E_REQUEST"}))
  }
};

/**
 * lấy accessToken từ Facebook.
 * @param {string} code
 * @returns {Promise}
 */
const getTokenFB = (code) => {
  return new Promise((resolve, reject) => {
    let url = con.FB_API_OAUTH;
    url += `?client_id=${ENV.getOrFail("FB_CLIENT_ID")}`;
    url += `&redirect_uri=${ENV.getOrFail("FB_REDIRECT_URI")}`;
    url += `&client_secret=${ENV.getOrFail("FB_CLIENT_SECRET")}`;
    url += `&code=${code}`;

    const options = {
      method: "GET",
      url,
    };
    axios(options)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
};

/**
 * Lấy profile của người dùng facebook
 * @param accessToken
 * @returns {Promise<object>}
 */
const getProfileFB = (accessToken) => {
  return new Promise((resolve, reject) => {
    let url = con.FB_API_INFO;
    url += `?fields=${con.FB_FIELDS}`;
    url += `&access_token=${accessToken}`;
    const options = {
      method: "GET",
      url,
    };
    axios(options)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

/**
 * Xử lý tài khoản Facebook
 * @param {object} profile
 * @returns {Promise<null|string>}
 */
const handlerUserFB = async (profile) => {
  try {
    if (profile.email === null) return "ERR_NOT_EMAIL";
    let user = await UsersLogin.findOne({"username": profile.email});
    if (user !== null) {
      if (!user.isFacebook) {
        user.isFacebook = true;
        await user.save()
      }
      return user;
    }
    user = new UsersLogin({username: profile.email, isFacebook: true});
    await user.save();
    const newUserInfo = new UsersInfo({
      _id: user._id,
      avatar: profile.picture ? profile.picture.data.url : "",
      name: profile.name,
      email: profile.email,
    });
    await newUserInfo.save();
    return user;
  } catch (error) {
    return null;
  }
}

/**
 * Login by account facebook
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const facebookLogin = async (req, res) => {
  try {
    const {code} = req.body;

    const {access_token} = await getTokenFB(code);
    const profile = await getProfileFB(access_token);
    const user = await handlerUserFB(profile);
    if (user === null) return res.status(400).send(handlerResERROR({message: "Login Fail !", code: "E_REQUEST"}))
    if (user === "ERR_NOT_EMAIL") return res.status(422).send(handlerResERROR({
      "message": "Email not found in user information"
    }));

    return handlerResLogin(req, res, user._id);
  } catch (error) {
    console.log(error);
    return res.status(400).send(handlerResERROR({message: "Login Fail !", code: "E_REQUEST"}))
  }
}

const userRegister = async (req, res) => {
  try {
    const {username, password} = req.body;
    const countUsername = await UsersLogin.countDocuments({"username": username});
    if (countUsername > 0) return res.status(422).send(handlerResERROR({message: "Username exist !"}));
    const hashPassword = await hashPass(password);
    const user = new UsersLogin({username, password: hashPassword});
    await user.save();
    const newUserInfo = new UsersInfo({_id: user._id});
    await newUserInfo.save();

    return handlerResLogin(req, res, user._id);
  } catch (error) {
    console.log(error)
    return res.status(400).send(handlerResERROR({message: "Register Fail !!!", code: "E_REQUEST"}))
  }
};

/**
 * Xử lý tài khoản Firebase
 * @param profile
 * @returns {Promise<*|string|*|*>}
 */
const handlerUserFirebase = async (profile) => {
  if (profile.email === null) return "ERR_NOT_EMAIL";
  let user = await UsersLogin.findOne({"username": profile.email});
  if (user !== null) {
    if (!user._doc.isDelete) {
      if (!user.isFirebase) {
        user.isFirebase = true;
        await user.save()
      }
      return user;
    }
    await user.deleteOne();
  }
  let mailChimp = await System.findOne({field: 'mailChimp'});
  if(mailChimp) {
    let fullName = profile.name;
    if (fullName) fullName = profile.name.split(' ');
    if (!Array.isArray(fullName)) fullName = ['', ''];
    await addMemberMailChimp(WELCOME_LIST, mailChimp, profile.email, fullName[0], fullName[fullName.length - 1]);
    await addMemberMailChimp(WELCOME_PROGRAM, mailChimp, profile.email, fullName[0], fullName[fullName.length - 1]);
  }
  user = new UsersLogin({username: profile.email, isFirebase: true});
  await user.save();
  const newUserInfo = new UsersInfo({
    _id: user._id,
    avatar: profile.picture || "",
    name: profile.name,
    email: profile.email,
  });
  await newUserInfo.save();
  return user;
}

/**
 * Login with firebase
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const firebaseLogin = async (req, res) => {
  try {
    const info = req.userInfo;
    const user = await handlerUserFirebase(info);
    if (user === null) return res.status(400).send(handlerResERROR({message: "Login Fail !", code: "E_REQUEST"}))
    if (user === "ERR_NOT_EMAIL") return res.status(422).send(handlerResERROR({
      "message": "Email not found in user information"
    }));

    return handlerResLogin(req, res, user._id);
  } catch (error) {
    console.log("firebaseLogin error: ", error);
    return res.status(400).send(handlerResERROR({message: "Login Fail !", code: "E_REQUEST"}))
  }
}

const handlerResLogin = async (req, res, uid) => {
  try {
    const user = await UsersLogin.findById(uid);
    const {status, membershipExp} = user
    if (!status) return res.status(400).send(handlerResERROR({message: "Login Fail !", code: "E_REQUEST"}))

    let isMembership = false
    const exp = new Date(membershipExp)
    if (membershipExp && moment().isBefore(exp)) isMembership = true;

    // Access token
    const tokens = generateAccessToken(uid, isMembership, status, user._doc.roles === "member");
    tokens._id = uid;
    tokens.isMembership = isMembership;
    tokens.status = status;

    // Refresh token
    const uidToken = uuidV4();
    const refreshToken = encryptToken(uidToken)
    tokens.refreshToken = refreshToken;
    optionCookies.maxAge = refreshDuration + Math.floor(new Date() / 1000);
    res.cookie(con.REFRESH_TOKEN, refreshToken, optionCookies);
    const newToken = new Token({userId: uid, uidToken, isRevoke: false});
    await newToken.save();

    tokens.profile = await UsersInfo.findById(uid).select('-_id')
    tokens.aiaCode = await AIACode.findOne({email: tokens?.profile?.email}).select(['price','code','status','-_id'])
    return res.status(200).send(handlerResSUCCESS({data: tokens}));
  } catch (error) {
    console.log(error)
    return res.status(400).send(handlerResERROR({message: "Login Fail !", code: "E_REQUEST"}))
  }
}

module.exports = {
  adminLogin,
  userLogin,
  googleLogin,
  facebookLogin,
  firebaseLogin,
  userRegister,
}
