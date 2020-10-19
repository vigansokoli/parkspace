const jwt = require("jsonwebtoken");
const { tokenSecret } = require("../../config");

module.exports = function (req,res,next){

    const authorization = req.header('authorization');

    if (authorization && (authorization.split(' ')[0] === 'Token' || authorization.split(' ')[0] === 'Bearer')){
        var token = authorization.split(" ")[1];

        if(!token) return res.status(401).send("Access Denied")

        try{ 
            const verified = jwt.verify(token, tokenSecret)
            req.user = verified;
            next();
        }catch(err){
            res.status(498).send("Invalid Token" + err);
        }
    }else{
        res.status(498).send("Invalid Token");
    }
}
