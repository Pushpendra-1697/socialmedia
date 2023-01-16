const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (req,res,next) => {
    const {authentication} = req.headers;
    if(authentication){
        jwt.verify(authentication, process.env.key, (err, decoded) => {
            if(err){
                res.send({"msg": "Please Login First"});
                console.log(err);
            }else if(decoded){
                const userID = decoded.userID;
                req.body.userID = userID;
                next();
            }else{
                next();
            }
        })
    }else{
        res.send({"msg": "Please Login First"});
    }
}

module.exports = {auth}