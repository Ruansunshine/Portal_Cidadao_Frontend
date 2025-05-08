"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, FileText, User, Search, Activity, Pill, Syringe, Stethoscope } from "lucide-react"
import { Sidebar } from "@/components/sidebar"

// Tipos para o histórico médico
interface RegistroMedico {
  id: string
  tipo: "consulta" | "exame" | "medicamento" | "vacina"
  titulo: string
  descricao: string
  data: string
  medico?: string
  especialidade?: string
  resultado?: string
  dosagem?: string
  frequencia?: string
  validade?: string
}

export default function HistoricoPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("todos")
  const [registrosMedicos, setRegistrosMedicos] = useState<RegistroMedico[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Adicionar após a declaração dos estados
  // API Integration: Buscar histórico médico do usuário
  useEffect(() => {
    const fetchHistoricoMedico = async () => {
      try {
        setIsLoading(true)
        // TODO: Integração com API - GET /api/historico-medico?usuario={id}
        // const response = await fetch(`/api/historico-medico?usuario=${userId}`)
        // const data = await response.json()
        // setRegistrosMedicos(data)

        // Simulação de dados para desenvolvimento
        setTimeout(() => {
          setRegistrosMedicos([
            {
              id: "1",
              tipo: "consulta",
              titulo: "Consulta de Rotina",
              descricao: "Avaliação geral de saúde. Pressão arterial: 120/80 mmHg. Frequência cardíaca: 72 bpm.",
              data: "10/04/2024",
              medico: "Dra. Mariana Lima",
              especialidade: "Clínica Geral",
            },
            {
              id: "2",
              tipo: "exame",
              titulo: "Hemograma Completo",
              descricao: "Exame de sangue para avaliação geral.",
              data: "15/03/2024",
              resultado: "Dentro dos parâmetros normais. Hemoglobina: 14.2 g/dL.",
            },
            {
              id: "3",
              tipo: "medicamento",
              titulo: "Losartana 50mg",
              descricao: "Medicamento para controle de pressão arterial.",
              data: "20/02/2024",
              dosagem: "1 comprimido",
              frequencia: "1x ao dia",
            },
            {
              id: "4",
              tipo: "vacina",
              titulo: "Vacina contra Influenza",
              descricao: "Imunização anual contra gripe.",
              data: "05/03/2024",
              validade: "05/03/2025",
            },
            {
              id: "5",
              tipo: "exame",
              titulo: "Eletrocardiograma",
              descricao: "Avaliação da atividade elétrica do coração.",
              data: "10/01/2024",
              resultado: "Ritmo sinusal normal. Sem alterações significativas.",
            },
            {
              id: "6",
              tipo: "consulta",
              titulo: "Consulta Cardiológica",
              descricao: "Avaliação cardiovascular de rotina.",
              data: "05/01/2024",
              medico: "Dr. Carlos Mendes",
              especialidade: "Cardiologia",
            },
          ])
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Erro ao buscar histórico médico:", error)
        setIsLoading(false)
        // TODO: Implementar tratamento de erro
      }
    }

    fetchHistoricoMedico()
  }, [])

  // Filtra os registros com base na pesquisa e no tipo
  const filteredRegistros = registrosMedicos.filter((registro) => {
    const matchesSearch =
      registro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registro.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "todos" || registro.tipo === filterType
    return matchesSearch && matchesType
  })

  // Ícone baseado no tipo de registro
  const getIconByType = (tipo: string) => {
    switch (tipo) {
      case "consulta":
        return <Stethoscope className="h-5 w-5" />
      case "exame":
        return <FileText className="h-5 w-5" />
      case "medicamento":
        return <Pill className="h-5 w-5" />
      case "vacina":
        return <Syringe className="h-5 w-5" />
      default:
        return <Activity className="h-5 w-5" />
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1">
        <div className="container py-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Histórico Médico</h1>
            <Button asChild>
              <a href="/documentos">Meus Documentos</a>
            </Button>
          </div>

          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Pesquisar no histórico..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="consulta">Consultas</SelectItem>
                <SelectItem value="exame">Exames</SelectItem>
                <SelectItem value="medicamento">Medicamentos</SelectItem>
                <SelectItem value="vacina">Vacinas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredRegistros.length > 0 ? (
            <div className="space-y-4">
              {filteredRegistros.map((registro) => (
                <Card key={registro.id} className="overflow-hidden">
                  <CardHeader className="bg-primary/5 pb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-primary/10 p-2">{getIconByType(registro.tipo)}</div>
                        <div>
                          <CardTitle>{registro.titulo}</CardTitle>
                          <CardDescription>{registro.data}</CardDescription>
                        </div>
                      </div>
                      <Badge>
                        {registro.tipo === "consulta"
                          ? "Consulta"
                          : registro.tipo === "exame"
                            ? "Exame"
                            : registro.tipo === "medicamento"
                              ? "Medicamento"
                              : "Vacina"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <p>{registro.descricao}</p>

                      {registro.tipo === "consulta" && (
                        <div className="grid gap-2 md:grid-cols-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>Médico: {registro.medico}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Stethoscope className="h-4 w-4 text-muted-foreground" />
                            <span>Especialidade: {registro.especialidade}</span>
                          </div>
                        </div>
                      )}

                      {registro.tipo === "exame" && registro.resultado && (
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-muted-foreground" />
                          <span>Resultado: {registro.resultado}</span>
                        </div>
                      )}

                      {registro.tipo === "medicamento" && (
                        <div className="grid gap-2 md:grid-cols-2">
                          <div className="flex items-center gap-2">
                            <Pill className="h-4 w-4 text-muted-foreground" />
                            <span>Dosagem: {registro.dosagem}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>Frequência: {registro.frequencia}</span>
                          </div>
                        </div>
                      )}

                      {registro.tipo === "vacina" && registro.validade && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Validade: {registro.validade}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end border-t pt-4">
                    <Button variant="outline" asChild>
                      <a href={`/historico/${registro.id}`}>Ver Detalhes</a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">Nenhum registro encontrado</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Não encontramos registros médicos que correspondam à sua pesquisa.
              </p>
              <Button
                className="mt-4"
                onClick={() => {
                  setSearchTerm("")
                  setFilterType("todos")
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
