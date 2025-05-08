document.addEventListener("DOMContentLoaded", () => {
  // Dados simulados de unidades de saúde
  const unidadesSaude = [
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
    },
  ]

  const searchInput = document.getElementById("search-term")
  const serviceFilter = document.getElementById("service-filter")
  const neighborhoodFilter = document.getElementById("neighborhood-filter")
  const unitsContainer = document.getElementById("units-container")
  const noResults = document.getElementById("no-results")

  // Função para filtrar unidades
  function filterUnits() {
    const searchTerm = searchInput.value.toLowerCase()
    const serviceValue = serviceFilter.value
    const neighborhoodValue = neighborhoodFilter.value

    // Filtrar unidades com base nos critérios
    const filteredUnits = unidadesSaude.filter((unidade) => {
      const matchSearch =
        unidade.nome.toLowerCase().includes(searchTerm) ||
        unidade.servicos.some((servico) => servico.toLowerCase().includes(searchTerm))

      const matchService = serviceValue === "todos" || unidade.servicos.includes(serviceValue)

      const matchNeighborhood = neighborhoodValue === "todos" || unidade.bairro === neighborhoodValue

      return matchSearch && matchService && matchNeighborhood
    })

    // Renderizar unidades filtradas
    renderUnits(filteredUnits)
  }

  // Função para renderizar unidades na tela
  function renderUnits(units) {
    // Limpar container
    unitsContainer.innerHTML = ""

    if (units.length === 0) {
      // Mostrar mensagem de nenhum resultado
      noResults.style.display = "block"
    } else {
      // Esconder mensagem de nenhum resultado
      noResults.style.display = "none"

      // Renderizar cada unidade
      units.forEach((unidade) => {
        const unitCard = document.createElement("div")
        unitCard.className = "unit-card"

        // Determinar classe do badge com base na lotação
        let badgeClass = ""
        if (unidade.lotacao === "Baixa") {
          badgeClass = "badge-success"
        } else if (unidade.lotacao === "Média") {
          badgeClass = "badge-warning"
        } else {
          badgeClass = "badge-error"
        }

        unitCard.innerHTML = `
          <div class="unit-header">
            <div>
              <h3 class="unit-title">${unidade.nome}</h3>
              <div class="unit-address">
                <i class="fas fa-map-marker-alt"></i> ${unidade.endereco}
              </div>
            </div>
            <span class="unit-badge ${badgeClass}">Lotação ${unidade.lotacao}</span>
          </div>
          <div class="unit-content">
            <div class="unit-info">
              <i class="fas fa-clock"></i>
              <span>${unidade.horario}</span>
            </div>
            <div class="unit-info">
              <i class="fas fa-phone"></i>
              <span>${unidade.telefone}</span>
            </div>
            <div class="unit-info">
              <i class="fas fa-file-alt"></i>
              <div class="unit-docs">
                <p><strong>Documentos necessários:</strong></p>
                <ul>
                  ${unidade.documentos.map((doc) => `<li>${doc}</li>`).join("")}
                </ul>
              </div>
            </div>
          </div>
          <div class="unit-footer">
            ${unidade.servicos.map((servico) => `<span class="unit-badge badge-outline">${servico}</span>`).join("")}
          </div>
        `

        unitsContainer.appendChild(unitCard)
      })
    }
  }

  // Adicionar event listeners para os filtros
  searchInput.addEventListener("input", filterUnits)
  serviceFilter.addEventListener("change", filterUnits)
  neighborhoodFilter.addEventListener("change", filterUnits)

  // Inicializar a página com todas as unidades
  filterUnits()
})
