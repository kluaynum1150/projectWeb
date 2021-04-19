const express = require('express'),
      router = express.Router(),
      lesson = require("../models/lesson"),
      ques = require("../models/quesion"),
      levels = require("../models/level"),
      user = require("../models/user"),
      middleware = require("../middleware");

router.get("/showLesson", middleware.isLoggedIn, function(req, res){
    lesson.find({level: req.user.status}, function(err,foundLesson){
        if(err){
            console.log(err);
        } else{
            levels.find({}, function(err,foundLevel){
                if(err){
                    console.log(err);
                } else{
                    if(req.user.status == foundLevel[0].nameLevel){
                        res.render("userPage/index",{allLesson:foundLesson});
                    }
                    if(req.user.status == foundLevel[1].nameLevel){
                        res.render("userPage/index2",{allLesson:foundLesson});
                    }
                    if(req.user.status == foundLevel[2].nameLevel){
                        res.render("userPage/index3",{allLesson:foundLesson});
                    }
                }
            });
            
        }
    });
});

//ไปหน้าบทเรียน
router.get("/showLesson/:lesson_id", middleware.isLoggedIn, middleware.upLevel, function(req,res){
    lesson.findById(req.params.lesson_id, function(err,found){
        if(err){
            console.log(err);
            res.redirect("/TTE/showLesson");
        } else{
            res.render("userPage/showlesson",{info_lesson:found});
        }
    });
});

//ไปหน้าข้อสอบ
router.get("/showLesson/:lesson_id/examTest", middleware.isLoggedIn, function(req,res){
    ques.find({idMap: req.params.lesson_id}, function(err,allQues){
        if(err){
            console.log(err);
            res.redirect("/TTE/showLesson");
        } else{
            var examTest = [];
            var n = allQues.length;
            var num = 5;
            var index = 0;
            var random = 0;
            var examFound,indexFind;
            while(num>0){
                random = Math.floor(Math.random() * n) + 1;
                examFound = allQues.find(function(value, index, array){ return value.value == random });
                indexFind = examTest.findIndex(function(value, index, array){ return value._id == examFound._id });
                if(indexFind == -1 && index !== num){
                    examTest.push(examFound);
                    index++;
                    num--;
                }
            }
            res.render("userPage/examTest",{exam:examTest});
        }
    });
});

//ตรวจข้อสอบ
router.post("/showLesson/:lesson_id/examTest", middleware.isLoggedIn,async function(req,res){
    var ans = req.body;
    let score_s = 0;
    for(i = 1;i<=5;i++){
        let anser_query = ans['aq'+i];
        let correct_ans = null;
        correct_ans = await ques.findById(ans['idQues'+i])
        if(correct_ans.answer == anser_query){
            score_s = score_s + 1;
        }
    }
    user.findById(req.user.id, function(err,foundUser){
        if(err){
            console.log(err);
        } else{
            let info;
            let pos = foundUser.exp.findIndex(exp => exp.lessonId == req.params.lesson_id);
            if(pos >= 0){
                if(foundUser.exp[pos].score < score_s){
                    foundUser.exp.splice(pos, 1)
                    info = {lessonId: req.params.lesson_id,score: score_s};
                    foundUser.exp.push(info);
                    foundUser.save();
                }
            } else{
                info = {lessonId: req.params.lesson_id,score: score_s};
                foundUser.exp.push(info);
                foundUser.save();
            }
            if(score_s < 3){
                req.flash("error","You take correct "+ score_s +" questions.");
            } else{
                req.flash("success","You take correct "+ score_s +" questions.");
            }
            res.redirect("/TTE/showLesson/"+req.params.lesson_id);
        }
    });
});

module.exports = router;