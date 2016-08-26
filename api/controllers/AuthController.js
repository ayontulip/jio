/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var passport = require('passport');

module.exports = {

    _config: {
        actions: false,
        shortcuts: false,
        rest: false
    },

    clientLoginView: function (req, res) {
        if (req.session.authenticated) {
            return res.redirect('/client/dashboard');
        }
        return res.view('client/login', {
            errors: req.flash('error'),
            successs: req.flash('success'),
        });
    },

    clientSignup: function (req, res) {
        if (req.session.authenticated) {
            return res.redirect('/client/dashboard');
        }
        return res.view('client/signup', {
            errors: req.flash('error')
        });
    },

    clientlogin: function (req, res) {

        passport.authenticate('local', function (err, user, info) {
            if ((err) || (!user)) {
                req.flash('error', info.message)
                return res.redirect('/client');
            }
            req.logIn(user, function (err) {
                if (err) res.send(err);

                // console.info(user);
                req.session.authenticated = true;
                if (user.role == 2) {
                    req.session.isClient = true;
                }
                req.session.currentuser = user;
                return res.redirect('/client/dashboard');
            });

        })(req, res);
    },

    clientlogout: function (req, res) {
        req.logout();
        req.session.authenticated = false;
        req.session.isClient = false;
        req.session.destroy();
        res.redirect('/client');
    },

    /**
     * Viewer Section
     */
    login: function (req, res) {

        passport.authenticate('local', function (err, user, info) {
            if ((err) || (!user)) {
                return res.send({
                    message: info.message,
                    user: user
                });
            }
            req.logIn(user, function (err) {
                if (err) res.send(err);

                req.session.authenticated = true;
                req.session.currentuser = user;
                return res.redirect('/client/dashboard');
            });

        })(req, res);
    },

    logout: function (req, res) {
        req.logout();
        res.redirect('/');
    }
};
