const userModel = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const auth = require("../middleware/auth");

//user login implementation
const login = async (req, res) => {
  console.log(req.body)
  try {
    const { email, password } = req.body;
    // validate
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Not all fields have been entered." });

    const user = await userModel.findOne({ email: email });
    if (!user)
      return res
        .status(400)
        .json({ message: "No account with this email has been registered.", success: false });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res
        .status(400)
        .json({ message: "Invalid credentials.", success: false });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);

    res.json({
      token,
      response: user,
      message: "User logged in successfully...",
      success: true,
    });

  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
}

//registeing new users
const register = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    // validate
    console.log('name-email-passowrd ;', req.body)
    if (!email || !password || !name)
      return res.status(400).json({ message: "Not all fields have been entered.", success: false });

    if (password.length < 5)
      return res
        .status(400)
        .json({ message: "The password needs to be at least 5 characters long.", success: false });


    const existingUser = await userModel.findOne({ email: email });
    if (existingUser)
      return res
        .status(400)
        .json({ message: "An account with this email already exists.", success: false });

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = new userModel({
      email,
      password: passwordHash,
      name,
    });
    const savedUser = await newUser.save();
    res.json({ message: 'user created successfully', user: savedUser, success: true });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

const index = async (req, res, next) => {
  try {
    const users = await userModel.find();
    res.status(200).json({ response: users, success: true })
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

const show = async (req, res) => {
  let userID = req.params.id;
  try {
    const user = await userModel.findById(userID);

    res.status(200).json({ response: user, success: true });

  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

const update = async (req, res) => {
  let userID = req.params.id;

  // console.log('user id - ');
  const updatedData = req.body;

  //console.log("user Data : ",updatedData)

  if (!userID) {
    res.status(401).json({ message: 'please provide user id', success: false });
  }

  try {
    await userModel.findByIdAndUpdate(userID, { $set: updatedData });
    res.status(200).json({ message: "Record Updated Successfully...!", success: true });
  } catch (error) {
    res.status(401).json({ message: error.message, success: false });
  }
};

const destroy = async (req, res) => {
  let userID = req.params.id;

  if (!userID) {
    res.status(400).json({ message: 'please provide user id', success: false });
  }

  try {
    await userModel.findOneAndRemove(userID).then(() => {
      res.status(200).json({ message: "Record Deleted Successfully...!", success: true });
    });
  } catch (error) {
    res.status(404).json({ message: error.message, success: false });
  }
};

const updateCart = async (req, res) => {
  let userID = req.params.id;
  
  let productId = req.body.productId
  console.log('cart product id - ', productId);

  if (!userID) {
    res.status(401).json({ message: 'please provide product id', success: false });
  }


  // let test = ["1","2","3"]

  // const newPeople = test.filter((person) => person !== "2");

  // console.log("newPeople",newPeople)


  try {

    const user = await userModel.findById(userID);

    const cartData = user.cart

    if (cartData.length > 0) {

      cartData.push(productId);

      await userModel.findByIdAndUpdate(userID, { $set: { cart: cartData } });
      res.status(200).json({ message: "Record Updated Successfully...!", success: true });

    } else {
      console.log("else")
      await userModel.findByIdAndUpdate(userID, { $set: { cart: [productId] } });
      res.status(200).json({ message: "Record Updated Successfully...!", success: true });

    }

  } catch (error) {
    res.status(401).json({ message: error.message, success: false });
  }
};

const updateWishlist = async (req, res) => {
  let userID = req.params.id;

  let productId = req.body.productId

  if (!userID) {
    res.status(401).json({ message: 'please provide product id', success: false });
  }



  try {

    const user = await userModel.findById(userID);

    const wishlistData = user.wishlist

    if (wishlistData.length > 0) {

      wishlistData.push(productId);

      await userModel.findByIdAndUpdate(userID, { $set: { wishlist: wishlistData } });
      res.status(200).json({ message: "Record Updated Successfully...!", success: true });

    } else {
      await userModel.findByIdAndUpdate(userID, { $set: { wishlist: [productId] } });
      res.status(200).json({ message: "Record Updated Successfully...!", success: true });

    }

  } catch (error) {
    res.status(401).json({ message: error.message, success: false });
  }
};

const removeCart = async (req, res) => {
  let userID = req.params.id;

  let productId = req.body.productId

  if (!userID) {
    res.status(401).json({ message: 'please provide product id', success: false });
  }


  try {

    const user = await userModel.findById(userID);

    const cartData = user.cart

    const filterData = cartData.filter((cart) => cart !== productId);

    await userModel.findByIdAndUpdate(userID, { $set: { cart: filterData } });
    res.status(200).json({ message: "Cart Updated Successfully...!", success: true });



    // if (cartData.length > 0) {



    //   cartData.push(productId);

    //   await userModel.findByIdAndUpdate(userID, { $set: { cart: cartData } });
    //   res.status(200).json({ message: "Record Updated Successfully...!", success: true });

    // } else {
    //   console.log("else")
    //   await userModel.findByIdAndUpdate(userID, { $set: { cart: [productId] } });
    //   res.status(200).json({ message: "Record Updated Successfully...!", success: true });

    // }

  } catch (error) {
    res.status(401).json({ message: error.message, success: false });
  }
};



module.exports = {
  register,
  login,
  update,
  destroy,
  index,
  show,
  updateCart,
  updateWishlist,
  removeCart
};
