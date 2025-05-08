"use client";

import { useState, useEffect } from "react";
import { ServiceCard } from "@/components/service-card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  MapPin,
  Bell,
  Bus,
  Users,
  Search,
  Menu,
  MessageSquareText,
  Settings,
  FileText,
  Clock,
  LogOut,
  Activity,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  
  const [userName, setUserName] = useState("Usuário");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [activeTab, setActiveTab] = useState("todos");

  //recupera dados dad localStorage:
  // Recupera os dados da URL
  // Recupera os dados da URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      const user = params.get("user");

      if (token && user) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", user);
        window.history.replaceState({}, document.title, "/");
      }

      // Aqui é onde resolvemos o problema da renderização:
      const userString = localStorage.getItem("user");
      if (userString) {
        try {
          const userData = JSON.parse(userString);
          setUserName(userData?.name || "Usuário");
        } catch {
          setUserName("Usuário");
        }
      }
    }
  }, []);
  // Lista de prompts pré-estabelecidos
  const presetPrompts = [
    "Como agendar uma consulta?",
    "Quais documentos preciso levar?",
    "Como cancelar um agendamento?",
    "Como cancelar um agendamento?",
    "Onde encontro meu cartão SUS?",
    "Quais vacinas estão disponíveis?",
  ];

  // Atualiza o horário atual
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  // Simula resposta da IA
  const handleAskQuestion = () => {
    if (!aiPrompt) return;

    setIsLoading(true);

    // Simula tempo de resposta da API
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-background/80">
      {/* Barra de navegação com botão hamburguer */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu de navegação</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px]">
                <div className="flex items-center mb-8">
                  <div className="mr-2 rounded-full bg-primary/10 p-2">
                    <Home className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold">Sistema de Saúde</h2>
                </div>
                <nav className="flex flex-col gap-4 py-4">
                  <Link
                    href="/agendar"
                    className="flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors"
                  >
                    <Calendar className="h-5 w-5" />
                    Agendar Consulta
                  </Link>
                  <Link
                    href="/unidades"
                    className="flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors"
                  >
                    <Search className="h-5 w-5" />
                    Buscar Unidades
                  </Link>
                  <Link
                    href="/status"
                    className="flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors"
                  >
                    <Users className="h-5 w-5" />
                    Status de Lotação
                  </Link>
                  <Link
                    href="/rotas"
                    className="flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors"
                  >
                    <Bus className="h-5 w-5" />
                    Rotas de Transporte
                  </Link>
                  <Link
                    href="/alertas"
                    className="flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors"
                  >
                    <Bell className="h-5 w-5" />
                    Alertas
                  </Link>
                  <Link
                    href="/mapa"
                    className="flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors"
                  >
                    <MapPin className="h-5 w-5" />
                    Mapa de Unidades
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center gap-2">
              <div className="hidden md:flex rounded-full bg-primary/10 p-1">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <span className="font-bold">Sistema de Saúde Pública</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-sm text-muted-foreground">
              {currentTime}
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu de perfil</span>
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    2
                  </span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="py-4">
                  <div className="mb-6 flex flex-col items-center justify-center space-y-2">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                      {/* TODO: Implementar avatar do usuário - Deve buscar a imagem do perfil do banco de dados */}
                      <Users className="h-10 w-10 text-primary-foreground" />
                    </div>
                    <h2 className="text-xl font-bold">
                      {/* TODO: Nome do usuário deve ser buscado da tabela de usuários no banco de dados */}
                      Usuário
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {/* TODO: Email do usuário deve ser buscado da tabela de usuários no banco de dados */}
                      usuario@exemplo.com
                    </p>
                    <Badge variant="outline" className="mt-1 px-2 py-0">
                      Paciente
                    </Badge>
                  </div>
                  <nav className="space-y-4">
                    <Link
                      href="/perfil"
                      className="flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors"
                    >
                      <Users className="h-5 w-5" />
                      Meu Perfil
                    </Link>

                    <div className="pt-4">
                      <Button variant="destructive" className="w-full">
                        <LogOut className="mr-2 h-4 w-4" />
                        {/* TODO: Implementar lógica de logout que deve limpar a sessão do usuário no banco de dados */}
                        Sair
                      </Button>
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Seção de boas-vindas com nome do usuário */}
        <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-12">
          <div className="container">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-primary/10 text-sm font-medium text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Bem-vindo ao sistema</span>
                </div>
                <h1 className="mb-2 text-4xl font-bold tracking-tight">
                  {/* TODO: Implementar integração com banco de dados para obter nome do usuário da tabela de usuários */}
                  Olá, <span className="text-primary">{userName}</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  Acesse informações sobre serviços públicos de saúde, agende
                  consultas e mais.
                </p>
              </div>
              <div className="mt-6 md:mt-0 flex items-center gap-4">
                <div className="hidden md:block rounded-lg border bg-card p-3 shadow-sm">
                  <div className="text-sm font-medium mb-1">
                    Próxima consulta
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {/* TODO: Buscar próxima consulta do banco de dados */}
                    15 de Maio, 14:30
                  </div>
                </div>
                <Button className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Agendar
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Cards de serviços */}
        <section className="container py-12">
          <div className="mb-8">
            <Tabs
              defaultValue="todos"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Serviços disponíveis</h2>
                <TabsList className="grid grid-cols-3 w-[300px]">
                  <TabsTrigger value="todos">Todos</TabsTrigger>
                  <TabsTrigger value="populares">Populares</TabsTrigger>
                  <TabsTrigger value="novos">Novos</TabsTrigger>
                </TabsList>
              </div>
            </Tabs>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ServiceCard
              title="Agendar Consulta"
              description="Agende consultas médicas, vacinas e outros serviços de saúde."
              icon={<Calendar className="h-8 w-8" />}
              href="/agendar"
              className="transform transition-all hover:scale-[1.02] hover:shadow-lg"
            />
            <ServiceCard
              title="Buscar Unidades de Saúde"
              description="Encontre unidades de saúde por bairro ou tipo de serviço."
              icon={<Search className="h-8 w-8" />}
              href="/unidades"
              className="transform transition-all hover:scale-[1.02] hover:shadow-lg"
            />
            <ServiceCard
              title="Status de Lotação"
              description="Verifique a lotação das unidades de saúde em tempo real."
              icon={<Users className="h-8 w-8" />}
              href="/status"
              className="transform transition-all hover:scale-[1.02] hover:shadow-lg"
              badge="Ao vivo"
            />
            <ServiceCard
              title="Rotas de Transporte"
              description="Visualize rotas de transporte público para chegar às unidades de saúde."
              icon={<Bus className="h-8 w-8" />}
              href="/rotas"
              className="transform transition-all hover:scale-[1.02] hover:shadow-lg"
            />
            <ServiceCard
              title="Alertas"
              description="Configure alertas e lembretes para suas consultas."
              icon={<Bell className="h-8 w-8" />}
              href="/alertas"
              className="transform transition-all hover:scale-[1.02] hover:shadow-lg"
            />
            <ServiceCard
              title="Mapa de Unidades"
              description="Visualize todas as unidades de saúde em um mapa interativo."
              icon={<MapPin className="h-8 w-8" />}
              href="/mapa"
              className="transform transition-all hover:scale-[1.02] hover:shadow-lg"
              badge="Novo"
            />
          </div>
        </section>

        {/* Seção de ajuda com IA */}
        <section className="container py-8">
          <div className="rounded-xl bg-gradient-to-r from-primary/5 via-card to-primary/5 p-8 shadow-lg border">
            <div className="flex items-start gap-6">
              <div className="hidden md:flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <MessageSquareText className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="mb-3 text-2xl font-bold">
                  Assistente de Saúde Virtual
                </h2>
                <p className="mb-6 text-muted-foreground">
                  Nosso assistente virtual inteligente pode ajudar com
                  informações sobre os serviços de saúde, tirar dúvidas sobre
                  procedimentos e fornecer orientações gerais.
                </p>

                {/* TODO: Implementar integração com API de IA e salvar histórico de perguntas no banco de dados */}
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-2">
                    {presetPrompts.map((prompt, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => setAiPrompt(prompt)}
                        className="text-sm bg-background/80 backdrop-blur-sm"
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Digite sua pergunta aqui..."
                      className="flex-1 rounded-md border border-input bg-background/80 backdrop-blur-sm px-3 py-2 text-sm ring-offset-background"
                    />
                    <Button onClick={handleAskQuestion} disabled={isLoading}>
                      {isLoading ? "Processando..." : "Perguntar"}
                    </Button>
                  </div>

                  {/* Área onde as respostas da IA serão exibidas */}
                  {aiPrompt && (
                    <div className="mt-4 rounded-md bg-background/80 backdrop-blur-sm p-4 border">
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 animate-pulse rounded-full bg-primary"></div>
                          <div
                            className="h-2 w-2 animate-pulse rounded-full bg-primary"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="h-2 w-2 animate-pulse rounded-full bg-primary"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                          <span className="ml-2 text-sm font-medium">
                            Processando sua pergunta...
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                              <Sparkles className="h-3 w-3 text-primary" />
                            </div>
                            <p className="text-sm font-medium">
                              Assistente de Saúde
                            </p>
                          </div>
                          <p className="text-sm">
                            {/* TODO: Aqui virá a resposta da API de IA */}
                            Resposta será exibida aqui quando a API for
                            implementada. Esta é apenas uma visualização de como
                            ficará a interface.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <Button asChild variant="outline" className="gap-2">
                    <Link href="/contato">
                      <Users className="h-4 w-4" />
                      Falar com um atendente humano
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 bg-background/80 backdrop-blur-md">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <p className="text-sm font-medium">Sistema de Saúde Pública</p>
            </div>
            <div className="flex gap-6">
              <Link
                href="/acessibilidade"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Acessibilidade
              </Link>
              <Link
                href="/privacidade"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Política de Privacidade
              </Link>
              <Link
                href="/termos"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Termos de Uso
              </Link>
            </div>
            <p className="text-center text-xs text-muted-foreground">
              &copy; 2024 Sistema de Saúde Pública. Todos os direitos
              reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
