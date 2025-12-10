const { createSequelizeInstance } = require('../infra/db/sequelize');
const { defineUsuarioModel } = require('../infra/db/models/UsuarioModel');
const { defineProjetoModel } = require('../infra/db/models/ProjetoModel');
const { defineTarefaModel } = require('../infra/db/models/TarefaModel');

const UsuarioRepositorySequelize = require('../infra/repositories/UsuarioRepositorySequelize');
const ProjetoRepositorySequelize = require('../infra/repositories/ProjetoRepositorySequelize');
const TarefaRepositorySequelize = require('../infra/repositories/TarefaRepositorySequelize');

const AuthService = require('../application/services/AuthService');
const ProjetoService = require('../application/services/ProjetoService');
const TarefaService = require('../application/services/TarefaService');

// Inicializar Sequelize
const sequelize = createSequelizeInstance();

// Definir modelos
const UsuarioModel = defineUsuarioModel(sequelize);
const ProjetoModel = defineProjetoModel(sequelize);
const TarefaModel = defineTarefaModel(sequelize);

// Sincronizar com o banco
sequelize.sync()
  .then(() => console.log('Banco de dados sincronizado'))
  .catch(err => console.error('Erro ao sincronizar:', err));

// Criar repositories
const usuarioRepository = new UsuarioRepositorySequelize(UsuarioModel);
const projetoRepository = new ProjetoRepositorySequelize(ProjetoModel);
const tarefaRepository = new TarefaRepositorySequelize(TarefaModel);

// Criar services
const authService = new AuthService(usuarioRepository);
const projetoService = new ProjetoService(projetoRepository, tarefaRepository);
const tarefaService = new TarefaService(tarefaRepository, projetoRepository);

module.exports = {
  sequelize,
  UsuarioModel,
  ProjetoModel,
  TarefaModel,
  usuarioRepository,
  projetoRepository,
  tarefaRepository,
  authService,
  projetoService,
  tarefaService,
};