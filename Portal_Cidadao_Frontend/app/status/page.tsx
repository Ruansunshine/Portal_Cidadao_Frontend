"use client"

import { MainNav } from "@/components/main-nav"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, AlertTriangle, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"

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

export default function StatusLotacao() {
  const [dadosAtualizados, setDadosAtualizados] = useState(dadosLotacao)
  const [tabAtiva, setTabAtiva] = useState("todos")

  // Simular atualização em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setDadosAtualizados((prev) =>
        prev.map((unidade) => ({
          ...unidade,
          percentual: Math.min(100, Math.max(10, unidade.percentual + Math.floor(Math.random() * 11) - 5)),
        })),
      )
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  // Filtrar dados com base na tab ativa
  const dadosFiltrados =
    tabAtiva === "todos"
      ? dadosAtualizados
      : dadosAtualizados.filter((unidade) => unidade.status.toLowerCase() === tabAtiva)

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        <PageHeader title="Status de Lotação" description="Verifique a lotação das unidades de saúde em tempo real" />
        <div className="container py-6">
          <div className="mb-6">
            <Tabs defaultValue="todos" value={tabAtiva} onValueChange={setTabAtiva}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="todos">Todos</TabsTrigger>
                <TabsTrigger value="baixa">Baixa Lotação</TabsTrigger>
                <TabsTrigger value="média">Média Lotação</TabsTrigger>
                <TabsTrigger value="alta">Alta Lotação</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {dadosFiltrados.map((unidade) => (
              <Card key={unidade.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{unidade.nome}</CardTitle>
                      <CardDescription>{unidade.endereco}</CardDescription>
                    </div>
                    <StatusBadge status={unidade.status} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span>Lotação atual</span>
                        <span className="font-medium">{unidade.percentual}%</span>
                      </div>
                      <Progress
                        value={unidade.percentual}
                        className={`h-2 ${
                          unidade.percentual < 40
                            ? "bg-green-100"
                            : unidade.percentual < 70
                              ? "bg-yellow-100"
                              : "bg-red-100"
                        }`}
                        indicatorClassName={`${
                          unidade.percentual < 40
                            ? "bg-green-500"
                            : unidade.percentual < 70
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Tempo estimado de espera: <strong>{unidade.tempoEspera}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Capacidade atual: <strong>{Math.round((unidade.percentual / 100) * 50)}/50</strong> pacientes
                      </span>
                    </div>
                    {unidade.percentual > 80 && (
                      <div className="mt-2 flex items-start gap-2 rounded-md bg-red-50 p-2 text-sm text-red-800">
                        <AlertTriangle className="mt-0.5 h-4 w-4" />
                        <span>Recomendamos buscar outra unidade com menor lotação, se possível.</span>
                      </div>
                    )}
                    {unidade.percentual < 40 && (
                      <div className="mt-2 flex items-start gap-2 rounded-md bg-green-50 p-2 text-sm text-green-800">
                        <CheckCircle className="mt-0.5 h-4 w-4" />
                        <span>Momento ideal para atendimento com tempo de espera reduzido.</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 rounded-lg bg-muted p-4 text-center text-sm text-muted-foreground">
            <p>
              Os dados de lotação são atualizados a cada 10 minutos. Última atualização:{" "}
              {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "Baixa":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
          Baixa Lotação
        </Badge>
      )
    case "Média":
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">
          Média Lotação
        </Badge>
      )
    case "Alta":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
          Alta Lotação
        </Badge>
      )
    default:
      return null
  }
}
