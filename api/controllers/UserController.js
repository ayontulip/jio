/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
function generatePassword(length) {
    if (!length) {
        var length = 8;
    }
    var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#_",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}
var email = require('../services/email');
var validation = require('../services/validation');

module.exports = {

    /**
     * `UserController.save()`
     */
    clientsave: function (req, res) {
        var params = _.extend(req.query || {}, req.params || {}, req.body || {}),
        newpassword = generatePassword(10);
        params.role = 2;
        if((params.client) && (params.client == params._csrf)) {
            params.password = newpassword;
            params.role = 99;
        }
        Users.create(params, function (err, createdUser) {

            if (err) {
                req.flash('error', validation.getMessageHtml(err));
                return res.redirect(req.session.backURL || '/client/signup');
            };

            console.log(newpassword);
            var mailOptions = { template: 'html', from: 'Jio <jio@thecatalystindia.in>', to: params.email, subject: 'Registration Complete on JIO', data: { companyName: params.companyName, password: newpassword, email: params.email} };
            email.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Message sent: ' + info.response);
                }
            });
            req.flash('success', 'Thank you for joining us. Please check your email for Password');
            res.redirect('/client');
        });

    },
    viewerSave: function (req, res) {
        var params = _.extend(req.query || {}, req.params || {}, req.body || {});
        params.role = 2;
        Users.create(params, function (err, createdUser) {
            if (err) {
                req.flash('error', validation.getMessageHtml(err));
                return res.redirect(req.session.backURL || '/signup');
            };
           /* var mailOptions = { template: 'html', from: 'Jio <jio@thecatalystindia.in>', to: params.email, subject: 'Registration Complete on JIO', data: { companyName: params.companyName, password: newpassword, email: params.email} };
            email.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Message sent: ' + info.response);
                }
            });*/
            req.flash('success', 'Thank you for joining us.');
            res.redirect('/');
        });

    },
};

