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
    user: 'skoolstarsupp@gmail.com',
    password: 'skadmin@123',
    templateDirectory: 'views/emailTemplates',
    from: 'Ayon Saha <jio@thecatalystindia.in>'
};