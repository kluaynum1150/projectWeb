const   user = require("../models/user"),
        levels = require("../models/level");

let middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated() && req.user.tag == "user"){
        return next();
    } else{
        req.flash('error', 'You need to login first');
        res.redirect('/');
    }
}

middlewareObj.isLoggedInAdmin = function(req, res, next){
    if(req.isAuthenticated() && req.user.tag == "admin"){
            return next();
        } else{
            req.flash('error', 'You must be logged in as an administrator.');
            res.redirect('/admin/login');
        }
}

middlewareObj.upLevel = function(req, res, next){
    levels.find({}, function(err,found){
        if(err){
            console.log(err);
        } else{
            let infoUser = req.user;
            let num = 0;
            let i = 0;
            let emp,index;
            let numOfexp;
            let mapLevel;
            if(req.user.status == found[0].nameLevel){ 
                numOfexp = req.user.exp.length;
                mapLevel = found[0].maps;
                while(numOfexp>0 && i<req.user.exp.length){
                    emp = infoUser.exp[i].lessonId;
                    index = mapLevel.indexOf(emp);
                    if(index !== -1 && num !== found[0].maps.length){
                        num++;
                        if(num == found[0].maps.length){
                            user.findById(req.user.id, function(err,foundUser){
                                if(err){
                                    console.log(err);
                                } else{
                                    foundUser.status = found[1].nameLevel;
                                    foundUser.save();
                                    res.redirect("/TTE/showLesson");
                                }
                            });
                        }
                        numOfexp--;
                        i++;
                    } else{ i++; }
                }
                if(num !== found[0].maps){
                    return next();
                } else{ return next(); }
            }
            if(req.user.status == found[1].nameLevel){ 
                numOfexp = req.user.exp.length;
                mapLevel = found[1].maps;
                while(numOfexp>0 && i<req.user.exp.length){
                    emp = infoUser.exp[i].lessonId;
                    index = mapLevel.indexOf(emp);
                    if(index !== -1 && num !== found[1].maps.length){
                        num++;
                        if(num == found[1].maps.length){
                            user.findById(req.user.id, function(err,foundUser){
                                if(err){
                                    console.log(err);
                                } else{
                                    foundUser.status = found[2].nameLevel;
                                    foundUser.save();
                                    res.redirect("/TTE/showLesson");
                                }
                            });
                        }
                        numOfexp--;
                        i++;
                    } else{ i++; }
                }
                if(num !== found[1].maps){
                    return next();
                } else{ return next(); }
            }
            if(req.user.status == found[2].nameLevel){ 
                numOfexp = req.user.exp.length;
                mapLevel = found[2].maps;
                while(numOfexp>0 && i<req.user.exp.length){
                    emp = infoUser.exp[i].lessonId;
                    index = mapLevel.indexOf(emp);
                    if(index !== -1 && num !== found[2].maps.length){
                        num++;
                        if(num == found[2].maps.length){
                            user.findById(req.user.id, function(err,foundUser){
                                if(err){
                                    console.log(err);
                                } else{
                                    req.flash('success', 'คุณเลเวลสูงสุดแล้ว');
                                    res.redirect("/TTE/showLesson");
                                }
                            });
                        }
                        numOfexp--;
                        i++;
                    } else{ i++; }
                }
                if(num !== found[2].maps){
                    return next();
                } else{ return next(); }
            }
        }
    });
}

module.exports = middlewareObj;