const TrackTopic = require("../models/TrackingTopic.model");
const TrackingAnswers = require("../models/TrackingAnswers.model");
const {handlerResSUCCESS, handlerResERROR, stringToInt} = require("../utils");
const moment = require("moment");

const createTrackTopic = async (req, res) => {
  try {
    const {name = '', type = '', question = '', description = ''} = req.body;
    let options = req.body.options || []
    if (type === 'input') options = []
    else if (typeof options === 'string') options = options?.split(',') || []
    let countIndex = req.body.index || null
    if(!countIndex)
      countIndex = await TrackTopic.count({}) || 0;
    const newTrack = new TrackTopic({index: countIndex + 1, name, type, question, description, options});
    await newTrack.save();
    return res.status(200).send(handlerResSUCCESS({data: newTrack}));
  } catch (e) {
    console.log(e?.message)
    return res.status(400).send(handlerResERROR({
      message: "Create Fail !" + e?.message || '', code: "E_REQUEST",
    }));
  }
};

const updateTrackTopic = async (req, res) => {
  try {
    const {id} = req.params;
    req.body.updatedAt = new Date()
    const data = await TrackTopic.findOneAndUpdate({_id: id}, {
      $set: req?.body
    }, {new: true})
    if (data) return res.status(200).send(handlerResSUCCESS({data: data}))
    return res.status(200).send(handlerResSUCCESS({message: "Nothing update, check your TrackTopic ID !"}));
  } catch (e) {
    console.log(e)
    return res.status(400).send(handlerResERROR({message: "Update survey error!", code: "E_REQUEST"}));
  }
};

