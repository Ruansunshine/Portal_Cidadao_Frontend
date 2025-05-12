"use client"

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import "leaflet/dist/leaflet.css"
import L, { type Map, Icon } from "leaflet"

import { MainNav } from "@/components/main-nav"
import { PageHeader } from "@/components/page-header"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Phone, FileText, X, Users, Loader2, Navigation, Info } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"

// Carregamento dinâmico dos componentes do Leaflet
const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), { ssr: false })
const Polyline = dynamic(() => import("react-leaflet").then((m) => m.Polyline), { ssr: false })

// Interface para os horários de funcionamento
interface HorarioFuncionamento {
  diaSemana: string
  horarioAbertura: string
  horarioFechamento: string
  aberto: boolean
}

// Interface para as unidades de saúde
interface UnidadeSaude {
  id: string
  nome: string
  endereco: string
  bairro: string
  telefone: string
  horarios: HorarioFuncionamento[]
  documentos: string[]
  servicos: string[]
  lotacao: {
    status: "Baixa" | "Média" | "Alta"
    porcentagem: number
    tempoEspera: string
  }
  localizacao: {
    lat: number
    lng: number
  }
  placeId?: string // ID do Google Places
}

export default function UnidadesSaude() {
  const [busca, setBusca] = useState("")
  const [filtro, setFiltro] = useState("todos")
  const [bairroFiltro, setBairroFiltro] = useState("todos")
  const [modalAberto, setModalAberto] = useState(false)
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<UnidadeSaude | null>(null)
  const [unidadesSaude, setUnidadesSaude] = useState<UnidadeSaude[]>([])
  const [carregando, setCarregando] = useState(true)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [selectedRoute, setSelectedRoute] = useState<Array<[number, number]> | null>(null)
  const [healthUnitIcon, setHealthUnitIcon] = useState<Icon | null>(null)
  const [userLocationIcon, setUserLocationIcon] = useState<Icon | null>(null)
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false)
  const mapRef = useRef<Map | null>(null)
  const { toast } = useToast()

  // Inicializar ícones do mapa
  useEffect(() => {
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

  // Carregar a API do Google Maps
  useEffect(() => {
    // Função para carregar o script do Google Maps
    const carregarGoogleMapsAPI = () => {
      // Verificar se o script já foi carregado
      if (window.google && window.google.maps) {
        setGoogleMapsLoaded(true)
        return
      }

      // Criar script para carregar a API do Google Maps
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=SUA_API_KEY_AQUI&libraries=places`
      script.async = true
      script.defer = true
      script.onload = () => {
        setGoogleMapsLoaded(true)
        console.log("Google Maps API carregada com sucesso")
      }
      script.onerror = () => {
        console.error("Erro ao carregar a API do Google Maps")
      }
      document.head.appendChild(script)
    }

    carregarGoogleMapsAPI()

    // Limpar script ao desmontar o componente
    return () => {
      const script = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]')
      if (script) {
        script.remove()
      }
    }
  }, [])

  // Buscar unidades de saúde da API
  useEffect(() => {
    const buscarUnidades = async () => {
      setCarregando(true)
      try {
        // Obter localização do usuário para buscar unidades próximas
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords
            setUserLocation([latitude, longitude])

            try {
              // Fazer requisição para a API de unidades de saúde
              const response = await fetch(
                `http://localhost:3000/api/unidades/unidades-proximas?lat=${latitude}&lng=${longitude}`,
              )

              if (!response.ok) {
                throw new Error("Falha ao buscar unidades próximas")
              }

              const data = await response.json()

              // Transformar os dados para o formato esperado
              const unidadesFormatadas: UnidadeSaude[] = await Promise.all(
                data.map(async (unidade: any) => {
                  // Buscar informações adicionais do Google Maps se a API estiver carregada
                  let horarios: HorarioFuncionamento[] = getHorariosDefault()
                  let lotacao = {
                    status: "Média" as "Baixa" | "Média" | "Alta",
                    porcentagem: 50,
                    tempoEspera: "30-45 min",
                  }
                  let placeId = undefined

                  // Se a API do Google Maps estiver carregada, buscar dados adicionais
                  if (googleMapsLoaded && window.google && window.google.maps) {
                    try {
                      // Buscar o local no Google Places
                      const resultado = await buscarLocalNoGooglePlaces(
                        unidade.nome,
                        unidade.localizacao.lat,
                        unidade.localizacao.lng,
                      )

                      if (resultado) {
                        placeId = resultado.place_id
                        // Buscar detalhes do local, incluindo horários de funcionamento
                        const detalhes = await buscarDetalhesDoLocal(resultado.place_id)
                        if (detalhes) {
                          // Processar horários de funcionamento
                          if (detalhes.opening_hours && detalhes.opening_hours.weekday_text) {
                            horarios = processarHorariosFuncionamento(detalhes.opening_hours.weekday_text)
                          }

                          // Processar dados de lotação (simulado, pois a API do Google não fornece diretamente)
                          lotacao = simularDadosLotacao(detalhes)
                        }
                      }
                    } catch (error) {
                      console.error("Erro ao buscar dados do Google Maps:", error)
                    }
                  }

                  return {
                    id: unidade.id,
                    nome: unidade.nome,
                    endereco: unidade.endereco,
                    bairro: extrairBairro(unidade.endereco),
                    telefone: unidade.telefone || "(00) 0000-0000",
                    horarios: horarios,
                    documentos: unidade.documentos || ["RG", "CPF", "Cartão SUS", "Comprovante de Residência"],
                    servicos: unidade.servicos || ["Consulta Médica", "Vacina"],
                    lotacao: lotacao,
                    localizacao: {
                      lat: unidade.localizacao.lat,
                      lng: unidade.localizacao.lng,
                    },
                    placeId: placeId,
                  }
                }),
              )

              setUnidadesSaude(unidadesFormatadas)
              toast({
                title: "Unidades carregadas",
                description: `Encontramos ${unidadesFormatadas.length} unidades de saúde.`,
              })
            } catch (error) {
              console.error("Erro ao buscar unidades:", error)
              toast({
                title: "Erro ao carregar unidades",
                description: "Não foi possível carregar as unidades de saúde. Usando dados de exemplo.",
                variant: "destructive",
              })
              // Carregar dados de exemplo em caso de erro
              setUnidadesSaude(dadosExemplo)
            }
          },
          (error) => {
            console.error("Erro de geolocalização:", error)
            toast({
              title: "Erro de localização",
              description: "Não foi possível obter sua localização. Usando dados de exemplo.",
              variant: "destructive",
            })
            // Carregar dados de exemplo em caso de erro
            setUnidadesSaude(dadosExemplo)
          },
        )
      } catch (error) {
        console.error("Erro:", error)
        setUnidadesSaude(dadosExemplo)
      } finally {
        setCarregando(false)
      }
    }

    buscarUnidades()
  }, [googleMapsLoaded, toast])

  // Função para buscar um local no Google Places
  const buscarLocalNoGooglePlaces = async (nome: string, lat: number, lng: number) => {
    // Esta função seria implementada usando a API do Google Places
    // Exemplo de implementação:
    /*
    return new Promise((resolve, reject) => {
      if (!window.google || !window.google.maps) {
        reject("Google Maps API não carregada");
        return;
      }

      const service = new window.google.maps.places.PlacesService(document.createElement('div'));
      const request = {
        query: `${nome} hospital clínica saúde`,
        location: new window.google.maps.LatLng(lat, lng),
        radius: 1000,
        type: ['hospital', 'health']
      };

      service.textSearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
          resolve(results[0]);
        } else {
          reject("Local não encontrado");
        }
      });
    });
    */

    // Simulação para fins de demonstração
    console.log(`Simulando busca no Google Places para: ${nome}`)
    return {
      place_id: `place_${Math.random().toString(36).substring(2, 10)}`,
      name: nome,
    }
  }

  // Função para buscar detalhes de um local no Google Places
  const buscarDetalhesDoLocal = async (placeId: string) => {
    // Esta função seria implementada usando a API do Google Places
    // Exemplo de implementação:
    /*
    return new Promise((resolve, reject) => {
      if (!window.google || !window.google.maps) {
        reject("Google Maps API não carregada");
        return;
      }

      const service = new window.google.maps.places.PlacesService(document.createElement('div'));
      const request = {
        placeId: placeId,
        fields: ['name', 'formatted_address', 'formatted_phone_number', 'opening_hours', 'rating', 'user_ratings_total']
      };

      service.getDetails(request, (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
          resolve(place);
        } else {
          reject("Detalhes do local não encontrados");
        }
      });
    });
    */

    // Simulação para fins de demonstração
    console.log(`Simulando busca de detalhes para place_id: ${placeId}`)
    return {
      name: "Unidade de Saúde",
      formatted_address: "Endereço completo, Bairro, Cidade - Estado",
      formatted_phone_number: "(00) 0000-0000",
      opening_hours: {
        weekday_text: [
          "Segunda-feira: 08:00 – 18:00",
          "Terça-feira: 08:00 – 18:00",
          "Quarta-feira: 08:00 – 18:00",
          "Quinta-feira: 08:00 – 18:00",
          "Sexta-feira: 08:00 – 18:00",
          "Sábado: 08:00 – 12:00",
          "Domingo: Fechado",
        ],
        open_now: true,
      },
      rating: 4.2,
      user_ratings_total: 120,
    }
  }

  // Função para processar os horários de funcionamento do Google Places
  const processarHorariosFuncionamento = (weekdayText: string[]): HorarioFuncionamento[] => {
    const diasSemana = [
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado",
      "Domingo",
    ]
    const hoje = new Date().getDay() // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
    const diaHoje = hoje === 0 ? 6 : hoje - 1 // Ajustar para o índice do array (0 = Segunda, ..., 6 = Domingo)

    return weekdayText.map((texto, index) => {
      // Exemplo: "Segunda-feira: 08:00 – 18:00"
      const partes = texto.split(": ")
      const diaSemana = partes[0]

      if (partes[1] === "Fechado") {
        return {
          diaSemana,
          horarioAbertura: "",
          horarioFechamento: "",
          aberto: false,
        }
      }

      const horarios = partes[1].split(" – ")
      const horarioAbertura = horarios[0]
      const horarioFechamento = horarios[1]

      return {
        diaSemana,
        horarioAbertura,
        horarioFechamento,
        aberto: index === diaHoje, // Marcar como aberto se for o dia atual
      }
    })
  }

  // Função para simular dados de lotação com base nos detalhes do local
  const simularDadosLotacao = (detalhes: any) => {
    // Na vida real, esses dados viriam de uma API específica ou do Google Popular Times
    // Aqui estamos simulando com base na hora atual e na avaliação do local

    const agora = new Date()
    const hora = agora.getHours()

    // Horários de pico típicos para unidades de saúde
    const horarioPico = (hora >= 8 && hora <= 10) || (hora >= 13 && hora <= 15)

    // Usar a avaliação (rating) para influenciar a lotação
    const rating = detalhes.rating || 3.5
    const ratingFactor = (5 - rating) / 5 // Quanto menor a avaliação, maior a lotação

    let porcentagem = 0
    let status: "Baixa" | "Média" | "Alta" = "Baixa"
    let tempoEspera = ""

    if (horarioPico) {
      porcentagem = Math.min(95, 60 + Math.round(ratingFactor * 40))
      if (porcentagem > 80) {
        status = "Alta"
        tempoEspera = "60-90 min"
      } else {
        status = "Média"
        tempoEspera = "30-45 min"
      }
    } else {
      porcentagem = Math.min(70, 30 + Math.round(ratingFactor * 30))
      if (porcentagem > 50) {
        status = "Média"
        tempoEspera = "20-30 min"
      } else {
        status = "Baixa"
        tempoEspera = "10-15 min"
      }
    }

    return {
      status,
      porcentagem,
      tempoEspera,
    }
  }

  // Função para extrair o bairro do endereço
  const extrairBairro = (endereco: string): string => {
    // Tentar extrair o bairro do formato "Rua X, Número - Bairro"
    const match = endereco.match(/- ([^,]+)/)
    if (match && match[1]) {
      return match[1].trim()
    }
    return "Não informado"
  }

  // Função para obter horários padrão
  const getHorariosDefault = (): HorarioFuncionamento[] => {
    const diasSemana = [
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado",
      "Domingo",
    ]
    const hoje = new Date().getDay() // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado

    return diasSemana.map((dia, index) => {
      const ehFinalDeSemana = index >= 5 // Sábado ou Domingo
      return {
        diaSemana: dia,
        horarioAbertura: ehFinalDeSemana ? (index === 5 ? "08:00" : "") : "08:00",
        horarioFechamento: ehFinalDeSemana ? (index === 5 ? "12:00" : "") : "18:00",
        aberto: hoje === (index + 1) % 7 && !ehFinalDeSemana, // Aberto se for o dia atual e não for fim de semana
      }
    })
  }

  // Extrair bairros únicos para o filtro
  const bairros = ["todos", ...Array.from(new Set(unidadesSaude.map((unidade) => unidade.bairro)))]

  // Extrair serviços únicos para o filtro
  const servicos = ["todos", ...Array.from(new Set(unidadesSaude.flatMap((unidade) => unidade.servicos)))]

  // Filtrar unidades com base na busca e filtros
  const unidadesFiltradas = unidadesSaude.filter((unidade) => {
    const matchBusca =
      unidade.nome.toLowerCase().includes(busca.toLowerCase()) ||
      unidade.servicos.some((servico) => servico.toLowerCase().includes(busca.toLowerCase()))

    const matchServico = filtro === "todos" || unidade.servicos.includes(filtro)
    const matchBairro = bairroFiltro === "todos" || unidade.bairro === bairroFiltro

    return matchBusca && matchServico && matchBairro
  })

  // Abrir modal com a unidade selecionada
  const handleVisualizarLocalizacao = (unidade: UnidadeSaude) => {
    setUnidadeSelecionada(unidade)
    setSelectedRoute(null) // Limpar rota anterior
    setModalAberto(true)
  }

  // Fechar modal
  const fecharModal = () => {
    setModalAberto(false)
    setSelectedRoute(null)
  }

  // Mostrar rota para a unidade
  const mostrarRota = () => {
    if (!userLocation || !unidadeSelecionada) {
      toast({
        title: "Localização não disponível",
        description: "Não foi possível obter sua localização atual.",
        variant: "destructive",
      })
      return
    }

    setSelectedRoute([userLocation, [unidadeSelecionada.localizacao.lat, unidadeSelecionada.localizacao.lng]])

    // Ajustar o zoom do mapa para mostrar a rota completa
    if (mapRef.current) {
      const bounds = L.latLngBounds(
        [userLocation[0], userLocation[1]],
        [unidadeSelecionada.localizacao.lat, unidadeSelecionada.localizacao.lng],
      )
      mapRef.current.fitBounds(bounds, { padding: [50, 50] })
    }

    toast({
      title: "Rota calculada",
      description: "Mostrando rota até a unidade selecionada.",
    })
  }

  // Obter o horário de hoje
  const getHorarioHoje = (unidade: UnidadeSaude): HorarioFuncionamento | undefined => {
    const hoje = new Date().getDay() // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
    const diasSemana = [
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado",
    ]
    const diaHoje = diasSemana[hoje]

    return unidade.horarios.find((h) => h.diaSemana.startsWith(diaHoje))
  }

  // Verificar se a unidade está aberta agora
  const estaAbertoAgora = (unidade: UnidadeSaude): boolean => {
    const horarioHoje = getHorarioHoje(unidade)
    if (!horarioHoje || !horarioHoje.aberto || !horarioHoje.horarioAbertura || !horarioHoje.horarioFechamento) {
      return false
    }

    const agora = new Date()
    const horaAtual = agora.getHours() * 60 + agora.getMinutes() // Converter para minutos

    const [horaAbertura, minutoAbertura] = horarioHoje.horarioAbertura.split(":").map(Number)
    const [horaFechamento, minutoFechamento] = horarioHoje.horarioFechamento.split(":").map(Number)

    const aberturaEmMinutos = horaAbertura * 60 + minutoAbertura
    const fechamentoEmMinutos = horaFechamento * 60 + minutoFechamento

    return horaAtual >= aberturaEmMinutos && horaAtual < fechamentoEmMinutos
  }
