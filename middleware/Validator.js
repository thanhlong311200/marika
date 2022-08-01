const {handlerResERROR, checkValUsername} = require("../utils");

const login = async function (req, res, next) {
  try {
    // console.log(req.body, !checkValUsername(req.body.username) , !req.body.password , req.body.password?.length < 4)
    if (!checkValUsername(req.body.username) || !req.body.password || req.body.password?.length < 4) {
      return res.status(422).send(handlerResERROR({
        message: "Invalid field !",
        code: "E_VALIDATION"
      }));
    }
    return next()
  } catch (error) {
    return res.status(422).send(handlerResERROR({
      message: "Invalid field !",
      code: "E_VALIDATION"
    }));
  }
}

const authSocial = async function (req, res, next) {
  try {
    if (req.body.code) {
      return next();
    }
    return res.status(422).send(handlerResERROR({message: "Code invalid !", code: "E_VALIDATION"}));
  } catch (error) {
    return res.status(422).send(handlerResERROR({message: "Code invalid !", code: "E_VALIDATION"}));
  }
}

const register = async function (req, res, next) {
  // console.log({Check: checkValUsername(req.body.username)})
  if (!checkValUsername(req?.body?.username) || !req?.body?.password || req?.body?.password?.length < 4) {
    return res.status(422).send(handlerResERROR({
      message: "Validation of the registration form failed !",
      code: "E_VALIDATION"
    }));
  }
  return next()
}

const changePassword = async function (req, res, next) {
  try {
    // await validation.changePasswordSchema.validateAsync(req.body);
    if (!req?.body?.password) return res.status(422).send(handlerResERROR({
      message: "Validation of the Change password form failed !",
      code: "E_VALIDATION"
    }));
    next();
  } catch (error) {
    return res.status(422).send(handlerResERROR({
      message: "Validation of the Change password form failed !",
      code: "E_VALIDATION"
    }));
  }
}

const forgetPassword = async function (req, res, next) {
  try {
    // await validation.forgetPasswordSchema.validateAsync(req.body);
    return next();
  } catch (error) {
    return res.status(422).send(handlerResERROR({
      message: "Validation of the Forget password failed!",
      code: "E_VALIDATION"
    }));
  }
}

module.exports = {
  login,
  authSocial,
  register,
  changePassword,
  forgetPassword,
}
