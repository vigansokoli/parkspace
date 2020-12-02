var verifyAuth = (req,res,next)=>{
    if(!req.user){
      res.redirect("/auth/google");
    }
    next();
}

module.exports = verifyAuth;