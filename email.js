var nodemailer = require('nodemailer');

var transporter = {};

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'londonbridgeproject2020@gmail.com',
      pass: 'georgeyu'
    }
  });
  
transporter.mailOptions = {
    from: 'londonbridgeproject2020@gmail.com',
    to: 'yifei7.zhang@gmail.com',
    subject: 'Notification of Streetlight Maintenance',
    text: `Request for Streetlight maintenance.`
  };
  
  transporter.sendMail(transporter.mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

module.exports = transporter; 