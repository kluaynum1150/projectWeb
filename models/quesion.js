const mongoose = require("mongoose");

const quesionSchema = new mongoose.Schema({
    idMap: String,
    level: String,
    value: String,
    quesion: String,
    choice: {
        one: String,
        two: String,
        three: String,
        four: String
    },
    answer: String
});

module.exports = mongoose.model("ques", quesionSchema);