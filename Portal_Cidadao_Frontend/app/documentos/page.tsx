"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FileText, Download, Upload, Search, Eye, Trash2, FileUp, File, FilePlus2 } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { toast } from "@/components/ui/use-toast"
import { useEffect } from "react"

// Tipos para documentos
interface Documento {
  id: string
  nome: string
  tipo: string
  tamanho: string
  dataUpload: string
  categoria: "exames" | "receitas" | "atestados" | "outros"
}

export default function DocumentosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [documentos, setDocumentos] = useState<Documento[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // API Integration: Buscar documentos do usuário
  useEffect(() => {
    const fetchDocumentos = async () => {
      try {
        setIsLoading(true)
        // TODO: Integração com API - GET /api/documentos?usuario={id}
        // const response = await fetch(`/api/documentos?usuario=${userId}`)
        // const data = await response.json()
        // setDocumentos(data)

        // Simulação de dados para desenvolvimento
        setTimeout(() => {
          setDocumentos([
            {
              id: "1",
              nome: "Resultado Hemograma.pdf",
              tipo: "PDF",
              tamanho: "1.2 MB",
              dataUpload: "15/03/2024",
              categoria: "exames",
            },
            {
              id: "2",
              nome: "Receita Losartana.pdf",
              tipo: "PDF",
              tamanho: "0.5 MB",
              dataUpload: "20/02/2024",
              categoria: "receitas",
            },
            {
              id: "3",
              nome: "Atestado Médico.pdf",
              tipo: "PDF",
              tamanho: "0.3 MB",
              dataUpload: "10/04/2024",
              categoria: "atestados",
            },
            {
              id: "4",
              nome: "Resultado Eletrocardiograma.jpg",
              tipo: "JPG",
              tamanho: "2.5 MB",
              dataUpload: "10/01/2024",
              categoria: "exames",
            },
            {
              id: "5",
              nome: "Carteira de Vacinação.pdf",
              tipo: "PDF",
              tamanho: "1.8 MB",
              dataUpload: "05/03/2024",
              categoria: "outros",
            },
          ])
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Erro ao buscar documentos:", error)
        setIsLoading(false)
        // TODO: Implementar tratamento de erro
      }
    }

    fetchDocumentos()
  }, [])

  // Filtra os documentos com base na pesquisa
  const filteredDocumentos = (categoria: string) => {
    return documentos.filter(
      (doc) =>
        (doc.categoria === categoria || categoria === "todos") &&
        doc.nome.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  const handleDeleteDocument = async (id: string) => {
    try {
      // TODO: Integração com API - DELETE /api/documentos/{id}
      // const response = await fetch(`/api/documentos/${id}`, {
      //   method: 'DELETE',
      // })
      //
      // if (!response.ok) {
      //   throw new Error('Falha ao excluir documento')
      // }

      // Atualização local após sucesso na API
      setDocumentos(documentos.filter((doc) => doc.id !== id))
      toast({
        title: "Documento excluído",
        description: "O documento foi excluído com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao excluir documento:", error)
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir o documento. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleUploadDocument = async (formData: FormData) => {
    try {
      // TODO: Integração com API - POST /api/documentos
      // const response = await fetch('/api/documentos', {
      //   method: 'POST',
      //   body: formData, // FormData contendo o arquivo e metadados
      // })
      //
      // if (!response.ok) {
      //   throw new Error('Falha ao enviar documento')
      // }
      // const novoDocumento = await response.json()
      // setDocumentos([...documentos, novoDocumento])

      // Simulação de upload
      toast({
        title: "Upload concluído",
        description: "Seu documento foi enviado com sucesso.",
      })

      // Recarregar a lista de documentos após o upload
      // fetchDocumentos()
    } catch (error) {
      console.error("Erro ao enviar documento:", error)
      toast({
        title: "Erro no upload",
        description: "Ocorreu um erro ao enviar o documento. Tente novamente.",
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
            <h1 className="text-3xl font-bold">Meus Documentos</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Enviar Documento
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Enviar Novo Documento</DialogTitle>
                  <DialogDescription>Selecione um arquivo do seu computador para enviar ao sistema.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="border-2 border-dashed rounded-lg p-12 text-center">
                    <FileUp className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Arraste e solte um arquivo aqui, ou clique para selecionar
                    </p>
                    <Input type="file" className="hidden" id="file-upload" />
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => document.getElementById("file-upload")?.click()}
                    >
                      Selecionar Arquivo
                    </Button>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-3">
                      <label className="text-sm font-medium">Categoria</label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                        <option value="exames">Exames</option>
                        <option value="receitas">Receitas</option>
                        <option value="atestados">Atestados</option>
                        <option value="outros">Outros</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Data</label>
                      <Input type="date" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancelar</Button>
                  <Button
                    onClick={() => {
                      const fileInput = document.getElementById("file-upload") as HTMLInputElement
                      if (fileInput && fileInput.files && fileInput.files[0]) {
                        const formData = new FormData()
                        formData.append("file", fileInput.files[0])
                        handleUploadDocument(formData)
                      } else {
                        toast({
                          title: "Nenhum arquivo selecionado",
                          description: "Por favor, selecione um arquivo para enviar.",
                          variant: "destructive",
                        })
                      }
                    }}
                  >
                    Enviar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mb-8 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Pesquisar documentos..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Tabs defaultValue="todos" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="exames">Exames</TabsTrigger>
              <TabsTrigger value="receitas">Receitas</TabsTrigger>
              <TabsTrigger value="atestados">Atestados</TabsTrigger>
              <TabsTrigger value="outros">Outros</TabsTrigger>
            </TabsList>

            {["todos", "exames", "receitas", "atestados", "outros"].map((categoria) => (
              <TabsContent key={categoria} value={categoria} className="space-y-4">
                {filteredDocumentos(categoria).length > 0 ? (
                  filteredDocumentos(categoria).map((documento) => (
                    <Card key={documento.id} className="overflow-hidden">
                      <CardHeader className="pb-4">
                        <div className="flex items-start gap-4">
                          <div className="rounded-lg bg-primary/10 p-2">
                            <FileText className="h-8 w-8 text-primary" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg">{documento.nome}</CardTitle>
                            <CardDescription>
                              Enviado em {documento.dataUpload} • {documento.tamanho}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardFooter className="flex justify-between border-t pt-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="gap-1">
                            <Eye className="h-4 w-4" />
                            Visualizar
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Download className="h-4 w-4" />
                            Baixar
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                          onClick={() => handleDeleteDocument(documento.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <File className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-medium">Nenhum documento encontrado</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {searchTerm
                        ? "Não encontramos documentos que correspondam à sua pesquisa."
                        : "Você não possui documentos nesta categoria."}
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="mt-4">
                          <FilePlus2 className="mr-2 h-4 w-4" />
                          Adicionar Documento
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Enviar Novo Documento</DialogTitle>
                          <DialogDescription>
                            Selecione um arquivo do seu computador para enviar ao sistema.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="border-2 border-dashed rounded-lg p-12 text-center">
                            <FileUp className="h-12 w-12 mx-auto text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">
                              Arraste e solte um arquivo aqui, ou clique para selecionar
                            </p>
                            <Input type="file" className="hidden" id="file-upload-empty" />
                            <Button
                              variant="outline"
                              className="mt-4"
                              onClick={() => document.getElementById("file-upload-empty")?.click()}
                            >
                              Selecionar Arquivo
                            </Button>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline">Cancelar</Button>
                          <Button
                            onClick={() => {
                              const fileInput = document.getElementById("file-upload-empty") as HTMLInputElement
                              if (fileInput && fileInput.files && fileInput.files[0]) {
                                const formData = new FormData()
                                formData.append("file", fileInput.files[0])
                                handleUploadDocument(formData)
                              } else {
                                toast({
                                  title: "Nenhum arquivo selecionado",
                                  description: "Por favor, selecione um arquivo para enviar.",
                                  variant: "destructive",
                                })
                              }
                            }}
                          >
                            Enviar
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  )
}
