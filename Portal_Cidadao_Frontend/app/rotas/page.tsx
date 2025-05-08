"use client"

import { useState } from "react"
import { MainNav } from "@/components/main-nav"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bus, Clock, MapPin, ArrowRight } from "lucide-react"

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

export default function RotasTransporte() {
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<string | null>(null)
  const [rotasExibidas, setRotasExibidas] = useState<any>(null)

  const handleUnidadeChange = (value: string) => {
    setUnidadeSelecionada(value)
    const rotasFiltradas = rotasOnibus.find((rota) => rota.unidadeId === value)
    setRotasExibidas(rotasFiltradas)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        <PageHeader
          title="Rotas de Transporte"
          description="Visualize rotas de transporte público para chegar às unidades de saúde"
        />
        <div className="container py-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Selecione uma Unidade de Saúde</CardTitle>
              <CardDescription>Escolha a unidade para ver as rotas de transporte público disponíveis</CardDescription>
            </CardHeader>
            <CardContent>
              <Select onValueChange={handleUnidadeChange}>
                <SelectTrigger className="w-full md:w-[300px]">
                  <SelectValue placeholder="Selecione uma unidade de saúde" />
                </SelectTrigger>
                <SelectContent>
                  {unidadesSaude.map((unidade) => (
                    <SelectItem key={unidade.id} value={unidade.id}>
                      {unidade.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {unidadeSelecionada && (
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Mapa e Localização</CardTitle>
                  <CardDescription>{unidadesSaude.find((u) => u.id === unidadeSelecionada)?.endereco}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video rounded-md bg-muted flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <p className="text-sm text-muted-foreground">
                        Mapa interativo seria exibido aqui com a localização da unidade
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        (Integração com Google Maps ou OpenStreetMap)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Linhas de Ônibus</CardTitle>
                  <CardDescription>
                    Linhas que chegam até {unidadesSaude.find((u) => u.id === unidadeSelecionada)?.nome}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {rotasExibidas ? (
                    <div className="space-y-4">
                      {rotasExibidas.linhas.map((linha: any) => (
                        <div key={linha.numero} className="rounded-lg border p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-primary/10">
                                {linha.numero}
                              </Badge>
                              <span className="font-medium">{linha.nome}</span>
                            </div>
                            <Badge variant="secondary">A cada {linha.frequencia}</Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Bus className="h-4 w-4" />
                            <span>Ponto de ônibus</span>
                            <ArrowRight className="h-3 w-3" />
                            <span>{unidadesSaude.find((u) => u.id === unidadeSelecionada)?.nome}</span>
                          </div>
                          <div className="mt-2 flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>
                              Tempo estimado: <strong>{linha.tempo} minutos</strong>
                            </span>
                          </div>
                        </div>
                      ))}
                      <Button className="w-full">Ver Rota no Mapa</Button>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bus className="h-8 w-8 mx-auto mb-2" />
                      <p>Selecione uma unidade para ver as linhas de ônibus disponíveis</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {!unidadeSelecionada && (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <MapPin className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Selecione uma Unidade de Saúde</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Escolha uma unidade de saúde para visualizar as rotas de transporte público disponíveis e o mapa com a
                localização.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
