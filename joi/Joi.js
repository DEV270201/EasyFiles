//joi validations
const joi = require('joi');
const {ClientError} = require("../handlers/Error");

//made this function synchronous
exports.uploader = (req,res,next)=>{
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

