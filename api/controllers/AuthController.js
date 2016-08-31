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
                var redirect_to = '/client/dashboard';
                Log.findOne({ user_id : user.id }, function(err, user) {

                    if(!user) {
                        req.flash('success', "Welcome, Please set your password")
                        redirect_to = '/client/update-password';
                    }
                });
                Log.create({ user_id : user.id }, function (err, user) {
                    return res.redirect(redirect_to);
                });
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
                var redirect_to = '/dashboard';
                Log.create({ user_id : user.id }, function (err, user) {
                    return res.redirect(redirect_to);
                });
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
            if ((err) || (!user)) {
                if(info) {
                    req.flash('error', info.message)
                }
                else {
                    req.flash('error', 'There was an error logging you in with Facebook')
                }
                return res.redirect('/');
            }
            req.logIn(user, function (err) {
                if (err) res.send(err);

                req.session.authenticated = true;
                req.session.isClient = false;
                req.session.currentuser = user;
                var redirect_to = '/dashboard';
                Log.create({ user_id : user.id }, function (err, user) {
                    return res.redirect(redirect_to);
                });
                
            });

        })(req, res, next);

    }
};