//esqueleto html
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

          {carregando ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Carregando unidades de saúde...</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {unidadesFiltradas.length > 0 ? (
                unidadesFiltradas.map((unidade) => {
                  const horarioHoje = getHorarioHoje(unidade)
                  const aberto = estaAbertoAgora(unidade)

                  return (
                    <Card key={unidade.id} className="overflow-hidden h-full flex flex-col">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between">
                          <CardTitle>{unidade.nome}</CardTitle>
                          <Badge
                            variant={
                              unidade.lotacao.status === "Baixa"
                                ? "success"
                                : unidade.lotacao.status === "Média"
                                  ? "warning"
                                  : "destructive"
                            }
                          >
                            Lotação {unidade.lotacao.status}
                          </Badge>
                        </div>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" /> {unidade.endereco}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3 pb-3 flex-grow">
                        <div className="flex items-start gap-2">
                          <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span>
                                {horarioHoje && horarioHoje.horarioAbertura
                                  ? `${horarioHoje.horarioAbertura} - ${horarioHoje.horarioFechamento}`
                                  : "Fechado hoje"}
                              </span>
                              <Badge variant={aberto ? "success" : "destructive"} className="text-xs">
                                {aberto ? "Aberto" : "Fechado"}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Tempo de espera estimado: {unidade.lotacao.tempoEspera}
                            </p>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1 text-sm">
                            <span>Lotação atual</span>
                            <span className="font-medium">{unidade.lotacao.porcentagem}%</span>
                          </div>
                          <Progress value={unidade.lotacao.porcentagem} className="h-2" />
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
                      <CardFooter className="flex flex-col gap-3 border-t pt-4 mt-auto">
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
                  )
                })
              ) : (
                <div className="col-span-full text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">Nenhuma unidade encontrada</h3>
                  <p className="text-muted-foreground">
                    Tente ajustar seus critérios de busca para encontrar unidades de saúde.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modal com mapa */}
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
              <div className="aspect-video bg-muted rounded-md mb-4 overflow-hidden">
                {userLocation && healthUnitIcon && userLocationIcon ? (
                  <MapContainer
                    center={[unidadeSelecionada.localizacao.lat, unidadeSelecionada.localizacao.lng]}
                    zoom={15}
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
                    <Marker position={userLocation} icon={userLocationIcon}>
                      <Popup>
                        <div className="p-1">
                          <h3 className="font-medium">Sua localização</h3>
                        </div>
                      </Popup>
                    </Marker>

                    {/* Marcador para a unidade de saúde */}
                    <Marker
                      position={[unidadeSelecionada.localizacao.lat, unidadeSelecionada.localizacao.lng]}
                      icon={healthUnitIcon}
                    >
                      <Popup>
                        <div className="p-1">
                          <h3 className="font-medium">{unidadeSelecionada.nome}</h3>
                          <p className="text-sm">{unidadeSelecionada.endereco}</p>
                        </div>
                      </Popup>
                    </Marker>

                    {/* Linha da rota */}
                    {selectedRoute && (
                      <Polyline positions={selectedRoute} color="#3b82f6" weight={4} opacity={0.7} dashArray="10,10" />
                    )}
                  </MapContainer>
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Informações de Contato</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{unidadeSelecionada.telefone}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Horários de Funcionamento</h4>
                    <div className="space-y-1 text-sm">
                      {unidadeSelecionada.horarios.map((horario) => (
                        <div
                          key={horario.diaSemana}
                          className={`flex justify-between ${horario.aberto ? "font-medium" : ""}`}
                        >
                          <span>{horario.diaSemana}</span>
                          <span>
                            {horario.horarioAbertura
                              ? `${horario.horarioAbertura} - ${horario.horarioFechamento}`
                              : "Fechado"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Status Atual</h4>
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Lotação:{" "}
                        <Badge
                          variant={
                            unidadeSelecionada.lotacao.status === "Baixa"
                              ? "success"
                              : unidadeSelecionada.lotacao.status === "Média"
                                ? "warning"
                                : "destructive"
                          }
                        >
                          {unidadeSelecionada.lotacao.status}
                        </Badge>
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1 text-sm">
                        <span>Ocupação atual</span>
                        <span className="font-medium">{unidadeSelecionada.lotacao.porcentagem}%</span>
                      </div>
                      <Progress value={unidadeSelecionada.lotacao.porcentagem} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Tempo de espera estimado: {unidadeSelecionada.lotacao.tempoEspera}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Serviços Disponíveis</h4>
                    <div className="flex flex-wrap gap-2">
                      {unidadeSelecionada.servicos.map((servico) => (
                        <Badge key={servico} variant="outline">
                          {servico}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md text-sm text-blue-700 flex items-start gap-2">
                <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Informações atualizadas em tempo real</p>
                  <p>
                    Os dados de lotação e tempo de espera são estimativas baseadas em padrões de uso e podem variar.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={fecharModal}>
                Fechar
              </Button>
              <Button onClick={mostrarRota} disabled={!userLocation}>
                <Navigation className="h-4 w-4 mr-2" />
                {selectedRoute ? "Atualizar Rota" : "Obter Direções"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Dados de exemplo para fallback caso a API falhe
const dadosExemplo: UnidadeSaude[] = [
  {
    id: "1",
    nome: "UBS Central",
    endereco: "Av. Principal, 123 - Centro",
    bairro: "Centro",
    telefone: "(11) 3333-4444",
    horarios: [
      { diaSemana: "Segunda-feira", horarioAbertura: "07:00", horarioFechamento: "19:00", aberto: true },
      { diaSemana: "Terça-feira", horarioAbertura: "07:00", horarioFechamento: "19:00", aberto: false },
      { diaSemana: "Quarta-feira", horarioAbertura: "07:00", horarioFechamento: "19:00", aberto: false },
      { diaSemana: "Quinta-feira", horarioAbertura: "07:00", horarioFechamento: "19:00", aberto: false },
      { diaSemana: "Sexta-feira", horarioAbertura: "07:00", horarioFechamento: "19:00", aberto: false },
      { diaSemana: "Sábado", horarioAbertura: "08:00", horarioFechamento: "12:00", aberto: false },
      { diaSemana: "Domingo", horarioAbertura: "", horarioFechamento: "", aberto: false },
    ],
    documentos: ["RG", "CPF", "Cartão SUS", "Comprovante de Residência"],
    servicos: ["Consulta Médica", "Vacina", "Exames Laboratoriais"],
    lotacao: {
      status: "Baixa",
      porcentagem: 30,
      tempoEspera: "10-15 min",
    },
    localizacao: {
      lat: -23.55052,
      lng: -46.633308,
    },
  },
  {
    id: "2",
    nome: "Hospital Municipal",
    endereco: "Rua das Flores, 456 - Jardim",
    bairro: "Jardim",
    telefone: "(11) 5555-6666",
    horarios: [
      { diaSemana: "Segunda-feira", horarioAbertura: "00:00", horarioFechamento: "23:59", aberto: true },
      { diaSemana: "Terça-feira", horarioAbertura: "00:00", horarioFechamento: "23:59", aberto: false },
      { diaSemana: "Quarta-feira", horarioAbertura: "00:00", horarioFechamento: "23:59", aberto: false },
      { diaSemana: "Quinta-feira", horarioAbertura: "00:00", horarioFechamento: "23:59", aberto: false },
      { diaSemana: "Sexta-feira", horarioAbertura: "00:00", horarioFechamento: "23:59", aberto: false },
      { diaSemana: "Sábado", horarioAbertura: "00:00", horarioFechamento: "23:59", aberto: false },
      { diaSemana: "Domingo", horarioAbertura: "00:00", horarioFechamento: "23:59", aberto: false },
    ],
    documentos: ["RG", "CPF", "Cartão SUS"],
    servicos: ["Emergência", "Consulta Médica", "Cirurgia", "Internação"],
    lotacao: {
      status: "Alta",
      porcentagem: 85,
      tempoEspera: "60-90 min",
    },
    localizacao: {
      lat: -23.55792,
      lng: -46.63982,
    },
  },
  {
    id: "3",
    nome: "Centro de Especialidades",
    endereco: "Rua dos Médicos, 789 - Vila Nova",
    bairro: "Vila Nova",
    telefone: "(11) 7777-8888",
    horarios: [
      { diaSemana: "Segunda-feira", horarioAbertura: "08:00", horarioFechamento: "18:00", aberto: true },
      { diaSemana: "Terça-feira", horarioAbertura: "08:00", horarioFechamento: "18:00", aberto: false },
      { diaSemana: "Quarta-feira", horarioAbertura: "08:00", horarioFechamento: "18:00", aberto: false },
      { diaSemana: "Quinta-feira", horarioAbertura: "08:00", horarioFechamento: "18:00", aberto: false },
      { diaSemana: "Sexta-feira", horarioAbertura: "08:00", horarioFechamento: "18:00", aberto: false },
      { diaSemana: "Sábado", horarioAbertura: "", horarioFechamento: "", aberto: false },
      { diaSemana: "Domingo", horarioAbertura: "", horarioFechamento: "", aberto: false },
    ],
    documentos: ["RG", "CPF", "Cartão SUS", "Encaminhamento Médico"],
    servicos: ["Consulta Especializada", "Exames de Imagem"],
    lotacao: {
      status: "Média",
      porcentagem: 60,
      tempoEspera: "30-45 min",
    },
    localizacao: {
      lat: -23.54568,
      lng: -46.63678,
    },
  },
  {
    id: "4",
    nome: "UBS Vila Esperança",
    endereco: "Rua da Esperança, 321 - Vila Esperança",
    bairro: "Vila Esperança",
    telefone: "(11) 2222-3333",
    horarios: [
      { diaSemana: "Segunda-feira", horarioAbertura: "07:00", horarioFechamento: "17:00", aberto: true },
      { diaSemana: "Terça-feira", horarioAbertura: "07:00", horarioFechamento: "17:00", aberto: false },
      { diaSemana: "Quarta-feira", horarioAbertura: "07:00", horarioFechamento: "17:00", aberto: false },
      { diaSemana: "Quinta-feira", horarioAbertura: "07:00", horarioFechamento: "17:00", aberto: false },
      { diaSemana: "Sexta-feira", horarioAbertura: "07:00", horarioFechamento: "17:00", aberto: false },
      { diaSemana: "Sábado", horarioAbertura: "", horarioFechamento: "", aberto: false },
      { diaSemana: "Domingo", horarioAbertura: "", horarioFechamento: "", aberto: false },
    ],
    documentos: ["RG", "CPF", "Cartão SUS", "Comprovante de Residência"],
    servicos: ["Consulta Médica", "Vacina", "Pré-natal"],
    lotacao: {
      status: "Baixa",
      porcentagem: 25,
      tempoEspera: "5-10 min",
    },
    localizacao: {
      lat: -23.55342,
      lng: -46.62897,
    },
  },
]
