const SurveyAnswer = require("../models/SurveyAnswer.model");
const SurveyAnswerTemp = require("../models/SurveyAnswerTemp.model");
const Surveys = require("../models/Surveys.model");
const UsersInfo = require("../models/UsersInfo.model");
const UserLogin = require("../models/UserLogin.model");
const ENV = require('../utils/Env');
const {
  handlerResSUCCESS,
  handlerResERROR,
  generateOtp,
  createMail, stringToInt, addMemberMailChimp,
} = require("../utils");
const _ = require("lodash");
const transporter = require("../config/SendMail");
const {encryptToken, decryptToken} = require("../utils/Encryption");
const System = require("../models/System.model");
const {SURVEY_COMPLETION} = require("../config/Constant");
const MealPlan = require("../models/MealPlan.model");
const Dietary = require("../models/Dietary.model");
const moment = require("moment");
const MenuFood = require("../models/MenuFood.model");
const {ObjectId} = require("mongodb");

const create = async (req, res) => {
  try {
    const userId = req.uid;
    let user = {};
    if (userId) {
      user = await UserLogin.findById(userId);
    }

    const email = req.body.email ? req.body.email : user.username;
    if (!email)
      return res.status(400).send(handlerResERROR({message: "User have not email !", code: "E_REQUEST",}));

    // validate survey answer
    const survey = await Surveys.findOne({_id: req.body.surveyId});
    if (!survey)
      return res.status(400).send(handlerResERROR({message: "Survey not found !", code: "E_REQUEST",}));

    let system = await System.find({$or: [{field: 'survey_meal_plan'}, {field: 'survey_dietary'},]});
    const systemAnswer = [];
    for (const item of req.body.result) {
      const uniqueAnswer = _.uniq(item.answer);
      const idx = survey.questions.findIndex(value => value._doc._id.toString() === item.questionId);
      if (idx === -1) {
        const idxSys = system.findIndex(val => val._id.toString() === item.questionId);
        if(idxSys === -1)
          return res.status(400).send(handlerResERROR({message: "Question not found !", code: "E_REQUEST",}));
        systemAnswer.push({...system[idxSys]._doc, ...item, answer: item.answer[0]})
        continue;
      }
     
      const invalidAnswer = item.answer.findIndex(answer => answer >= survey.questions[idx]._doc.options.length);
      
      if (!uniqueAnswer || !uniqueAnswer.length)
        return res.status(400).send(handlerResERROR({message: "Answer not found !", code: "E_REQUEST",}));
      if (invalidAnswer > -1)
        return res.status(400).send(handlerResERROR({message: "Invalid answer !", code: "E_REQUEST",}));
    }
   
    if(systemAnswer.length === 2 && userId) await handleMealPlan(systemAnswer, userId);
   
    let queryMealPlan = [{$match: {}}];
    queryMealPlan.push({$group: {_id: { "name": "$name","description": "$description"}}})
    queryMealPlan.push({$sort: {"_id": 1}})
    let dataMealPlan = await MealPlan.aggregate(queryMealPlan);
    const idxMealPlan = systemAnswer.findIndex(value => value.field === 'survey_meal_plan');
    // Save temp survey answer
    if(userId) {
      const existSurvey = await SurveyAnswer.findOne({
        email: email,
        surveyId: req.body.surveyId,
      });
      let surveyAnswer = null;
      

      if (existSurvey) {
        existSurvey.result = req.body.result;
        existSurvey.surveyId = req.body.surveyId;
        existSurvey.isSuccess = true;
        await existSurvey.save();
        surveyAnswer = existSurvey;
      } else {
        surveyAnswer = new SurveyAnswer({
          email: email,
          surveyId: req.body.surveyId,
          result: req.body.result,
          isSuccess: true
        });
        await surveyAnswer.save();
      }

      // Thêm mail chimp
      let mailChimp = await System.findOne({field: 'mailChimp'});
      if(mailChimp) {
        const userInfo = await UsersInfo.findById(userId);
        let fullName = userInfo.name;
        if (fullName) fullName = fullName.split(' ');
        if (!Array.isArray(fullName)) fullName = ['', ''];
        try {
          await addMemberMailChimp(SURVEY_COMPLETION, mailChimp, user.username, fullName[0], fullName[fullName.length - 1]);
        } catch (e) {

        }
      }
      console.log(dataMealPlan)
      surveyAnswer.mealPlan = dataMealPlan[systemAnswer[idxMealPlan].answer]._id.name;
      return res.status(200).send(handlerResSUCCESS({data: surveyAnswer}));
    } else if (req.body.email) {
      const otp = generateOtp(6);
      let existedSurveyAnswerTemp = await SurveyAnswerTemp.findOne({
        email: req.body.email,
        surveyId: req.body.surveyId,
      });

      if (existedSurveyAnswerTemp) {
        existedSurveyAnswerTemp.otpCode = otp;
        existedSurveyAnswerTemp.result = req.body.result;
      } else {
        existedSurveyAnswerTemp = new SurveyAnswerTemp({
          email: req.body.email,
          otpCode: otp,
          surveyId: req.body.surveyId,
          result: req.body.result,
        });
      }

      const activeCode = encryptToken(JSON.stringify({
        otp: otp,
        email: req.body.email,
        surveyId: req.body.surveyId,
      }), false);
      const domain = ENV.get("DOMAIN", "https://apiv2.marika.tobele.com");
      let url = domain + `/survey-answer/verify?code=${activeCode}`

      await existedSurveyAnswerTemp.save();
      const htmlBody =
        "<p><b>Welcome Marikaday</b> </p>" +
        `<p>Here is your account activation code: <b>${otp}</b> <br/></p>` +
        `<p>or click link: <a href="${url}">${domain + "/survey-answer/verify"}</a> <br/></p>`;
      await transporter.sendMail(
        createMail(
          htmlBody,
          req.body.email,
          "Activation code",
          "Activation code"
        )
      );
      return res.status(200).send(
        handlerResSUCCESS({
          message: "Please check your email inbox to get OTP !",
        })
      );
    }
    return res.status(400).send(
      handlerResERROR({message: 'Email not found !', code: "E_REQUEST",})
    );
  } catch (e) {
    return res.status(400).send(
      handlerResERROR({message: JSON.stringify(e), code: "E_REQUEST",})
    );
  }
};

