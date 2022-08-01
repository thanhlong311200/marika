const Membership = require('../models/MemberShip.model');
const {handlerResERROR, handlerResSUCCESS, stringToInt} = require("../utils");
const MembershipType = require("../models/MembershipType.model");
const Campaign = require("../models/Campaign.model");
const moment = require("moment");
const stripe = require('stripe')(process.env.LIVE_MODE_API_KEY);

const aggMembership = [
  {$match: {}},
  {$addFields: {"id": {$toString: "$_id"}}},
  {
    $lookup: {
      from: 'payments',
      localField: 'id',
      foreignField: 'membershipId',
      as: 'payments',
      pipeline: [{$project: {__v: 0, createdAt: 0, updatedAt: 0,}}],
    }
  },
  {$unwind: {path: "$payments", preserveNullAndEmptyArrays: true}},
  // {$match: {'payments.status': "succeeded"}},
  {
    $group:
      {
        _id: {_id: "$_id", userId: "$payments.userId"},
        id: {$first: "$_id"},
        type: {$first: "$type"},
        time: {$first: "$time"},
        productId: {$first: "$productId"},
        proPriceId: {$first: "$proPriceId"},
        price: {$first: "$price"},
        name: {$first: "$name"},
        amountOfSaving: {$first: "$amountOfSaving"},
        description: {$first: "$description"},
        typeMembershipId: {$first: "$typeMembershipId"},
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
        time: {$first: "$time"},
        productId: {$first: "$productId"},
        proPriceId: {$first: "$proPriceId"},
        price: {$first: "$price"},
        amountOfSaving: {$first: "$amountOfSaving"},
        typeMembershipId: {$first: "$typeMembershipId"},
        name: {$first: "$name"},
        description: {$first: "$description"},
        user: {
          $push: {
            userId: "$_id.userId",
            count: "$count",
          }
        },
        count: {$sum: 1},
        updatedAt: {$first: "$updatedAt"},
        createdAt: {$first: "$createdAt"},
      }
  },
  {$sort: {"createdAt": -1}},
]

const create = async (req, res) => {
  try {
    const product = await stripe.products.create({
      name: req.body.name,
    });
    const price = await stripe.prices.create({
      unit_amount: req.body.price * 100,
      currency: 'aud',
      recurring: {interval: req.body.type, interval_count: req.body.time},
      product: product.id,
    });
    req.body.productId = product.id
    req.body.proPriceId = price.id
    const data = new Membership({...req.body})
    await data.save();
    return res.status(200).send(handlerResSUCCESS({data}));
  } catch (e) {
    console.log(e);
    return res.status(400).send(handlerResERROR({message: "Create Membership Fail !", code: "E_REQUEST"}));
  }
}

const change = async (req, res) => {
  try {
    req.body.updatedAt = new Date()
    const memberShip = await Membership.findById(req.params.id)
    if (!memberShip) if (!data) return res.status(404).send(handlerResERROR({
      message: "Membership not found",
      code: "E_REQUEST"
    }));
    if (req.body.name) {
      await stripe.products.update(
        memberShip.productId,
        {name: req.body.name}
      );
    }
    // let priceUpdate = {}
    // if (req.body.price)
    //   priceUpdate.unit_amount = req.body.price * 100
    // if (req.body.type || req.body.time) {
    //   priceUpdate.recurring = {
    //     interval: req.body.type ? req.body.type : memberShip.type,
    //     interval_count: req.body.time ? req.body.time : memberShip.time
    //   }
    // }
    // if (req.body.price || req.body.type || req.body.time) {
    //   await stripe.prices.update(
    //     memberShip.proPriceId,
    //     priceUpdate
    //   );
    // }
    // console.log(req.params.id, req.body);
    const data = await Membership.findByIdAndUpdate({_id: req.params.id}, req.body, {new: true});
    if (!data) return res.status(400).send(handlerResERROR({message: "Membership not found", code: "E_REQUEST"}));
    return res.status(200).send(handlerResSUCCESS({data}));
  } catch (e) {
    console.log(e);
    return res.status(400).send(handlerResERROR({message: "Change Membership Fail !", code: "E_REQUEST"}));
  }
}

const fetch = async (req, res) => {
  try {
    const data = await Membership.findOne({"_id": req.params.id});
    if (!data) return res.status(200).send(handlerResSUCCESS({data: {}, message: "Membership not found"}))
    return res.status(200).send(handlerResSUCCESS({data}))
  } catch (e) {
    res.status(400).send(handlerResERROR({message: "Membership not found", code: "E_REQUEST"}))
  }
}
const getDataFoundation = async (isFoundation = false) => {
  try {
    const data = await Membership.find()
    const dataMembershipFoundation = await Promise.all(data.map(
      async doc => {
        const typeMembership = await MembershipType.findOne({_id: doc?.typeMembershipId})
        const camps = (await Campaign.find({
          idsMembership: doc._id.toString()
        }).select(['-idsMembership', '-createdAt', '-updatedAt', '-__v'])) || []
        let dataCam
        if (isFoundation)
          dataCam = camps.filter(cam => moment().isBetween(cam.start, cam.end)) || []
        else
          dataCam = camps.filter(cam => cam && !cam.start || !cam.end || !moment().isBetween(cam.start, cam.end))
        // console.log({isFoundation, dataCam, camps})
        if (!dataCam?.length && isFoundation)
          return null
        if (camps?.length !== dataCam?.length && !isFoundation)
          return null
        return {
          ...doc._doc,
          typeName: typeMembership?.name || '',
          campaigns: dataCam
        }
      }))
    return dataMembershipFoundation.filter(x => x) || []
  } catch (e) {
    return []
  }
}

