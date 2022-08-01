const {handlerResERROR, handlerResSUCCESS, stringToInt} = require("../utils");
const System = require("../models/System.model");

const create = async (req, res) => {
  try {
    const data = new System({...req.body})
    await data.save();
    return res.status(200).send(handlerResSUCCESS({data}));
  } catch (e) {
    console.log(e);
    return res.status(400).send(handlerResERROR({message:"Upload System Fail !", code: "E_REQUEST"}));
  }
}

const change = async (req, res) => {
  try {
    req.body.updatedAt = new Date()
    const data = await System.findOneAndUpdate({field: req.params.field}, {value: req.body.value}, {new: true});
    if (!data) return res.status(400).send(handlerResERROR({message:"System not found", code: "E_REQUEST"}));
    return res.status(200).send(handlerResSUCCESS({data}));
  } catch (e) {
    console.log(e);
    return res.status(400).send(handlerResERROR({message: "Change System Fail !", code: "E_REQUEST"}));
  }
}

const fetch = async (req, res) => {
  try {
    const data = await System.findOne({field: req.params.field});
    if(!data) return res.status(200).send(handlerResSUCCESS({data: {}, message: "System not found"}))
    return res.status(200).send(handlerResSUCCESS({data}))
  } catch (e) {
    res.status(400).send(handlerResERROR({message: "System not found", code: "E_REQUEST"}))
  }
}

const fetchList = async (req, res) => {
  try {
    const query = [{$match: {}}]
    if (req.query.field) {
      query[0].$match.field = new RegExp('.*' + req.query.field + '.*', 'gi');
    }
    if (req.query.itemsPerPage) {
      const pageNumber = (typeof req.query?.pageNumber === 'string') ? stringToInt(req.query?.pageNumber) : req.query?.pageNumber || 0;
      const itemsPerPage = (typeof req.query?.itemsPerPage === 'string') ? stringToInt(req.query?.itemsPerPage) : req.query?.itemsPerPage;
      let skip = itemsPerPage * pageNumber;
      query.push({$facet: {data: [{$skip: skip}, {$limit: itemsPerPage}]}})
    }
    let data = await System.aggregate(query)
    if(data.length === 0) return res.status(200).send(handlerResSUCCESS({data: [], message: "System not found"}))
    if(req.query.itemsPerPage) {
      query.splice(query.length-1, 1);
      data = data[0].data;
    }
    let totalItems = await System.aggregate(query).count("totalItems");
    totalItems = totalItems.length > 0 ? totalItems[0].totalItems : 0;
    return res.status(200).send(handlerResSUCCESS({data, totalItems}))
  } catch (e) {
    res.status(400).send(handlerResERROR({message: "System not found", code: "E_REQUEST"}))
  }
}

const deleteSystem = async (req, res) => {
  try {
    const {field} = req.params
    const data = await System.findOneAndDelete(field);
    if(!data) return res.status(400).send(handlerResERROR({message:"System not found", code: "E_REQUEST"}))
    return res.status(200).send(handlerResSUCCESS())
  }catch (e) {
    return res.status(400).send(handlerResERROR({message:"Delete System fail!", code: "E_REQUEST"}))
  }
}

module.exports = {
  create,
  change,
  fetch,
  deleteSystem,
  fetchList,
}