const handleMealPlan = async (system, userId) => {
  try {
    let queryMealPlan = [{$match: {}}];
    queryMealPlan.push({$group: {_id: { "name": "$name","description": "$description"}}})
   queryMealPlan.push({$sort: {"_id": 1}})
    let dataMealPlan = await MealPlan.aggregate(queryMealPlan);
    const idxMealPlan = system.findIndex(value => value.field === 'survey_meal_plan');
    const name = dataMealPlan[system[idxMealPlan].answer]._id.name;

    const dataDietary = await Dietary.find().sort({"name": "descending"});
    const idxDietary = system.findIndex(value => value.field === 'survey_dietary');
    const idDie = dataDietary[system[idxDietary].answer]._id.toString();
    const regex = new RegExp(`^${name}$`, "i");
    const meal = await MealPlan.findOne({name: regex, dietaryId: idDie});
    if (!meal) throw "meal plan not found !";

    const mealPlan = meal.data
    const date = moment(Date.now());
    let i = date.day() - 1;
    if(i < 0) i = 7;

    await MenuFood.remove({userId: ObjectId(userId)});
    let j = 0;

    for (let length = mealPlan.length; i < length; i++) {
      const {menuFood} = mealPlan[i];
      const result = await Promise.all(menuFood.map(id => MenuFood.findById(id.toString())));
      let dayOfWeek = moment(date).add(j,'days').format('YYYY-MM-DD')

      await Promise.all(result.map(val => {
        const menu = new MenuFood({
          mealId: val.mealId,
          recipe: val.recipe || null,
          date: dayOfWeek,
          swap: false,
          userId
        })
        return menu.save();
      }));
      ++j;
    }
    await UsersInfo.findByIdAndUpdate(userId, {mealPlan: name, dietary: idDie});
  } catch (e) {
    throw e
  }
}

