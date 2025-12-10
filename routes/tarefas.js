const express = require('express');
const router = express.Router();
const { validate } = require('../middlewares/validate');
const asyncHandler = require('../middlewares/asyncHandler');
const { verificarAuth } = require('../middlewares/auth');
const container = require('../container');
const TarefaController = require('../controllers/TarefaController');

const controller = new TarefaController(
  container.tarefaService,
  container.projetoService
);

router.use(verificarAuth);

// GET /tarefas/:projetoId/lista
router.get('/:projetoId/lista', asyncHandler(controller.lista.bind(controller)));

// GET /tarefas/:projetoId/nova
router.get('/:projetoId/nova', asyncHandler(controller.telaForm.bind(controller)));

// POST /tarefas/:projetoId/nova
router.post('/:projetoId/nova',
  validate(controller.regras()),
  asyncHandler(controller.criar.bind(controller))
);

// GET /tarefas/:projetoId/:id/editar
router.get('/:projetoId/:id/editar', asyncHandler(controller.telaForm.bind(controller)));

// POST /tarefas/:projetoId/:id/editar
router.post('/:projetoId/:id/editar',
  validate(controller.regras()),
  asyncHandler(controller.editar.bind(controller))
);

// POST /tarefas/:projetoId/:id/excluir
router.post('/:projetoId/:id/excluir', asyncHandler(controller.excluir.bind(controller)));

// GET /tarefas/dashboard
router.get('/dashboard', asyncHandler(controller.dashboard.bind(controller)));

module.exports = router;