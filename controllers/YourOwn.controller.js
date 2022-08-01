const YourOwn = require("../models/YourOwn.model");
const {handlerResSUCCESS, handlerResERROR, stringToInt} = require("../utils");

const createYourOwn = async (req, res) => {
  try {
    const userId = req.uid;
    // console.log(req.body)
    const {food = '', hub = '', mind = '', stress = ''} = req.body;
    const newData = new YourOwn({food, hub, mind, stress, userId});
    await newData.save();
    return res.status(200).send(handlerResSUCCESS({data: newData}));
  } catch (e) {
    return res.status(400).send(handlerResERROR({
      message: "Create Fail !", code: "E_REQUEST",
    }));
  }
};

const updateYourOwn = async (req, res) => {
  try {
    const userId = req.uid;
    const {id} = req.params;
    req.body.updatedAt = new Date()
    const data = await YourOwn.findOneAndUpdate({_id: id, userId: userId}, {
      $set: req?.body
    })
    if (data) return res.status(200).send(handlerResSUCCESS({data: {...data?._doc, ...req?.body}}))
    return res.status(200).send(handlerResSUCCESS({message: "Nothing update, check your YourOwn ID !"}));
  } catch (e) {
    return res.status(400).send(handlerResERROR({message: "Update survey error!", code: "E_REQUEST"}));
  }
};

const deleteById = async (req, res) => {
  try {
    const userId = req.uid;
    const {id} = req.params;
    if (!id) return res.status(404).send(handlerResERROR({message: "Not found !", code: "E_REQUEST"}));
    const data = await YourOwn.deleteOne({_id: id, userId: userId});
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

const getYourOwns = async (req, res) => {
  try {
    const userId = req.uid;
    if (req.query.itemsPerPage) {
      const pageNumber = (typeof req.query?.pageNumber === 'string') ? stringToInt(req.query?.pageNumber) : req.query?.pageNumber || 0;
      const itemsPerPage = (typeof req.query?.itemsPerPage === 'string') ? stringToInt(req.query?.itemsPerPage) : req.query?.itemsPerPage;
      let data
      const regex = new RegExp('.*' + req.query.filter + '.*', 'gi');
      if (req.query.options === 'food') data = await YourOwn.find({
        userId: userId,
        food: regex
      }).limit(itemsPerPage).skip(itemsPerPage * pageNumber)
      else if (req.query.options === 'hub') data = await YourOwn.find({
        userId: userId,
        hub: regex
      }).limit(itemsPerPage).skip(itemsPerPage * pageNumber)
      else if (req.query.options === 'mind') data = await YourOwn.find({
        userId: userId,
        mind: regex
      }).limit(itemsPerPage).skip(itemsPerPage * pageNumber)
      else if (req.query.options === 'stress') data = await YourOwn.find({
        userId: userId,
        stress: regex
      }).limit(itemsPerPage).skip(itemsPerPage * pageNumber)
      else data = await YourOwn.find({userId: userId}).limit(itemsPerPage).skip(itemsPerPage * pageNumber)
      if (!data) return res.status(200).send(handlerResSUCCESS({data: [], message: "Not found"}))
      const totalItems = await YourOwn.countDocuments()
      return res.status(200).send(handlerResSUCCESS({data, totalItems}))
    }
    const data = await YourOwn.find({userId});
    res.status(200).send({data: data});
  } catch (e) {
    return res.status(404).send(handlerResERROR({message: "Not found !", code: "E_REQUEST"}));
  }
};

const getById = async (req, res) => {
  try {
    const userId = req.uid;
    const {id} = req.params;
    if (!id) return res.status(404).send(handlerResERROR({message: "Not found !", code: "E_REQUEST"}));
    const data = await YourOwn.findOne({_id: id, userId: userId});
    if(!data) return res.status(404).send(handlerResERROR({message: "Not found !", code: "E_REQUEST"}));
    return res.status(200).send({data: data});
  } catch (e) {
    return res.status(404).send(handlerResERROR({message: "Not found !", code: "E_REQUEST"}));
  }
};

module.exports = {
  createYourOwn, updateYourOwn, deleteById, getYourOwns, getById,
};