const verifyOtp = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;
  const surveyId = req.body.surveyId;

  try {
    const surveyAnswerTemp = await SurveyAnswerTemp.findOne({
      email: email,
      surveyId: surveyId,
    });

    if (!surveyAnswerTemp) {
      return res.status(400).send(
        handlerResERROR({
          message: "Survey answer not found !",
          code: "E_REQUEST",
        })
      );
    }

    if (surveyAnswerTemp.otpCode !== otp) {
      return res.status(400).send(
        handlerResERROR({
          message: `Otp not match !`,
          code: "E_REQUEST",
        })
      );
    }

    const existSurvey = await SurveyAnswer.findOne({
      email: email,
      surveyId: surveyId,
    });

    let surveyAnswer = null;

    if (existSurvey) {
      existSurvey.result = surveyAnswerTemp.result;
      existSurvey.surveyId = req.body.surveyId;
      existSurvey.isSuccess = true;
      await existSurvey.save();
      surveyAnswer = existSurvey;
    } else {
      surveyAnswer = new SurveyAnswer({
        email: email,
        surveyId: req.body.surveyId,
        result: surveyAnswerTemp.result,
        isSuccess: true,
      });
      await surveyAnswer.save();
    }
    await SurveyAnswerTemp.deleteOne({email: email, surveyId: surveyId});

    let mailChimp = await System.findOne({field: 'mailChimp'});
    if(mailChimp) await addMemberMailChimp(SURVEY_COMPLETION, mailChimp, email, '', '');

    return res.status(200).send(
      handlerResSUCCESS({
        message: "Do survey done !",
        data: surveyAnswer,
      })
    );
  } catch (e) {
    return res.status(400).send(
      handlerResERROR({
        message: `Verify error ! ${e?.message}`,
        code: "E_REQUEST",
      })
    );
  }
};

const verifyCode = async (req, res) => {
  const {code} = req.query;
  if (!code) return res.status(400).send(
    handlerResERROR({
      message: `code does not exist. Verify error !`,
      code: "E_REQUEST",
    })
  );

  try {
    let result = decryptToken(code, false)
    result = JSON.parse(result);
    const {otp, email, surveyId} = result

    const surveyAnswerTemp = await SurveyAnswerTemp.findOne({
      email: email,
      surveyId: surveyId,
      otpCode: otp,
    });

    if (!surveyAnswerTemp) {
      return res.status(400).send(
        handlerResERROR({
          message: "Survey answer not found !",
          code: "E_REQUEST",
        })
      );
    }

    const existSurvey = await SurveyAnswer.findOne({
      email: email,
      surveyId: surveyId,
    });

    if (existSurvey) {
      existSurvey.result = surveyAnswerTemp.result;
      existSurvey.surveyId = req.body.surveyId;
      existSurvey.isSuccess = true;
      await existSurvey.save();
    } else {
      const surveyAnswer = new SurveyAnswer({
        email: email,
        surveyId: req.body.surveyId,
        result: surveyAnswerTemp.result,
        isSuccess: true,
      });
      await surveyAnswer.save();
    }
    await SurveyAnswerTemp.deleteOne({email: email, surveyId: surveyId});
    let redirectLink = await getRedirectLink();
    if(!redirectLink) redirectLink = "https://apiv2.marika.tobele.com"
    return res.redirect(redirectLink);
  } catch (e) {
    return res.status(400).send(
      handlerResERROR({
        message: `Verify error ! ${e?.message}`,
        code: "E_REQUEST",
      })
    );
  }
};

const getRedirectLink = () => new Promise(async (resolve) => {
  try {
    const result = await System.findOne({field: 'redirect_uri'});
    return resolve(result.value);
  } catch (e) {
    return resolve(null);
  }
});

const fetchBySurveyID = async (req, res) => {
  try {
    const {surveyId} = req.params;
    const data = await Surveys.find({_id: surveyId});
    return res.status(200).send({data});
  } catch (e) {
    return res.status(400).send(
      handlerResERROR({message: "Fetch survey error!", code: "E_REQUEST"})
    );
  }
};

const fetch = async (req, res) => {
  try {
    const data = await Surveys.find({});
    return res.status(200).send({data});
  } catch (e) {
    return res
      .status(400)
      .send(handlerResERROR({message: "Fetch error !", code: "E_REQUEST"}));
  }
};

