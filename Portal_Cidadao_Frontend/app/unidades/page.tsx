"use client"

import { useState } from "react"
import { MainNav } from "@/components/main-nav"
import { PageHeader } from "@/components/page-header"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Phone, FileText, X, Users } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

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

export default function UnidadesSaude() {
  const [busca, setBusca] = useState("")
  const [filtro, setFiltro] = useState("todos")
  const [bairroFiltro, setBairroFiltro] = useState("todos")

  const [modalAberto, setModalAberto] = useState(false)
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<any>(null)

  // Extrair bairros únicos para o filtro
  const bairros = ["todos", ...new Set(unidadesSaude.map((unidade) => unidade.bairro))]

  // Filtrar unidades com base na busca e filtros
  const unidadesFiltradas = unidadesSaude.filter((unidade) => {
    const matchBusca =
      unidade.nome.toLowerCase().includes(busca.toLowerCase()) ||
      unidade.servicos.some((servico) => servico.toLowerCase().includes(busca.toLowerCase()))

    const matchServico = filtro === "todos" || unidade.servicos.includes(filtro)
    const matchBairro = bairroFiltro === "todos" || unidade.bairro === bairroFiltro

    return matchBusca && matchServico && matchBairro
  })

  // Extrair serviços únicos para o filtro
  const servicos = ["todos", ...new Set(unidadesSaude.flatMap((unidade) => unidade.servicos))]

  const handleVisualizarLocalizacao = (unidade: any) => {
    setUnidadeSelecionada(unidade)
    setModalAberto(true)
  }

  const fecharModal = () => {
    setModalAberto(false)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        <PageHeader
          title="Buscar Unidades de Saúde"
          description="Encontre unidades de saúde por bairro ou tipo de serviço"
        />
        <div className="container py-6">
          <div className="mb-8 space-y-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex-1">
                <Input
                  placeholder="Buscar por nome ou serviço..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="w-full md:w-64">
                <Select value={filtro} onValueChange={setFiltro}>
                  <SelectTrigger> 
                    <SelectValue placeholder="Filtrar por serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    {servicos.map((servico) => (
                      <SelectItem key={servico} value={servico}>
                        {servico === "todos" ? "Todos os serviços" : servico}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-64">
                <Select value={bairroFiltro} onValueChange={setBairroFiltro}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por bairro" />
                  </SelectTrigger>
                  <SelectContent>
                    {bairros.map((bairro) => (
                      <SelectItem key={bairro} value={bairro}>
                        {bairro === "todos" ? "Todos os bairros" : bairro}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {unidadesFiltradas.length > 0 ? (
              unidadesFiltradas.map((unidade) => (
                <Card key={unidade.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between">
                      <CardTitle>{unidade.nome}</CardTitle>
                      <Badge
                        variant={
                          unidade.lotacao === "Baixa"
                            ? "success"
                            : unidade.lotacao === "Média"
                              ? "warning"
                              : "destructive"
                        }
                      >
                        Lotação {unidade.lotacao}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> {unidade.endereco}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 pb-3">
                    <div className="flex items-start gap-2">
                      <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <span>{unidade.horario}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <span>{unidade.telefone}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Documentos necessários:</p>
                        <ul className="list-inside list-disc">
                          {unidade.documentos.map((doc) => (
                            <li key={doc} className="text-sm">
                              {doc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-3 border-t pt-4">
                    <div className="flex flex-wrap gap-2">
                      {unidade.servicos.map((servico) => (
                        <Badge key={servico} variant="outline">
                          {servico}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2"
                      onClick={() => handleVisualizarLocalizacao(unidade)}
                    >
                      <MapPin className="h-4 w-4" />
                      Visualizar Localização
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-xl font-semibold mb-2">Nenhuma unidade encontrada</h3>
                <p className="text-muted-foreground">
                  Tente ajustar seus critérios de busca para encontrar unidades de saúde.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      {modalAberto && unidadeSelecionada && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-3xl overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-semibold">{unidadeSelecionada.nome}</h3>
              <Button variant="ghost" size="icon" onClick={fecharModal}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-4">
              <div className="aspect-video bg-muted rounded-md mb-4 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 mx-auto mb-2 text-primary" />
                  <p className="text-muted-foreground">Mapa com a localização de {unidadeSelecionada.nome}</p>
                  <p className="text-sm text-muted-foreground mt-2">{unidadeSelecionada.endereco}</p>
                  <p className="text-xs text-muted-foreground mt-4">
                    (Aqui será exibido o mapa quando a API for implementada)
                  </p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Informações de Contato</h4>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{unidadeSelecionada.telefone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{unidadeSelecionada.horario}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Status Atual</h4>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Lotação:{" "}
                      <Badge
                        variant={
                          unidadeSelecionada.lotacao === "Baixa"
                            ? "success"
                            : unidadeSelecionada.lotacao === "Média"
                              ? "warning"
                              : "destructive"
                        }
                      >
                        {unidadeSelecionada.lotacao}
                      </Badge>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={fecharModal}>
                Fechar
              </Button>
              <Button>
                <MapPin className="h-4 w-4 mr-2" />
                Obter Direções
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}