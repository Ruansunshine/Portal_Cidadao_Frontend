"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar, Clock, MapPin, CalendarIcon, X, CheckCircle } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { toast } from "@/components/ui/use-toast"

// Tipos para as consultas
type ConsultaStatus = "agendada" | "concluida" | "cancelada"

interface Consulta {
  id: string
  medico: string
  especialidade: string
  unidade: string
  endereco: string
  data: string
  hora: string
  status: ConsultaStatus
}

export default function ConsultasPage() {
  // Dados simulados de consultas
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // API Integration: Buscar consultas do usuário
  useEffect(() => {
    const fetchConsultas = async () => {
      try {
        setIsLoading(true)
        // TODO: Integração com API - GET /api/consultas?usuario={id}
        // const response = await fetch(`/api/consultas?usuario=${userId}`)
        // const data = await response.json()
        // setConsultas(data)

        // Simulação de dados para desenvolvimento
        setTimeout(() => {
          setConsultas([
            {
              id: "1",
              medico: "Dra. Ana Souza",
              especialidade: "Clínica Geral",
              unidade: "UBS Jardim Primavera",
              endereco: "Rua das Flores, 123 - Jardim Primavera",
              data: "15/05/2024",
              hora: "14:30",
              status: "agendada",
            },
            {
              id: "2",
              medico: "Dr. Carlos Mendes",
              especialidade: "Cardiologia",
              unidade: "Centro de Especialidades Médicas",
              endereco: "Av. Principal, 500 - Centro",
              data: "22/05/2024",
              hora: "10:15",
              status: "agendada",
            },
            {
              id: "3",
              medico: "Dra. Mariana Lima",
              especialidade: "Dermatologia",
              unidade: "Centro de Especialidades Médicas",
              endereco: "Av. Principal, 500 - Centro",
              data: "10/04/2024",
              hora: "09:00",
              status: "concluida",
            },
            {
              id: "4",
              medico: "Dr. Roberto Alves",
              especialidade: "Ortopedia",
              unidade: "Hospital Municipal",
              endereco: "Rua da Saúde, 789 - Vila Nova",
              data: "25/03/2024",
              hora: "16:45",
              status: "cancelada",
            },
          ])
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Erro ao buscar consultas:", error)
        setIsLoading(false)
        // TODO: Implementar tratamento de erro
      }
    }

    fetchConsultas()
  }, [])

  const cancelarConsulta = async (id: string) => {
    try {
      // TODO: Integração com API - PATCH /api/consultas/{id}/cancelar
      // const response = await fetch(`/api/consultas/${id}/cancelar`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // })
      //
      // if (!response.ok) {
      //   throw new Error('Falha ao cancelar consulta')
      // }

      // Atualização local após sucesso na API
      setConsultas(consultas.map((consulta) => (consulta.id === id ? { ...consulta, status: "cancelada" } : consulta)))
      toast({
        title: "Consulta cancelada",
        description: "Sua consulta foi cancelada com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao cancelar consulta:", error)
      toast({
        title: "Erro ao cancelar",
        description: "Ocorreu um erro ao cancelar sua consulta. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: ConsultaStatus) => {
    switch (status) {
      case "agendada":
        return <Badge className="bg-green-500">Agendada</Badge>
      case "concluida":
        return <Badge className="bg-blue-500">Concluída</Badge>
      case "cancelada":
        return <Badge variant="destructive">Cancelada</Badge>
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1">
        <div className="container py-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Minhas Consultas</h1>
            <Button asChild>
              <a href="/agendar">Agendar Nova Consulta</a>
            </Button>
          </div>

          <Tabs defaultValue="agendadas" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="agendadas">Agendadas</TabsTrigger>
              <TabsTrigger value="concluidas">Concluídas</TabsTrigger>
              <TabsTrigger value="canceladas">Canceladas</TabsTrigger>
            </TabsList>

            <TabsContent value="agendadas" className="space-y-4">
              {consultas.filter((c) => c.status === "agendada").length > 0 ? (
                consultas
                  .filter((c) => c.status === "agendada")
                  .map((consulta) => (
                    <Card key={consulta.id} className="overflow-hidden">
                      <CardHeader className="bg-primary/5 pb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{consulta.especialidade}</CardTitle>
                            <CardDescription>{consulta.medico}</CardDescription>
                          </div>
                          {getStatusBadge(consulta.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{consulta.data}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{consulta.hora}</span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{consulta.unidade}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="ml-6">{consulta.endereco}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-4">
                        <Button variant="outline" asChild>
                          <a href={`/consultas/${consulta.id}`}>Ver Detalhes</a>
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="destructive">Cancelar Consulta</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Cancelar Consulta</DialogTitle>
                              <DialogDescription>
                                Tem certeza que deseja cancelar sua consulta de {consulta.especialidade} com{" "}
                                {consulta.medico} no dia {consulta.data} às {consulta.hora}?
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="mt-4">
                              <Button variant="outline" className="mr-2">
                                Voltar
                              </Button>
                              <Button variant="destructive" onClick={() => cancelarConsulta(consulta.id)}>
                                Confirmar Cancelamento
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </CardFooter>
                    </Card>
                  ))
              ) : (
                <div className="text-center py-12">
                  <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">Nenhuma consulta agendada</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Você não possui consultas agendadas no momento.</p>
                  <Button className="mt-4" asChild>
                    <a href="/agendar">Agendar Nova Consulta</a>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="concluidas" className="space-y-4">
              {consultas.filter((c) => c.status === "concluida").length > 0 ? (
                consultas
                  .filter((c) => c.status === "concluida")
                  .map((consulta) => (
                    <Card key={consulta.id} className="overflow-hidden">
                      <CardHeader className="bg-blue-500/5 pb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{consulta.especialidade}</CardTitle>
                            <CardDescription>{consulta.medico}</CardDescription>
                          </div>
                          {getStatusBadge(consulta.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{consulta.data}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{consulta.hora}</span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{consulta.unidade}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="ml-6">{consulta.endereco}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-4">
                        <Button variant="outline" asChild>
                          <a href={`/consultas/${consulta.id}`}>Ver Detalhes</a>
                        </Button>
                        <Button asChild>
                          <a href="/agendar">Agendar Nova Consulta</a>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">Nenhuma consulta concluída</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Você não possui consultas concluídas no histórico.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="canceladas" className="space-y-4">
              {consultas.filter((c) => c.status === "cancelada").length > 0 ? (
                consultas
                  .filter((c) => c.status === "cancelada")
                  .map((consulta) => (
                    <Card key={consulta.id} className="overflow-hidden">
                      <CardHeader className="bg-destructive/5 pb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{consulta.especialidade}</CardTitle>
                            <CardDescription>{consulta.medico}</CardDescription>
                          </div>
                          {getStatusBadge(consulta.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{consulta.data}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{consulta.hora}</span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{consulta.unidade}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="ml-6">{consulta.endereco}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end border-t pt-4">
                        <Button asChild>
                          <a href="/agendar">Reagendar Consulta</a>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
              ) : (
                <div className="text-center py-12">
                  <X className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">Nenhuma consulta cancelada</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Você não possui consultas canceladas no histórico.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
