"use client"

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import "leaflet/dist/leaflet.css"
import L, { type Map, Icon } from "leaflet"

import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, CheckCircle2, MapPin, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/components/ui/use-toast"

const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), { ssr: false })
const Geolocalizacao = dynamic(() => import("@/components/geolocalizacao"), { ssr: false })
const Polyline = dynamic(() => import("react-leaflet").then((m) => m.Polyline), { ssr: false })

const MainNavCustom = dynamic(
  () =>
    import("@/components/main-nav").then((mod) => {
      // Return a modified version of MainNav without login/register buttons
      return ({ ...props }) => {
        const MainNavComponent = mod.MainNav
        return <MainNavComponent {...props} hideAuthButtons={true} />
      }
    }),
  { ssr: false },
)

// useEffect(() => {
//   // Evita importar 'leaflet' no topo
//   const L = require("leaflet")

//   delete L.Icon.Default.prototype._getIconUrl
//   L.Icon.Default.mergeOptions({
//     iconRetinaUrl: "/marker-icon-2x.png",
//     iconUrl: "/marker-icon.png",
//     shadowUrl: "/marker-shadow.png",
//   })
// }, [])

const unidadesSaude = [
  {
    id: "1",
    nome: "UBS Central",
    endereco: "Av. Principal, 123",
    lat: -23.55052,
    lng: -46.633308,
    distancia: "1.2 km",
  },
  {
    id: "2",
    nome: "Hospital Municipal",
    endereco: "Rua das Flores, 456",
    lat: -23.55792,
    lng: -46.63982,
    distancia: "1.8 km",
  },
  {
    id: "3",
    nome: "Centro de Especialidades",
    endereco: "Praça da Saúde, 789",
    lat: -23.54568,
    lng: -46.63678,
    distancia: "2.5 km",
  },
  {
    id: "4",
    nome: "UBS Vila Esperança",
    endereco: "Rua da Esperança, 321",
    lat: -23.55342,
    lng: -46.62897,
    distancia: "3.1 km",
  },
]

const tiposAtendimento = [
  { id: "consulta", nome: "Consulta Médica" },
  { id: "vacina", nome: "Vacinação" },
  { id: "exame", nome: "Exames Laboratoriais" },
  { id: "especialista", nome: "Consulta com Especialista" },
]

