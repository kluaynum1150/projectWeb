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

module.exports = middlewareObj;