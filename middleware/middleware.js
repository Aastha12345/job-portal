var middlewareObj = {};

// FUNCTIONS
middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.render('login',{msg:"You need to login if you have an account else register first"});
};




module.exports=middlewareObj;