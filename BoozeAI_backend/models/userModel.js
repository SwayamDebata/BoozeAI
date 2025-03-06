const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: [true, "Please add the name"]
    },
    email: {
        type: String, 
        required: [true, "Please add the email"],
        unique: true
    },
    picture: String,
    favourite: [{ type: mongoose.Schema.Types.ObjectId, ref: "Drink" }]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
