"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"


type MainNavProps = {
  hideAuthButtons?: boolean
}

export function MainNav({ hideAuthButtons = false }: MainNavProps) {
  const pathname = usePathname()



// export function MainNav() {
//   const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="mr-2 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[300px]">
            <nav className="flex flex-col gap-4 py-4">
              <Link
                href="/"
                className={cn(
                  "flex items-center gap-2 text-lg font-semibold",
                  pathname === "/" ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                Página Inicial
              </Link>
              <Link
                href="/agendar"
                className={cn(
                  "flex items-center gap-2 text-lg font-semibold",
                  pathname === "/agendar" ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                Agendar Consulta
              </Link>
              <Link
                href="/unidades"
                className={cn(
                  "flex items-center gap-2 text-lg font-semibold",
                  pathname === "/unidades" ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                Buscar Unidades
              </Link>
              <Link
                href="/status"
                className={cn(
                  "flex items-center gap-2 text-lg font-semibold",
                  pathname === "/status" ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                Status de Lotação
              </Link>
              <Link
                href="/rotas"
                className={cn(
                  "flex items-center gap-2 text-lg font-semibold",
                  pathname === "/rotas" ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                Rotas de Transporte
              </Link>
              <Link
                href="/alertas"
                className={cn(
                  "flex items-center gap-2 text-lg font-semibold",
                  pathname === "/alertas" ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                Alertas
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="hidden font-bold sm:inline-block">Acesso ao serviços públicos</span>
        </Link>
        <nav className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          <div className="flex gap-6">
            <Link
              href="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/" ? "text-primary" : "text-muted-foreground",
              )}
            >
              Página Inicial
            </Link>
            <Link
              href="/agendar"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/agendar" ? "text-primary" : "text-muted-foreground",
              )}
            >
              Agendar Consulta
            </Link>
            <Link
              href="/unidades"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/unidades" ? "text-primary" : "text-muted-foreground",
              )}
            >
              Buscar Unidades
            </Link>
            <Link
              href="/status"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/status" ? "text-primary" : "text-muted-foreground",
              )}
            >
              Status de Lotação
            </Link>
            <Link
              href="/rotas"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/rotas" ? "text-primary" : "text-muted-foreground",
              )}
            >
              Rotas de Transporte
            </Link>
            <Link
              href="/alertas"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/alertas" ? "text-primary" : "text-muted-foreground",
              )}
            >
              Alertas
            </Link>
          </div>
          {/* <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Entrar
            </Button>
            <Button size="sm">Cadastrar</Button>
          </div> */}
        </nav>
      </div>
    </header>
  )
}
