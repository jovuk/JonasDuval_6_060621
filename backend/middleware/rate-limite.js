const rateLimit = require('express-rate-limit');

 const limit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // limit each IP to 100 requests per windowMs
    message: 'Vous avez dépassé le nombre limite de tentatives de connexion, essayer ultérieurement ! '
});

module.exports = limit;
