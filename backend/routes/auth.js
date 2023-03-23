const express = require('express');
const User = require('../models/User')
const router = express.Router();
const { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser =require('../middleware/fetchuser')

const JWT_SECRET = 'Lokeshisgoodboy'

// Route 1: Create a user useing POST '/api/auth/createuser'. No login required
router.post('/createuser', [
    body('email',"Enter a valid email").isEmail(),
    body('name', "Enter a valid name").isLength({ min: 5 }),
    body('password' , 'password must be atleast 5 charecters').isLength({ min: 5 })
] , async (req, res)=>{
    let success =false;
    // If there are  errors, return Bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success,  errors: errors.array() });
    }

    // Cheak whether the user with this email exists already
    try{
    let user = await User.findOne({email: req.body.email});
    if(user){
        return res.status(400).json({success, error:"Sorry a user with email already exist"})
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt)
    // create a new user
    user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass});

        const data ={
            user: {
                id: user.id
            }
        }
        const authtokan = jwt.sign(data, JWT_SECRET);
        //res.json(user)
        success = true;
        res.json({success, authtokan})

        // ctach errors
        }catch(error){
            console.error(error.message);
            res.status(500).send(" Internal Server Error")
        }
    })


// Route 2: Authenticate a user useing POST '/api/auth/login'. No login required
router.post('/login', [
    body('email',"Enter a valid email").isEmail(),
    body('password',"Password connot be blank").exists()
] , async (req, res)=>{

    let success =false;
    // If there are  errors, return Bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {email, password} = req.body
    try {
        let user =await User.findOne({email});
        if(!user){
            success = false
            return res.status(400).json({success ,error: "Pleace try to login with correct credentials"});
        }

        const passwordCompare =await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            success = false
            return res.status(400).json({error: "Pleace try to login with correct credentials"});
        }

        const data ={
            user: {
                id: user.id
            }
        }
        const authtokan = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success, authtokan})

    } catch (error) {
        console.error(error.message);
        res.status(500).send(" Internal Server Error")
    }

})

// Route 3: Get loggedin user details using:POST '/api/auth/getuser'. Login required
router.post('/getuser', fetchuser , async (req, res)=>{
try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
} catch (error) {
    console.error(error.message);
    res.status(500).send(" Internal Server Error")
}
})


module.exports = router