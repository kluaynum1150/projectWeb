const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
    name: String,
    level: String,
    information: String,
});

module.exports = mongoose.model("lesson", lessonSchema);