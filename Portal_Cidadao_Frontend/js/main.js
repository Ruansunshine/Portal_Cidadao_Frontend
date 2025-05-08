// Toggle mobile menu
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle")
  const mainNav = document.querySelector(".main-nav")

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      mainNav.classList.toggle("active")
    })
  }

  // Accessibility panel toggle
  const accessibilityToggle = document.querySelector(".accessibility-toggle")
  const accessibilityPanel = document.querySelector(".accessibility-panel")

  if (accessibilityToggle && accessibilityPanel) {
    accessibilityToggle.addEventListener("click", () => {
      accessibilityPanel.classList.toggle("active")
    })
  }

  // Tab functionality
  const tabBtns = document.querySelectorAll(".tab-btn")

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // For filter tabs
      if (this.dataset.filter) {
        const filter = this.dataset.filter

        // Remove active class from all buttons
        tabBtns.forEach((btn) => btn.classList.remove("active"))

        // Add active class to clicked button
        this.classList.add("active")

        // Handle filtering logic in respective page scripts
        if (typeof handleFilterChange === "function") {
          handleFilterChange(filter)
        }
      }

      // For content tabs
      if (this.dataset.tab) {
        const tabId = this.dataset.tab

        // Remove active class from all buttons
        tabBtns.forEach((btn) => btn.classList.remove("active"))

        // Add active class to clicked button
        this.classList.add("active")

        // Hide all tab contents
        const tabContents = document.querySelectorAll(".tab-content")
        tabContents.forEach((content) => (content.style.display = "none"))

        // Show selected tab content
        const selectedTab = document.getElementById(tabId)
        if (selectedTab) {
          selectedTab.style.display = "block"
        }
      }
    })
  })

  // Close menus when clicking outside
  document.addEventListener("click", (event) => {
    // Close mobile menu when clicking outside
    if (
      mainNav &&
      mainNav.classList.contains("active") &&
      !event.target.closest(".main-nav") &&
      !event.target.closest(".menu-toggle")
    ) {
      mainNav.classList.remove("active")
    }

    // Close accessibility panel when clicking outside
    if (
      accessibilityPanel &&
      accessibilityPanel.classList.contains("active") &&
      !event.target.closest(".accessibility-panel") &&
      !event.target.closest(".accessibility-toggle")
    ) {
      accessibilityPanel.classList.remove("active")
    }
  })
})
