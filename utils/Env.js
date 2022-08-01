/* lodash .  _.get() */
require('dotenv').config();
const _ = require('lodash');

/**
 * Nếu có biến môi trường thì trả về default.
 * @param {string} env
 * @param {number} _default
 * @returns
 */
function get(env, _default) {
    const varEnv = _.get(process.env, env, _default);
    return varEnv;
}

/**
 *
 * @param {string} env
 */
function getOrFail(env) {
    const varEnv = _.get(process.env, env);
    // if (varEnv)
      return varEnv;
    // throw new Error('Valid not found');
}

module.exports = {
    get,
    getOrFail
}
