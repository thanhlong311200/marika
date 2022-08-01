const Dietary = require('../models/Dietary.model');
const {handlerResERROR, handlerResSUCCESS, stringToInt} = require("../utils");

const aggDietary = [
  {$match: {}},
]

const create = async (req, res) => {
  try {
    const data = new Dietary({...req.body})
    await data.save();
    return res.status(200).send(handlerResSUCCESS({data}));
  } catch (e) {
    console.log(e);
    return res.status(400).send(handlerResERROR({message: "Upload Dietary Fail !", code: "E_REQUEST"}));
  }
}

const change = async (req, res) => {
  try {
    req.body.updatedAt = new Date()
    const data = await Dietary.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if (!data) return res.status(400).send(handlerResERROR({message: "Dietary not found", code: "E_REQUEST"}));
    return res.status(200).send(handlerResSUCCESS({data}));
  } catch (e) {
    console.log(e);
    return res.status(400).send(handlerResERROR({message: "Change Dietary Fail !", code: "E_REQUEST"}));
  }
}

const fetch = async (req, res) => {
  try {
    const data = await Dietary.findById(req.params.id);
    if (!data) return res.status(200).send(handlerResSUCCESS({data: {}, message: " Dietary not found"}))
    return res.status(200).send(handlerResSUCCESS({data}))
  } catch (e) {
    res.status(400).send(handlerResERROR({message: "Dietary not found", code: "E_REQUEST"}))
  }
}

const fetchList = async (req, res) => {
  try {
    const query = [...aggDietary];
    query[0].$match = {}
    if (req.query.name) query[0].$match.name = new RegExp('.*' + req.query.name + '.*', 'gi');

    if (req.query.itemsPerPage) {
      const pageNumber = (typeof req.query?.pageNumber === 'string') ? stringToInt(req.query?.pageNumber) : req.query?.pageNumber || 0;
      const itemsPerPage = (typeof req.query?.itemsPerPage === 'string') ? stringToInt(req.query?.itemsPerPage) : req.query?.itemsPerPage;
      const skip = itemsPerPage * pageNumber;
      query.push({$facet: {data: [{$skip: skip}, {$limit: itemsPerPage}]}})
    }
    let data = await Dietary.aggregate(query)
    if (req.query.itemsPerPage) {
      query.splice(query.length-1, 1);
      data = data[0].data
    }
    if (data.length === 0) return res.status(200).send(handlerResSUCCESS({data: {}, message: " Dietary not found"}))
    let totalItems = await Dietary.aggregate([query[0]]).count("totalItems");
    totalItems = totalItems.length > 0 ? totalItems[0].totalItems : 0;
    return res.status(200).send(handlerResSUCCESS({data, totalItems}))
  } catch (e) {
    res.status(400).send(handlerResERROR({message: " Dietary not found", code: "E_REQUEST"}))
  }
}

const deleteDietary = async (req, res) => {
  try {
    const {id} = req.params
    const data = await Dietary.findByIdAndDelete(id);
    if (!data) return res.status(400).send(handlerResERROR({message: " Dietary not found", code: "E_REQUEST"}))
    return res.status(200).send(handlerResSUCCESS())
  } catch (e) {
    return res.status(400).send(handlerResERROR({message: "Delete Dietary fail!", code: "E_REQUEST"}))
  }
}

module.exports = {
  create,
  change,
  fetch,
  deleteDietary,
  fetchList,
}
