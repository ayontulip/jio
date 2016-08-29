var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
FacebookStrategy = require('passport-facebook').Strategy,
bcrypt = require('bcrypt'),
config = require('./social');

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

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    Users.findOne({ id: id } , function (err, user) {
        done(err, user);
    });
});

// =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================

   passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : config.facebookAuth.clientID,
        clientSecret    : config.facebookAuth.clientSecret,
        callbackURL     : config.facebookAuth.callbackURL,
        enableProof: false,
        profileFields: ['id', 'displayName', 'link', 'photos', 'email']
    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {
        if((!profile.emails) && (!profile.emails[0].value)) {
          return done(err, false, {
                          message: 'Sorry.. Can not fetch Email. So please register through normal Signup'
                        });
        }
        // asynchronous
        process.nextTick(function() {

            var emailID = profile.emails[0].value;
            // find the user in the database based on their facebook id
            Users.findOne({ fb_id : profile.id, or: [{email : emailID}] }, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err, false, {
                          message: 'Some thing wrong, Please try again.'
                        });

                // if the user is found, then log them in
                if (user) {
                    return done(null, user, {
                          message: 'Logged In Successfully'
                        }); // user found, return that user
                  } else {
                    // if there is no user found with that facebook id, create them
                    var newpassword = generatePassword(10),
                    first_name = profile.name.givenName || profile.displayName;
                    // save our user to the database
                    var newUser = {
                      fb_id: profile.id,
                      fb_access_token: token,
                      first_name:  first_name,
                      last_name: profile.name.familyName,
                      email: emailID,
                      password: newpassword,
                      avatar: (profile.emails) ? profile.photos[0].value : "",
                      role: 2
                    };
                    Users.create(newUser, function (err, user) {
                      if (err) {
                         return done(err, false, {
                          message: 'Some thing wrong, Please try again.'
                        });
                      };
                    
                    var mailOptions = { template: 'html', from: 'Jio <jio@thecatalystindia.in>', to: emailID, subject: 'Registration Complete on JIO', data: { companyName: first_name, password: newpassword, email: emailID} };
                      email.sendMail(mailOptions, function (error, info) {
                          if (error) {
                              console.log(error);
                          } else {
                              console.log('Message sent: ' + info.response);
                          }
                      });
                      return done(null, user, {
                          message: 'Logged In Successfully'
                        });
                    });
                }

            });
        });

    }));

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  function(req, email, password, done) {
    var params = _.extend(req.query || {}, req.params || {}, req.body || {});
    params.role = 2;
      if((params.client) && (params.client == params._csrf)) {
          params.role = 99;
      }
    Users.findOne({ email: email, isactive: 1, role: params.role }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'User not found' });
      }

      bcrypt.compare(password, user.password, function (err, res) {
          if (!res)
            return done(null, false, {
              message: 'Invalid password. Please try again'
            });

          /*var returnUser = {
            first_name: user.first_name,
            last_name: user.last_name,
            companyName: user.companyName,
            role: user.role,
            email: user.email,
            createdAt: user.createdAt,
            id: user.id
          };*/
          return done(null, user, {
            message: 'Logged In Successfully'
          });
        });
    });
  }
));