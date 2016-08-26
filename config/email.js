/**
 * Email Mappings
 * (sails.config.email)
 */
/*var smtpTransport = require('nodemailer-smtp-transport');
	var transporter = smtpTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'ayon@tulipinfotek.com',
        pass: 'ayonsah@tulip'
    }
});

module.exports.email = {
    service: 'Gmail',
    //transporter: transporter,
    auth: {
        user: "ayon@tulipinfotek.com",
        pass: "ayonsah@tulip"
    },
    from: 'ayon@tulipinfotek.com'
};*/
module.exports.email = {
    host: 'smtp.gmail.com',
    port: 587,
    user: 'root',
    user: 'ayon@tulipinfotek.com',
    password: 'ayonsah@tulip',
    templateDirectory: 'views/emailTemplates',
    from: 'Ayon Saha <ayonsaha2012@gmail.com>'
};