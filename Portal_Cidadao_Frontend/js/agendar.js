document.addEventListener("DOMContentLoaded", () => {
  const appointmentForm = document.getElementById("appointment-form")
  const appointmentFormCard = document.getElementById("appointment-form-card")
  const appointmentConfirmation = document.getElementById("appointment-confirmation")
  const newAppointmentBtn = document.getElementById("new-appointment")
  const backToHomeBtn = document.getElementById("back-to-home")

  // Dados simulados para os tipos de atendimento
  const tiposAtendimento = {
    consulta: "Consulta Médica",
    vacina: "Vacinação",
    exame: "Exames Laboratoriais",
    especialista: "Consulta com Especialista",
  }

  // Dados simulados para as unidades
  const unidades = {
    1: "UBS Central",
    2: "Hospital Municipal",
    3: "Centro de Especialidades",
    4: "UBS Vila Esperança",
  }

  // Configurar data mínima para hoje
  const dataInput = document.getElementById("data")
  if (dataInput) {
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, "0")
    const dd = String(today.getDate()).padStart(2, "0")
    dataInput.min = `${yyyy}-${mm}-${dd}`
  }

  // Função para validar CPF
  function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, "") // Remove caracteres não numéricos

    if (cpf.length !== 11) return false

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cpf)) return false

    // Validação simplificada para este exemplo
    return cpf.length === 11
  }

  // Função para validar Cartão SUS
  function validarCartaoSUS(cartao) {
    cartao = cartao.replace(/[^\d]/g, "") // Remove caracteres não numéricos

    // Validação simplificada para este exemplo
    return cartao.length === 15
  }

  // Função para formatar data
  function formatarData(dataString) {
    const data = new Date(dataString)
    return data.toLocaleDateString("pt-BR")
  }

  // Event listener para o formulário
  if (appointmentForm) {
    appointmentForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Resetar mensagens de erro
      document.querySelectorAll(".error-message").forEach((el) => {
        el.style.display = "none"
      })

      // Obter valores do formulário
      const nome = document.getElementById("nome").value
      const cpf = document.getElementById("cpf").value
      const cartaoSus = document.getElementById("cartao-sus").value
      const unidade = document.getElementById("unidade").value
      const tipoAtendimento = document.getElementById("tipo-atendimento").value
      const data = document.getElementById("data").value
      const horario = document.getElementById("horario").value

      // Validar campos
      let isValid = true

      if (nome.length < 3) {
        document.getElementById("nome-error").textContent = "Nome deve ter pelo menos 3 caracteres"
        document.getElementById("nome-error").style.display = "block"
        isValid = false
      }

      if (!validarCPF(cpf)) {
        document.getElementById("cpf-error").textContent = "CPF inválido"
        document.getElementById("cpf-error").style.display = "block"
        isValid = false
      }

      if (!validarCartaoSUS(cartaoSus)) {
        document.getElementById("cartao-sus-error").textContent = "Número do Cartão SUS inválido"
        document.getElementById("cartao-sus-error").style.display = "block"
        isValid = false
      }

      if (!unidade) {
        document.getElementById("unidade-error").textContent = "Selecione uma unidade de saúde"
        document.getElementById("unidade-error").style.display = "block"
        isValid = false
      }

      if (!tipoAtendimento) {
        document.getElementById("tipo-atendimento-error").textContent = "Selecione o tipo de atendimento"
        document.getElementById("tipo-atendimento-error").style.display = "block"
        isValid = false
      }

      if (!data) {
        document.getElementById("data-error").textContent = "Selecione uma data"
        document.getElementById("data-error").style.display = "block"
        isValid = false
      }

      if (!horario) {
        document.getElementById("horario-error").textContent = "Selecione um horário"
        document.getElementById("horario-error").style.display = "block"
        isValid = false
      }

      // Se o formulário for válido, mostrar confirmação
      if (isValid) {
        // Preencher dados de confirmação
        document.getElementById("confirm-nome").textContent = nome
        document.getElementById("confirm-unidade").textContent = unidades[unidade]
        document.getElementById("confirm-atendimento").textContent = tiposAtendimento[tipoAtendimento]
        document.getElementById("confirm-data").textContent = formatarData(data)
        document.getElementById("confirm-horario").textContent = horario

        // Esconder formulário e mostrar confirmação
        appointmentFormCard.style.display = "none"
        appointmentConfirmation.style.display = "block"
      }
    })
  }

  // Event listener para o botão de novo agendamento
  if (newAppointmentBtn) {
    newAppointmentBtn.addEventListener("click", () => {
      // Resetar formulário
      appointmentForm.reset()

      // Esconder confirmação e mostrar formulário
      appointmentConfirmation.style.display = "none"
      appointmentFormCard.style.display = "block"
    })
  }

  // Event listener para o botão de voltar para a página inicial
  if (backToHomeBtn) {
    backToHomeBtn.addEventListener("click", () => {
      window.location.href = "index.html"
    })
  }
})
