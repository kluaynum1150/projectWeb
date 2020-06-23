const express = require('express'),
      router = express.Router(),
      passport = require('passport'),
      user = require('../models/user');

router.get("/", function(req, res){
    res.render("landing");
});

router.post('/', passport.authenticate('local',{
    //successRedirect: '/TTE',
    failureFlash: "Incorrect username or password. Try again.",
    failureRedirect: '/'
}),function(req, res){
    if(req.user.tag == "user"){
        res.redirect("/TTE");
    } else {
        req.logOut();
        req.flash('error','Incorrect username or password. Try again.');
        res.redirect("/");
    }
});

router.get("/aboutus", function(req, res){
    res.render("aboutus");
});

router.get("/explore", function(req, res){
    res.render("explore");
});
    
router.get("/logout", function(req, res){
    req.logout();
    req.flash('success','You log out successfully.');
    res.redirect("/");
});
    
router.get("/signup", function(req, res){
    res.render("signup");
});

router.post('/signup', function(req,res){
    if(req.body.password == req.body.Cpassword){
        user.register(new user({username: req.body.username, firstname: req.body.firstName, lastname: req.body.lastName, tag: "user", map: "1", imgProfile: "usericon-001.png", status: "beginner1"}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash('error','This username is already taken.');
            res.redirect("/signup");
        }
        passport.authenticate('local')(req,res,function(){
            res.redirect('/TTE');
        });
    });
    } else {
        req.flash('error',"Password and Confirm password isn't match.");
        res.redirect("/signup");
    }
});

module.exports = router;