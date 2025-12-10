const { DataTypes } = require('sequelize');

function defineProjetoModel(sequelize) {
  const ProjetoModel = sequelize.define('Projeto', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titulo: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    prazo: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id',
      },
    },
  }, {
    tableName: 'projetos',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em',
  });

  return ProjetoModel;
}

module.exports = { defineProjetoModel };