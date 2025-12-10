const { body, validationResult } = require('express-validator');

const regras = [
  body('titulo').trim().isLength({ min: 3, max: 100 })
    .withMessage('Título deve ter 3-100 caracteres'),
  body('descricao').trim().isLength({ min: 10, max: 500 })
    .withMessage('Descrição deve ter 10-500 caracteres'),
  body('prazo').isISO8601()
    .withMessage('Prazo inválido'),
];

class ProjetoController {
  constructor(projetoService) {
    this.projetoService = projetoService;
  }

  regras() { return regras; }

  async lista(req, res) {
    const projetos = await this.projetoService.listar(req.usuario.id);
    res.render('projetos/lista', {
      title: 'Meus Projetos',
      projetos,
    });
  }

  async telaForm(req, res) {
    if (req.params.id) {
      const projeto = await this.projetoService.obter(req.params.id);
      if (!projeto || !projeto.podeSerEditadoPor(req.usuario.id)) {
        return res.status(403).send('Acesso negado');
      }
      return res.render('projetos/form', {
        title: 'Editar Projeto',
        projeto,
        errors: {},
      });
    }

    res.render('projetos/form', {
      title: 'Novo Projeto',
      projeto: {},
      errors: {},
    });
  }

  async criar(req, res) {
    if (req.validationMapped) {
      return res.status(400).render('projetos/form', {
        title: 'Novo Projeto',
        projeto: req.body,
        errors: req.validationMapped,
      });
    }

    try {
      await this.projetoService.criar(
        req.body.titulo,
        req.body.descricao,
        req.body.prazo,
        req.usuario.id
      );
      return res.redirect('/projetos/lista');
    } catch (error) {
      return res.status(400).render('projetos/form', {
        title: 'Novo Projeto',
        projeto: req.body,
        errors: { geral: { msg: error.message } },
      });
    }
  }

  async editar(req, res) {
    if (req.validationMapped) {
      const projeto = await this.projetoService.obter(req.params.id);
      return res.status(400).render('projetos/form', {
        title: 'Editar Projeto',
        projeto: { ...projeto, ...req.body },
        errors: req.validationMapped,
      });
    }

    try {
      await this.projetoService.atualizar(
        req.params.id,
        req.usuario.id,
        {
          titulo: req.body.titulo,
          descricao: req.body.descricao,
          prazo: req.body.prazo,
        }
      );
      return res.redirect('/projetos/lista');
    } catch (error) {
      const projeto = await this.projetoService.obter(req.params.id);
      return res.status(400).render('projetos/form', {
        title: 'Editar Projeto',
        projeto,
        errors: { geral: { msg: error.message } },
      });
    }
  }

  async excluir(req, res) {
    try {
      await this.projetoService.excluir(req.params.id, req.usuario.id);
      res.redirect('/projetos/lista');
    } catch (error) {
      res.status(400).send(`Erro ao excluir: ${error.message}`);
    }
  }
}

module.exports = ProjetoController;