const getTypeName = async (memberships) => {
  return Promise.all([...memberships].map(
    async doc => {
      // console.log(typeof doc, doc.name)
      const typeMembership = await MembershipType.findOne({_id: doc?.typeMembershipId})
      if (doc._doc) return {
        ...doc._doc,
        typeName: typeMembership?.name || '',
      }
      return {
        ...doc,
        typeName: typeMembership?.name || '',
      }
    }))
}

const fetchList = async (req, res) => {
  try {
    if (!req.roles) {
      const data = await getDataFoundation(true)
      return res.status(200).send(handlerResSUCCESS({data, totalItems: data?.length}))
    }
    if (req.roles !== 'admin') {
      let data
      if (req.query.isFoundation)
        data = await getDataFoundation(req.query.isFoundation === "true")
      else {
        const members = await Membership.find();
        data = await getTypeName(members)
      }
      return res.status(200).send(handlerResSUCCESS({data, totalItems: data?.length}))
    }
    if (req.query.isFoundation) {
      const data = await getDataFoundation(req.query.isFoundation === "true")
      return res.status(200).send(handlerResSUCCESS({data, totalItems: data?.length}))
    }
    const query = [...aggMembership];
    query[0].$match = {}
    if (req.query.name)
      query[0].$match.name = new RegExp('.*' + req.query.name + '.*', 'gi');
    if (req.query.type)
      query[0].$match.type = new RegExp('.*' + req.query.type + '.*', 'gi');
    if (req.query.typeMembershipId)
      query[0].$match.typeMembershipId = req.query.typeMembershipId;

    if (req.query.itemsPerPage) {
      const pageNumber = (typeof req.query?.pageNumber === 'string') ? stringToInt(req.query?.pageNumber) : req.query?.pageNumber || 0;
      const itemsPerPage = (typeof req.query?.itemsPerPage === 'string') ? stringToInt(req.query?.itemsPerPage) : req.query?.itemsPerPage;
      const skip = itemsPerPage * pageNumber;
      query.push({$facet: {data: [{$skip: skip}, {$limit: itemsPerPage}]}})
    }
    let data = await Membership.aggregate(query);
    if (req.query.itemsPerPage) {
      query.splice(query.length - 1, 1);
      data = data[0].data;
    }
    data = await getTypeName([...data])
    if (!data?.length) return res.status(200).send(handlerResSUCCESS({message: "Membership not found"}))
    for (let value of data) {
      const users = value.user.filter(u => !u.userId);
      if (users.length > 0) users.forEach(val => {
        value.count = value.count - val.count
      })
    }
    let totalItems = await Membership.aggregate(query).count("totalItems");
    totalItems = totalItems?.length > 0 ? totalItems[0]?.totalItems : 0;
    return res.status(200).send(handlerResSUCCESS({data, totalItems}))
  } catch (e) {
    console.log(e);
    res.status(400).send(handlerResERROR({message: "Membership not found", code: "E_REQUEST"}))
  }
}

const handlerCancelSub = async (priceId) => {
  const subscriptions = await stripe.subscriptions.list();
  const plans = subscriptions.data.map(item => ({priceId: item?.plan?.id, id: item.id}))
  const subsCancel = plans.filter(pl => pl.priceId === priceId);
  // console.log({subsCancel})
  return Promise.all(subsCancel.map(async sub => {
    await stripe.subscriptions.del(
      sub.id
    );
  }))
}

const deleteMembership = async (req, res) => {
  try {
    const {id} = req.params
    const data = await Membership.findById(id);
    if (!data) return res.status(400).send(handlerResERROR({message: "Membership not found", code: "E_REQUEST"}))

    await handlerCancelSub(data.proPriceId)
    const deleted = await stripe.plans.del(
      data.proPriceId
    );
    deleted.id = id;
    await Membership.findOneAndRemove({_id: id})
    return res.status(200).send(handlerResSUCCESS({data: deleted}))
  } catch (e) {
    console.log(e)
    return res.status(400).send(handlerResERROR({message: "Delete Membership fail!", code: "E_REQUEST"}))
  }
}

module.exports = {
  create,
  change,
  fetch,
  deleteMembership,
  fetchList,
}
