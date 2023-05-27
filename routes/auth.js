const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt")

//Register
router.post("/register", async (req, res) => {
 try {
   //Hashed Password
   const salt = await bcrypt.genSalt(10);
   const hashedPassword = await bcrypt.hash(req.body.password, salt);

//Register or Create New User
   const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,

  });


  //To save the Registered User in the database and return Response
    const user = await newUser.save();
    res.status(200).json(user);
 } catch(err) {
   res.status(500).json(err)
   
   
 }
});



///Login
router.post("/login", async(req,res)=> {
   try{
      //This is to verify if the database has a Similar Email to the one That was typed
   const user = await User.findOne({email:req.body.email});
   !user && res.status(404).send("user not found")
   
   //Now to Verify If the password is the same as that one the User in the database
   const validPassword = await bcrypt.compare(req.body.password, user.password)
   !validPassword && res.status(400).json("Invalid Password")
    
    //So if it is correct it Sends the user that it is Correct 
    res.status(200).json(user);

}catch(err){
  res.status(500).json(err)
}
})
module.exports = router;