const express = require('express');
const router = express.Router();

router.get("/",(req,res)=>{
    return res.status(200).json({
        msg : "successfulllllllllll"
      });
});

console.log("router loaded");

module.exports = router;

