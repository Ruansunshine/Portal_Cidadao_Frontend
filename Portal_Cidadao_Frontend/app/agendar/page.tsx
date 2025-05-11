"use client"


// Importações

import "leaflet/dist/leaflet.css";



import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, CheckCircle2, Loader2, MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Components
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

// Dynamic Imports
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);

const Geolocalizacao = dynamic(
  () => import('@/components/geolocalizacao'),
  { 
    ssr: false, // 👈 Fundamental se usar Leaflet ou APIs do navegador
    loading: () => <div>Carregando geolocalização...</div> 
  }
);

const MapComponent = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const MainNavCustom = dynamic(
  () => import("@/components/main-nav").then((mod) => {
    const MainNavComponent = mod.MainNav
    return ({ ...props }) => <MainNavComponent {...props} hideAuthButtons={true} />
  }),
  { ssr: false }
)




// Schema de validação
const formSchema = z.object({
  nome: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  cpf: z.string().min(11, { message: "CPF inválido" }).max(14),
  cartaoSus: z.string().min(15, { message: "Número do Cartão SUS inválido" }),
  unidade: z.string({ required_error: "Selecione uma unidade de saúde" }),
  tipoAtendimento: z.string({ required_error: "Selecione o tipo de atendimento" }),
  data: z.date({ required_error: "Selecione uma data" }),
  horario: z.string({ required_error: "Selecione um horário" }),
})

type FormValues = z.infer<typeof formSchema>

