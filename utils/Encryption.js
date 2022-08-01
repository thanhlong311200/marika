const crypto = require('crypto');
const refreshSecret = process.env.REFRESH_SECRET || "U2ltcGx5IGVudGVyIHlvdXIgZGF0YSB0aGVuIHB1c2ggdGhlIGVuY29kZSBidXR0b24u";
const apiSecret = process.env.API_SECRET || "U2ltcGx5IGVudGVyIHlvdXIgZGF0YSB0aGVuIHB1c2ggdGhlIGVuY29kZSBidXR0b24u";
const IV = process.env.REFRESH_IV || 'GVuIHB1c2ggdGhlI'
/**
 *
 * @param tokenId
 * @param isRefresh
 * @returns {*}
 */
const encryptToken = function (tokenId, isRefresh = true) {
  const secret = isRefresh ? refreshSecret : apiSecret;
  let cipher = crypto.Cipher('aes-256-gcm', Buffer.from(secret, 'hex'), IV);
  let token = cipher.update(tokenId, 'utf8', 'hex')
  token += cipher.final('hex');
  return token;
};
/**
 *
 * @param tokenString
 * @param isRefresh
 * @returns {*}
 */
const decryptToken = function (tokenString, isRefresh = true) {
  const secret = isRefresh ? refreshSecret : apiSecret;
  let decipher = crypto.Decipher('aes-256-gcm', Buffer.from(secret, 'hex'), IV);
  return decipher.update(tokenString, 'hex', 'utf8');
}
module.exports = {
  encryptToken,
  decryptToken
}
