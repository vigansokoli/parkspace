var verifyAuth = (req,res,next)=>{

  console.log(req.user);
    if(!req.user){
      res.redirect("/auth/google");
    }
    next();
}

module.exports = verifyAuth;