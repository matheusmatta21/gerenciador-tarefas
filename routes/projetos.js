const express = require('express');
const router = express.Router();
const { validate } = require('../middlewares/validate');
const asyncHandler = require('../middlewares/asyncHandler');
const { verificarAuth } = require('../middlewares/auth');
const container = require('../container');
const ProjetoController = require('../controllers/ProjetoController');

const controller = new ProjetoController(container.projetoService);

// Todas as rotas requerem autenticação
router.use(verificarAuth);

// GET /projetos/lista
router.get('/lista', asyncHandler(controller.lista.bind(controller)));

// GET /projetos/novo
router.get('/novo', asyncHandler(controller.telaForm.bind(controller)));

// POST /projetos/novo
router.post('/novo',
  validate(controller.regras()),
  asyncHandler(controller.criar.bind(controller))
);

// GET /projetos/:id/editar
router.get('/:id/editar', asyncHandler(controller.telaForm.bind(controller)));

// POST /projetos/:id/editar
router.post('/:id/editar',
  validate(controller.regras()),
  asyncHandler(controller.editar.bind(controller))
);

// POST /projetos/:id/excluir
router.post('/:id/excluir', asyncHandler(controller.excluir.bind(controller)));

module.exports = router;