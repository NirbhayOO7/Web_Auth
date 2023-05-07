const nodeMailer = require('../config/nodemailer');


// funciton fpr sending the mail to user
exports.resetPassword = (accessToken) => {
    let htmlString = nodeMailer.renderTemplate({accessToken: accessToken}, '/resetpassword/reset_password.ejs');
    
    nodeMailer.transporter.sendMail({
        from:'uchihanirbhay02@gmail.com',
        to: accessToken.user.email,
        subject: 'Reset password link',
        html: htmlString
    }, (err, info) => {
        if(err){
            console.log('Error in sending mail', err);
            return;
        }
        return;
    });

}