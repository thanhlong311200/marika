const {handlerResERROR, handlerResSUCCESS, stringToInt} = require("../utils");
const RecipesTags = require("../models/RecipesTags.model");

const create = async (req, res) => {
  try {
    const data = new RecipesTags({...req.body})
    await data.save();
    return res.status(200).send(handlerResSUCCESS({data}));
  } catch (e) {
    console.log(e);
    return res.status(400).send(handlerResERROR({message:"Upload Recipes Tags Fail !", code: "E_REQUEST"}));
  }
}

const change = async (req, res) => {
  try {
    req.body.updatedAt = new Date()
    const data = await RecipesTags.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if (!data) return res.status(400).send(handlerResERROR({message:"Recipes Tags not found", code: "E_REQUEST"}));
    return res.status(200).send(handlerResSUCCESS({data}));
  } catch (e) {
    console.log(e);
    return res.status(400).send(handlerResERROR({message: "Change Recipes Tags Fail !", code: "E_REQUEST"}));
  }
}

const fetch = async (req, res) => {
  try {
    const data = await RecipesTags.findById(req.params.id);
    if(!data) return res.status(200).send(handlerResSUCCESS({data: {}, message: "Recipes Tags not found"}))
    return res.status(200).send(handlerResSUCCESS({data}))
  } catch (e) {
    res.status(400).send(handlerResERROR({message: "Recipes Tags not found", code: "E_REQUEST"}))
  }
}

const fetchList = async (req, res) => {
  try {
    const query = [{$match: {}}]
    if (req.query.name) {
      query[0].$match.name = new RegExp('.*' + req.query.name + '.*', 'gi');
    }
    if (req.query.itemsPerPage) {
      const pageNumber = (typeof req.query?.pageNumber === 'string') ? stringToInt(req.query?.pageNumber) : req.query?.pageNumber || 0;
      const itemsPerPage = (typeof req.query?.itemsPerPage === 'string') ? stringToInt(req.query?.itemsPerPage) : req.query?.itemsPerPage;
      let skip = itemsPerPage * pageNumber;
      query.push({$facet: {data: [{$skip: skip}, {$limit: itemsPerPage}]}})
    }
    let data = await RecipesTags.aggregate(query)
    if(data.length === 0) return res.status(200).send(handlerResSUCCESS({data: {}, message: "Recipes Tags not found"}))
    if(req.query.itemsPerPage) {
      query.splice(query.length-1, 1);
      data = data[0].data;
    }
    let totalItems = await RecipesTags.aggregate([query[0]]).count("totalItems");
    totalItems = totalItems.length > 0 ? totalItems[0].totalItems : 0;
    return res.status(200).send(handlerResSUCCESS({data, totalItems}))
  } catch (e) {
    res.status(400).send(handlerResERROR({message: "Recipes Tags not found", code: "E_REQUEST"}))
  }
}

const deleteRecipesTags = async (req, res) => {
  try {
    const {id} = req.params
    const data = await RecipesTags.findByIdAndDelete(id);
    if(!data) return res.status(400).send(handlerResERROR({message:"Recipes Tags not found", code: "E_REQUEST"}))
    return res.status(200).send(handlerResSUCCESS())
  }catch (e) {
    return res.status(400).send(handlerResERROR({message:"Delete Recipes Tags fail!", code: "E_REQUEST"}))
  }
}

module.exports = {
  create,
  change,
  fetch,
  deleteRecipesTags,
  fetchList,
}
