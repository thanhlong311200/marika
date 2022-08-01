const { handlerResERROR } = require("../utils");
const {body, validationResult} = require("express-validator");

const checkDoSurvey = async (req, res, next) => {
  const userId = req.uid;
  const { surveyId, email = null, result = [] } = req.body;

  if (!surveyId && !result.length)
    return res.status(422).send(
      handlerResERROR({
        message: "surveyId or result not found!",
        code: "E_VALIDATION",
      })
    );

  if (!userId && !email) {
    return res.status(422).send(
      handlerResERROR({
        message: "Bear token or email not found!",
        code: "E_VALIDATION",
      })
    );
  }

  if(email){
    await body('email', "email is not correct !").isEmail().notEmpty().run(req)
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();

    return res.status(422).json(handlerResERROR({
        message: "Validation data !",
        data: errors.array().map(value => ({'field': value.param, 'message': value.msg}))
      },
    ));
  }

  for (const { questionId, answer = "" } of result) {
    if (!questionId || !answer.length)
      return res.status(422).send(
        handlerResERROR({
          message: "Question or answer not found!",
          code: "E_VALIDATION",
        })
      );
  }
  next();
};

const checkDoSurveyVerify = (req, res, next) => {
  const errors = {
    surveyId: "surveyId not found!",
    email: "Email not found!",
    otp: "Otp not found!",
  }
  for (const iterator of Object.keys(errors)) {
    if (!req.body[iterator]) {
      return res.status(422).send(
        handlerResERROR({
          message: errors[iterator],
          code: "E_VALIDATION",
        })
      );
    }
  }
  next();
};

module.exports = {
  checkDoSurvey,
  checkDoSurveyVerify,
};
