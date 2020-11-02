var verifyAuth = (req,res,next)=>{
  console.log("american");
  console.log(req.user);
  console.log("me");
    if(!req.user){
      res.redirect("/auth/google");
    }
    next();
}

module.exports = verifyAuth;