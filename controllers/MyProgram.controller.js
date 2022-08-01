const MyProgram = require('../models/MyProgram.model');
const {handlerResERROR, handlerResSUCCESS, stringToInt} = require("../utils");

const create = async (req, res) => {
  try {
    const data = new MyProgram({...req.body})
    await data.save();
    return res.status(200).send(handlerResSUCCESS({data}));
  } catch (e) {
    console.log(e);
    return res.status(400).send(handlerResERROR({message:"Upload My Program Fail !", code: "E_REQUEST"}));
  }
}

const change = async (req, res) => {
  try {
    req.body.updatedAt = new Date()
    const data = await MyProgram.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if (!data) return res.status(400).send(handlerResERROR({message:"My Program not found", code: "E_REQUEST"}));
    return res.status(200).send(handlerResSUCCESS({data}));
  } catch (e) {
    console.log(e);
    return res.status(400).send(handlerResERROR({message: "Change My Program Fail !", code: "E_REQUEST"}));
  }
}

const fetch = async (req, res) => {
  try {
    const data = await MyProgram.findById(req.params.id);
    if(!data) return res.status(200).send(handlerResSUCCESS({data: {}, message: "My Program not found"}))
    return res.status(200).send(handlerResSUCCESS({data}))
  } catch (e) {
    res.status(400).send(handlerResERROR({message: "My Program not found", code: "E_REQUEST"}))
  }
}

const fetchList = async (req, res) => {
  try {
    const query = MyProgram.find()
    if (req.query.name) {
      const regex = new RegExp('.*' + req.query.name + '.*', 'gi');
      query.where({name: regex})
    }
    if (req.query.itemsPerPage) {
      const pageNumber = (typeof req.query?.pageNumber === 'string') ? stringToInt(req.query?.pageNumber) : req.query?.pageNumber || 0;
      const itemsPerPage = (typeof req.query?.itemsPerPage === 'string') ? stringToInt(req.query?.itemsPerPage) : req.query?.itemsPerPage;
      query.limit(itemsPerPage).skip(itemsPerPage * pageNumber)
      const data = await query.exec()
      if (!data) return res.status(200).send(handlerResSUCCESS({data: []}))
      const totalItems = await MyProgram.countDocuments()
      return res.status(200).send(handlerResSUCCESS({data, totalItems}))
    }
    const data = await query.exec()
    if(!data) return res.status(200).send(handlerResSUCCESS({data: {}, message: "My Program not found"}))
    const totalItems = await MyProgram.countDocuments()
    return res.status(200).send(handlerResSUCCESS({data, totalItems}))
  } catch (e) {
    res.status(400).send(handlerResERROR({message: "My Program not found", code: "E_REQUEST"}))
  }
}

const deleteMyProgram = async (req, res) => {
  try {
    const {id} = req.params
    const data = await MyProgram.findByIdAndDelete(id);
    if(!data) return res.status(400).send(handlerResERROR({message:"My Program not found", code: "E_REQUEST"}))
    return res.status(200).send(handlerResSUCCESS())
  } catch (e) {
    return res.status(400).send(handlerResERROR({message:"Delete My Program fail!", code: "E_REQUEST"}))
  }
}

module.exports = {
  create,
  change,
  fetch,
  deleteMyProgram,
  fetchList,
}
