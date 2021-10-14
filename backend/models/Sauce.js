const mongoose = require('mongoose');
//Gestion des erreurs de schema et erreur BDD
const mongooseErrors = require("mongoose-errors");

const sauceSchema = mongoose.Schema({
    name: { type: String, required:true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    manufacturer: { type: String, required:true },
    description: { type: String, required:true },
    mainPepper: { type: String, required:true },
    imageUrl: { type: String },
    heat: { type: Number, required:true },
    likes: { type: Number, required:true, default: 0 },
    dislikes: { type: Number, required:true, default: 0 },
    usersLiked: { type: [String], required:true, default: [] },
    usersDisliked: { type: [String], required:true, default: [] }
})

sauceSchema.plugin(mongooseErrors);
module.exports = mongoose.model('Sauce', sauceSchema);
