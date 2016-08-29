/**
 * Users.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var bcrypt = require('bcrypt');

module.exports = {

  tableName: 'tbl_users',
  attributes: {
      first_name: {
          type: 'string',
          size: 100,
          maxLength: 100
      },
      last_name: {
          type: 'string',
          size: 100,
          maxLength: 100
      },
      companyName: {
          type: 'string',
          size: 200,
          minLength: 4,
          maxLength: 200
      },
      email: {
          type: 'email',
          unique: true,
          size: 150,
          minLength: 4,
          maxLength: 150
      },
      avatar: {
          type: 'string',
          size: 255
      },
      password: {
          type: 'string',
          minLength: 6,
          required: true
      },
      isactive: {
          type: 'integer',
          size: 8,
          defaultsTo: 1
      },
      role: {
          type: 'integer',
          size: 8,
          defaultsTo: 2
      },
      fb_id: {
          type: 'string',
          size: 255
      },
      fb_access_token: {
          type: 'string',
          size: 255
      },
      toJSON: function () {
          var obj = this.toObject();
          delete obj.password;
          return obj;
      }
  },
    beforeCreate: function (user, cb) {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    console.log(err);
                    cb(err);
                } else {
                    user.password = hash;
                    cb();
                }
            });
        });
    }
};

