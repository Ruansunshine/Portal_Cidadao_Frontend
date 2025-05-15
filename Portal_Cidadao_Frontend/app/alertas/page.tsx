"use client"


import { SelectItem } from "@/components/ui/select"

import { SelectContent } from "@/components/ui/select"

import { SelectValue } from "@/components/ui/select"

import { SelectTrigger } from "@/components/ui/select"

import { Select } from "@/components/ui/select"

import { useState } from "react"
import { MainNav } from "@/components/main-nav"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Calendar, Clock, MapPin, MessageSquare, Smartphone } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function Alertas() {
  const [notificacoesConsulta, setNotificacoesConsulta] = useState(true)
  const [notificacoesLotacao, setNotificacoesLotacao] = useState(false)
  const [notificacoesTransporte, setNotificacoesTransporte] = useState(true)
  const [notificacoesVacinas, setNotificacoesVacinas] = useState(true)
  const [notificacoesSMS, setNotificacoesSMS] = useState(false)
  const [notificacoesEmail, setNotificacoesEmail] = useState(true)
  const [notificacoesPush, setNotificacoesPush] = useState(true)
  const [telefone, setTelefone] = useState("")
  const [email, setEmail] = useState("")
  const { toast } = useToast()

  const handleSalvar = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas preferências de notificação foram atualizadas com sucesso.",
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        <PageHeader
          title="Alertas e Lembretes"
          description="Configure alertas e lembretes para suas consultas e outros serviços"
        />
        <div className="container py-6">
          <Tabs defaultValue="configuracoes" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
              <TabsTrigger value="historico">Histórico de Alertas</TabsTrigger>
            </TabsList>
            <TabsContent value="configuracoes">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Tipos de Alertas</CardTitle>
                    <CardDescription>Escolha quais tipos de alertas você deseja receber</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between space-x-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <Label htmlFor="consultas" className="flex-1">
                          Lembretes de consultas
                        </Label>
                      </div>
                      <Switch id="consultas" checked={notificacoesConsulta} onCheckedChange={setNotificacoesConsulta} />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                      <div className="flex items-center space-x-2">
                        <Bell className="h-4 w-4 text-primary" />
                        <Label htmlFor="lotacao" className="flex-1">
                          Alertas de lotação
                        </Label>
                      </div>
                      <Switch id="lotacao" checked={notificacoesLotacao} onCheckedChange={setNotificacoesLotacao} />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <Label htmlFor="transporte" className="flex-1">
                          Alertas de transporte
                        </Label>
                      </div>
                      <Switch
                        id="transporte"
                        checked={notificacoesTransporte}
                        onCheckedChange={setNotificacoesTransporte}
                      />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <Label htmlFor="vacinas" className="flex-1">
                          Lembretes de vacinas
                        </Label>
                      </div>
                      <Switch id="vacinas" checked={notificacoesVacinas} onCheckedChange={setNotificacoesVacinas} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Métodos de Notificação</CardTitle>
                    <CardDescription>Escolha como deseja receber seus alertas</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between space-x-2">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4 text-primary" />
                        <Label htmlFor="sms" className="flex-1">
                          SMS
                        </Label>
                      </div>
                      <Switch id="sms" checked={notificacoesSMS} onCheckedChange={setNotificacoesSMS} />
                    </div>
                    {notificacoesSMS && (
                      <div className="pl-6">
                        <Label htmlFor="telefone" className="text-sm">
                          Número de telefone
                        </Label>
                        <Input
                          id="telefone"
                          placeholder="(00) 00000-0000"
                          value={telefone}
                          onChange={(e) => setTelefone(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between space-x-2">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4 text-primary" />
                        <Label htmlFor="email" className="flex-1">
                          E-mail
                        </Label>
                      </div>
                      <Switch id="email" checked={notificacoesEmail} onCheckedChange={setNotificacoesEmail} />
                    </div>
                    {notificacoesEmail && (
                      <div className="pl-6">
                        <Label htmlFor="email-input" className="text-sm">
                          Endereço de e-mail
                        </Label>
                        <Input
                          id="email-input"
                          placeholder="seu@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between space-x-2">
                      <div className="flex items-center space-x-2">
                        <Smartphone className="h-4 w-4 text-primary" />
                        <Label htmlFor="push" className="flex-1">
                          Notificações push
                        </Label>
                      </div>
                      <Switch id="push" checked={notificacoesPush} onCheckedChange={setNotificacoesPush} />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSalvar} className="w-full">
                      Salvar Configurações
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Preferências Avançadas</CardTitle>
                  <CardDescription>Configure detalhes adicionais sobre seus alertas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="antecedencia-consulta">Antecedência para lembretes de consulta</Label>
                      <Select defaultValue="24">
                        <SelectTrigger id="antecedencia-consulta">
                          <SelectValue placeholder="Selecione a antecedência" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 hora antes</SelectItem>
                          <SelectItem value="3">3 horas antes</SelectItem>
                          <SelectItem value="12">12 horas antes</SelectItem>
                          <SelectItem value="24">24 horas antes</SelectItem>
                          <SelectItem value="48">2 dias antes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="frequencia-lotacao">Frequência de alertas de lotação</Label>
                      <Select defaultValue="imediato">
                        <SelectTrigger id="frequencia-lotacao">
                          <SelectValue placeholder="Selecione a frequência" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="imediato">Imediato</SelectItem>
                          <SelectItem value="15">A cada 15 minutos</SelectItem>
                          <SelectItem value="30">A cada 30 minutos</SelectItem>
                          <SelectItem value="60">A cada hora</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="historico">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Alertas</CardTitle>
                  <CardDescription>Alertas e notificações recentes enviados para você</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        tipo: "consulta",
                        titulo: "Lembrete de Consulta",
                        mensagem: "Sua consulta com Dr. Silva está agendada para amanhã às 14:00.",
                        data: "Hoje, 10:30",
                        icone: <Calendar className="h-5 w-5" />,
                      },
                      {
                        tipo: "lotacao",
                        titulo: "Alerta de Lotação",
                        mensagem:
                          "A UBS Central está com baixa lotação neste momento. Tempo de espera estimado: 15 minutos.",
                        data: "Ontem, 15:45",
                        icone: <Bell className="h-5 w-5" />,
                      },
                      {
                        tipo: "transporte",
                        titulo: "Alerta de Transporte",
                        mensagem:
                          "Saia agora para chegar a tempo na sua consulta. Tempo estimado de viagem: 30 minutos.",
                        data: "23/04/2024, 08:15",
                        icone: <MapPin className="h-5 w-5" />,
                      },
                      {
                        tipo: "vacina",
                        titulo: "Lembrete de Vacina",
                        mensagem: "Não esqueça de tomar a segunda dose da vacina contra COVID-19 esta semana.",
                        data: "20/04/2024, 09:00",
                        icone: <Clock className="h-5 w-5" />,
                      },
                    ].map((alerta, index) => (
                      <div key={index} className="flex gap-4 rounded-lg border p-4">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                            alerta.tipo === "consulta"
                              ? "bg-blue-100 text-blue-600"
                              : alerta.tipo === "lotacao"
                                ? "bg-green-100 text-green-600"
                                : alerta.tipo === "transporte"
                                  ? "bg-purple-100 text-purple-600"
                                  : "bg-yellow-100 text-yellow-600"
                          }`}
                        >
                          {alerta.icone}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium">{alerta.titulo}</h4>
                            <span className="text-xs text-muted-foreground">{alerta.data}</span>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{alerta.mensagem}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Ver Todos os Alertas
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