const horarios = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
]

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
  const [unidadesProximas, setUnidadesProximas] = useState<typeof unidadesSaude>([])
  const { toast } = useToast()
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [selectedRoute, setSelectedRoute] = useState<Array<[number, number]> | null>(null)
  const mapRef = useRef<Map | null>(null)

  // Adicionar estas variáveis de estado para os ícones
  const [healthUnitIcon, setHealthUnitIcon] = useState<Icon | null>(null)
  const [userLocationIcon, setUserLocationIcon] = useState<Icon | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      cpf: "",
      cartaoSus: "",
    },
  })
  useEffect(() => {
    if (unidadeSelecionada) {
      form.setValue("unidade", unidadeSelecionada)
    }
  }, [unidadeSelecionada, form])
  const formatarCPF = (value: string) => {
    // Remove todos os caracteres não numéricos
    const cpfNumeros = value.replace(/\D/g, "")

    // Aplica a máscara de CPF: 000.000.000-00
    if (cpfNumeros.length <= 3) {
      return cpfNumeros
    } else if (cpfNumeros.length <= 6) {
      return `${cpfNumeros.slice(0, 3)}.${cpfNumeros.slice(3)}`
    } else if (cpfNumeros.length <= 9) {
      return `${cpfNumeros.slice(0, 3)}.${cpfNumeros.slice(3, 6)}.${cpfNumeros.slice(6)}`
    } else {
      return `${cpfNumeros.slice(0, 3)}.${cpfNumeros.slice(3, 6)}.${cpfNumeros.slice(6, 9)}-${cpfNumeros.slice(9, 11)}`
    }
  }
  const formatarCartaoSUS = (value: string) => {
    // Remove todos os caracteres não numéricos
    const susNumeros = value.replace(/\D/g, "")

    // Aplica a máscara de Cartão SUS: 000 0000 0000 0000
    if (susNumeros.length <= 3) {
      return susNumeros
    } else if (susNumeros.length <= 7) {
      return `${susNumeros.slice(0, 3)} ${susNumeros.slice(3)}`
    } else if (susNumeros.length <= 11) {
      return `${susNumeros.slice(0, 3)} ${susNumeros.slice(3, 7)} ${susNumeros.slice(7)}`
    } else {
      return `${susNumeros.slice(0, 3)} ${susNumeros.slice(3, 7)} ${susNumeros.slice(7, 11)} ${susNumeros.slice(11, 15)}`
    }
  }
  // Adicionar este useEffect para inicializar os ícones apenas no cliente
  useEffect(() => {
    // Inicializar os ícones apenas no lado do cliente
    setHealthUnitIcon(
      new Icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      }),
    )

    setUserLocationIcon(
      new Icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      }),
    )
  }, [])
  function onSubmit(data: FormValues) {
    // Simulação de envio para API
    setTimeout(() => {
      setDadosAgendamento(data)
      setAgendamentoConfirmado(true)
      toast({
        title: "Agendamento realizado com sucesso!",
        description: `Sua consulta foi agendada para ${format(data.data, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} às ${data.horario}.`,
      })
    }, 1000)
  }
  //aqui usa o componente Geolocalização para buscar a localização atual do usuario
  function buscarUnidadesProximas() {
    setBuscandoLocalizacao(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        // Save user location for routing
        setUserLocation([latitude, longitude])

        try {
          // Faz a requisição para o backend com as coordenadas do usuário //aqui é o consumo da api. Verifiquem e que porta está rodando o back end na maquina de vocês
          const response = await fetch(
            `http://localhost:3000/api/unidades/unidades-proximas?lat=${latitude}&lng=${longitude}`, //ela retorna latitude e longitude
          )

          if (!response.ok) {
            console.error("Erro da API:", response.status, await response.text())
            throw new Error("Falha ao buscar unidades próximas")
          }

          const unidades = await response.json()

          if (unidades && unidades.length > 0) {
            // Calcula a distância aproximada para cada unidade (opcional)
            const unidadesComDistancia = unidades.map(
              (unidade: { localizacao: { lat: number; lng: number }; id: any; nome: any; endereco: any }) => {
                // Cálculo simples de distância em metros usando a fórmula de Haversine
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
                  distancia:
                    distanciaMetros < 25000
                      ? `${Math.round(distanciaMetros)} m`
                      : `${(distanciaMetros / 1000).toFixed(1)} km`,
                }
              },
            )

            // Atualiza o estado com as unidades encontradas
            setUnidadesProximas(unidadesComDistancia)

            // Fit map bounds to include all markers
            if (mapRef.current && unidadesComDistancia.length > 0) {
              const bounds = unidadesComDistancia.reduce(
                (bounds: { extend: (arg0: any[]) => void }, unit: { lat: any; lng: any }) => {
                  bounds.extend([unit.lat, unit.lng])
                  return bounds
                },
                L.latLngBounds([latitude, longitude], [latitude, longitude]),
              )

              mapRef.current.fitBounds(bounds, { padding: [50, 50] })
            }

            toast({
              title: "Localização encontrada",
              description: `Encontramos ${unidadesComDistancia.length} unidades de saúde próximas a você.`,
            })
          } else {
            // Caso não encontre unidades próximas
            toast({
              title: "Nenhuma unidade encontrada",
              description: "Não encontramos unidades de saúde próximas à sua localização.",
              variant: "destructive",
            })
            setUnidadesProximas([])
          }
        } catch (error) {
          console.error("Erro ao buscar unidades próximas:", error)
          toast({
            title: "Erro ao buscar unidades",
            description: "Ocorreu um erro ao buscar unidades próximas. Tente novamente.",
            variant: "destructive",
          })
          setUnidadesProximas([])
        } finally {
          setBuscandoLocalizacao(false)
        }
      },
      (error) => {
        console.error("Erro de geolocalização:", error)
        toast({
          title: "Erro de localização",
          description: "Não foi possível obter sua localização. Verifique as permissões do navegador.",
          variant: "destructive",
        })
        setBuscandoLocalizacao(false)
      },
    )
  }
  function calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371e3 // Raio da Terra em metros
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lon2 - lon1) * Math.PI) / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c // Distância em metros
  }
  function mostrarRota(unidade: any) {
    if (!userLocation) {
      toast({
        title: "Localização não disponível",
        description: "Sua localização atual não está disponível. Tente novamente.",
        variant: "destructive",
      })
      return
    }
    setSelectedRoute([userLocation, [unidade.lat, unidade.lng]])
    selecionarUnidade(unidade.id)
  }
  function selecionarUnidade(id: string) {
    setUnidadeSelecionada(id)

    const unidadeSelecionada = unidadesProximas.find((u) => u.id === id)
    if (unidadeSelecionada) {
      toast({
        title: "Unidade selecionada",
        description: `Você selecionou: ${unidadeSelecionada.nome}`,
      })
    }
  }
  useEffect(() => {
    if (unidadesProximas.length > 0) {
      console.log("Unidades próximas atualizadas:", unidadesProximas)
    }
  }, [unidadesProximas])
function agendar(){
  
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
                                  {tiposAtendimento.map((tipo) => (
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
                                    {horarios.map((horario) => (
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

                        {/* Componente de Mapa Interativo */}
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

                          {/* Mapa interativo */}
                          <div className="h-[300px] bg-slate-100 rounded-md relative overflow-hidden">
                            {unidadesProximas.length > 0 ? (
                              <MapContainer
                                center={[unidadesProximas[0].lat, unidadesProximas[0].lng]}
                                zoom={13}
                                style={{ height: "100%", width: "100%" }}
                                ref={(map) => {
                                  if (map) mapRef.current = map
                                }}
                              >
                                <TileLayer
                                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                {/* Marcador para a localização do usuário */}
                                {userLocation && userLocationIcon && (
                                  <Marker position={userLocation} icon={userLocationIcon}>
                                    <Popup>
                                      <div className="p-1">
                                        <h3 className="font-medium">Sua localização</h3>
                                      </div>
                                    </Popup>
                                  </Marker>
                                )}

                                {/* Marcadores para cada unidade de saúde */}
                                {unidadesProximas.map(
                                  (unidade) =>
                                    healthUnitIcon && (
                                      <Marker
                                        key={unidade.id}
                                        position={[unidade.lat, unidade.lng]}
                                        icon={healthUnitIcon}
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
                                    ),
                                )}

                                {/* Linha da rota */}
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

                          {/* Lista de unidades próximas */}
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
                                      <div
                                        className={`w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold`}
                                      >
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

                          {/* Campo oculto para armazenar a unidade selecionada */}
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

                    <Button type="submit" className="w-full mt-6" disabled={!unidadeSelecionada}>
                      Confirmar Agendamento
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
                      <span className="text-muted-foreground">Unidade:</span>
                      <span>{unidadesSaude.find((u) => u.id === dadosAgendamento?.unidade)?.nome}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-muted-foreground">Atendimento:</span>
                      <span>{tiposAtendimento.find((t) => t.id === dadosAgendamento?.tipoAtendimento)?.nome}</span>
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
