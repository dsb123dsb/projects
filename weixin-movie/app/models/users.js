const mongoose = require('mongoose');
const UserSchema = require('../schemas/users');
const User = mongoose.model('User', UserSchema);

module.exports=User;