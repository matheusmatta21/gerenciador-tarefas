const ProjetoRepository = require('../../domain/ports/ProjetoRepository');
const Projeto = require('../../domain/entities/Projeto');

class ProjetoRepositorySequelize extends ProjetoRepository {
  constructor(ProjetoModel) {
    super();
    this.ProjetoModel = ProjetoModel;
  }

  _rowToEntity(row) {
    if (!row) return null;
    return new Projeto({
      id: row.id,
      titulo: row.titulo,
      descricao: row.descricao,
      prazo: row.prazo,
      ownerId: row.ownerId,
      criadoEm: row.criado_em,
    });
  }

  async create(projeto) {
    const row = await this.ProjetoModel.create({
      titulo: projeto.titulo,
      descricao: projeto.descricao,
      prazo: projeto.prazo,
      ownerId: projeto.ownerId,
    });
    return this._rowToEntity(row.toJSON());
  }

  async findAll(ownerId) {
    const rows = await this.ProjetoModel.findAll({
      where: { ownerId },
      order: [['criado_em', 'DESC']],
    });
    return rows.map(r => this._rowToEntity(r.toJSON()));
  }

  async findById(id) {
    const row = await this.ProjetoModel.findByPk(id);
    return this._rowToEntity(row ? row.toJSON() : null);
  }

  async update(projeto) {
    await this.ProjetoModel.update(
      {
        titulo: projeto.titulo,
        descricao: projeto.descricao,
        prazo: projeto.prazo,
      },
      { where: { id: projeto.id } }
    );
    const row = await this.ProjetoModel.findByPk(projeto.id);
    return this._rowToEntity(row ? row.toJSON() : null);
  }

  async deleteById(id) {
    await this.ProjetoModel.destroy({ where: { id } });
  }
}

module.exports = ProjetoRepositorySequelize;