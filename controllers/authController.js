const { promisify } = require("util");
const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const { error } = require("console");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(201).json({
      status: "Success",
      data: { newUser, token },
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: err.message,
    });
  }
};

exports.logout = async(req, res)=>{
  
}

exports.login = async (req, res) => {
  
  try {
    const { email, password } = req.body;
    //1. check email and password exist
    if (!email || !password) {
      throw new Error("Please provide email and password");
    }
    //2. check if user exist and password correct
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
      throw new Error("Incorrect email or password");
    }
    const token = signToken(user.id);
    //3. if everything is ok, send token to client
    res.status(200).json({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: err.message,
    });
  }
};

exports.protect = async (req, res, next) => {
  //1. Getting token
  let token;
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      throw new Error("User not authenticated");
    }
    //2. Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log("decoded", decoded);
    //3. Check if user still exist
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      throw new Error("user no exist");
    }
    //4. Check user change password after token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      throw new Error("User changed password");
    }
    //Grant access
    req.user = currentUser;
    next();
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: err.message,
    });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if(!roles.includes(req.user.role)){
      return next(res.status(403).json({
        status: "Fail",
        message: "Your are not authorized to access ths data"
      }))
    }
    next()
  }
}