const ENV = require('../utils/Env')
const bcrypt = require('bcrypt');
const saltRounds = parseInt(ENV.get("BCRYPT_SALT", '12'));
/**
 *
 * @param {string} password
 * @returns {Promise<void|*|NodeJS.Global.Promise>}
 */
const hashPass = async function (password) {
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(password, salt);
}
/**
 *
 * @param {string} password
 * @param {string} hashpass - password Hash by bcrypt
 * @returns {true | false} check
 */
const checkPass = function (password = "", hashPassword = "") {
  if (!password || !hashPassword) return false
  return bcrypt.compare(password, hashPassword);
}
module.exports = {
  hashPass,
  checkPass
}
