const userModel = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv')
dotenv.config();

const verifyToken = async (req, res, next) => {
  //mongodb://localhost:27017/ecomm
  try {
    const authHeader = req.header("Authorization");
    //console.log(authHeader);
    const token = authHeader && authHeader.split(" ")[1];
    //console.log(token);

    if (!token) 
        return res.status(401).json({message: 'please provide token', success: false});

    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log('token verification - ', verified);
    if (!verified) 
        // return res.json(false);
        return res.status(401).json({message: 'invalid token', success: false});


    const user = await userModel.findById(verified.id);
    console.log('found user in auth  - ', user);
    if (!user) 
        //return res.json(false);
        return res.status(401).json({message: 'authetication failed', success: false});

    next()

  } catch (err) {
      res.status(500).json({ message: err.message, success: false});
  }
};

module.exports = { verifyToken };
