const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const FavoritesSchema = new Schema({
  userId: String,
  type: String, // menu/recipe/media //collection Name
  data: [String], // array ids
  // data: [{
  //   _id: String, 
  //   category: String,}]
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Favorites = mongoose.model("Favorites", FavoritesSchema);
module.exports = Favorites;


//fetch
//Favorites.fetch await
//type == menu => trả luôn await
// type == recipe =>group by category await
// type == media => group by category await