const   mongoose = require('mongoose'),
        passportLocalMongoose = require('passport-local-mongoose');

let UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstname: String,
    lastname: String,
    tag: String,
    status: String,
    imgProfile: String,
    exp: String,
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', UserSchema);