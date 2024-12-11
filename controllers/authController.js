const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');

const signTocken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
};

const createSendTocken = (user, statusCode, res) => {
  const token = signTocken(user._id);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const NewUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordconfirm: req.body.passwordconfirm
  });

  createSendTocken(NewUser, 200, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new appError('Please provide Eail or Password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctpassword(password, user.password))) {
    return next(new appError('Incorrect Email or Password', 400));
  }

  createSendTocken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new appError('You are not logged in! please login first', 400));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new appError(
        'The User belonging to this Token does no longer exist!',
        400
      )
    );
  }

  if (currentUser.changedpasswordAfter(decoded.iat)) {
    return next(
      new appError('User Recently chnaged password! Please login again.', 400)
    );
  }

  req.user = currentUser;
  res.locals.user = currentUser;

  next();
});