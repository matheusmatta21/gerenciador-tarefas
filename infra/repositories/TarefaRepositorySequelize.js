const TarefaRepository = require('../../domain/ports/TarefaRepository');
const Tarefa = require('../../domain/entities/Tarefa');

class TarefaRepositorySequelize extends TarefaRepository {
  constructor(TarefaModel) {
    super();
    this.TarefaModel = TarefaModel;
  }

  _rowToEntity(row) {
    if (!row) return null;
    return new Tarefa({
      id: row.id,
      titulo: row.titulo,
      status: row.status,
      prioridade: row.prioridade,
      prazo: row.prazo,
      projetoId: row.projetoId,
      criadoEm: row.criado_em,
    });
  }

  async create(tarefa) {
    const row = await this.TarefaModel.create({
      titulo: tarefa.titulo,
      status: tarefa.status,
      prioridade: tarefa.prioridade,
      prazo: tarefa.prazo,
      projetoId: tarefa.projetoId,
    });
    return this._rowToEntity(row.toJSON());
  }

  async findByProjetoId(projetoId) {
    const rows = await this.TarefaModel.findAll({
      where: { projetoId },
      order: [['criado_em', 'DESC']],
    });
    return rows.map(r => this._rowToEntity(r.toJSON()));
  }

  async findById(id) {
    const row = await this.TarefaModel.findByPk(id);
    return this._rowToEntity(row ? row.toJSON() : null);
  }

  async update(tarefa) {
    await this.TarefaModel.update(
      {
        titulo: tarefa.titulo,
        status: tarefa.status,
        prioridade: tarefa.prioridade,
        prazo: tarefa.prazo,
      },
      { where: { id: tarefa.id } }
    );
    const row = await this.TarefaModel.findByPk(tarefa.id);
    return this._rowToEntity(row ? row.toJSON() : null);
  }

  async deleteById(id) {
    await this.TarefaModel.destroy({ where: { id } });
  }
}

module.exports = TarefaRepositorySequelize;