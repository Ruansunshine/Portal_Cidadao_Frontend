"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { User, Calendar, Clock, FileText, Settings, LogOut, Home, Activity } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/",
      icon: <Home className="h-5 w-5" />,
      label: "Início",
    },
    {
      href: "/perfil",
      icon: <User className="h-5 w-5" />,
      label: "Meu Perfil",
    },
    {
      href: "/consultas",
      icon: <Calendar className="h-5 w-5" />,
      label: "Minhas Consultas",
      badge: "2",
    },
    {
      href: "/historico",
      icon: <Clock className="h-5 w-5" />,
      label: "Histórico Médico",
    },
    {
      href: "/documentos",
      icon: <FileText className="h-5 w-5" />,
      label: "Meus Documentos",
    },
    
  ]

  return (
    <div className="hidden md:flex flex-col w-64 border-r bg-background/80 backdrop-blur-md">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="rounded-full bg-primary/10 p-1">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <span className="font-bold">Sistema de Saúde</span>
        </Link>
      </div>

      <div className="flex flex-col items-center py-4 px-6">
        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg mb-4">
          <User className="h-10 w-10 text-primary-foreground" />
        </div>
        <h2 className="text-xl font-bold">Usuário</h2>
        <p className="text-sm text-muted-foreground">usuario@exemplo.com</p>
        <Badge variant="outline" className="mt-1 px-2 py-0">
          Paciente
        </Badge>
      </div>

      <div className="flex-1 px-3 py-6">
        <nav className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === route.href
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              {route.icon}
              {route.label}
              {route.badge && <Badge className="ml-auto">{route.badge}</Badge>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t">
        <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
          <LogOut className="h-5 w-5" />
          Sair
        </button>
      </div>
    </div>
  )
}
