const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require("validator");
const User = require('../models/User');
const dotenv = require('dotenv');
const ebg13 = require('ebg13');
dotenv.config({ path: './.env' });

exports.signup = (req, res, next) => {
    if (validator.isEmail(req.body.email) !== true) {
        return res.status(401).json({error: "Email non valid"});
    }
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regexPassword.test(req.body.password)){
        return res.status(406).json({ message: 'Password should be 8 characters with at least 1 number, 1 symbol and 1 uppercase letter !' })
    }
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
        user.email = ebg13(req.body.email, 12);
        user.save()
            .then(() => res.status(201).json({ message: 'User created!' }))
            .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({email: ebg13(req.body.email, 12)})
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Email/Mot de passe invalid !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