const fetchReport = async (req, res) => {
  try {
    const data = await SurveyAnswer.find({});
    let uniqueSurveyIds = [];

    for (const iterator of data) {
      if (!uniqueSurveyIds.includes(iterator.surveyId)) {
        uniqueSurveyIds.push(iterator.surveyId);
      }
    }

    const response = [];
    for (const surveyId of uniqueSurveyIds) {
      const survey = await Surveys.findOne({_id: surveyId});
      const count = await SurveyAnswer.countDocuments({surveyId: surveyId});
      const survey1 = {...survey._doc, count: count};
      response.push(survey1);
    }

    return res.status(200).send({data: response});
  } catch (e) {
    return res
      .status(400)
      .send(handlerResERROR({message: "Fetch error !", code: "E_REQUEST"}));
  }
};

const fetchReportBySurveyAnswerId = async (req, res) => {
  try {
    const {surveyAnswerId} = req.params;
    const data = await SurveyAnswer.findOne({_id: surveyAnswerId});
    let result1 = [];
    for (const item of data._doc.result) {
      let ans = {};
      ans[item.questionId] = item.answer;
      result1.push(ans);
    }
    const res1 = {
      _id: data.id,
      userId: data.userId,
      surveyId: data.surveyId,
      result: result1,
    };
    return res.status(200).send({data: res1});
  } catch (error) {
    return res
      .status(400)
      .send(handlerResERROR({message: `Fetch error ${error?.message}`, code: "E_REQUEST"}));
  }
};

const fetchResult = async (req, res) => {
  try {
    const {surveyAnswerId} = req.params;
    const userInfo = await UsersInfo.findById(req.uid);
    const result = await SurveyAnswer.findOne({email: userInfo.email, surveyId: surveyAnswerId});
    if (!result)
      return res.status(200).send(handlerResSUCCESS({message: "Survey answer don't exist", code: "SUCCESS"}))
    let answers = [];
    for (const item of result._doc.result) {
      let ans = {};
      ans[item.questionId] = item.answer;
      answers.push(ans);
    }
    const data = {
      _id: result.id,
      userId: result.userId,
      surveyId: result.surveyId,
      result: answers,
    };
    return res.status(200).send({data});
  } catch (error) {
    return res
      .status(400)
      .send(handlerResERROR({message: `Fetch error ${error?.message}`, code: "E_REQUEST"}));
  }
};

const fetchSurveyAnswer = async (req, res) => {
  try {
    const arr = [
      {$match: {}},
      {
        $lookup: {
          from: "surveys",
          localField: "surveyId",
          foreignField: "_id",
          as: "survey",
          pipeline: [{$project: {__v: 0}}],
        }
      },
      {$unwind: { path: "$survey"}},
      {$match: {}},
      {$sort: {"createdAt": -1}},
    ]

    const query = [...arr];
    const {name, email} = req.query;
    if(name) query[3].$match = {'survey.name': new RegExp('.*' + name + '.*', 'gi')};
    if(email) query[0].$match = {'email': new RegExp('.*' + email + '.*', 'gi')}
    if (req.query.itemsPerPage) {
      const pageNumber = (typeof req.query?.pageNumber === 'string') ? stringToInt(req.query?.pageNumber) : req.query?.pageNumber || 0;
      const itemsPerPage = (typeof req.query?.itemsPerPage === 'string') ? stringToInt(req.query?.itemsPerPage) : req.query?.itemsPerPage;
      const skip = itemsPerPage * pageNumber;
      query.push({$facet: {data: [{$skip: skip}, {$limit: itemsPerPage}]}})
    }
    let data = await SurveyAnswer.aggregate(query);
    if (req.query.itemsPerPage) {
      query.splice(query.length-1, 1);
      data = data[0].data;
    }
    if (data.length === 0) return res.status(200).send(handlerResSUCCESS({data: [], message: "Survey Answer not found"}));
    let totalItems = await SurveyAnswer.aggregate(query).count("totalItems");
    totalItems = totalItems.length > 0 ? totalItems[0].totalItems : 0;
    return res.status(200).send(handlerResSUCCESS({data, totalItems}));
  } catch (e) {
    console.log(e)
    return res.status(400).send(handlerResERROR({message: "Fetch Survey Answer Error !", code: "E_REQUEST"}));
  }
};

module.exports = {
  create,
  fetchReport,
  fetch,
  fetchBySurveyID,
  fetchResult,
  fetchReportBySurveyAnswerId,
  verifyOtp,
  verifyCode,
  fetchSurveyAnswer
};
