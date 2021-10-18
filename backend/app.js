const express = require('express');
const bodyParser = require('body-parser');
const mongoSanitize = require('express-mongo-sanitize');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

mongoose.connect(process.env.DB_NAME,
    { useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();
const corsOptions = {
    origin: "http://localhost:4200",
    optionsSuccessStatus: 200,
    allowedHeaders: 'Origin,X-Requested-With,Content,Accept,Content-Type,Authorization',
    methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS'
}

app.use(cors(corsOptions));

app.use(bodyParser.json()); //Transformer le corps de la requête en objet JS
app.use(mongoSanitize());//Chercher dans les req et supprimer toutes les clés commençant par $ ou contenant "."
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;