const deleteById = async (req, res) => {
  try {
    const userId = req.uid;
    const {id} = req.params;
    if (!id) return res.status(404).send(handlerResERROR({message: "Not found !", code: "E_REQUEST"}));
    const data = await TrackTopic.deleteOne({_id: id});
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

const getAnswer = (topicId, answers) => {
  return answers.find(e => topicId?.equals(e?.topicId)) || null
}

const getTrackTopic = async (req, res) => {
  try {
    let data
    if (req.query?.answerToday && req.query?.answerToday !== 'false') {
      // console.log("USER GET TOPIC TODAY")
      const dataTopic = await TrackTopic.find()
      const answers = await TrackingAnswers.find({
        userId: req.uid,
        date: {$gte: new Date(moment().format('YYYY-MM-DDT00:00:00Z'))}
      });
      // console.log({answers})
      data = dataTopic.map(top => ({
        ...top?._doc,
        answer: getAnswer(top._id, answers)
      }))
    }else if (req.roles === 'admin'){
      // console.log("ADMIN GET TOPIC")
      const aggregate = [
        {$match: {}},
        {$project: {__v: 0}},
        {$sort: {"createdAt": -1}}
      ]
      if (req.query.itemsPerPage) {
        const pageNumber = (typeof req.query?.pageNumber === 'string') ? stringToInt(req.query?.pageNumber) : req.query?.pageNumber || 0;
        const itemsPerPage = (typeof req.query?.itemsPerPage === 'string') ? stringToInt(req.query?.itemsPerPage) : req.query?.itemsPerPage;
        let skip = itemsPerPage * pageNumber;
        aggregate.push({$facet: {data: [{$skip: skip}, {$limit: itemsPerPage}]}})
      }
      if(req.query.name){
        // aggregate[0].$match.email = new RegExp('.*' + req.query.email + '.*', 'gi');
        aggregate[0].$match.name = new RegExp('.*' + req.query.name + '.*', 'gi');
      }
      let data = await TrackTopic.aggregate(aggregate)
      if (req.query.itemsPerPage) {
        aggregate.splice(aggregate.length-1, 1);
        data = data[0].data;
      }
      if(!data?.length) return res.status(200).send(handlerResSUCCESS({data: [], message: "Not found"}))
      let totalItems = await TrackTopic.aggregate(aggregate).count("totalItems");
      totalItems = totalItems?.length > 0 ? totalItems[0]?.totalItems : 0;
      return res.status(200).send(handlerResSUCCESS({data, totalItems}))
    }else {
      // console.log("USER GET TOPIC ALL")
      data = await TrackTopic.find()
    }
    return res.status(200).send({data: data, totalItems: data?.length});
  } catch (e) {
    console.log(e)
    return res.status(404).send(handlerResERROR({message: "Not found !", code: "E_REQUEST"}));
  }
};

const getTrackTopicById = async (req, res) => {
  try {
    const userId = req.uid;
    const {id} = req.params;
    if (!id) return res.status(404).send(handlerResERROR({message: "Not found !", code: "E_REQUEST"}));
    const data = await TrackTopic.findOne({_id: id, userId: userId});
    return res.status(200).send({data: data});
  } catch (e) {
    return res.status(404).send(handlerResERROR({message: "Not found !", code: "E_REQUEST"}));
  }
};

const createTrackAnswer = async (req, res) => {
  try {
    const userId = req.uid;
    let {topicId, answer, date = new Date()} = req.body;
    const checkTopic = await TrackTopic.findOne({_id: topicId})
    if (typeof answer === 'string') answer = stringToInt(answer) || 0
    // console.log(typeof answer, answer)
    if (!checkTopic || answer <= 0 || (checkTopic?.type === 'radio' && answer > checkTopic?.options?.length))
      return res.status(400).send(handlerResERROR({
        message: "Answer not match with question Track Topic !", code: "E_REQUEST",
      }));
    const formatDate = new Date(date);
    const isUpdate = await TrackingAnswers.findOne({userId, topicId, date: {$eq: formatDate}});
    let data;
    if (!isUpdate) {
      data = new TrackingAnswers({topicId, answer, userId, date});
      await data.save();
    } else {
      // data = await TrackingAnswers.findOneAndUpdate({userId, topicId, date: {$eq: formatDate}}, req.body, {new: true})
      data = await TrackingAnswers.findByIdAndUpdate({_id: isUpdate._id, userId: userId}, {$set: req.body}, {new: true})
    }
    return res.status(200).send(handlerResSUCCESS({data}));
  } catch (e) {
    return res.status(400).send(handlerResERROR({
      message: "Create Fail !", code: "E_REQUEST",
    }));
  }
};

const updateTrackAnswer = async (req, res) => {
  try {
    const userId = req.uid;
    const {id} = req.params;
    req.body.updatedAt = new Date()
    let {answer} = req.body;
    const trackAnswer = await TrackingAnswers.findOne({_id: id})
    if (typeof answer === 'string') answer = stringToInt(answer) || 0
    const checkTopic = await TrackTopic.findOne({_id: trackAnswer.topicId})
    if (!checkTopic || answer <= 0 || (checkTopic?.type === 'radio' && answer > checkTopic?.options?.length)) return res.status(400).send(handlerResERROR({
      message: "Answer not match with question Track Topic !", code: "E_REQUEST",
    }));
    const data = await TrackingAnswers.findOneAndUpdate({_id: id, userId: userId}, {
      $set: {answer}
    })
    if (data) return res.status(200).send(handlerResSUCCESS({data: {...data?._doc, answer}}))
    return res.status(200).send(handlerResSUCCESS({message: "Nothing update, check your TrackTopic ID !"}));
  } catch (e) {
    return res.status(400).send(handlerResERROR({message: "Update survey error!", code: "E_REQUEST"}));
  }
};

const deleteAnswerById = async (req, res) => {
  try {
    const userId = req.uid;
    const {id} = req.params;
    if (!id) return res.status(404).send(handlerResERROR({message: "Not found !", code: "E_REQUEST"}));
    const data = await TrackingAnswers.deleteOne({_id: id, userId: userId});
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

const getTrackAnswers = async (req, res) => {
  try {
    console.log(req.query)
    const userId = req.uid;
    let query = [{$match: {userId}},]
    if (req.roles === 'admin') {
      query = [{$match: {}}]
      if (req.query.userId)
        query[0].$match.userId = req.query.userId
    }
    query.push({$addFields: {"userId": {"$toObjectId": "$userId"}}})
    query.push({
      $lookup: {
        from: "profiles",
        localField: "userId",
        foreignField: "_id",
        as: "profile",
        pipeline: [{$project: {__v: 0}}],
      }
    })
    query.push({$addFields: {"profile": {$arrayElemAt: ["$profile", 0]}}},)
    if (req.query.start && req.query.end) {
      query[0].$match.date = {
        $gte: new Date(moment(req.query.start).format()),
        $lte: new Date(moment(req.query.end).format()),
      }
    } else if (req.query.start) {
      query[0].$match.date = {
        $gte: new Date(moment(req.query.start).format()),
      }
    } else if (req.query.end) {
      query[0].$match.date = {
        $lte: new Date(moment(req.query.end).format()),
      }
    }

    if (req.query.topicId) query[0].$match.topicId = req.query.topicId;
    if (req.query.answer) {
      if (typeof req.query.answer === 'string') req.query.answer = parseInt(req.query.answer);
      query[0].$match.answer = req.query.answer;
    }
    if (req.query.itemsPerPage) {
      const pageNumber = (typeof req.query?.pageNumber === 'string') ? stringToInt(req.query?.pageNumber) : req.query?.pageNumber || 0;
      const itemsPerPage = (typeof req.query?.itemsPerPage === 'string') ? stringToInt(req.query?.itemsPerPage) : req.query?.itemsPerPage;
      const skip = itemsPerPage * pageNumber;
      query.push({$facet: {data: [{$skip: skip}, {$limit: itemsPerPage}]}})
    }
    let data = await TrackingAnswers.aggregate(query);
    if (req.query.itemsPerPage) {
      query.splice(query.length - 1, 1);
      data = data[0].data;
    }
    if (data.length === 0) return res.status(200).send(handlerResSUCCESS({
      data: [],
      message: "Track answers not found"
    }))
    let totalItems = await TrackingAnswers.aggregate([query[0]]).count("totalItems");
    totalItems = totalItems.length > 0 ? totalItems[0].totalItems : 0;
    return res.status(200).send(handlerResSUCCESS({data, totalItems}))
  } catch (e) {
    return res.status(404).send(handlerResERROR({message: "Not found !", code: "E_REQUEST"}));
  }
};

const getTrackAnswerById = async (req, res) => {
  try {
    const userId = req.uid;
    const {id} = req.params;
    if (!id) return res.status(404).send(handlerResERROR({message: "Not found !", code: "E_REQUEST"}));
    const data = await TrackingAnswers.findOne({_id: id, userId: userId});
    return res.status(200).send({data: data});
  } catch (e) {
    return res.status(404).send(handlerResERROR({message: "Not found !", code: "E_REQUEST"}));
  }
};

const aggReportTrackingAnswers = [
  {$match: {}},
  {$addFields: {"id": {$toString: "$_id"}}},
  {
    $lookup: {
      from: 'trackinganswers',
      localField: 'id',
      foreignField: 'topicId',
      as: 'dataAnswers',
      pipeline: [{$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },
  {$unwind: {path: "$dataAnswers"}},
  {$match: {}},
  {
    $group:
      {
        _id: {_id: "$_id", answer: "$dataAnswers.answer"},
        id: {$first: "$_id"},
        type: {$first: "$type"},
        question: {$first: "$question"},
        options: {$first: "$options"},
        answer: {$first: "$dataAnswers.answer"},
        count: {$sum: 1},
        updatedAt: {$first: "$updatedAt"},
        createdAt: {$first: "$createdAt"},
      }
  },
  {
    $group:
      {
        _id: "$id",
        type: {$first: "$type"},
        question: {$first: "$question"},
        options: {$first: "$options"},
        answers: {
          $push: {
            answer: "$answer",
            count: "$count",
          }
        },
        total: {$sum: "$count"},
        updatedAt: {$first: "$updatedAt"},
        createdAt: {$first: "$createdAt"},
      }
  },
  {$sort: {"createdAt": -1}},
]

const reportTrackingAnswers = async (req, res, next) => {
  try {
    const {start, end} = req.query
    const query = [...aggReportTrackingAnswers];
    if (start && end) query[4].$match['dataAnswers.date'] = {
      $gte: new Date(start),
      $lte: new Date(end),
    }
    const result = await TrackTopic.aggregate(query)
    return res.send(handlerResSUCCESS({data: result}));
  } catch (e) {
    console.log(e)
    return res.status(400).send(handlerResERROR({message: "Report tracking answer fail !", code: "E_REQUEST"}));
  }
}

module.exports = {
  createTrackTopic,
  updateTrackTopic,
  deleteById,
  getTrackTopic,
  getTrackTopicById,
  reportTrackingAnswers,
  createTrackAnswer,
  updateTrackAnswer,
  deleteAnswerById,
  getTrackAnswers,
  getTrackAnswerById,
};
