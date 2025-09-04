const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("../handlers/Error");
const {promisify} = require('util');
const User = require('../models/User');

const Auth = async (req,_res,next)=>{
    try{      
        let token = req.cookies.s_Id;
        console.log("TOKEN: ", token);
        if(!token){
            throw new AuthenticationError("Please login!");
        }
        const decoder = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoder.id);
        next();
    }catch(err){
        console.log("error auth middleware : " ,err);
        return next(err);
    }
}
module.exports = Auth;