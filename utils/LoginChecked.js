const UsersLogin = require('../models/UserLogin.model');
const bcrypt = require('bcrypt');
/**
 *
 * @param {string} username
 * @param {string} password
 */
const checkUserLogin = async function (username = '', password = '') {
  try {
    const user = await UsersLogin.findOne({"username": username});
    const check = await bcrypt.compare(password, user.password);
    if (check === true && user?.status && !user?.isDelete) return user;
    return null;
  } catch (error) {
    return null;
  }
}
/**
 *
 * @param {string} username
 * @param {string} password
 */
const checkAdminLogin = async function (username = '', password = '') {
  try {
    const user = await UsersLogin.findOne({"username": username, 'roles': 'admin'});
    const check = await bcrypt.compare(password, user.password);
    if (check === true) return user._id;
    return null;
  } catch (error) {
    return null;
  }
}

module.exports = {
  checkUserLogin,
  checkAdminLogin
}
