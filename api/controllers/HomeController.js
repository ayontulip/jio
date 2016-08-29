/**
 * HomeController
 *
 * @description :: Server-side logic for managing homes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    index: function (req, res) {
        if (req.session.authenticated) {
            return res.redirect('/dashboard');
        }
        return res.view('login', {
            errors: req.flash('error'),
            successs: req.flash('success'),
        });
    },
    signup: function (req, res) {
        if (req.session.authenticated) {
            return res.redirect('/dashboard');
        }
        return res.view('signup', {
            errors: req.flash('error')
        });
    },
};

