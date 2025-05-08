/**
 * Serviço para consumir a futura API de unidades de saúde
 */
class ApiService {
  constructor() {
    // URL base da API - substituir quando a API real estiver disponível
    this.baseUrl = "https://api.saude-publica.exemplo.com"
  }

  /**
   * Método para buscar todas as unidades de saúde
   * @returns {Promise} Promise com os dados das unidades
   */
  async buscarUnidades() {
    try {
      // Quando a API estiver disponível, descomentar o código abaixo
      // const response = await fetch(`${this.baseUrl}/unidades`);
      // if (!response.ok) throw new Error('Erro ao buscar unidades');
      // return await response.json();

      // Dados simulados - remover quando a API estiver disponível
      return this.dadosSimulados()
    } catch (error) {
      console.error("Erro ao buscar unidades:", error)
      throw error
    }
  }

  /**
   * Método para buscar uma unidade específica por ID
   * @param {string} id ID da unidade
   * @returns {Promise} Promise com os dados da unidade
   */
  async buscarUnidadePorId(id) {
    try {
      // Quando a API estiver disponível, descomentar o código abaixo
      // const response = await fetch(`${this.baseUrl}/unidades/${id}`);
      // if (!response.ok) throw new Error('Erro ao buscar unidade');
      // return await response.json();

      // Dados simulados - remover quando a API estiver disponível
      const unidades = this.dadosSimulados()
      return unidades.find((unidade) => unidade.id === Number.parseInt(id))
    } catch (error) {
      console.error(`Erro ao buscar unidade ${id}:`, error)
      throw error
    }
  }

  /**
   * Método para buscar a localização geográfica de uma unidade
   * @param {string} id ID da unidade
   * @returns {Promise} Promise com os dados de localização
   */
  async buscarLocalizacaoUnidade(id) {
    try {
      // Quando a API estiver disponível, descomentar o código abaixo
      // const response = await fetch(`${this.baseUrl}/unidades/${id}/localizacao`);
      // if (!response.ok) throw new Error('Erro ao buscar localização');
      // return await response.json();

      // Dados simulados - remover quando a API estiver disponível
      const localizacoes = {
        1: { latitude: -23.55052, longitude: -46.633308, endereco: "Av. Principal, 123 - Centro" },
        2: { latitude: -23.55792, longitude: -46.63982, endereco: "Rua das Flores, 456 - Jardim" },
        3: { latitude: -23.54568, longitude: -46.62859, endereco: "Rua dos Médicos, 789 - Vila Nova" },
        4: { latitude: -23.56284, longitude: -46.64521, endereco: "Rua da Esperança, 321 - Vila Esperança" },
      }

      return localizacoes[id] || null
    } catch (error) {
      console.error(`Erro ao buscar localização da unidade ${id}:`, error)
      throw error
    }
  }

  /**
   * Método para filtrar unidades por critérios
   * @param {Object} filtros Objeto com os filtros a serem aplicados
   * @returns {Promise} Promise com os dados filtrados
   */
  async filtrarUnidades(filtros) {
    try {
      // Quando a API estiver disponível, descomentar o código abaixo
      // const queryParams = new URLSearchParams(filtros).toString();
      // const response = await fetch(`${this.baseUrl}/unidades/filtrar?${queryParams}`);
      // if (!response.ok) throw new Error('Erro ao filtrar unidades');
      // return await response.json();

      // Dados simulados com filtragem local - remover quando a API estiver disponível
      let unidades = this.dadosSimulados()

      if (filtros.busca) {
        const termoBusca = filtros.busca.toLowerCase()
        unidades = unidades.filter(
          (unidade) =>
            unidade.nome.toLowerCase().includes(termoBusca) ||
            unidade.servicos.some((servico) => servico.toLowerCase().includes(termoBusca)),
        )
      }

      if (filtros.servico && filtros.servico !== "todos") {
        unidades = unidades.filter((unidade) => unidade.servicos.includes(filtros.servico))
      }

      if (filtros.bairro && filtros.bairro !== "todos") {
        unidades = unidades.filter((unidade) => unidade.bairro === filtros.bairro)
      }

      return unidades
    } catch (error) {
      console.error("Erro ao filtrar unidades:", error)
      throw error
    }
  }

  /**
   * Dados simulados para desenvolvimento
   * @returns {Array} Array com dados simulados de unidades
   */
  dadosSimulados() {
    return [
      {
        id: 1,
        nome: "UBS Central",
        endereco: "Av. Principal, 123 - Centro",
        bairro: "Centro",
        telefone: "(11) 3333-4444",
        horario: "Segunda a Sexta: 7h às 19h",
        documentos: ["RG", "CPF", "Cartão SUS", "Comprovante de Residência"],
        servicos: ["Consulta Médica", "Vacina", "Exames Laboratoriais"],
        lotacao: "Baixa",
        coordenadas: {
          latitude: -23.55052,
          longitude: -46.633308,
        },
      },
      {
        id: 2,
        nome: "Hospital Municipal",
        endereco: "Rua das Flores, 456 - Jardim",
        bairro: "Jardim",
        telefone: "(11) 5555-6666",
        horario: "24 horas",
        documentos: ["RG", "CPF", "Cartão SUS"],
        servicos: ["Emergência", "Consulta Médica", "Cirurgia", "Internação"],
        lotacao: "Alta",
        coordenadas: {
          latitude: -23.55792,
          longitude: -46.63982,
        },
      },
      {
        id: 3,
        nome: "Centro de Especialidades",
        endereco: "Rua dos Médicos, 789 - Vila Nova",
        bairro: "Vila Nova",
        telefone: "(11) 7777-8888",
        horario: "Segunda a Sexta: 8h às 18h",
        documentos: ["RG", "CPF", "Cartão SUS", "Encaminhamento Médico"],
        servicos: ["Consulta Especializada", "Exames de Imagem"],
        lotacao: "Média",
        coordenadas: {
          latitude: -23.54568,
          longitude: -46.62859,
        },
      },
      {
        id: 4,
        nome: "UBS Vila Esperança",
        endereco: "Rua da Esperança, 321 - Vila Esperança",
        bairro: "Vila Esperança",
        telefone: "(11) 2222-3333",
        horario: "Segunda a Sexta: 7h às 17h",
        documentos: ["RG", "CPF", "Cartão SUS", "Comprovante de Residência"],
        servicos: ["Consulta Médica", "Vacina", "Pré-natal"],
        lotacao: "Baixa",
        coordenadas: {
          latitude: -23.56284,
          longitude: -46.64521,
        },
      },
    ]
  }
}

// Exportar uma instância única do serviço
const apiService = new ApiService()
export default apiService
