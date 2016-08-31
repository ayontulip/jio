/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var moment = require('moment');
var uuid = require('node-uuid');
var bcrypt = require('bcrypt');
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

            // console.log(newpassword);
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
    clientPasswordUpdate: function (req, res) {
        return res.view('client/password-update', {
            errors: req.flash('error'),
            successs: req.flash('success'),
        });
    },

    clientForgotPassword: function (req, res) {
        console.log(req.session.backURL);
        return res.view('forgotPassword', {
            errors: req.flash('error'),
            successs: req.flash('success'),
            redirect_to: "/client"

        });
    },

    updatePassword: function (req, res) { 
        var params = _.extend(req.query || {}, req.params || {}, req.body || {}),
        currentuser = req.session.currentuser;

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(params.password, salt, function (err, hash) {
                if (err) {
                    console.log(err);
                    // cb(err);
                    req.addFlash('error', 'Password not update');
                    res.redirect('/client/dashboard');
                } else {
                    //  cb();
                     Users.update({id: currentuser.id},{password: hash}).exec(function afterwards(err, updated){

                        if (err) {
                            req.addFlash('error', 'Password not update');
                            res.redirect('/client/dashboard');
                        }

                        req.addFlash('success', 'Password update successfully');
                        res.redirect('/client/dashboard');
                    });
                }
            });
        });
    },
    
    forgotPassword: function (req, res) {
        return res.view('forgotPassword', {
            errors: req.flash('error'),
            successs: req.flash('success'),
            redirect_to: "/"

        });
    },
    forgotPasswordsubmit: function (req, res) {
        var params = _.extend(req.query || {}, req.params || {}, req.body || {}),
        redirect_to = params.redirect_to;
        Users.findOne({ email : params.email }, function(err, user) {
            if(err) {
                req.flash('error', 'User not found');
                return res.redirect('/forgot-password');
            }
            var tokon = uuid.v1(),
            time =  new Date();
            Users.update({email: params.email},{password_reset_tokon: tokon, password_reset_time: time}).exec(function afterwards(err, updated){

                if (err) {
                    console.log(err);
                    req.flash('error', 'Opp! There is some thing wrong, Please try again leter.');
                    return res.redirect('/forgot-password');
                }
                var name ="";
                 if(user.role != 99 ) {
                    name = user.first_name;
                    if(user.last_name) {
                        name += " "+user.last_name;
                    }
                }
                else {
                    name = user.companyName;
                }
                 var mailOptions = { template: 'reset-password', from: 'Jio <jio@thecatalystindia.in>', to: user.email, subject: 'Password reset on JIO', data: {name: name, id: user.id, tokon:tokon} };
                    email.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                            req.flash('error', 'Opp! There is some thing wrong, Please try again leter.');
                        } else {
                            console.log(info);
                            req.flash('success', 'Please check your email for resetting password');
                        }
                        return res.redirect(redirect_to);
                    });
                
                // return res.redirect(redirect_to);
            });
            // return res.redirect("/");
        });
        // return res.redirect(redirect_to);
    },

    resetPassword: function (req, res) {
        var params = _.extend(req.query || {}, req.params || {}, req.body || {}),
            time =  new Date();
        Users.findOne({ id : params.id, password_reset_tokon: params.tokon }, function(err, user) {
            if (err) {
                console.log(err);
                req.flash('error', 'Opp! There is some thing wrong, Please try again.');
                return res.redirect('/');
            }

            // var duration = moment.duration(time.diff(user.password_reset_time));
            var duration = moment.utc(moment(time,"DD/MM/YYYY HH:mm:ss").diff(moment(user.password_reset_time,"DD/MM/YYYY HH:mm:ss"))).format("HH")
            // var hours = duration.asHours();
            console.log(duration);
            var redirect_to = "/";
             if(user.role == 99 )
                {
                    redirect_to ='/client';
                }
            if(duration > 1) {
                req.flash('error', 'Password reset time out. Please try again.');
                return res.redirect(redirect_to);
            }
            return res.view('reset-password', {
                errors: req.flash('error'),
                successs: req.flash('success'),
                redirect_to: redirect_to,
                user: user
            });

        });
        console.log(params);
    },
    resetPasswordsubmit: function (req, res) { 
        var params = _.extend(req.query || {}, req.params || {}, req.body || {});

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(params.password, salt, function (err, hash) {
                if (err) {
                    console.log(err);
                    // cb(err);
                    req.flash('error', 'Password not update');
                } else {
                    // cb();
                     Users.update({id: params.user_id}, {password: hash}).exec(function afterwards(err, updated){
                        if (err) {
                        console.log(err);
                            req.flash('error', 'Password not update');
                        }
                        console.log(updated);
                        req.flash('success', 'Password update successfully');
                    });
                }
                return res.redirect(params.redirect_to);
            });
        });
    },

};

