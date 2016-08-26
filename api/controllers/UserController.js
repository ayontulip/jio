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

module.exports = {

    /**
     * `UserController.save()`
     */
    save: function (req, res) {
        var params = _.extend(req.query || {}, req.params || {}, req.body || {}),
        newpassword = generatePassword(10);

        params.password = newpassword;
        User.create(params, function (err, createdUser) {

            if (err) {
                req.flash('error', err);
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
};

