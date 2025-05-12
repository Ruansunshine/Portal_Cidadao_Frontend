import type React from "react"
import Link from "next/link"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface ServiceCardProps {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  badge?: string | null
  className?: string
}

export function ServiceCard({ title, description, icon, href, badge, className }: ServiceCardProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden h-full flex flex-col transition-all hover:shadow-md hover:translate-y-[-2px]",
        className,
      )}
    >
      <CardHeader className="pb-3 flex-grow">
        <div className="flex items-center justify-between mb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</div>
          {badge && (
            <Badge variant="secondary" className="ml-auto">
              {badge}
            </Badge>
          )}
        </div>
        <CardTitle className="mt-2">{title}</CardTitle>
        <CardDescription className="line-clamp-3">{description}</CardDescription>
      </CardHeader>
      <CardFooter className="pt-3 mt-auto border-t">
        <Button asChild variant="ghost" className="w-full gap-1 group hover:bg-primary/5 justify-between">
          <Link href={href}>
            <span>Acessar</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
