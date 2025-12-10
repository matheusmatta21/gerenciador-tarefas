const { DataTypes } = require('sequelize');

function defineTarefaModel(sequelize) {
  const TarefaModel = sequelize.define('Tarefa', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titulo: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pendente', 'em_progresso', 'concluida'),
      allowNull: false,
      defaultValue: 'pendente',
    },
    prioridade: {
      type: DataTypes.ENUM('baixa', 'média', 'alta'),
      allowNull: false,
      defaultValue: 'média',
    },
    prazo: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    projetoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'projetos',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  }, {
    tableName: 'tarefas',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em',
  });

  return TarefaModel;
}

module.exports = { defineTarefaModel };