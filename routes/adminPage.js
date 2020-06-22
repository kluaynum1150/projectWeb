const express = require('express'),
      router = express.Router(),
      passport = require('passport'),
      user = require("../models/user"),
      map = require("../models/lesson"),
      middleware = require("../middleware");

router.get("/", middleware.isLoggedInAdmin, function(req, res){
    res.render("adminPage/index");
});

router.get("/login", function(req, res){
    res.render("adminPage/login");
});

router.post('/login', passport.authenticate('local',{
    //successRedirect: '/TTE',
    failureFlash: "Incorrect username or password. Try again.",
    failureRedirect: "/admin/login"
}),function(req, res){
    if(req.user.tag == "admin"){
        res.redirect("/admin");
    } else {
        req.logOut();
        req.flash('error','Incorrect username or password. Try again.');
        res.redirect("/admin/login");
    }
});

//add lesson
router.get("/addLesson", middleware.isLoggedInAdmin, function(req,res){
    res.render("adminPage/addLesson");
});

router.post("/addLesson", middleware.isLoggedInAdmin, function(req,res){
    let n_Lesson = {name: req.body.nameLesson, level: req.body.level, information: req.body.information};
    map.create(n_Lesson, function(err,newLesson){
        if(err){
            console.log(err);
            res.redirect("/admin");
        } else{
            req.flash("success","Add a new lesson success.");
            res.redirect("/admin");
            // res.redirect("/admin/"+newLesson._id+"/addQuesions");
        }
    });
});

//find all lesson
router.get("/editOrDeleteLesson", middleware.isLoggedInAdmin, function(req,res){
    map.find({},function(err,found){
        if(err){
            console.log(err);
        } else{
            res.render("adminPage/chooseLesson",{allLesson:found});
        }
    });
});

//edit lesson
router.get("/editLesson/:Lesson_id", middleware.isLoggedInAdmin, function(req,res){
    map.findById(req.params.Lesson_id, function(err,foundLesson){
        if(err){
            console.log(err);
            res.redirect("/admin/editOrDeleteLesson")
        } else{
            res.render("adminPage/editLesson",{info_Lesson:foundLesson});
        }
    });
});

router.put("/editLesson/:Lesson_id", middleware.isLoggedInAdmin, function(req,res){
    let n_info = {name: req.body.nameLesson, level: req.body.level, information: req.body.information};
    map.findByIdAndUpdate(req.params.Lesson_id, n_info, function(err,updated){
        if(err){
            console.log(err);
            res.redirect("/admin");
        } else{
            req.flash("success","Edit a lesson success.");
            res.redirect("/admin/editOrDeleteLesson");
        }
    });
});

//delete lesson
router.delete("/deleteLesson/:Lesson_id", middleware.isLoggedInAdmin, function(req,res){
    map.findByIdAndRemove(req.params.Lesson_id, function(err){
        if(err){
            console.log(err);
            res.redirect("/admin");
        } else{
            req.flash("success","Delete a lesson success.");
            res.redirect("/admin/editOrDeleteLesson");
        }
    });
});

module.exports = router;