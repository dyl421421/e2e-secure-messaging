var express = require('express');
var router = express.Router();
const users = require('../modules/users');
const passport = require("passport");

/* GET users listing. */
router.get('/', function(req, res, next) {

    res.send('respond with a resource');
});

router.get('/login', function (req, res, next) {
    res.render('login');
})

router.post('/login', passport.authenticate('local'), users.login);

module.exports = router;