const jwt = require('jsonwebtoken');
const container = require('../container');

function verificarAuth(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/auth/login');
  }

  try {
    const decoded = container.authService.verificarToken(token);
    req.usuario = decoded;
    next();
  } catch (error) {
    res.clearCookie('token');
    res.redirect('/auth/login');
  }
}

module.exports = { verificarAuth };