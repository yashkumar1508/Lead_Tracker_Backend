const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticate = require("../middleweares/authanticate");

/*
    @usage : to Register a User
    @url : /api/users/register
    @fields : name , username,email , password
    @method : POST
    @access : PUBLIC
 */

    router.post(
        "/register",
        async (request, response) => {
          try {
            let { name, username, email, password } = request.body;
            // check if the user exits
            let user = await User.findOne({ email: email });
      
            if (user) {
              return response.status(201).json({ msg: "Email already Exists" });
            }
          user=await User.findOne({username:username});
          if(user){
            return response.status(201).json({ msg: "Username already Exists" });
          }
            let salt = await bcrypt.genSalt(10); // salt is actually encrypted password
            password = await bcrypt.hash(password, salt); //password=salt
      
            let avatar =
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTOkHm3_mPQ5PPRvGtU6Si7FJg8DVDtZ47rw&usqp=CAU";
      
            user = new User({ name, username, email, password, avatar });
            await user.save();
            response.status(200).json({ msg: "Registration is Successful" });
          } catch (error) {
            console.error(error);
            response.status(500).json({ errors: [{ msg: error.message }] });
          }
        });
        /*
    @usage : to Login a User
    @url : /api/users/login
    @fields : email , password
    @method : POST
    @access : PUBLIC
 */
router.post(
    "/login",
  
    async (request, response) => {
      try {
        let { usernameoremail, password } = request.body;
        
        // check if the correct email
        let user = await User.findOne({ email: usernameoremail });
  
        if (!user) {
            user = await User.findOne({username:usernameoremail});
            if(!user){
                return response
                .status(201)
                .json({ errors: [{ msg: "Invalid Credentials" }] });
            }
          
        }
  
        // check the passwords
        let isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return response
            .status(201)
            .json({ errors: [{ msg: "Invalid Credentials" }] });
        }
        let payload = {
          user: {
            id: user.id,
            name: user.name,
          },
        };
      jwt.sign(payload, process.env.JWT_SECRET_KEY, (error, token) => {
          if (error) throw error;
          response.status(200).json({
            msg: "Login is Success",
            token: token,
          });
        });
      } catch (error) {
        console.error(error);
        response.status(500).json({ errors: [{ msg: error.message }] });
      }
    }
  );
  router.get("/me", authenticate, async (request, response) => {
    try {
      let user = await User.findById(request.user.id).select("-password");
      response.status(200).json({
        user: user,
      });
    } catch (error) {
      console.error(error);
      response.status(500).json({ errors: [{ msg: error.message }] });
    }
  });
module.exports = router;