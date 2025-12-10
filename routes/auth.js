const express = require('express');
const router = express.Router();
const { validate } = require('../middlewares/validate');
const asyncHandler = require('../middlewares/asyncHandler');
const container = require('../container');
const AuthController = require('../controllers/AuthController');

const controller = new AuthController(container.authService);

// GET /auth/registro
router.get('/registro', asyncHandler(controller.telaRegistro.bind(controller)));

// POST /auth/registro
router.post('/registro',
  validate(controller.regrasRegistro()),
  asyncHandler(controller.registrar.bind(controller))
);

// GET /auth/login
router.get('/login', asyncHandler(controller.telaLogin.bind(controller)));

// POST /auth/login
router.post('/login',
  validate(controller.regrasLogin()),
  asyncHandler(controller.login.bind(controller))
);

// GET /auth/logout
router.get('/logout', asyncHandler(controller.logout.bind(controller)));

module.exports = router;