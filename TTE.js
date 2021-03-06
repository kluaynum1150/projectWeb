const express = require("express"),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      flash = require('connect-flash'),
      passport = require('passport'),
      passportLocal = require('passport-local'),
      passportLocalMongoose = require('passport-local-mongoose'),
      methodOverride = require("method-override"),
      user = require('./models/user'),
      levels = require('./models/level'),
      indexRoutes = require('./routes/index'),
      tteRoutes = require('./routes/userPage'),
      tteProflieRoutes = require('./routes/userPofile'),
      adminRoutes = require('./routes/adminPage'),
      config = require("./config/db");

const app = express();

mongoose.set("useUnifiedTopology",true);
mongoose.set("useCreateIndex",true);
mongoose.set("useFindAndModify",false);
mongoose
    .connect(config.database, {useNewUrlParser: true})
    .then(() => {
        console.log("Database is connected");
    })
    .catch(err => {
        console.log({ database_error: err });
    });
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());
app.use(methodOverride("_method"));

app.use(require("express-session")({
    secret: 'tte',
    resave: false,
    saveUninitialized: false
})
);

// เพิ่มรหัสของ admin
// user.register(new user({username: "admin", firstname: "admin", lastname: "admin", tag: "admin"}), "admin", function(err, user){
//     if(err){
//         console.log(err);
//     }
// });
// เพิ่มเลเวล
// levels.create({nameLevel: "beginner1"}, function(err){
//     if(err){
//         console.log(err);
//     }
// });
// levels.create({nameLevel: "beginner2"}, function(err){
//     if(err){
//         console.log(err);
//     }
// });
// levels.create({nameLevel: "beginner3"}, function(err){
//     if(err){
//         console.log(err);
//     }
// });

app.use(passport.initialize());
app.use(passport.session());
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

passport.use(new passportLocal(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use("/",indexRoutes);
app.use("/TTE",tteRoutes);
app.use("/TTE/profile",tteProflieRoutes);
app.use("/admin",adminRoutes);

app.listen(3000,function(){
    console.log('Server is started');
});