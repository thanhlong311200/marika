const axios = require("axios");
const System = require("../models/System.model");
const {handlerResSUCCESS} = require("../utils");

const configMailChimp = async (req, res, next) => {
  try {
    const {apiKey, dc, version = '3.0', listId, tags} = req.body;
    const apiUri = `https://${dc}.api.mailchimp.com/${version}`;

    const response = await axios.get(`${apiUri}/lists`, {headers: {Authorization: `Bearer ${apiKey}`}});
    let {id} = response.data.lists[0];
    if(listId) id = listId;

    let mailchimp = {...req.body, apiUri};
    mailchimp.listId = id;
    mailchimp.lists = response.data.lists;
    mailchimp.tags = tags;
    if(!tags) {
      const {data} = await axios.get(`${apiUri}/lists/${id}/tag-search`, {headers: {Authorization: `Bearer ${apiKey}`}});
      mailchimp.tags = data.tags;
    }

    mailchimp = JSON.stringify(mailchimp);

    let configMailChimp = await System.findOneAndUpdate({field: 'mailChimp'}, {value: mailchimp, updatedAt: new Date()}, {new: true});
    if(!configMailChimp) {
      configMailChimp = new System({field: 'mailChimp', value: mailchimp});
      await configMailChimp.save();
    }

    return res.send(handlerResSUCCESS({data: configMailChimp}));
  } catch (e) {
    return res.status(400).send(e);
  }
}

module.exports = {
  configMailChimp,
}
