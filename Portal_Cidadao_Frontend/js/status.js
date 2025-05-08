document.addEventListener("DOMContentLoaded", () => {
  // Dados simulados de lotação
  const dadosLotacao = [
    {
      id: 1,
      nome: "UBS Central",
      endereco: "Av. Principal, 123 - Centro",
      percentual: 30,
      tempoEspera: "10 minutos",
      status: "Baixa",
    },
    {
      id: 2,
      nome: "Hospital Municipal",
      endereco: "Rua das Flores, 456 - Jardim",
      percentual: 85,
      tempoEspera: "2 horas",
      status: "Alta",
    },
    {
      id: 3,
      nome: "Centro de Especialidades",
      endereco: "Rua dos Médicos, 789 - Vila Nova",
      percentual: 60,
      tempoEspera: "45 minutos",
      status: "Média",
    },
    {
      id: 4,
      nome: "UBS Vila Esperança",
      endereco: "Rua da Esperança, 321 - Vila Esperança",
      percentual: 25,
      tempoEspera: "15 minutos",
      status: "Baixa",
    },
  ]

  const statusContainer = document.getElementById("status-container")
  const lastUpdateSpan = document.getElementById("last-update")

  // Atualizar horário da última atualização
  if (lastUpdateSpan) {
    lastUpdateSpan.textContent = new Date().toLocaleTimeString()
  }

  // Função para filtrar unidades por status
  function handleFilterChange(filter) {
    let filteredUnits

    if (filter === "todos") {
      filteredUnits = dadosLotacao
    } else {
      filteredUnits = dadosLotacao.filter((unidade) => unidade.status.toLowerCase() === filter)
    }

    renderStatusCards(filteredUnits)
  }

  // Função para renderizar cards de status
  function renderStatusCards(units) {
    if (!statusContainer) return

    // Limpar container
    statusContainer.innerHTML = ""

    // Renderizar cada unidade
    units.forEach((unidade) => {
      const statusCard = document.createElement("div")
      statusCard.className = "status-card"

      // Determinar classe do badge e da barra de progresso com base na lotação
      let badgeClass = ""
      let progressClass = ""

      if (unidade.status === "Baixa") {
        badgeClass = "badge-success"
        progressClass = "progress-low"
      } else if (unidade.status === "Média") {
        badgeClass = "badge-warning"
        progressClass = "progress-medium"
      } else {
        badgeClass = "badge-error"
        progressClass = "progress-high"
      }

      // Criar mensagem de alerta com base na lotação
      let alertMessage = ""

      if (unidade.percentual > 80) {
        alertMessage = `
          <div class="status-message warning">
            <i class="fas fa-exclamation-triangle"></i>
            <span>Recomendamos buscar outra unidade com menor lotação, se possível.</span>
          </div>
        `
      } else if (unidade.percentual < 40) {
        alertMessage = `
          <div class="status-message success">
            <i class="fas fa-check-circle"></i>
            <span>Momento ideal para atendimento com tempo de espera reduzido.</span>
          </div>
        `
      }

      statusCard.innerHTML = `
        <div class="status-header">
          <div>
            <h3 class="unit-title">${unidade.nome}</h3>
            <div class="unit-address">
              <i class="fas fa-map-marker-alt"></i> ${unidade.endereco}
            </div>
          </div>
          <span class="unit-badge ${badgeClass}">Lotação ${unidade.status}</span>
        </div>
        <div class="status-content">
          <div class="status-info">
            <div class="status-label">
              <span>Lotação atual</span>
              <span><strong>${unidade.percentual}%</strong></span>
            </div>
            <div class="progress-bar">
              <div class="progress-value ${progressClass}" style="width: ${unidade.percentual}%"></div>
            </div>
          </div>
          <div class="unit-info">
            <i class="fas fa-clock"></i>
            <span>Tempo estimado de espera: <strong>${unidade.tempoEspera}</strong></span>
          </div>
          <div class="unit-info">
            <i class="fas fa-users"></i>
            <span>Capacidade atual: <strong>${Math.round((unidade.percentual / 100) * 50)}/50</strong> pacientes</span>
          </div>
          ${alertMessage}
        </div>
      `

      statusContainer.appendChild(statusCard)
    })
  }

  // Simular atualização em tempo real
  function simulateRealTimeUpdates() {
    setInterval(() => {
      // Atualizar percentuais aleatoriamente
      dadosLotacao.forEach((unidade) => {
        // Gerar variação aleatória entre -5 e +5
        const variacao = Math.floor(Math.random() * 11) - 5

        // Aplicar variação, mantendo entre 10 e 100
        unidade.percentual = Math.min(100, Math.max(10, unidade.percentual + variacao))

        // Atualizar status com base no novo percentual
        if (unidade.percentual < 40) {
          unidade.status = "Baixa"
          unidade.tempoEspera = `${Math.round(unidade.percentual / 3)} minutos`
        } else if (unidade.percentual < 70) {
          unidade.status = "Média"
          unidade.tempoEspera = `${Math.round(unidade.percentual / 2)} minutos`
        } else {
          unidade.status = "Alta"

          // Converter para horas se for mais de 60 minutos
          const minutos = Math.round(unidade.percentual)
          if (minutos > 60) {
            const horas = Math.floor(minutos / 60)
            const minutosRestantes = minutos % 60
            unidade.tempoEspera = `${horas} hora${horas > 1 ? "s" : ""} e ${minutosRestantes} minutos`
          } else {
            unidade.tempoEspera = `${minutos} minutos`
          }
        }
      })

      // Atualizar visualização
      const activeFilter = document.querySelector(".tab-btn.active").dataset.filter
      handleFilterChange(activeFilter)

      // Atualizar horário da última atualização
      if (lastUpdateSpan) {
        lastUpdateSpan.textContent = new Date().toLocaleTimeString()
      }
    }, 10000) // Atualizar a cada 10 segundos
  }

  // Inicializar a página com todas as unidades
  renderStatusCards(dadosLotacao)

  // Expor função para o escopo global (para ser usada pelo main.js)
  window.handleFilterChange = handleFilterChange

  // Iniciar simulação de atualizações em tempo real
  simulateRealTimeUpdates()
})
