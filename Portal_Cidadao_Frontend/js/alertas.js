document.addEventListener("DOMContentLoaded", () => {
  // Elementos do DOM
  const smsToggle = document.getElementById("sms")
  const smsInput = document.querySelector(".sms-input")
  const emailToggle = document.getElementById("email-notif")
  const emailInput = document.querySelector(".email-input")
  const saveSettingsBtn = document.getElementById("save-settings")

  // Toggle para mostrar/esconder input de SMS
  if (smsToggle && smsInput) {
    smsToggle.addEventListener("change", function () {
      smsInput.style.display = this.checked ? "block" : "none"
    })
  }

  // Toggle para mostrar/esconder input de email
  if (emailToggle && emailInput) {
    emailToggle.addEventListener("change", function () {
      emailInput.style.display = this.checked ? "block" : "none"
    })

    // Inicializar estado
    emailInput.style.display = emailToggle.checked ? "block" : "none"
  }

  // Salvar configurações
  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener("click", () => {
      // Coletar dados das configurações
      const settings = {
        notificacoes: {
          consultas: document.getElementById("consultas")?.checked || false,
          lotacao: document.getElementById("lotacao")?.checked || false,
          transporte: document.getElementById("transporte")?.checked || false,
          vacinas: document.getElementById("vacinas")?.checked || false,
        },
        metodos: {
          sms: document.getElementById("sms")?.checked || false,
          email: document.getElementById("email-notif")?.checked || false,
          push: document.getElementById("push")?.checked || false,
        },
        contato: {
          telefone: document.getElementById("telefone")?.value || "",
          email: document.getElementById("email")?.value || "",
        },
        preferencias: {
          antecedenciaConsulta: document.getElementById("antecedencia-consulta")?.value || "24",
          frequenciaLotacao: document.getElementById("frequencia-lotacao")?.value || "imediato",
        },
      }

      // Salvar no localStorage (em um sistema real, seria enviado para um servidor)
      localStorage.setItem("alertSettings", JSON.stringify(settings))

      // Mostrar mensagem de sucesso
      alert("Configurações salvas com sucesso!")
    })
  }

  // Carregar configurações salvas
  function loadSavedSettings() {
    const savedSettings = localStorage.getItem("alertSettings")

    if (savedSettings) {
      const settings = JSON.parse(savedSettings)

      // Aplicar configurações salvas
      if (settings.notificacoes) {
        if (document.getElementById("consultas"))
          document.getElementById("consultas").checked = settings.notificacoes.consultas
        if (document.getElementById("lotacao"))
          document.getElementById("lotacao").checked = settings.notificacoes.lotacao
        if (document.getElementById("transporte"))
          document.getElementById("transporte").checked = settings.notificacoes.transporte
        if (document.getElementById("vacinas"))
          document.getElementById("vacinas").checked = settings.notificacoes.vacinas
      }

      if (settings.metodos) {
        if (document.getElementById("sms")) {
          document.getElementById("sms").checked = settings.metodos.sms
          if (smsInput) smsInput.style.display = settings.metodos.sms ? "block" : "none"
        }

        if (document.getElementById("email-notif")) {
          document.getElementById("email-notif").checked = settings.metodos.email
          if (emailInput) emailInput.style.display = settings.metodos.email ? "block" : "none"
        }

        if (document.getElementById("push")) document.getElementById("push").checked = settings.metodos.push
      }

      if (settings.contato) {
        if (document.getElementById("telefone")) document.getElementById("telefone").value = settings.contato.telefone
        if (document.getElementById("email")) document.getElementById("email").value = settings.contato.email
      }

      if (settings.preferencias) {
        if (document.getElementById("antecedencia-consulta"))
          document.getElementById("antecedencia-consulta").value = settings.preferencias.antecedenciaConsulta
        if (document.getElementById("frequencia-lotacao"))
          document.getElementById("frequencia-lotacao").value = settings.preferencias.frequenciaLotacao
      }
    }
  }

  // Carregar configurações ao iniciar a página
  loadSavedSettings()
})
