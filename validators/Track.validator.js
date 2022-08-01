const {isNumber, isArray} = require("lodash");
const {handlerResERROR} = require("../utils");

const validCreateTrackTopic = (req, res, next) => {
  const {name = '', type = '', question = ''} = req.body;
  if (!name || !type || !question)
    return res.status(422).send(handlerResERROR({
      message: "Validator data!",
      code: "E_VALIDATION"
    }));
  next()
}

const validUpdateTrackTopic = (req, res, next) => {
  const {name = '', type = '', question = '', description = '', options} = req.body;
  if (!name && !type && !description && !question && !options)
    return res.status(422).send(handlerResERROR({
      message: "Validator data!",
      code: "E_VALIDATION"
    }));
  return next()
}

const validCreateTrackAnswer = (req, res, next) => {
  const {topicId, answer} = req.body;
  if (!topicId && !answer)
    return res.status(422).send(handlerResERROR({
      message: "Validator data!",
      code: "E_VALIDATION"
    }));
  next()
}

const validUpdateTrackAnswer = (req, res, next) => {
  const {topicId, answer} = req.body;
  if (!topicId && !answer)
    return res.status(422).send(handlerResERROR({
      message: "Validator data!",
      code: "E_VALIDATION"
    }));
  return next()
}

module.exports = {
  validCreateTrackTopic,
  validUpdateTrackTopic,
  validCreateTrackAnswer,
  validUpdateTrackAnswer
}
