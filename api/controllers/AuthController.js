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
                if (user.role == 99) {
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
                req.flash('error', info.message)
                return res.redirect('/');
            }
            req.logIn(user, function (err) {
                if (err) res.send(err);

                req.session.authenticated = true;
                req.session.isClient = false;
                req.session.currentuser = user;
                return res.redirect('/dashboard');
            });

        })(req, res);
    },

    logout: function (req, res) {
        req.logout();
        req.session.authenticated = false;
        req.session.isClient = false;
        req.session.destroy();
        res.redirect('/');
    },
    /**
     * facebook login
     */
    'facebook': function (req, res, next) { 
        passport.authenticate('facebook', { scope: 'email'},
            function (err, user) {
                req.logIn(user, function (err) {
                if(err) {
                    req.session.flash = 'There was an error';
                    res.redirect('user/login');
                } else {
                    req.session.user = user;
                    res.redirect('/user/dashboard');
                }
            });
        })(req, res, next);

    },
    'facebook_callback': function (req, res, next) {  
        /*passport.authenticate('facebook',
        function (req, res) {
            res.redirect('/dashboard');
        })(req, res, next);*/

        passport.authenticate('facebook', function (err, user, info) {
            console.info(err);
            console.info(user);
            console.info(info);
            if ((err) || (!user)) {
                req.flash('error', 'There was an error logging you in with Facebook')
                return res.redirect('/');
            }
            req.logIn(user, function (err) {
                if (err) res.send(err);

                req.session.authenticated = true;
                req.session.isClient = false;
                req.session.currentuser = user;
                return res.redirect('/dashboard');
            });

        })(req, res, next);

    }
};
