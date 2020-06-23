const mongoose = require("mongoose");

const levelSchema = new mongoose.Schema({
    nameLevel: String,
    maps: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "map"
        }
    ]
});


module.exports = mongoose.model("levels", levelSchema);