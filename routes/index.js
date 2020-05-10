var express = require('express');
var router = express.Router();

function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
        //req.isAuthenticated() will return true if user is logged in
        next();
    } else{
        res.redirect("/login");
    }
}

/* GET home page. */
router.get('/', checkAuthentication, function(req, res, next) {
    res.render('index', { title: "Express", username: req.user.username });
});
router.get('/login', function (req, res, next) {
    res.render('login');
})
router.get('/register', function(req, res, next) {
    res.render('register');
})

module.exports = router;
