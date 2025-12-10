const Tarefa = require('../../domain/entities/Tarefa');

class TarefaService {
  constructor(tarefaRepository, projetoRepository) {
    this.tarefaRepository = tarefaRepository;
    this.projetoRepository = projetoRepository;
  }

  async criar(titulo, status, prioridade, prazo, projetoId, usuarioId) {
    // Verificar se projeto existe e se usuário é dono
    const projeto = await this.projetoRepository.findById(projetoId);
    if (!projeto) {
      throw new Error('Projeto não encontrado');
    }

    if (!projeto.podeSerEditadoPor(usuarioId)) {
      throw new Error('Você não tem permissão para adicionar tarefas neste projeto');
    }

    const tarefa = new Tarefa({ titulo, status, prioridade, prazo, projetoId });
    tarefa.validar();

    // Validar prazo do projeto
    if (new Date(prazo) > projeto.prazo) {
      throw new Error('Prazo da tarefa não pode exceder o prazo do projeto');
    }

    return await this.tarefaRepository.create(tarefa);
  }

  async listarPorProjeto(projetoId) {
    return await this.tarefaRepository.findByProjetoId(projetoId);
  }

  async obter(id) {
    return await this.tarefaRepository.findById(id);
  }

  async atualizar(id, projetoId, usuarioId, { titulo, status, prioridade, prazo }) {
    const tarefa = await this.tarefaRepository.findById(id);
    if (!tarefa) {
      throw new Error('Tarefa não encontrada');
    }

    if (tarefa.projetoId !== projetoId) {
      throw new Error('Tarefa não pertence a este projeto');
    }

    const projeto = await this.projetoRepository.findById(projetoId);
    if (!projeto || !projeto.podeSerEditadoPor(usuarioId)) {
      throw new Error('Você não tem permissão para editar esta tarefa');
    }

    if (new Date(prazo) > projeto.prazo) {
      throw new Error('Prazo da tarefa não pode exceder o prazo do projeto');
    }

    const atualizada = new Tarefa({ 
      ...tarefa, 
      titulo, 
      status, 
      prioridade, 
      prazo 
    });
    atualizada.validar();

    return await this.tarefaRepository.update(atualizada);
  }

  async excluir(id, projetoId, usuarioId) {
    const tarefa = await this.tarefaRepository.findById(id);
    if (!tarefa) {
      throw new Error('Tarefa não encontrada');
    }

    const projeto = await this.projetoRepository.findById(projetoId);
    if (!projeto || !projeto.podeSerEditadoPor(usuarioId)) {
      throw new Error('Você não tem permissão para excluir esta tarefa');
    }

    await this.tarefaRepository.deleteById(id);
  }

  async obterEstatisticas(projetoId) {
    const tarefas = await this.tarefaRepository.findByProjetoId(projetoId);
    
    return {
      total: tarefas.length,
      porStatus: {
        pendente: tarefas.filter(t => t.status === 'pendente').length,
        em_progresso: tarefas.filter(t => t.status === 'em_progresso').length,
        concluida: tarefas.filter(t => t.status === 'concluida').length,
      },
      porPrioridade: {
        baixa: tarefas.filter(t => t.prioridade === 'baixa').length,
        média: tarefas.filter(t => t.prioridade === 'média').length,
        alta: tarefas.filter(t => t.prioridade === 'alta').length,
      }
    };
  }
}

module.exports = TarefaService;