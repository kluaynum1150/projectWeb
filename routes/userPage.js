const express = require('express'),
      router = express.Router(),
      passport = require('passport'),
      multer = require("multer"),
      path = require("path"),
      fs = require("fs"),
      user = require("../models/user"),
      middleware = require("../middleware");

router.get("/", middleware.isLoggedIn, function(req, res){
    res.render("userPage/index");
});

//ไปหน้าบทเรียน
// router.get("/:lesson_id", middleware.isLoggedIn, function(req,res){
//     map.findById(req.params.lesson_id, function(err,found){
//         if(err){
//             console.log(err);
//             res.redirect("/TTE");
//         } else{
//             res.render("userPage/showMap",{info_lesson:found});
//         }
//     });
// });

module.exports = router;