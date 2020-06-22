const express = require('express'),
      router = express.Router(),
      passport = require('passport'),
      multer = require("multer"),
      path = require("path"),
      fs = require("fs"),
      user = require("../models/user"),
      middleware = require("../middleware");

//ที่เก็บรูป
const storage = multer.diskStorage({
    destination: "./public/uploads",
    filename: function(req, file, cb){
        cb(null,file.fieldname + "-" + req.user.username + "-" + Date.now() + path.extname(file.originalname));
    }
});

//เช็คนามสกุลของรูป
const imageFilter = function(req, file, cb){
    var ext = path.extname(file.originalname);
    if(ext !== ".png" && ext !== ".gif" && ext !== ".jpg" && ext !== ".jpeg"){
        return cb(new Error("Only image is allowed."),false);
    }
    cb(null, true);
}

//เรียกใช้
const upload = multer({storage: storage, fileFilter: imageFilter});

router.get("/", middleware.isLoggedIn, function(req, res){
    res.render("userPage/index");
});

router.get("/profile", middleware.isLoggedIn, function(req, res){
    res.render("userPage/profile");
});

//ไปหน้าบทเรียน
// router.get("/:map_id", middleware.isLoggedIn, function(req,res){
//     map.findById(req.params.map_id, function(err,found){
//         if(err){
//             console.log(err);
//             res.redirect("/TTE");
//         } else{
//             res.render("userPage/showMap",{info_map:found});
//         }
//     });
// });

router.get("/profile/edit", middleware.isLoggedIn, function(req, res){
    user.findById(req.user.id, function(err,foundUser){
        if(err){
            console.log("ERROR!");
        }else{
            res.render("userPage/profileEdit",{infoUser:foundUser});
        }
    });
});

//edit firstname, lastname and image profile.
router.put("/profile/edit", middleware.isLoggedIn, upload.single("imgProfile"), function(req, res){
    let id = req.user.id;
    let n_firstname = req.body.firstName.trim();
    let n_lastname = req.body.lastName.trim();
    if(req.file){
        var n_img = req.file.filename;
        user.findById(id, function(err, foundUser){
            if(err){
                res.redirect("/profile");
            } else{
                if(foundUser.imgProfile !== "usericon-001.png"){
                    const imagePath = "./public/uploads/" + foundUser.imgProfile;
                    fs.unlink(imagePath, function(err){
                        if(err){
                            console.log(err);
                            res.redirect("/profile");
                        }
                    });
                }
            }
        });
        var n_info = {firstname: n_firstname,lastname: n_lastname,imgProfile: n_img};
    } else{
        var n_info = {firstname: n_firstname,lastname: n_lastname};
    }
    user.findByIdAndUpdate(id, n_info, function(err, update){
        if(err){
            console.log(err);
            res.redirect("/TTE/profile");
        } else{
            res.redirect("/TTE/profile");
        }
    });
});
//change password
// router.get("/profile/edit/reset-password", middleware.isLoggedIn, function(req, res){
//     res.render("userPage/resetPassword");
// });

router.post("/profile/edit/reset-password", middleware.isLoggedIn, function(req, res){
    if(req.body.newpassword == req.body.CNpassword){
        user.findById(req.user.id, function(err,foundUser){
            if(err){
                console.log("ERROR!");
            } else{
                foundUser.changePassword(req.body.oldpassword, req.body.newpassword, function(err){
                    if(err){
                        console.log(err);
                        if(err.name === 'IncorrectPasswordError'){
                            req.flash("error","Old password is incorrect.");
                            res.redirect("/TTE/profile");
                        } else{
                            req.flash("error","Something went wrong!! Please try again after sometimes.");
                            res.redirect("/TTE/profile");
                        }
                    } else {
                        req.flash("success","Your password has been changed successfully.");
                        res.redirect("/TTE/profile");
                    }
                });
            }
        });
        
    } else{
        req.flash('error',"Password and Confirm password isn't match.");
        res.redirect("/profile/edit/reset-password");
    }
});

module.exports = router;