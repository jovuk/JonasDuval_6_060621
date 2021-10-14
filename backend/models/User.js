const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
//Gestion des erreurs de schema et erreur BDD
const mongooseErrors = require("mongoose-errors");

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
})

userSchema.plugin(mongooseErrors);
userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);
