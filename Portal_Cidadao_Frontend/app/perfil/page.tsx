"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Phone, Mail, MapPin, Calendar } from "lucide-react";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { jwtDecode } from "jwt-decode";

export default function PerfilPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    dateNascimento: "",
    cpf: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    tipoSanguineo: "",
    alergias: "",
    condicoesMedicas: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };
  // Buscar dados do usuário do localStorage e API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);

        // Recupera dados do localStorage
        const userString = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!userString || !token) {
          setIsLoading(false);
          toast({
            title: "Erro de autenticação",
            description: "Você precisa estar logado para acessar esta página.",
            variant: "destructive",
          });
          return;
        }

        let userId;
        let localUserData = {};

        // Tenta obter os dados do usuário do localStorage
        try {
          const parsedUserData = JSON.parse(userString);
          userId = parsedUserData?.id;

          // Preenche os campos com os dados disponíveis no localStorage
          setUserData((prevData) => ({
            ...prevData,
            id: parsedUserData.id || "",
            name: parsedUserData.name || "",
            email: parsedUserData.email || "",
            phone: parsedUserData.phone || "",
            dateNascimento: parsedUserData.date
              ? formatDate(parsedUserData.date)
              : "",
            cpf: parsedUserData.cpf || "",
            // Mantém os outros campos vazios se não existirem no localStorage
          }));

          localUserData = parsedUserData;
        } catch (error) {
          console.error("Erro ao analisar dados do usuário:", error);
        }

        // Se não temos o ID do usuário, tentamos extrair do token
        if (!userId && token) {
          try {
            const decodificador = jwtDecode(token);
            userId = decodificador?.id;
          } catch (error) {
            console.error("Erro ao decodificar token:", error);
          }
        }

        if (!userId) {
          setIsLoading(false);
          return;
        }

        // Busca dados completos do usuário na API
        const response = await fetch(
          `http://localhost:3000/router/buscar/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const apiUserData = await response.json();
          const completeUserData = apiUserData.Users || apiUserData;

          // Atualiza o localStorage com os dados completos
          localStorage.setItem("user", JSON.stringify(completeUserData));

          // Preenche o estado com todos os dados disponíveis
          setUserData((prevData) => ({
            ...prevData,
            id: completeUserData.id || prevData.id,
            name: completeUserData.name || prevData.name,
            email: completeUserData.email || prevData.email,
            phone: completeUserData.phone || prevData.phone,
            dateNascimento:
              completeUserData.dateNascimento || prevData.dateNascimento,
            cpf: completeUserData.cpf || prevData.cpf,
            endereco: completeUserData.endereco || prevData.endereco || "",
            cidade: completeUserData.cidade || prevData.cidade || "",
            estado: completeUserData.estado || prevData.estado || "",
            cep: completeUserData.cep || prevData.cep || "",
            tipoSanguineo:
              completeUserData.tipoSanguineo || prevData.tipoSanguineo || "",
            alergias: completeUserData.alergias || prevData.alergias || "",
            condicoesMedicas:
              completeUserData.condicoesMedicas ||
              prevData.condicoesMedicas ||
              "",
          }));
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        setIsLoading(false);
        toast({
          title: "Erro ao carregar dados",
          description:
            "Ocorreu um erro ao buscar suas informações. Tente novamente mais tarde.",
          variant: "destructive",
        });
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // Função para atualizar dados básicos do perfil
  const handleUpdateBasicInfo = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast({
          title: "Erro de autenticação",
          description: "Você precisa estar logado para atualizar seu perfil.",
          variant: "destructive",
        });
        return;
      }

      // Dados básicos que já existem no cadastro
      const basicUserData = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        dateNascimento: userData.dateNascimento,
        cpf: userData.cpf,
      };

      const response = await fetch(
        `http://localhost:3000/router/atualizar/${userData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(basicUserData),
        }
      );

      if (!response.ok) {
        throw new Error("Falha ao atualizar dados básicos");
      }

      // Atualiza o localStorage com os dados atualizados
      const userString = localStorage.getItem("user");
      if (userString) {
        const currentUserData = JSON.parse(userString);
        const updatedUserData = { ...currentUserData, ...basicUserData };
        localStorage.setItem("user", JSON.stringify(updatedUserData));
      }

      toast({
        title: "Dados básicos atualizados",
        description: "Suas informações básicas foram atualizadas com sucesso.",
      });

      return true;
    } catch (error) {
      console.error("Erro ao atualizar dados básicos:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar suas informações básicas.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Função para cadastrar dados complementares
  const handleSaveAdditionalInfo = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast({
          title: "Erro de autenticação",
          description: "Você precisa estar logado para completar seu perfil.",
          variant: "destructive",
        });
        return;
      }

      // Dados complementares opcionais
      const additionalUserData = {
        userId: userData.id,
        endereco: userData.endereco,
        cidade: userData.cidade,
        estado: userData.estado,
        cep: userData.cep,
        tipoSanguineo: userData.tipoSanguineo,
        alergias: userData.alergias,
        condicoesMedicas: userData.condicoesMedicas,
      };

      const response = await fetch(
        `http://localhost:3000/router/complementar-perfil/${userData.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(additionalUserData),
        }
      );

      if (!response.ok) {
        throw new Error("Falha ao cadastrar dados complementares");
      }

      // Atualiza o localStorage com os dados complementares
      const userString = localStorage.getItem("user");
      if (userString) {
        const currentUserData = JSON.parse(userString);
        const updatedUserData = { ...currentUserData, ...additionalUserData };
        localStorage.setItem("user", JSON.stringify(updatedUserData));
      }

      toast({
        title: "Perfil complementado",
        description: "Suas informações adicionais foram salvas com sucesso.",
      });

      return true;
    } catch (error) {
      console.error("Erro ao cadastrar dados complementares:", error);
      toast({
        title: "Erro ao complementar perfil",
        description: "Ocorreu um erro ao salvar suas informações adicionais.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Função principal para salvar todas as alterações
  const handleSave = async () => {
    setIsLoading(true);

    // Primeiro atualiza os dados básicos
    const basicInfoUpdated = await handleUpdateBasicInfo();

    // Se os dados básicos foram atualizados com sucesso, salva os dados complementares
    if (basicInfoUpdated) {
      await handleSaveAdditionalInfo();
    }

    setIsLoading(false);
    setIsEditing(false);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1">
        <div className="container py-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Meu Perfil</h1>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} disabled={isLoading}>
                Editar Perfil
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p>Carregando dados do perfil...</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-3">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center">
                  <Avatar className="h-32 w-32 mb-4">
                    <AvatarImage
                      src="/placeholder.svg?height=128&width=128"
                      alt="Avatar"
                    />
                    <AvatarFallback className="text-4xl">
                      {userData.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{userData.name}</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    {userData.email}
                  </p>

                  <div className="w-full space-y-3 mt-4">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {userData.phone || "Não informado"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{userData.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {userData.cidade && userData.estado
                          ? `${userData.cidade}, ${userData.estado}`
                          : "Não informado"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {userData.dateNascimento || "Não informado"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Detalhes do Perfil</CardTitle>
                  <CardDescription>
                    Gerencie suas informações pessoais e médicas
                  </CardDescription>
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
                          <Label htmlFor="name">Nome Completo</Label>
                          <Input
                            id="name"
                            name="name"
                            value={userData.name}
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
                          <Label htmlFor="phone">Telefone</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={userData.phone}
                            onChange={handleChange}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dateNascimento">
                            Data de Nascimento
                          </Label>
                          <Input
                            id="dateNascimento"
                            name="dateNascimento"
                            value={userData.dateNascimento}
                            onChange={handleChange}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cpf">CPF</Label>
                          <Input
                            id="cpf"
                            name="cpf"
                            value={userData.cpf}
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
                            onValueChange={(value) =>
                              handleSelectChange("estado", value)
                            }
                          >
                            <SelectTrigger id="estado">
                              <SelectValue placeholder="Selecione o estado" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SP">São Paulo</SelectItem>
                              <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                              <SelectItem value="MG">Minas Gerais</SelectItem>
                              <SelectItem value="BA">Bahia</SelectItem>
                              <SelectItem value="RS">
                                Rio Grande do Sul
                              </SelectItem>
                              <SelectItem value="SC">Santa Catarina</SelectItem>
                              <SelectItem value="PR">Paraná</SelectItem>
                              <SelectItem value="PE">Pernambuco</SelectItem>
                              <SelectItem value="CE">Ceará</SelectItem>
                              <SelectItem value="PA">Pará</SelectItem>
                              <SelectItem value="MA">Maranhão</SelectItem>
                              <SelectItem value="GO">Goiás</SelectItem>
                              <SelectItem value="AM">Amazonas</SelectItem>
                              <SelectItem value="ES">Espírito Santo</SelectItem>
                              <SelectItem value="PB">Paraíba</SelectItem>
                              <SelectItem value="RN">
                                Rio Grande do Norte
                              </SelectItem>
                              <SelectItem value="MT">Mato Grosso</SelectItem>
                              <SelectItem value="AL">Alagoas</SelectItem>
                              <SelectItem value="PI">Piauí</SelectItem>
                              <SelectItem value="DF">
                                Distrito Federal
                              </SelectItem>
                              <SelectItem value="MS">
                                Mato Grosso do Sul
                              </SelectItem>
                              <SelectItem value="SE">Sergipe</SelectItem>
                              <SelectItem value="RO">Rondônia</SelectItem>
                              <SelectItem value="TO">Tocantins</SelectItem>
                              <SelectItem value="AC">Acre</SelectItem>
                              <SelectItem value="AP">Amapá</SelectItem>
                              <SelectItem value="RR">Roraima</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cep">CEP</Label>
                          <Input
                            id="cep"
                            name="cep"
                            value={userData.cep}
                            onChange={handleChange}
                            disabled={!isEditing}
                          />
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
                            onValueChange={(value) =>
                              handleSelectChange("tipoSanguineo", value)
                            }
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
                          <Label htmlFor="condicoesMedicas">
                            Condições Médicas
                          </Label>
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
                  </Tabs>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-6">
                  <Button variant="outline" asChild>
                    <Link href="/">Voltar para Home</Link>
                  </Button>
                  {isEditing && (
                    <Button onClick={handleSave} disabled={isLoading}>
                      {isLoading ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
