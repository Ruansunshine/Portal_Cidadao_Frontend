document.addEventListener("DOMContentLoaded", () => {
  // Dados simulados de unidades de saúde
  const unidadesSaude = [
    {
      id: "1",
      nome: "UBS Central",
      endereco: "Av. Principal, 123 - Centro",
      coordenadas: { lat: -23.55052, lng: -46.633308 },
    },
    {
      id: "2",
      nome: "Hospital Municipal",
      endereco: "Rua das Flores, 456 - Jardim",
      coordenadas: { lat: -23.55792, lng: -46.63982 },
    },
    {
      id: "3",
      nome: "Centro de Especialidades",
      endereco: "Rua dos Médicos, 789 - Vila Nova",
      coordenadas: { lat: -23.54568, lng: -46.62859 },
    },
    {
      id: "4",
      nome: "UBS Vila Esperança",
      endereco: "Rua da Esperança, 321 - Vila Esperança",
      coordenadas: { lat: -23.56284, lng: -46.64521 },
    },
  ]

  // Dados simulados de rotas de ônibus
  const rotasOnibus = [
    {
      id: "1",
      unidadeId: "1",
      linhas: [
        { numero: "123", nome: "Centro - Terminal", tempo: 15, frequencia: "10 min" },
        { numero: "456", nome: "Circular Centro", tempo: 20, frequencia: "15 min" },
        { numero: "789", nome: "Bairro - Centro", tempo: 25, frequencia: "20 min" },
      ],
    },
    {
      id: "2",
      unidadeId: "2",
      linhas: [
        { numero: "234", nome: "Jardim - Terminal", tempo: 30, frequencia: "15 min" },
        { numero: "567", nome: "Circular Jardim", tempo: 25, frequencia: "20 min" },
      ],
    },
    {
      id: "3",
      unidadeId: "3",
      linhas: [
        { numero: "345", nome: "Vila Nova - Centro", tempo: 20, frequencia: "15 min" },
        { numero: "678", nome: "Circular Vila", tempo: 15, frequencia: "10 min" },
      ],
    },
    {
      id: "4",
      unidadeId: "4",
      linhas: [
        { numero: "456", nome: "Vila Esperança - Terminal", tempo: 35, frequencia: "25 min" },
        { numero: "789", nome: "Circular Esperança", tempo: 30, frequencia: "20 min" },
      ],
    },
  ]

  const unitSelect = document.getElementById("unit-select")
  const mapCard = document.getElementById("map-card")
  const busRoutesCard = document.getElementById("bus-routes-card")
  const unitAddress = document.getElementById("unit-address")
  const routesTitle = document.getElementById("routes-title")
  const routesPlaceholder = document.getElementById("routes-placeholder")
  const routesList = document.getElementById("routes-list")
  const selectUnitPlaceholder = document.getElementById("select-unit-placeholder")

  // Esconder cards inicialmente
  if (mapCard && busRoutesCard) {
    mapCard.style.display = "none"
    busRoutesCard.style.display = "none"
  }

  // Event listener para seleção de unidade
  if (unitSelect) {
    unitSelect.addEventListener("change", function () {
      const selectedUnitId = this.value

      if (selectedUnitId) {
        // Encontrar unidade selecionada
        const selectedUnit = unidadesSaude.find((unit) => unit.id === selectedUnitId)

        // Encontrar rotas para a unidade selecionada
        const selectedRoutes = rotasOnibus.find((route) => route.unidadeId === selectedUnitId)

        // Atualizar endereço da unidade
        if (unitAddress) {
          unitAddress.textContent = selectedUnit.endereco
        }

        // Atualizar título das rotas
        if (routesTitle) {
          routesTitle.textContent = `Linhas que chegam até ${selectedUnit.nome}`
        }

        // Mostrar cards e esconder placeholder
        if (mapCard && busRoutesCard && selectUnitPlaceholder) {
          mapCard.style.display = "block"
          busRoutesCard.style.display = "block"
          selectUnitPlaceholder.style.display = "none"
        }

        // Renderizar rotas
        if (routesPlaceholder && routesList) {
          routesPlaceholder.style.display = "none"
          routesList.style.display = "block"

          // Limpar lista de rotas
          routesList.innerHTML = ""

          // Adicionar cada linha de ônibus
          selectedRoutes.linhas.forEach((linha) => {
            const routeItem = document.createElement("div")
            routeItem.className = "route-item"

            routeItem.innerHTML = `
              <div class="route-header">
                <div>
                  <span class="route-number">${linha.numero}</span>
                  <span class="route-name">${linha.nome}</span>
                </div>
                <span class="route-frequency">A cada ${linha.frequencia}</span>
              </div>
              <div class="route-path">
                <i class="fas fa-bus"></i>
                <span>Ponto de ônibus</span>
                <i class="fas fa-arrow-right"></i>
                <span>${selectedUnit.nome}</span>
              </div>
              <div class="route-time">
                <i class="fas fa-clock"></i>
                <span>Tempo estimado: <strong>${linha.tempo} minutos</strong></span>
              </div>
            `

            routesList.appendChild(routeItem)
          })

          // Adicionar botão para ver rota no mapa
          const mapButton = document.createElement("button")
          mapButton.className = "btn btn-primary btn-block"
          mapButton.textContent = "Ver Rota no Mapa"
          mapButton.addEventListener("click", () => {
            alert("Funcionalidade de mapa será implementada com integração Google Maps ou OpenStreetMap.")
          })

          routesList.appendChild(mapButton)
        }
      } else {
        // Esconder cards e mostrar placeholder se nenhuma unidade for selecionada
        if (mapCard && busRoutesCard && selectUnitPlaceholder) {
          mapCard.style.display = "none"
          busRoutesCard.style.display = "none"
          selectUnitPlaceholder.style.display = "block"
        }
      }
    })
  }
})
