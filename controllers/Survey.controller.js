const Survey = require("../models/Surveys.model");
const {handlerResSUCCESS, handlerResERROR, stringToInt} = require("../utils");
const UsersInfo = require("../models/UsersInfo.model");
const System = require("../models/System.model");
const MealPlan = require("../models/MealPlan.model");
const Dietary = require("../models/Dietary.model");

const create = async (req, res) => {
  try {
    const survey = new Survey({
      userId: req.uid,
      ...req.body,
    });
    await survey.save();
    let systemSurvey = await handleSystemSurvey();
    survey.questions.push(...systemSurvey);
    return res.status(200).send(handlerResSUCCESS({data: survey}));
  } catch (e) {
    return res.status(400).send(
      handlerResERROR({
        message: `Create Survey Fail ${e?.message}`,
        code: "E_REQUEST",
      })
    );
  }
};

const update = async (req, res) => {
  try {
    const {id} = req.params;
    req.body.updatedAt = new Date()
    const data = await Survey.findByIdAndUpdate(id, req.body, {new: true});
    let systemSurvey = await handleSystemSurvey();
    data.questions.push(...systemSurvey);
    if (data) return res.status(200).send(handlerResSUCCESS({data}))
    return res.status(400).send(
      handlerResERROR({message: "Nothing update, check your survey ID !", code: "E_REQUEST"})
    );
  } catch (e) {
    return res.status(400).send(
      handlerResERROR({message: "Update survey error!", code: "E_REQUEST"})
    );
  }
};

const deleteById = async (req, res) => {
  try {
    const {id} = req.params;
    if (!id)
      return res
        .status(404)
        .send(handlerResERROR({message: "Not found !", code: "E_REQUEST"}));
    const data = await Survey.deleteOne({_id: id,});
    if (data?.deletedCount === 0) return res.status(404).send(handlerResERROR({
      message: "Not found !",
      code: "E_REQUEST"
    }));
    return res.status(200).send(handlerResSUCCESS({data}));
  } catch (e) {
    return res
      .status(404)
      .send(handlerResERROR({message: "Not found !", code: "E_REQUEST"}));
  }
};

const fetch = async (req, res) => {
  try {
    const aggregate = [
      {$match: {}},
      {$project: {__v: 0}},
      {$sort: {"createdAt": -1}}
    ]

    if(req.roles === 'member') {
      const user = await UsersInfo.findById(req.uid);
      aggregate.push({
        $lookup: {
          from: 'surveyanswers',
          localField: '_id',
          foreignField: 'surveyId',
          as: 'answer',
          pipeline: [{$project: {_id: 0, surveyId: 0, result: 0, date: 0, __v: 0}},],
        }
      });
      aggregate.push({
        "$addFields": {"answer": {"$arrayElemAt": [{
          "$filter": {
            "input": "$answer",
            "as": "comp",
            "cond": {"$eq": [ "$$comp.email", user._doc.email ]}
          }}, 0]}},
      });
    }

    const {status, name} = req.query;
    if (status && stringToInt(status) !== false) aggregate[0].$match.status = stringToInt(status);
    if (name) aggregate[0].$match.name = new RegExp('.*' + name + '.*', 'gi');
    if (req.query.itemsPerPage) {
      const pageNumber = (typeof req.query?.pageNumber === 'string') ? stringToInt(req.query?.pageNumber) : req.query?.pageNumber || 0;
      const itemsPerPage = (typeof req.query?.itemsPerPage === 'string') ? stringToInt(req.query?.itemsPerPage) : req.query?.itemsPerPage;
      let skip = itemsPerPage * pageNumber;
      aggregate.push({$facet: {data: [{$skip: skip}, {$limit: itemsPerPage}]}})
    }
    let data = await Survey.aggregate(aggregate);

    let systemSurvey = await handleSystemSurvey();
    if (req.query.itemsPerPage) {
      aggregate.splice(aggregate.length-1, 1);
      data = data[0].data;
    }
    data = data.map(item=>{
      item.questions = item.questions.map((s,i)=>{
        s.sortOrder = i+1
        return s
      })
      return item
    })
    if(data.length === 0) return res.status(200).send(handlerResSUCCESS({data: [], message: "Survey not found"}))
    data.forEach(value => value.questions.push(...systemSurvey));
    data = data.map(item=>{
      item.questions = item.questions.sort((a,b)=>{
        return a.sortOrder - b.sortOrder;
      })
      return item
    })
    let totalItems = await Survey.aggregate(aggregate).count("totalItems");
    totalItems = totalItems.length > 0 ? totalItems[0].totalItems : 0;
    return res.status(200).send(handlerResSUCCESS({data, totalItems}))
  } catch (e) {
    return res
      .status(404)
      .send(handlerResERROR({message: "Not found !", code: "E_REQUEST"}));
  }
};

