const Campaign = require('../models/Campaign.model');
const MemberShip = require('../models/MemberShip.model');
const {handlerResERROR, handlerResSUCCESS, stringToInt} = require("../utils");

const checkMembershipExist = async (ids = []) => {
  return new Promise(async (resolve, reject) => {
    try {
      for (let i = 0; i < ids.length; i++) {
        if(!ids[i]) return reject()
        const data = await MemberShip.findById(ids[i])
        if(!data) return reject()
      }
      return resolve()
    }catch (e) {
      return reject()
    }
  })
}

const createCampaign = async (req, res) => {
  try {
    if(req.body.idsMembership)
      await checkMembershipExist(req.body.idsMembership)
    const data = new Campaign({...req.body})
    await data.save();
    return res.status(200).send(handlerResSUCCESS({data}));
  } catch (e) {
    console.log(e);
    return res.status(400).send(handlerResERROR({message: "Create Campaign Fail !", code: "E_REQUEST"}));
  }
}

const updateCampaign = async (req, res) => {
  try {
    if(req.body.idsMembership)
      await checkMembershipExist(req.body.idsMembership)
    req.body.updatedAt = new Date()
    const campaign = await Campaign.findById(req.params.id)
    if (!campaign) return res.status(404).send(handlerResERROR({
      message: "Campaign not found",
      code: "E_REQUEST"
    }));
    const data = await Campaign.findByIdAndUpdate({_id: req.params.id}, req.body, {new: true});
    if (!data)
      return res.status(400).send(handlerResERROR({message: "Campaign not found", code: "E_REQUEST"}));
    return res.status(200).send(handlerResSUCCESS({data}));
  } catch (e) {
    if(!e)
      return res.status(400).send(handlerResERROR({message: "Check !", code: "E_REQUEST"}));
    return res.status(400).send(handlerResERROR({message: "Change Campaign Fail !", code: "E_REQUEST"}));
  }
}

const deleteCampaign = async (req, res) => {
  try {
    const {id} = req.params
    const data = await Campaign.findById(id);
    if (!data) return res.status(400).send(handlerResERROR({message: "Campaign not found", code: "E_REQUEST"}))
    await Campaign.findOneAndRemove({_id: id})
    return res.status(200).send(handlerResSUCCESS({data: "Delete Campaign successful !"}))
  } catch (e) {
    console.log(e)
    return res.status(400).send(handlerResERROR({message: "Delete Campaign fail!", code: "E_REQUEST"}))
  }
}

const fetchById = async (req, res) => {
  try {
    const data = await Campaign.findOne({"_id": req.params.id});
    if (!data)
      return res.status(200).send(handlerResSUCCESS({data: {}, message: "Campaign not found"}))
    return res.status(200).send(handlerResSUCCESS({data}))
  } catch (e) {
    res.status(400).send(handlerResERROR({message: "Campaign not found", code: "E_REQUEST"}))
  }
}

const fetchList = async (req, res) => {
  try {
    let data
    if (req.query.itemsPerPage) {
      const pageNumber = (typeof req.query?.pageNumber === 'string') ? stringToInt(req.query?.pageNumber) : req.query?.pageNumber || 0;
      const itemsPerPage = (typeof req.query?.itemsPerPage === 'string') ? stringToInt(req.query?.itemsPerPage) : req.query?.itemsPerPage;
      const skip = itemsPerPage * pageNumber;
      data = await Campaign.find().limit(itemsPerPage).skip(skip);
    }else{
      data = await Campaign.find()
    }
    // console.log({data});
    if (!data)
      return res.status(200).send(handlerResSUCCESS({data: {}, message: "Campaign not found"}))
    return res.status(200).send(handlerResSUCCESS({data, totalItems: data?.length || 0}))
  } catch (e) {
    console.log(e);
    res.status(400).send(handlerResERROR({message: "Campaign not found", code: "E_REQUEST"}))
  }
}

module.exports = {
  createCampaign,
  updateCampaign,
  fetchList,
  fetchById,
  deleteCampaign,
}