export default function AgendarConsulta() {
  const [agendamentoConfirmado, setAgendamentoConfirmado] = useState(false)
  const [dadosAgendamento, setDadosAgendamento] = useState<FormValues | null>(null)
  const [buscandoLocalizacao, setBuscandoLocalizacao] = useState(false)
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<string | null>(null)
  const [unidadesProximas, setUnidadesProximas] = useState<any[]>([])
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [selectedRoute, setSelectedRoute] = useState<Array<[number, number]> | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const mapRef = useRef<any>(null)
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      cpf: "",
      cartaoSus: "",
    },
  })

  // Hook para ícones do Leaflet
  const icons = useLeafletIcons()

  useEffect(() => {
    if (unidadeSelecionada) {
      form.setValue("unidade", unidadeSelecionada)
    }
  }, [unidadeSelecionada, form])

  // Funções auxiliares
  const formatarCPF = (value: string) => {
    const cpfNumeros = value.replace(/\D/g, "")
    if (cpfNumeros.length <= 3) return cpfNumeros
    if (cpfNumeros.length <= 6) return `${cpfNumeros.slice(0, 3)}.${cpfNumeros.slice(3)}`
    if (cpfNumeros.length <= 9) return `${cpfNumeros.slice(0, 3)}.${cpfNumeros.slice(3, 6)}.${cpfNumeros.slice(6)}`
    return `${cpfNumeros.slice(0, 3)}.${cpfNumeros.slice(3, 6)}.${cpfNumeros.slice(6, 9)}-${cpfNumeros.slice(9, 11)}`
  }

  const formatarCartaoSUS = (value: string) => {
    const susNumeros = value.replace(/\D/g, "")
    if (susNumeros.length <= 3) return susNumeros
    if (susNumeros.length <= 7) return `${susNumeros.slice(0, 3)} ${susNumeros.slice(3)}`
    if (susNumeros.length <= 11) return `${susNumeros.slice(0, 3)} ${susNumeros.slice(3, 7)} ${susNumeros.slice(7)}`
    return `${susNumeros.slice(0, 3)} ${susNumeros.slice(3, 7)} ${susNumeros.slice(7, 11)} ${susNumeros.slice(11, 15)}`
  }

  // Função para buscar unidades próximas
  async function buscarUnidadesProximas() {
    setBuscandoLocalizacao(true)

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })

      const { latitude, longitude } = position.coords
      setUserLocation([latitude, longitude])

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/unidades?lat=${latitude}&lng=${longitude}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          }
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Falha ao buscar unidades próximas")
      }

      const unidades = await response.json()

      const unidadesComDistancia = unidades.map((unidade: any) => {
        const distanciaMetros = calcularDistancia(
          latitude,
          longitude,
          unidade.localizacao.lat,
          unidade.localizacao.lng,
        )

        return {
          id: unidade.id,
          nome: unidade.nome,
          endereco: unidade.endereco,
          lat: unidade.localizacao.lat,
          lng: unidade.localizacao.lng,
          distancia: distanciaMetros < 1000 
            ? `${Math.round(distanciaMetros)} m`
            : `${(distanciaMetros / 1000).toFixed(1)} km`
        }
      })

      setUnidadesProximas(unidadesComDistancia)

      if (mapRef.current && unidadesComDistancia.length > 0) {
        const bounds = unidadesComDistancia.reduce(
          (bounds: any, unit: any) => {
            bounds.extend([unit.lat, unit.lng])
            return bounds
          },
          new (require('leaflet')).LatLngBounds([latitude, longitude], [latitude, longitude])
        )

        mapRef.current.fitBounds(bounds, { padding: [50, 50] })
      }

      toast({
        title: "Localização encontrada",
        description: `Encontramos ${unidadesComDistancia.length} unidades próximas.`,
      })

    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao buscar unidades",
        variant: "destructive"
      })
    } finally {
      setBuscandoLocalizacao(false)
    }
  }


  // -----------------------------------------------------------------------------------------

  // Função para enviar agendamento

    const onSubmit = async (data: FormValues) => {
  setIsSubmitting(true);
  try {
    const response = await fetch('https://53cb-186-216-47-142.ngrok-free.app/scheduling/criar', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // nome_completo: data.nome,
        cpf: data.cpf.replace(/\D/g, ""), // Remove pontos e traços
        sus: data.cartaoSus.replace(/\D/g, ""), // Remove espaços
        date_scheduling: `${format(data.data, "yyyy-MM-dd")}T${data.horario}:00`,
        type: data.tipoAtendimento,
        // unidade_id: data.unidade || "ID_PADRAO", // 👈 Fallback para testes
        latitude: 40.7128,
        longitude: -74.0060,
        users_users_id: 11

  //        "date_scheduling": "2025-05-12",
  // "type": "Consulta",
  // "sus": "123456789012345",
  // "latitude": 40.7128,
  // "longitude": -74.0060,
  // "users_users_id": 11



      }),
    });

    if (!response.ok) throw new Error("Erro na API");
    
    setAgendamentoConfirmado(true);
    toast({ title: "Sucesso!", description: "Agendamento confirmado." });
  } catch (error) {
    toast({
      title: "Erro",
      description: error.message || "Falha ao enviar dados",
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
  };

  // ---------------------------------------------------------------------------------------

  // Funções auxiliares
  function calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371e3
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lon2 - lon1) * Math.PI) / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  function mostrarRota(unidade: any) {
    if (!userLocation) {
      toast({
        title: "Localização não disponível",
        description: "Não foi possível traçar a rota",
        variant: "destructive"
      })
      return
    }
    setSelectedRoute([userLocation, [unidade.lat, unidade.lng]])
    selecionarUnidade(unidade.id)
  }

  function selecionarUnidade(id: string) {
    setUnidadeSelecionada(id)
    const unidade = unidadesProximas.find((u) => u.id === id)
    if (unidade) {
      toast({
        title: "Unidade selecionada",
        description: unidade.nome,
      })
    }
  }

  // Hook para ícones do Leaflet
  function useLeafletIcons() {
    const [icons, setIcons] = useState<{
      healthUnitIcon: any;
      userLocationIcon: any;
    } | null>(null)

    useEffect(() => {
      if (typeof window !== 'undefined') {
        const L = require('leaflet')
        
        delete L.Icon.Default.prototype._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: '/marker-icon-2x.png',
          iconUrl: '/marker-icon.png',
          shadowUrl: '/marker-shadow.png',
        })

        setIcons({
          healthUnitIcon: new L.Icon({
            iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
            shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          }),
          userLocationIcon: new L.Icon({
            iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
            shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          })
        })
      }
    }, [])

    return icons
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNavCustom />
      <main className="flex-1">
        <PageHeader
          title="Agendar Consulta"
          description="Agende consultas médicas, vacinas e outros serviços de saúde"
        />
        <div className="container py-6">
          {!agendamentoConfirmado ? (
            <Card className="mx-auto max-w-5xl">
              <CardHeader>
                <CardTitle>Formulário de Agendamento</CardTitle>
                <CardDescription>Preencha os dados abaixo para agendar seu atendimento</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Coluna da esquerda - Dados Pessoais */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Dados Pessoais</h3>

                        <FormField
                          control={form.control}
                          name="nome"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome Completo</FormLabel>
                              <FormControl>
                                <Input placeholder="Digite seu nome completo" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="cpf"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CPF</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="000.000.000-00"
                                  value={field.value}
                                  onChange={(e) => {
                                    const formattedValue = formatarCPF(e.target.value)
                                    field.onChange(formattedValue)
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="cartaoSus"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cartão SUS</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="000 0000 0000 0000"
                                  value={field.value}
                                  onChange={(e) => {
                                    const formattedValue = formatarCartaoSUS(e.target.value)
                                    field.onChange(formattedValue)
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="tipoAtendimento"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipo de Atendimento</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione o tipo de atendimento" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {[
                                    { id: "consulta", nome: "Consulta Médica" },
                                    { id: "vacina", nome: "Vacinação" },
                                    { id: "exame", nome: "Exames Laboratoriais" },
                                    { id: "especialista", nome: "Consulta com Especialista" },
                                  ].map((tipo) => (
                                    <SelectItem key={tipo.id} value={tipo.id}>
                                      {tipo.nome}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="data"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Data</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "w-full pl-3 text-left font-normal",
                                          !field.value && "text-muted-foreground",
                                        )}
                                      >
                                        {field.value ? (
                                          format(field.value, "dd/MM/yyyy")
                                        ) : (
                                          <span>Selecione uma data</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      disabled={(date) =>
                                        date < new Date() || date.getDay() === 0 || date.getDay() === 6
                                      }
                                      initialFocus
                                      locale={ptBR}
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="horario"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Horário</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione um horário" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {[
                                      "08:00", "08:30", "09:00", "09:30", 
                                      "10:00", "10:30", "11:00", "11:30", 
                                      "13:00", "13:30", "14:00", "14:30", 
                                      "15:00", "15:30", "16:00", "16:30"
                                    ].map((horario) => (
                                      <SelectItem key={horario} value={horario}>
                                        {horario}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-800 mt-6">
                          <h4 className="mb-2 font-medium">Lembrete</h4>
                          <p className="text-sm">
                            Tenha em mãos seus documentos: RG, CPF, Cartão SUS e comprovante de residência.
                          </p>
                        </div>
                      </div>

                      {/* Coluna da direita - Mapa Interativo */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Unidades Próximas a Você</h3>

                        <div className="border rounded-md p-4 space-y-4">
                          <div className="text-center mb-4">
                            <p className="text-muted-foreground mb-2">
                              Encontre unidades de saúde próximas à sua localização
                            </p>

                            <Button
                              variant="default"
                              className="flex items-center gap-2"
                              onClick={buscarUnidadesProximas}
                              disabled={buscandoLocalizacao}
                            >
                              {buscandoLocalizacao ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Buscando...
                                </>
                              ) : (
                                <>
                                  <MapPin className="h-4 w-4" />
                                  Usar minha localização
                                </>
                              )}
                            </Button>
                          </div>

                          <div className="h-[300px] bg-slate-100 rounded-md relative overflow-hidden">
                            {unidadesProximas.length > 0 && icons ? (
                              <MapContainer
                                center={[unidadesProximas[0].lat, unidadesProximas[0].lng]}
                                zoom={13}
                                style={{ height: "100%", width: "100%" }}
                                ref={mapRef}
                              >
                                <TileLayer
                                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                {userLocation && (
                                  <Marker position={userLocation} icon={icons.userLocationIcon}>
                                    <Popup>
                                      <div className="p-1">
                                        <h3 className="font-medium">Sua localização</h3>
                                      </div>
                                    </Popup>
                                  </Marker>
                                )}

                                {unidadesProximas.map((unidade) => (
                                  <Marker
                                    key={unidade.id}
                                    position={[unidade.lat, unidade.lng]}
                                    icon={icons.healthUnitIcon}
                                  >
                                    <Popup>
                                      <div className="p-1">
                                        <h3 className="font-medium">{unidade.nome}</h3>
                                        <p className="text-sm">{unidade.endereco}</p>
                                        <p className="text-sm text-muted-foreground">
                                          Distância: {unidade.distancia}
                                        </p>
                                        <div className="flex gap-2 mt-2">
                                          <Button
                                            size="sm"
                                            className="w-full"
                                            onClick={() => selecionarUnidade(unidade.id)}
                                          >
                                            Selecionar
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => mostrarRota(unidade)}
                                          >
                                            Ver rota
                                          </Button>
                                        </div>
                                      </div>
                                    </Popup>
                                  </Marker>
                                ))}

                                {selectedRoute && (
                                  <Polyline
                                    positions={selectedRoute}
                                    color="#3b82f6"
                                    weight={4}
                                    opacity={0.7}
                                    dashArray="10,10"
                                  />
                                )}
                              </MapContainer>
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                <div className="text-center">
                                  <p>Clique em "Usar minha localização" para ver unidades próximas</p>
                                </div>
                              </div>
                            )}
                          </div>

                          {unidadesProximas.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium mb-2">Unidades encontradas:</h4>
                              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                {unidadesProximas.map((unidade, index) => (
                                  <div
                                    key={unidade.id}
                                    className={`flex justify-between items-center p-3 rounded-md cursor-pointer border ${
                                      unidade.id === unidadeSelecionada
                                        ? "bg-green-50 border-green-200"
                                        : "hover:bg-slate-50 border-slate-200"
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">
                                        {index + 1}
                                      </div>
                                      <div>
                                        <p className="font-medium text-sm">{unidade.nome}</p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                          <span>{unidade.endereco}</span>
                                          <span className="inline-block w-1 h-1 rounded-full bg-slate-300"></span>
                                          <span>{unidade.distancia}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button variant="outline" size="sm" onClick={() => mostrarRota(unidade)}>
                                        Ver rota
                                      </Button>
                                      <Button
                                        variant={unidade.id === unidadeSelecionada ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => selecionarUnidade(unidade.id)}
                                      >
                                        {unidade.id === unidadeSelecionada ? "Selecionada" : "Selecionar"}
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <FormField
                            control={form.control}
                            name="unidade"
                            render={({ field }) => (
                              <FormItem className="hidden">
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full mt-6" 
                      //  
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Agendando...
                        </>
                      ) : (
                        "Confirmar Agendamento"
                      )}
                    </Button>
                    {!unidadeSelecionada && (
                      <p className="text-center text-sm text-red-500 mt-2">
                        Selecione uma unidade de saúde para continuar
                      </p>
                    )}
                  </form>
                </Form>
              </CardContent>
            </Card>
          ) : (
            <Card className="mx-auto max-w-2xl">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Agendamento Confirmado!</CardTitle>
                <CardDescription>Seu agendamento foi realizado com sucesso</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-muted p-4">
                  <h3 className="mb-2 font-semibold">Detalhes do Agendamento</h3>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-2">
                      <span className="text-muted-foreground">Nome:</span>
                      <span>{dadosAgendamento?.nome}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-muted-foreground">CPF:</span>
                      <span>{dadosAgendamento?.cpf}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-muted-foreground">Cartão SUS:</span>
                      <span>{dadosAgendamento?.cartaoSus}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-muted-foreground">Unidade:</span>
                      <span>{unidadesProximas.find((u) => u.id === dadosAgendamento?.unidade)?.nome}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-muted-foreground">Atendimento:</span>
                      <span>{[
                        { id: "consulta", nome: "Consulta Médica" },
                        { id: "vacina", nome: "Vacinação" },
                        { id: "exame", nome: "Exames Laboratoriais" },
                        { id: "especialista", nome: "Consulta com Especialista" },
                      ].find((t) => t.id === dadosAgendamento?.tipoAtendimento)?.nome}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-muted-foreground">Data:</span>
                      <span>{dadosAgendamento?.data && format(dadosAgendamento.data, "dd/MM/yyyy")}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-muted-foreground">Horário:</span>
                      <span>{dadosAgendamento?.horario}</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
                  <h4 className="mb-2 font-medium">Lembrete Importante</h4>
                  <p className="text-sm">
                    Chegue com 15 minutos de antecedência e leve seus documentos: RG, CPF, Cartão SUS e comprovante de
                    residência.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button className="w-full" onClick={() => setAgendamentoConfirmado(false)}>
                  Fazer Novo Agendamento
                </Button>
                <Button variant="outline" className="w-full">
                  Voltar para a Página Inicial
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}