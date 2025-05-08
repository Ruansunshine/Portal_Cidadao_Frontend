"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { Phone, Mail, MapPin, Calendar } from "lucide-react"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"

export default function PerfilPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState({
    nome: "",
    email: "",
    telefone: "",
    dataNascimento: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    tipoSanguineo: "",
    alergias: "",
    condicoesMedicas: "",
  })

  const [isLoading, setIsLoading] = useState(true)

  // Adicionar após a declaração dos estados
  // API Integration: Buscar dados do usuário
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true)
        // TODO: Integração com API - GET /api/usuarios/{id}
        // const response = await fetch(`/api/usuarios/${userId}`)
        // const data = await response.json()
        // setUserData(data)

        // Simulação de dados para desenvolvimento
        setTimeout(() => {
          setUserData({
            nome: "João Silva",
            email: "usuario@exemplo.com",
            telefone: "(11) 98765-4321",
            dataNascimento: "15/05/1985",
            endereco: "Rua das Flores, 123 - Jardim Primavera",
            cidade: "São Paulo",
            estado: "SP",
            cep: "01234-567",
            tipoSanguineo: "O+",
            alergias: "Penicilina, Amendoim",
            condicoesMedicas: "Hipertensão",
          })
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error)
        setIsLoading(false)
        // TODO: Implementar tratamento de erro
      }
    }

    fetchUserData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setUserData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setUserData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      // TODO: Integração com API - PUT /api/usuarios/{id}
      // const response = await fetch(`/api/usuarios/${userId}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(userData),
      // })
      //
      // if (!response.ok) {
      //   throw new Error('Falha ao atualizar perfil')
      // }
      // const data = await response.json()

      // Simulação de salvamento
      setTimeout(() => {
        setIsEditing(false)
        toast({
          title: "Perfil atualizado",
          description: "Suas informações foram atualizadas com sucesso.",
        })
      }, 1000)
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error)
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar suas informações. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1">
        <div className="container py-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Meu Perfil</h1>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>Editar Perfil</Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>Salvar Alterações</Button>
              </div>
            )}
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src="/placeholder.svg?height=128&width=128" alt="Avatar" />
                  <AvatarFallback className="text-4xl">{userData.nome.charAt(0)}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{userData.nome}</h2>
                <p className="text-sm text-muted-foreground mb-4">{userData.email}</p>

                <div className="w-full space-y-3 mt-4">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{userData.telefone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{userData.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {userData.cidade}, {userData.estado}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{userData.dataNascimento}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Detalhes do Perfil</CardTitle>
                <CardDescription>Gerencie suas informações pessoais e médicas</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="pessoal">
                  <TabsList className="mb-4 w-full">
                    <TabsTrigger value="pessoal" className="flex-1">
                      Dados Pessoais
                    </TabsTrigger>
                    <TabsTrigger value="medico" className="flex-1">
                      Dados Médicos
                    </TabsTrigger>
                   
                  </TabsList>

                  <TabsContent value="pessoal" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="nome">Nome Completo</Label>
                        <Input
                          id="nome"
                          name="nome"
                          value={userData.nome}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={userData.email}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telefone">Telefone</Label>
                        <Input
                          id="telefone"
                          name="telefone"
                          value={userData.telefone}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                        <Input
                          id="dataNascimento"
                          name="dataNascimento"
                          value={userData.dataNascimento}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endereco">Endereço</Label>
                        <Input
                          id="endereco"
                          name="endereco"
                          value={userData.endereco}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cidade">Cidade</Label>
                        <Input
                          id="cidade"
                          name="cidade"
                          value={userData.cidade}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="estado">Estado</Label>
                        <Select
                          disabled={!isEditing}
                          value={userData.estado}
                          onValueChange={(value) => handleSelectChange("estado", value)}
                        >
                          <SelectTrigger id="estado">
                            <SelectValue placeholder="Selecione o estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SP">São Paulo</SelectItem>
                            <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                            <SelectItem value="MG">Minas Gerais</SelectItem>
                            <SelectItem value="BA">Bahia</SelectItem>
                            <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cep">CEP</Label>
                        <Input id="cep" name="cep" value={userData.cep} onChange={handleChange} disabled={!isEditing} />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="medico" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="tipoSanguineo">Tipo Sanguíneo</Label>
                        <Select
                          disabled={!isEditing}
                          value={userData.tipoSanguineo}
                          onValueChange={(value) => handleSelectChange("tipoSanguineo", value)}
                        >
                          <SelectTrigger id="tipoSanguineo">
                            <SelectValue placeholder="Selecione o tipo sanguíneo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A+">A+</SelectItem>
                            <SelectItem value="A-">A-</SelectItem>
                            <SelectItem value="B+">B+</SelectItem>
                            <SelectItem value="B-">B-</SelectItem>
                            <SelectItem value="AB+">AB+</SelectItem>
                            <SelectItem value="AB-">AB-</SelectItem>
                            <SelectItem value="O+">O+</SelectItem>
                            <SelectItem value="O-">O-</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="alergias">Alergias</Label>
                        <Textarea
                          id="alergias"
                          name="alergias"
                          value={userData.alergias}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder="Liste suas alergias separadas por vírgula"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="condicoesMedicas">Condições Médicas</Label>
                        <Textarea
                          id="condicoesMedicas"
                          name="condicoesMedicas"
                          value={userData.condicoesMedicas}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder="Liste suas condições médicas separadas por vírgula"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="preferencias" className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="notificacoes">Notificações por Email</Label>
                          <p className="text-sm text-muted-foreground">Receba lembretes de consultas por email</p>
                        </div>
                        <Switch id="notificacoes" disabled={!isEditing} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="sms">Notificações por SMS</Label>
                          <p className="text-sm text-muted-foreground">Receba lembretes de consultas por SMS</p>
                        </div>
                        <Switch id="sms" disabled={!isEditing} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="compartilhar">Compartilhar Dados Médicos</Label>
                          <p className="text-sm text-muted-foreground">Permitir que médicos acessem seu histórico</p>
                        </div>
                        <Switch id="compartilhar" disabled={!isEditing} />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" asChild>
                  <Link href="/">Voltar para Home</Link>
                </Button>
                {isEditing && <Button onClick={handleSave}>Salvar Alterações</Button>}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
