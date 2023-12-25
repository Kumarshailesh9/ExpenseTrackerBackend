
const User = require('../models/user');
const sgMail = require('@sendgrid/mail');
const uuid = require('uuid');
const ForgotPassword = require('../models/resetPassword');
const bcrypt = require('bcrypt');



sgMail.setApiKey('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');

exports.forgotPassword = async (req, res) => {
    const { to } = req.body;
    const user = await User.findOne({where : { email: to }});
    if(user){
        const id = uuid.v4();
        ForgotPassword.create({ id , active : true, userId: user.id});
        const msg =  {
            to,
            from : 'theshaileshkumar9@gmail.com',
            subject: 'testing Email for password reset mail 2',
            text: 'Click on reset password link and reset your password',
            html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
       };
       const sendMail = await sgMail.send(msg);
       if(sendMail){
           return res.status(200).json({message: 'Email Sended Successfully', success: true});
       } else {
           res.status(500).json({message: 'Error in sending password reset mail', success: false});
       }
    }
}

exports.resetpassword = (req, res) => {
    const id =  req.params.id;
    ForgotPassword.findOne({ where : { id }}).then(forgotpasswordrequest => {
        if(forgotpasswordrequest){
            forgotpasswordrequest.update({ active: false});
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>

                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()

        }
    })
};


exports.updatepassword = (req, res) => {

    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        ForgotPassword.findOne({ where : { id: resetpasswordid }}).then(resetpasswordrequest => {
            User.findOne({where: { id : resetpasswordrequest.userId}}).then(user => {
                if(user) {
                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash) {
                            if(err){
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ password: hash }).then(() => {
                                res.status(201).json({message: 'Successfuly update the new password'})
                            })
                        });
                    });
            } else{
                return res.status(404).json({ error: 'No user Exists', success: false})
            }
            })
        })
    } catch(error){
        return res.status(403).json({ error, success: false } )
    }

}


