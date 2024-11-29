const jwt=require('jsonwebtoken');
const User=require('../../models/user');

exports.authenticate=(req,res,next)=>{
    try{
        const token=req.header('Authorization');
        const user=jwt.verify(token,process.env.tokenSecret)
        console.log("user",user)

        User.findByPk(user.id).then(user=>{
            req.user=user
            next()
        }).catch(err=>{
            throw new Error(err)
        })
    }catch(error){
        return res.status(401).json({
            success:false
        })
    }
}