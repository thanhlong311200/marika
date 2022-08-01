'use strict';
const Admin = require('../models/UserLogin.model');
const {hashPass, checkPass} = require('../utils/Password');
const {handlerResERROR, handlerResSUCCESS} = require("../utils");

const changePassword = async (req, res) => {
  try {
    const id = req.uid;
    let {password, newPassword} = req.body;
    const userT = await Admin.findOne({"_id": id});
    const hashPassword = await hashPass(newPassword);
    const check = await checkPass(password, userT.password);
    if (!check) return res.status(400).send(handlerResERROR({message: "Change password Fail !", code: "E_REQUEST"}));
    await Admin.updateOne({_id: id}, {
      $set:
        {password: hashPassword}
    });
    return res.send("Change password ok !");
  } catch (error) {
    return res.status(400).send(handlerResERROR({message: "Change password Fail !", code: "E_REQUEST"}));
  }
};

const changeInfo = async (req, res) => {
  try {
    const id = req.uid;
    const user = req.body;
    await Admin.findOneAndUpdate({"_id": id}, {
      "avatar": user.avatar,
      "fullname": user.fullname,
      "phone": user.phone,
      "address": user.address
    }, {new: true, select: '-password'}, function (err, data) {
      if (err) return res.status(400).send(handlerResERROR({message: "Change info fail !", code: "ERROR"}));
      return res.status(200).send(handlerResSUCCESS({data}));
    });
  } catch (error) {
    res.status(400).send(handlerResERROR({message: "Change info fail !", code: "ERROR"}));
  }
};

const deleteByID = async (req, res) => {
  try {
    const data = await Admin.findByIdAndRemove({_id: req.body.id}).select('-password');
    if (!data) res.status(400).send(handlerResERROR({message: "Delete fail !", code: "E_ERROR"}));
    return res.status(200).send(data);
  } catch (error) {
    res.status(400).send(handlerResERROR({message: "Delete fail !", code: "E_ERROR"}));
  }
};

const getUsers = (req, res) => {
  return res.status(200).send(handlerResSUCCESS({data: [], message: 'Testing....'}))
}

const getLogs = (req, res) => {
  return res.status(200).send(handlerResSUCCESS({data: [], message: 'Testing....'}))
}

const getUserById = (req, res) => {
  return res.status(200).send(handlerResSUCCESS({data: [], message: 'Testing....'}))
}

module.exports = {
  changePassword,
  changeInfo,
  deleteByID,
  // deleteByUsername,
  getUsers,
  getUserById,
  getLogs
}

