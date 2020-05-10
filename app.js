var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var session = require("express-session");
const db = require("./modules/db-module");
const bcrypt = require('bcrypt');

const passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const apiRouter = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: "351" }));
// noinspection JSCheckFunctionSignatures
app.use(passport.initialize());
// noinspection JSCheckFunctionSignatures
app.use(passport.session());

passport.use(new LocalStrategy(
    function(username, password, done) {
        db.query("SELECT id, username, passwordHash, publicKey FROM users WHERE username=$1 OR email=$1", [username], (err, result) => {
            if (err) {
                createError(401,err);
                return done(err);
            }
            if(result.rows.length > 0) {
                const first = result.rows[0];

                let hash = bcrypt.compare(password, first.passwordHash, (hashError, hashRes) => {
                    if (hashRes) {
                        done(null, { id: first.id, username: first.username, publicKey: first.publicKey});
                    } else {
                        done(null, false, { message: "Incorrect password" } );
                    }
                });

            } else {
                done(null, false, { message: "Incorrect username or email"});
            }
        });

    }
));
passport.serializeUser((user, done) => {
    done(null, user.id)
});
passport.deserializeUser((id, cb) => {
    db.query('SELECT id, username, type FROM users WHERE id = $1', [parseInt(id, 10)], (err, results) => {
        if(err) {
            createError(500,'Error when selecting user on session deserialize', err)
            return cb(err)
        }
        cb(null, results.rows[0])
    })
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : err;

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
