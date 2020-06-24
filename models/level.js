const mongoose = require("mongoose");

const levelSchema = new mongoose.Schema({
    nameLevel: String,
    maps: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "lesson"
        }
    ]
});


module.exports = mongoose.model("levels", levelSchema);