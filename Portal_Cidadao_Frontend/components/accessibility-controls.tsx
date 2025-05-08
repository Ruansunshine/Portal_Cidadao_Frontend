"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Accessibility, Moon, Sun, Type } from "lucide-react"
import { useTheme } from "next-themes"

export function AccessibilityControls() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [fontSize, setFontSize] = useState(100)
  const [highContrast, setHighContrast] = useState(false)
  const [textToSpeech, setTextToSpeech] = useState(false)

  // Evitar hidratação incorreta
  useEffect(() => {
    setMounted(true)
  }, [])

  // Aplicar tamanho da fonte
  useEffect(() => {
    if (mounted) {
      document.documentElement.style.fontSize = `${fontSize}%`
    }
  }, [fontSize, mounted])

  // Aplicar alto contraste
  useEffect(() => {
    if (mounted) {
      if (highContrast) {
        document.documentElement.classList.add("high-contrast")
      } else {
        document.documentElement.classList.remove("high-contrast")
      }
    }
  }, [highContrast, mounted])

  // Implementação básica de leitura de texto
  const toggleTextToSpeech = () => {
    const newValue = !textToSpeech
    setTextToSpeech(newValue)

    if (newValue && window.speechSynthesis) {
      // Cancelar qualquer fala anterior
      window.speechSynthesis.cancel()

      // Selecionar o texto principal da página
      const mainContent = document.querySelector("main")?.textContent || ""
      const utterance = new SpeechSynthesisUtterance(mainContent)
      utterance.lang = "pt-BR"
      window.speechSynthesis.speak(utterance)
    } else if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
  }

  if (!mounted) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-full h-10 w-10 bg-background shadow-md">
            <Accessibility className="h-5 w-5" />
            <span className="sr-only">Controles de acessibilidade</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Acessibilidade</h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="theme-toggle">Tema</Label>
                <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="font-size">Tamanho da fonte</Label>
                  <span className="text-sm text-muted-foreground">{fontSize}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  <Slider
                    id="font-size"
                    min={80}
                    max={150}
                    step={10}
                    value={[fontSize]}
                    onValueChange={(value) => setFontSize(value[0])}
                  />
                  <Type className="h-5 w-5" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor="high-contrast">Alto contraste</Label>
                </div>
                <Switch id="high-contrast" checked={highContrast} onCheckedChange={setHighContrast} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor="text-to-speech">Leitura de texto</Label>
                </div>
                <Switch id="text-to-speech" checked={textToSpeech} onCheckedChange={toggleTextToSpeech} />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
