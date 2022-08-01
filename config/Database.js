const mongoose = require("mongoose");
const ENV = require('../utils/Env');
const System = require("../models/System.model");
const MembershipType = require("../models/MembershipType.model");


const mongoConnect = async () => {
  try {
    const uri = ENV.get("DATABASE_URI", '');

    await mongoose.connect(uri);

    // install data default
    const data = [
      {
        connection: System,
        field: 'redirect_uri',
        value: 'https://marikaday.com',
      },
      {
        connection: System,
        field: 'survey_meal_plan',
        value: 'Please select meal plan',
      },
      {
        connection: System,
        field: 'survey_dietary',
        value: 'Please select dietary',
      },
      {
        connection: MembershipType,
        name: 'Foundation',
        description: '',
      },
      {
        connection: MembershipType,
        name: 'Standard',
        description: '',
      },
    ];

    await Promise.all(data.map(async ({connection, ...arg}) => {
      let keys = Object.keys(arg)
      const field = keys[0];
      const data = await connection.findOne({[field]: arg[field]});
      if(data) return null
      const newData = new connection({...arg});
      return newData.save();
    }))
  } catch (err) {
    await mongoose.disconnect();
    throw err;
  }
};

module.exports = mongoConnect;
