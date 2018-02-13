'use strict'

const mongoose = require('mongoose');
const Category = mongoose.model('Category');

// admin new page
exports.new = async function (ctx, next) {
  await ctx.render('pages/category_admin', {
    title: 'imooc 后台分类录入页',
    category: {}
  });
}

// admin post movie
exports.save = async function (ctx, next) {
  let _category = ctx.request.body.category;
  let category = new Category(_category);

  await ctx.save();

  this.redirect('/admin/category/list');
}

// catelist page
exports.list = async function (ctx, next) {
  let catetories = await ctx.find({}).exec();

  await ctx.render('pages/categorylist', {
    title: 'imooc 分类列表页',
    catetories: catetories
  });
}
