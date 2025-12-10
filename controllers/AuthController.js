const { body, validationResult } = require('express-validator');

const regrasRegistro = [
  body('nome').trim().isLength({ min: 3, max: 100 })
    .withMessage('Nome deve ter 3-100 caracteres'),
  body('email').trim().isEmail()
    .withMessage('Email inválido'),
  body('senha').isLength({ min: 6, max: 64 })
    .withMessage('Senha deve ter 6-64 caracteres'),
];

const regrasLogin = [
  body('email').trim().isEmail()
    .withMessage('Email inválido'),
  body('senha').notEmpty()
    .withMessage('Senha obrigatória'),
];

class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  regrasRegistro() { return regrasRegistro; }
  regrasLogin() { return regrasLogin; }

  async telaRegistro(req, res) {
    res.render('auth/registro', { 
      title: 'Registrar',
      data: {},
      errors: {}
    });
  }

  async registrar(req, res) {
    if (req.validationMapped) {
      return res.status(400).render('auth/registro', {
        title: 'Registrar',
        data: req.body,
        errors: req.validationMapped,
      });
    }

    try {
      const usuario = await this.authService.registrar(
        req.body.nome,
        req.body.email,
        req.body.senha
      );

      const { token } = await this.authService.autenticar(
        req.body.email,
        req.body.senha
      );

      res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
      return res.redirect('/projetos/lista');
    } catch (error) {
      return res.status(400).render('auth/registro', {
        title: 'Registrar',
        data: req.body,
        errors: { geral: { msg: error.message } },
      });
    }
  }

  async telaLogin(req, res) {
    res.render('auth/login', {
      title: 'Login',
      data: {},
      errors: {},
    });
  }

  async login(req, res) {
    if (req.validationMapped) {
      return res.status(400).render('auth/login', {
        title: 'Login',
        data: req.body,
        errors: req.validationMapped,
      });
    }

    try {
      const { usuario, token } = await this.authService.autenticar(
        req.body.email,
        req.body.senha
      );

      res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
      return res.redirect('/projetos/lista');
    } catch (error) {
      return res.status(400).render('auth/login', {
        title: 'Login',
        data: req.body,
        errors: { geral: { msg: error.message } },
      });
    }
  }

  async logout(req, res) {
    res.clearCookie('token');
    res.redirect('/');
  }
}

module.exports = AuthController;