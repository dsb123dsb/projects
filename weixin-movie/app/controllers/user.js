'use strict'

const mongoose = require('mongoose');
const User = mongoose.model('User');

// signup
exports.showSignup = async function (ctx, next) {
  await ctx.render('pages/signup', {
    title: '注册页面'
  });
};

exports.showSignin = async function (ctx, next) {
  await ctx.render('pages/signin', {
    title: '登录页面'
  });
};

exports.signup = async function (ctx, next) {
  let _user = ctx.request.body.user;

  let user = await User.findOne({name: _user.name}).exec();

  if (user) {
    ctx.redirect('pages/signin');

    return next;
  }
  else {
    user = new User(_user);
    await user.save();

    ctx.session.user = user;

    ctx.redirect('/');
  }
};

// signin
exports.signin = async function (ctx, next) {
  let _user = ctx.request.body.user;
  let name = _user.name;
  let password = _user.password;

  let user = await User.findOne({name: name}).exec();

  if (!user) {
    ctx.redirect('pages/signup');

    return next;
  }

  let isMatch = await user.comparePassword(password, user.password);

  if (isMatch) {
    ctx.session.user = user;

    ctx.redirect('/');
  }
  else {
    ctx.redirect('pages/signin');
  }
};

// logout
exports.logout = async function (ctx, next) {
  delete ctx.session.user;
  //delete app.locals.user

  ctx.redirect('/');
};

// userlist page
exports.list = async function (ctx, next) {
  let users = await User
    .find({})
    .sort('meta.updateAt')
    .exec();

  await ctx.render('pages/userlist', {
    title: 'imooc 用户列表页',
    users: users
  });
};

// midware for user
exports.signinRequired = async function (ctx, next) {
  let user = ctx.session.user;

  if (!user) {
    ctx.redirect('pages/signin');
  }
  else {
    await next();
  }
};

exports.adminRequired = async function (ctx, next) {
  let user = ctx.session.user;

  if (user.role <= 10) {
    ctx.redirect('pages/signin');
  }
  else {
    await next();
  }
};
