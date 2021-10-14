//Attaques XSS et CSRF
const session = require('express-session');

const expiryDate = new Date(Date.now() + 60 * 60 * 1000)

const expressSession = session({
    secret: "SopOPC20",
    name: "sessionId",
    cookie: {secure: true, httpOnly: true, sameSite: true, path: "/api/", expires: expiryDate}
});

module.exports = expressSession;