const fetchById = async (req, res) => {
  try {
    const {id} = req.params;
    if (!id)
      return res.status(404).send(handlerResERROR({message: "Not found !", code: "E_REQUEST"}));
    const data = await Survey.findOne({_id: id});
    let systemSurvey = await handleSystemSurvey();
    data.questions.push(...systemSurvey);
    return res.status(200).send({data: data});
  } catch (e) {
    return res.status(404).send(handlerResERROR({message: "Not found !", code: "E_REQUEST"}));
  }
};

const handleSystemSurvey = async () => {
  let system = await System.find({$or: [{field: 'survey_meal_plan'}, {field: 'survey_dietary'},]});

  let queryMealPlan = [{$match: {}}];
  queryMealPlan.push({$group: {_id: { "name": "$name","description": "$description"}}})
  queryMealPlan.push({$sort: {"_id": 1}})
  let dataMealPlan = await MealPlan.aggregate(queryMealPlan);
  const dataDietary = await Dietary.find().sort({"name": "descending"});
  const data = [];
console.log(dataMealPlan)
  for (let val of system){
    const item = {numberOfAnswers: 1, _id: val.id,sortOrder:val.sortOrder??5};
    if(val.field === "survey_meal_plan"){
      item.question = val.value;
      item.options = dataMealPlan.map(mealPlan => mealPlan._id.description);
      item.type = "survey_meal_plan"
      data.push(item)
    }
    if(val.field === "survey_dietary"){
      item.question = val.value;
      item.options = dataDietary.map(dietary => dietary.description);
      item.type = "survey_dietary"
      item.sortOrder = 1
      data.push(item)
    }
  }

  if(data.length === 2) return data

  const idxMealPlan = data.findIndex(val => val.field === "survey_meal_plan");
  if(idxMealPlan === -1) {
    const newSystem = new System({
      field: "survey_meal_plan",
      value: "Please select meal plan"
    })
    await newSystem.save();
    const item = {numberOfAnswers: 1, _id: newSystem._id, sortOrder:newSystem.sortOrder??5};
    item.question = newSystem.value;
    item.options = dataMealPlan.map(mealPlan => mealPlan._id.description);
    item.type = "survey_meal_plan"
    data.push(item)
  }

  const idxDietary = data.findIndex(val => val.field === "survey_dietary");
  if(idxDietary === -1) {
    const newSystem = new System({
      field: "survey_dietary",
      value: "Please select dietary"
    })
    await newSystem.save();
    const item = {numberOfAnswers: 1, _id: newSystem._id, sortOrder:newSystem.sortOrder??2};
    item.question = newSystem.value;
    item.options = dataDietary.map(dietary => dietary.description);
    item.type = "survey_dietary"
    data.push(item)
  }

  return data
}

// const getQAInfo = async (surveyId = '') => {
//   const questions = await Questions.find({surveyId})
//   await Promise.all(questions.map(async (q, index) => {
//     questions[index].answers = await Answers.find({questionId: q?._id})
//   }))
//   return questions
// }
//
// const fetchReport = async (req, res) => {
//   try {
//     const userId = req.uid;
//     const {surveyId} = req.params;
//     const data = await SurveyAnswer.findOne({surveyId, userId});
//     data.questions = await getQAInfo(surveyId)
//     return res.status(200).send({data: data});
//   } catch (e) {
//     return res
//       .status(400)
//       .send(handlerResERROR({message: "Fetch error !", code: "E_REQUEST"}));
//   }
// };

module.exports = {
  create,
  update,
  deleteById,
  fetch,
  fetchById,
  // fetchReport,
};
