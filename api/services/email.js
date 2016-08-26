var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var ejs = require('ejs');
var fs = require('fs');
var path = require('path');
module.exports = {
	sendMail: function(options, callback) {
		var template = options.template || 'testEmail';
		var from = options.from || sails.config.email.from || 'Ayon Saha ✔ <ayonsaha2012@gmail.com>';
		var to = options.to || 'ayonsaha2011@gmail.com';
		var cc = options.cc || '';
		var bcc = options.bcc || '';
		var replyTo = options.replyTo || '';
		var subject = options.subject || 'Test mail';
		var text = options.text || '';
		var data = options.data || {companyName: "The Catalyst", password: "password", email:"jio@thecatalystindia.in"};
		var attachments = options.attachments  || false;

		var templateDirectory = sails.config.email.templateDirectory || 'views/emailTemplates'
		var view =path.resolve(sails.config.appPath, templateDirectory+'/'+template);
		var source = fs.readFileSync(view+'.ejs', 'utf8')
		var compileFn = ejs.compile((source || "").toString(), {
				          cache: true, filename: view
				        });
		var compileTemplate = compileFn(data);

		var transporter = nodemailer.createTransport(smtpTransport({
		    host: sails.config.email.host || 'smtp.gmail.com',
		    port: sails.config.email.port || 587,
		    auth: {
		        user: sails.config.email.user || 'ayon@tulipinfotek.com',
		        pass: sails.config.email.password || 'ayonsah@tulip'
		    }
		}));
		// setup e-mail data with unicode symbols
		var mailOptions = {from: from, to: to, cc: cc, bcc: bcc, replyTo: replyTo, subject: subject,  text: text, html: compileTemplate, attachments : attachments };
		// send mail with defined transport object
		transporter.sendMail(mailOptions, function(error, info){
		    if(error){
		    	callback(error, null);
		        // console.log(error);
		    }else{
		    	callback(null, info);
		        // console.log('Message sent: ' + info.response);
		    }
		});
	}

}