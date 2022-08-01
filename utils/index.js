const {body} = require("express-validator");
const jws = require("jws");
const ENV = require("../utils/Env");
const moment = require('moment')
const Favorites = require("../models/Favorites.model");
const sharp = require("sharp");
const {v4: uuidV4} = require('uuid');
const axios = require("axios");
const md5 = require('md5');

const jwsSecret = ENV.get("JWS_SECRET", 'RW5jb2RlIHRvIEJhc2U2NCBmb3JtYXQ=');
const jwsSecretAdmin = ENV.get("JWS_SECRET_ADMIN", 'MmchRtxB0edz1PmLVF4xXgtwKCPH6u2CpcKBinZi9S2xyuF4ylY0');
const duration = parseInt(ENV.get("JWS_DURATION", '2400'));
const ALG = ENV.get('JWS_ALG', 'HS256');
const ALG_ADMIN = ENV.get('JWS_ALG_ADMIN', 'HS512');

/**
 * Validator string
 * @param {object} req
 * @param {string} field
 * @param {object} data
 * @returns {Promise<void>}
 */
const checkString = async (req, field, data) => {
  if (req.body[`${field}`] !== undefined) {
    await body(`${field}`).isString().run(req)
    data[`${field}`] = req.body[`${field}`];
  }
}

/**
 * Validator number
 * @param {object} req
 * @param {string} field
 * @param {object} data
 * @returns {Promise<void>}
 */
const checkNumber = async (req, field, data) => {
  if (req.body[`${field}`] !== undefined) {
    await body(`${field}`).isNumeric().run(req)
    data[`${field}`] = req.body[`${field}`];
  }
}

/**
 *
 * @param {string} [message = ""]
 * @param {*} [data = null]
 * @param {string} [code = "E_VALIDATION"] - params E_VALIDATION | E_REQUEST | E_PERMISSION
 * @defaulted E_VALIDATION
 * @returns {{code: string, message, errors}}
 */
const handlerResERROR = (prop = null) => {
  const result = {code: "E_VALIDATION"}
  if (!prop) return result;
  if (prop.message && prop.message !== "") result.message = prop.message;
  if (prop.data) result.data = prop.data;
  if (prop.code) result.code = prop.code;
  return result;
}

/**
 *
 * @param {*} [data = null]
 * @param {string} [message = "The request was executed successfully"]
 * @param {string} [code = "SUCCESS"]
 * @returns {{code: string, message, data}}
 */
const handlerResSUCCESS = (prop = null) => {
  const result = {
    message: "The request was executed successfully",
    code: "SUCCESS"
  }
  if (!prop) return result;
  if (prop.data) result.data = prop.data;
  if (prop.message) result.message = prop.message;
  if (prop.code) result.code = prop.code;
  if (prop.totalItems > 0) result.totalItems = prop.totalItems;
  return result;
}

/**
 * generate json web token
 * @param {string} uid - id of user
 * @param {boolean} [isMembership = true] - member or admin
 * @param {boolean} [status = true] - member or admin
 * @param {boolean} [isMember = true] - member or admin
 * @returns {{accessToken, expiration}} - json web token and expiration
 */
const generateAccessToken = (uid, isMembership=false, status=true, isMember = true) => {
  let iat = Math.floor(new Date() / 1000);
  let exp = iat + duration;
  let secret = isMember ? jwsSecret : jwsSecretAdmin;
  let alg = isMember ? ALG : ALG_ADMIN;
  let roles = isMember ? 'member' : 'admin'
  const accessToken = jws.sign({
    header: {alg, typ: 'JWT'},
    payload: {uid, iat, exp, roles, isMembership, status},
    secret,
  });
  return {accessToken, expiration: moment().add(duration, 'second').format()};
}

