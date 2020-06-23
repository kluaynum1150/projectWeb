const express = require('express'),
      router = express.Router(),
      passport = require('passport'),
      user = require("../models/user"),
      lesson = require("../models/lesson"),
      levels = require("../models/level"),
      ques = require("../models/quesion"),
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
    levels.findOne({nameLevel: req.body.level}, function(err,found){
        if(err){
            console.log(err);
            res.redirect("/admin");
        } else{
            lesson.create(n_Lesson, function(err,newLesson){
                if(err){
                    console.log(err);
                    res.redirect("/admin");
                } else{
                    found.maps.push(newLesson);
                    found.save();
                    req.flash("success","Add a new lesson success.");
                    res.redirect("/admin/"+newLesson._id+"/addQuesions");
                }
            });
        }
    });
});

//add Quesion 
router.get("/:Lesson_id/addQuesions", middleware.isLoggedInAdmin, function(req,res){
    res.render("adminPage/addQuesion",{info_id:req.params.Lesson_id});
});

router.post("/:Lesson_id/addQuesions", middleware.isLoggedInAdmin, function(req,res){
    var idMap = req.body.idMap;
    var numQues = req.body.numQues;
    var info = req.body;
    lesson.findById(idMap, async function(err,found){
        if(err){
            console.log(err);
            res.redirect("/admin");
        } else{
            for(var i = 1;i<=numQues;i++){
                let n_ques = {
                    idMap: idMap,
                    level: found.level,
                    value: i,
                    quesion: info['q'+i],
                    choice: {
                        one: info['q'+i+'c1'],
                        two: info['q'+i+'c2'],
                        three: info['q'+i+'c3'],
                        four: info['q'+i+'c4']
                    },
                    answer: info['aq'+i]
                };
                await ques.create(n_ques, async function(err,added){
                    if(err){
                        console.log(err);
                        res.redirect("/admin");
                    }
                });
            };
            req.flash("success","Add a new quesios success.");
            res.redirect("/admin");
        }
    });
});

//เพิ่มข้อสอบใหม่อีกที
router.get("/addNewQuesion", middleware.isLoggedInAdmin, function(req,res){
    lesson.find({}, function(err,found){
        if(err){
            console.log(err);
            res.redirect("/admin");
        } else{
            res.render("adminPage/chooseLesson2",{allLesson:found});
        }
    });
});

router.get("/addNewQuesion/:Lesson_id", middleware.isLoggedInAdmin, function(req,res){
    ques.find({idMap: req.params.Lesson_id}, function(err,allQues){
        if(err){
            console.log(err);
            res.redirect("/admin");
        } else{
            let n = 1;
            let maxValue = 0;
            var emp;
            allQues.forEach(function(allQues){
                emp = allQues.value * n;
                if(emp > maxValue){
                    maxValue = emp;
                }
            });
            res.render("adminPage/addNewQuesion",{Lesson_id: req.params.Lesson_id, maxValue: maxValue});
        }
    });
});

router.post("/addNewQuesion/:Lesson_id", middleware.isLoggedInAdmin, function(req,res){
    lesson.findById(req.params.Lesson_id, function(err,found){
        if(err){
            console.log(err);
            res.redirect("/admin");
        } else{
            let value = (req.body.maxValue * 1) + 1;
            let n_ques = {
                idMap: found._id,
                level: found.level,
                value: value,
                quesion: req.body.Quesion,
                choice: {
                    one: req.body.c1,
                    two: req.body.c2,
                    three: req.body.c3,
                    four: req.body.c4
                },
                answer: req.body.a
            };
            ques.create(n_ques, function(err){
                if(err){
                    console.log(err);
                    res.redirect("/admin");
                } else{
                    req.flash("success","Add a new quesios success.");
                    res.redirect("/admin/addNewQuesion/"+req.params.Lesson_id);
                }
            });
        }
    });
});

//find all lesson
router.get("/editOrDeleteLesson", middleware.isLoggedInAdmin, function(req,res){
    lesson.find({},function(err,found){
        if(err){
            console.log(err);
        } else{
            res.render("adminPage/chooseLesson",{allLesson:found});
        }
    });
});

//edit lesson
router.get("/editLesson/:Lesson_id", middleware.isLoggedInAdmin, function(req,res){
    lesson.findById(req.params.Lesson_id, function(err,foundLesson){
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
    lesson.findByIdAndUpdate(req.params.Lesson_id, n_info, function(err,updated){
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
    lesson.findByIdAndRemove(req.params.Lesson_id, function(err,lessonDelete){
        if(err){
            console.log(err);
            res.redirect("/admin");
        } else{
            levels.findOne({nameLevel: lessonDelete.level}, function(err,found){
                if(err){
                    console.log(err);
                    res.redirect("/admin");
                } else{
                    found.maps.splice(found.maps.indexOf(lessonDelete._id),1);
                    found.save();
                }
            });
            ques.find({idMap:lessonDelete._id}, function(err,allQues){
                if(err){
                    console.log(err);
                    res.redirect("/admin");
                } else{
                    allQues.forEach(function(allQues){
                        allQues.deleteOne(function(err){
                            if(err){ console.log(err); }
                        });
                    });
                }
            });
            req.flash("success","Delete a lesson success.");
            res.redirect("/admin/editOrDeleteLesson");
        }
    });
});

//edit quesions
router.get("/editLesson/:lesson_id/editOrDeleteQuesions", middleware.isLoggedInAdmin, function(req,res){
    ques.find({idMap: req.params.lesson_id}, function(err,found){
        if(err){
            console.log(err);
            res.redirect("/admin");
        } else{
            res.render("adminPage/editQuesion",{allQues: found,lesson_id: req.params.lesson_id});
        }
    });
});

router.put("/editLesson/:lesson_id/editOrDeleteQuesions/:ques_id", middleware.isLoggedInAdmin, function(req,res){
    let n_ques = {
        quesion: req.body.Quesion,
        choice: {
            one: req.body.c1,
            two: req.body.c2,
            three: req.body.c3,
            four: req.body.c4,
        },
        answer: req.body.a
    };
    ques.findByIdAndUpdate(req.params.ques_id, n_ques, function(err){
        if(err){
            console.log(err);
            res.redirect("/admin");
        } else{
            req.flash("success","Edit a quesion success.");
            res.redirect("/admin/editLesson/"+req.params.lesson_id+"/editOrDeleteQuesions");
        }
    });
});

//delete quesions
router.delete("/editLesson/:lesson_id/editOrDeleteQuesions/:ques_id", middleware.isLoggedInAdmin, function(req,res){
    ques.findByIdAndRemove(req.params.ques_id, function(err){
        if(err){
            console.log(err);
            res.redirect("/admin");
        } else{
            req.flash("success","Delete a quesion success.");
            res.redirect("/admin/editLesson/"+req.params.lesson_id+"/editOrDeleteQuesions");
        }
    });
});

module.exports = router;