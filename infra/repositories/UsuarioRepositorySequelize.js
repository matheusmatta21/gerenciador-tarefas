const UsuarioRepository = require('../../domain/ports/UsuarioRepository');
const Usuario = require('../../domain/entities/Usuario');

class UsuarioRepositorySequelize extends UsuarioRepository {
  constructor(UsuarioModel) {
    super();
    this.UsuarioModel = UsuarioModel;
  }

  _rowToEntity(row) {
    if (!row) return null;
    return new Usuario({
      id: row.id,
      nome: row.nome,
      email: row.email,
      senha: row.senha,
      criadoEm: row.criado_em,
    });
  }

  async create(usuario) {
    const row = await this.UsuarioModel.create({
      nome: usuario.nome,
      email: usuario.email,
      senha: usuario.senha,
    });
    return this._rowToEntity(row.toJSON());
  }

  async findByEmail(email) {
    const row = await this.UsuarioModel.findOne({ where: { email } });
    return this._rowToEntity(row ? row.toJSON() : null);
  }

  async findById(id) {
    const row = await this.UsuarioModel.findByPk(id);
    return this._rowToEntity(row ? row.toJSON() : null);
  }

  async update(usuario) {
    await this.UsuarioModel.update(
      { nome: usuario.nome, email: usuario.email },
      { where: { id: usuario.id } }
    );
    const row = await this.UsuarioModel.findByPk(usuario.id);
    return this._rowToEntity(row ? row.toJSON() : null);
  }
}

module.exports = UsuarioRepositorySequelize;