function generateStrings(length = 10) {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const generatePromoCode = () => {
  return generateStrings(10)
}

function generateOtp(digits = 6) {
  const _min = Math.pow(10, digits - 1);
  const _max = 9 * _min;
  return Math.floor(_min + Math.random() * _max);
}

const checkValUsername = (str = '') => {
  if (!str || str?.length < 5) return false;
  const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return regex.test(str)
}
/**
 * stringToInt
 * @param str
 * @returns {number|boolean}
 */
const stringToInt = (str = "") => {
  return (parseInt(str) * 0 === 0) ? parseInt(str) : false;
}

/**
 * sendMailAIACode
 * @param token
 * @param email
 * @returns {{bcc: string, subject: string, from: string, html: string, to: string, text: string}}
 */
const sendMailAIACode = (token, email, code) => {
  return {

    from: `${process.env.MAIL_FROM}`,
    to: 'Marikaday <email>',
    bcc: `${email}`,

    subject: 'Marikaday active AIA code ✔',

    // plaintext body
    text: `Marikaday active AIA code ✔`,

    // HTML body
    html:
      `<p>YOUR AIA CODE: <b>${code}</b> </p>` +
      `<p>Click to activate the code :  <a href="${process.env.DOMAIN}/aia-codes/confirm?tokenConfirm=${token}">${process.env.DOMAIN}/aia-codes/confirm?tokenConfirm=${token}</a> <br/></p>`
  };
}

/**
 *
 * @param req
 * @param isAvatar
 * @returns {Promise<unknown>}
 */
const resizeImage = (req, isAvatar = false) => {
  return new Promise((resolve, reject) => {
    sharp(req.file.path).metadata()
      .then(info => {
        let width = Math.round(info.width * 25 / 100);
        let height = Math.round(info.height * 25 / 100);
        if(width < 500){
          width = Math.round(info.width * 50 / 100);
          height = Math.round(info.height * 50 / 100);
        }
        if(width < 500){
          width = Math.round(info.width * 75 / 100);
          height = Math.round(info.height * 75 / 100);
        }
        const uuid = uuidV4();
        const chartFilename = req.file.filename.split(".")
        const nameFile = isAvatar ? `/${uuid}_.${chartFilename[chartFilename.length - 1]}`: '/thumbnail_' + req.file.filename
        const path = req.file.destination + nameFile;

        sharp(req.file.path).resize(width, height).toFile(path)
          .then(() => resolve(ENV.getOrFail("DOMAIN") + `${isAvatar ? '/avatar' : '/uploads'}` + nameFile))
          .catch(reject);
      })
      .catch(reject);
  })
}


const createMail = (htmlBody, email, title, text) => {
  return {

    from: `${process.env.MAIL_FROM}`,
    to: 'Marikaday <email>',
    bcc: `${email}`,

    subject: `${title}`,

    // plaintext body
    text: `${text}`,

    // HTML body
    html:
      `<p>${htmlBody}</p>`
  };
}

/**
 *
 * @param userId
 * @param type
 * @param dataId
 * @returns {Promise<unknown>}
 */
const isFavorite = (userId, type, dataId) => new Promise((resolve, reject) => Favorites.findOne({
  userId: userId,
  type: type,
  data: {$all: [dataId]}
})
  .then(res => res ? resolve(true) : resolve(false))
  .catch(err => reject(err)));

/**
 * Add member mail chimp
 * @param {string} type
 * @param {object} data
 * @param {string} email
 * @param {string} firstName
 * @param {string} lastName
 * @returns {Promise<void>}
 */
const addMemberMailChimp = async (type, data, email, firstName, lastName) => {
  try {
    const mailChimp = {...JSON.parse(data.value)};
    const item = mailChimp[type];
    if (!item || !item.tags || item.tags.length === 0) return;
    const dataMail = {
      email_address: email,
      status: item.status,
      tags: item.tags.map(val => val.name),
    }
    if (firstName || lastName) dataMail.merge_fields = {
      FNAME: firstName,
      LNAME: lastName,
    }
    await axios.put(
      `${mailChimp.apiUri}/lists/${mailChimp.listId}/members/${md5(email)}`,
      dataMail,
      {headers: {Authorization: `Bearer ${mailChimp.apiKey}`}}
    );
  } catch (e) {
    if(
      !e.response
      || !e.response.data.title
      || e.response.data.title !== "Forgotten Email Not Subscribed"
    ) throw e;
  }
}

module.exports = {
  checkString,
  handlerResERROR,
  handlerResSUCCESS,
  generateAccessToken,
  generatePromoCode,
  checkValUsername,
  checkNumber,
  stringToInt,
  sendMailAIACode,
  generateOtp,
  createMail,
  isFavorite,
  resizeImage,
  addMemberMailChimp,
}
