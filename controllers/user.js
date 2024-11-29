const User = require('../models/user')
const path = require('path')
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendResetEmail } = require('../config/mailer');
const { Op } = require('sequelize');

exports.showLogin = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'../views','signin.html'))
}

exports.submitLogin = (req,res,next)=>{
    let login = req.body
    console.log("login info ",login)
    User.findAll({where:{email:login.email}}).then(user=>{
        if(user.length==0){
            res.status(404).json({
                success:false,
                message:"User not found"
            })
        }else{
            user = user[0]
            console.log("user from db ",user.password)

            bcrypt.compare(login.password,user.password).then(result=>{
                console.log("result ",result,"user.id: ",user.id)
                if(result==false){
                    res.status(401).json({
                        success:false,
                        message:"User Not Authorized"
                    })
                }else{
                    console.log("secret key ",process.env.tokenSecret)
                    var token = jwt.sign({ id: user.id }, process.env.tokenSecret);
                    res.status(200).json({
                        success:true,
                        message:"User is succesfuly logged in",
                        token:token
                    })
                }
            })
        }
    })
}

exports.showSignup = (req,res)=>{
    res.sendFile(path.join(__dirname,'../views','signup.html'))
}

exports.createUser=(req,res)=>{
    console.log(req.body)
    let plainPsd = req.body.password
    let salt = 10
    bcrypt.hash(plainPsd,salt).then(hash=>{
        console.log("hash ",hash)
        User.create({name:req.body.name,email:req.body.email,password:hash})
        .then(user=>{
            res.json(user)
        }).catch(error=>{
            let errormsg = error?.errors?.[0]?.message ?? error.message    
            res.json({
                error:errormsg
            })
        })
    })
}

// Request password reset
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Generate reset token and expiration
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiration = Date.now() + 3600000; // Token valid for 1 hour

    await user.update({
      resetToken,
      resetTokenExpiration: new Date(resetTokenExpiration),
    });

    // Send reset email
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
    await sendResetEmail(user.email, resetLink);

    res.status(200).json({ message: 'Password reset email sent.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred.' });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiration: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await user.update({
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiration: null,
    });

    res.status(200).json({ message: 'Password reset successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred.' });
  }
};
