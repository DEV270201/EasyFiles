//joi validations
const joi = require('joi');
const {ClientError} = require("../handlers/Error");

exports.uploader = async (body)=>{

    const schema = joi.object({
        filename : joi.string().max(50).regex(/^[a-zA-z0-9]+$/),
    });
    try{
        return await schema.validateAsync(body);
    }catch(err){
        // console.log("error from joiiii : " , err);
        console.log("error from joi : " , err.details[0].message);
        throw new ClientError(err.details[0].message.replace(/"/g,""));
    }
}