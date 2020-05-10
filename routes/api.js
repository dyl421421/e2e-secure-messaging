var express = require('express');
var router = express.Router();
const users = require('../modules/users');
const passport = require("passport");
const bcrypt = require('bcrypt');
const db = require('../modules/db-module');

/* GET users listing. */
router.get('/', function(req, res, next) {

    res.send('respond with a resource');
});

router.get('/login', function (req, res, next) {
    res.render('login');
})

router.post('/login', function (req, res, next)  {
    console.log(req.body);
    passport.authenticate('local', function (err, user, info) {
        if (err) return next(err);
        if (!user) {
            res.status(401);
            return res.send("unauthorized: " + info.message);
        }
        req.login(user, function(loginErr) {
            if (loginErr) next(loginErr);
            return res.redirect('/');
        })
    })(req, res, next);
});

router.post('/register', function (req, res, next) {

    bcrypt.hash(req.body.password, 10, function (err, hash) {
        db.query('INSERT INTO users (email, username, passwordHash, publicKey, displayName) VALUES ($1, $2, $3, $4, $5)',[
            req.body.email, req.body.username, hash, req.body.pubKey, req.body.display
        ], (error, result) => {
            if (error) {
                res.json({error});
            } else {
                res.json(result);
            }
        })
    })


})
router.get('/logout', function (req, res, next) {
    req.logOut();
    res.redirect('/');
})

module.exports = router;
