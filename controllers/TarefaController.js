const { body } = require('express-validator');

const regras = [
  body('titulo').trim().isLength({ min: 3, max: 100 })
    .withMessage('Título deve ter 3-100 caracteres'),
  body('status').isIn(['pendente', 'em_progresso', 'concluida'])
    .withMessage('Status inválido'),
  body('prioridade').isIn(['baixa', 'média', 'alta'])
    .withMessage('Prioridade inválida'),
  body('prazo').isISO8601()
    .withMessage('Prazo inválido'),
];

class TarefaController {
  constructor(tarefaService, projetoService) {
    this.tarefaService = tarefaService;
    this.projetoService = projetoService;
  }

  regras() { return regras; }

  async lista(req, res) {
    const projeto = await this.projetoService.obter(req.params.projetoId);
    if (!projeto || !projeto.podeSerEditadoPor(req.usuario.id)) {
      return res.status(403).send('Acesso negado');
    }

    const tarefas = await this.tarefaService.listarPorProjeto(req.params.projetoId);
    const stats = await this.tarefaService.obterEstatisticas(req.params.projetoId);

    res.render('tarefas/lista', {
      title: `Tarefas - ${projeto.titulo}`,
      projeto,
      tarefas,
      stats,
    });
  }

  async telaForm(req, res) {
    const projeto = await this.projetoService.obter(req.params.projetoId);
    if (!projeto || !projeto.podeSerEditadoPor(req.usuario.id)) {
      return res.status(403).send('Acesso negado');
    }

    if (req.params.id) {
      const tarefa = await this.tarefaService.obter(req.params.id);
      if (!tarefa || tarefa.projetoId !== projeto.id) {
        return res.status(404).send('Tarefa não encontrada');
      }

      return res.render('tarefas/form', {
        title: 'Editar Tarefa',
        projeto,
        tarefa,
        errors: {},
      });
    }

    res.render('tarefas/form', {
      title: 'Nova Tarefa',
      projeto,
      tarefa: { status: 'pendente', prioridade: 'média' },
      errors: {},
    });
  }

  async criar(req, res) {
    if (req.validationMapped) {
      const projeto = await this.projetoService.obter(req.params.projetoId);
      return res.status(400).render('tarefas/form', {
        title: 'Nova Tarefa',
        projeto,
        tarefa: req.body,
        errors: req.validationMapped,
      });
    }

    try {
      await this.tarefaService.criar(
        req.body.titulo,
        req.body.status,
        req.body.prioridade,
        req.body.prazo,
        req.params.projetoId,
        req.usuario.id
      );
      return res.redirect(`/tarefas/${req.params.projetoId}/lista`);
    } catch (error) {
      const projeto = await this.projetoService.obter(req.params.projetoId);
      return res.status(400).render('tarefas/form', {
        title: 'Nova Tarefa',
        projeto,
        tarefa: req.body,
        errors: { geral: { msg: error.message } },
      });
    }
  }

  async editar(req, res) {
    if (req.validationMapped) {
      const projeto = await this.projetoService.obter(req.params.projetoId);
      const tarefa = await this.tarefaService.obter(req.params.id);
      return res.status(400).render('tarefas/form', {
        title: 'Editar Tarefa',
        projeto,
        tarefa: { ...tarefa, ...req.body },
        errors: req.validationMapped,
      });
    }

    try {
      await this.tarefaService.atualizar(
        req.params.id,
        req.params.projetoId,
        req.usuario.id,
        {
          titulo: req.body.titulo,
          status: req.body.status,
          prioridade: req.body.prioridade,
          prazo: req.body.prazo,
        }
      );
      return res.redirect(`/tarefas/${req.params.projetoId}/lista`);
    } catch (error) {
      const projeto = await this.projetoService.obter(req.params.projetoId);
      const tarefa = await this.tarefaService.obter(req.params.id);
      return res.status(400).render('tarefas/form', {
        title: 'Editar Tarefa',
        projeto,
        tarefa,
        errors: { geral: { msg: error.message } },
      });
    }
  }

  async excluir(req, res) {
    try {
      await this.tarefaService.excluir(
        req.params.id,
        req.params.projetoId,
        req.usuario.id
      );
      res.redirect(`/tarefas/${req.params.projetoId}/lista`);
    } catch (error) {
      res.status(400).send(`Erro ao excluir: ${error.message}`);
    }
  }

  async dashboard(req, res) {
    const projetos = await this.projetoService.listar(req.usuario.id);
    
    let totalPorStatus = { pendente: 0, em_progresso: 0, concluida: 0 };
    let totalPorPrioridade = { baixa: 0, média: 0, alta: 0 };

    for (const projeto of projetos) {
      const stats = await this.tarefaService.obterEstatisticas(projeto.id);
      Object.keys(stats.porStatus).forEach(s => {
        totalPorStatus[s] += stats.porStatus[s];
      });
      Object.keys(stats.porPrioridade).forEach(p => {
        totalPorPrioridade[p] += stats.porPrioridade[p];
      });
    }

    res.render('dashboard', {
      title: 'Dashboard',
      projetos,
      estatisticas: {
        porStatus: totalPorStatus,
        porPrioridade: totalPorPrioridade,
      },
    });
  }
}

module.exports = TarefaController;