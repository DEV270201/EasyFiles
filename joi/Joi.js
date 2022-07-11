//joi validations
const joi = require('joi');
const {ClientError} = require("../handlers/Error");

//made this function synchronous
exports.UploaderJoi = (req,res,next)=>{
    const schema = joi.object().keys({
        filename : joi.string().max(50).regex(/^[a-zA-z0-9]+$/),
    });
      const result =  schema.validate(req.body);
      if(result.error){
          console.log("result : ",result.error.details[0].message.replace(/"/g,""));
          return next(new ClientError(result.error.details[0].message.replace(/"/g,"")));
      }else{
        req.filename = req.body.filename;
        next();
      }
}


exports.RegisterJoi = async (body)=>{
   const schema = joi.object({
    //can use better regex than mine
     email : joi.string().regex(/^[a-z]+\d*\.?[a-z\d]*@(gmail|hotmail|yahoo)\.(com|in)$/),
     username : joi.string().max(25),
    //can use better regex than mine
     password : joi.string().min(8).max(15).regex(/^[a-zA-Z]+[a-zA-Z\d]*[@$#]+[a-zA-Z@$#\d]*\d+$/)
   });

   try{
     return await schema.validateAsync(body);
   }catch(err){
    console.log("register joi : ",err);
    throw err;
   }
}
