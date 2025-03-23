const mongoose = require("mongoose");

const DrinkSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mood: String,
  weather: String,
  ingredients: String,
  instructions: String,
  budget: String,
  suggestion: { 
    type: mongoose.Schema.Types.Mixed,  
    required: true 
  }
});


module.exports = mongoose.model("Drink", DrinkSchema);
