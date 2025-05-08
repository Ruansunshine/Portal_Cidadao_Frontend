document.addEventListener("DOMContentLoaded", () => {
  // Theme toggle
  const themeToggle = document.getElementById("theme-toggle")
  const themeIcon = themeToggle ? themeToggle.querySelector("i") : null

  // Font size control
  const fontSizeSlider = document.getElementById("font-size")
  const fontSizeValue = document.querySelector(".font-size-value")

  // High contrast toggle
  const highContrastToggle = document.getElementById("high-contrast")

  // Text to speech toggle
  const textToSpeechToggle = document.getElementById("text-to-speech")

  // Check for saved settings and apply them
  function loadSettings() {
    // Theme
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode")
      if (themeIcon) themeIcon.className = "fas fa-sun"
    }

    // Font size
    const savedFontSize = localStorage.getItem("fontSize")
    if (savedFontSize) {
      document.documentElement.style.fontSize = `${savedFontSize}%`
      if (fontSizeSlider) fontSizeSlider.value = savedFontSize
      if (fontSizeValue) fontSizeValue.textContent = `${savedFontSize}%`
    }

    // High contrast
    const savedContrast = localStorage.getItem("highContrast")
    if (savedContrast === "true") {
      document.documentElement.classList.add("high-contrast")
      if (highContrastToggle) highContrastToggle.checked = true
    }
  }

  // Apply saved settings on load
  loadSettings()

  // Theme toggle functionality
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode")

      if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark")
        themeIcon.className = "fas fa-sun"
      } else {
        localStorage.setItem("theme", "light")
        themeIcon.className = "fas fa-moon"
      }
    })
  }

  // Font size control functionality
  if (fontSizeSlider) {
    fontSizeSlider.addEventListener("input", function () {
      const size = this.value
      document.documentElement.style.fontSize = `${size}%`
      fontSizeValue.textContent = `${size}%`
      localStorage.setItem("fontSize", size)
    })
  }

  // High contrast toggle functionality
  if (highContrastToggle) {
    highContrastToggle.addEventListener("change", function () {
      if (this.checked) {
        document.documentElement.classList.add("high-contrast")
        localStorage.setItem("highContrast", "true")
      } else {
        document.documentElement.classList.remove("high-contrast")
        localStorage.setItem("highContrast", "false")
      }
    })
  }

  // Text to speech functionality
  if (textToSpeechToggle) {
    textToSpeechToggle.addEventListener("change", function () {
      if (this.checked) {
        // Cancel any previous speech
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel()

          // Get main content text
          const mainContent = document.querySelector("main").textContent

          // Create utterance
          const utterance = new SpeechSynthesisUtterance(mainContent)
          utterance.lang = "pt-BR"

          // Speak
          window.speechSynthesis.speak(utterance)
        } else {
          alert("Seu navegador não suporta a funcionalidade de leitura de texto.")
          this.checked = false
        }
      } else {
        // Stop speaking
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel()
        }
      }
    })
  }
})
