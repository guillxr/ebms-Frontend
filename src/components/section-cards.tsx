'use client'

import { useEffect, useState } from "react"
import { IconCalendarEvent } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { getAllSchedulings, Scheduling } from "@/services/schedulingService"
import { useRefresh } from "@/contexts/RefreshContext"

export function SectionCards() {
  const [schedulings, setSchedulings] = useState<Scheduling[]>([])
  const { refreshKey } = useRefresh()

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllSchedulings()
      setSchedulings(data)
    }
    fetchData()
  }, [refreshKey]) // atualiza ao mudar refreshKey

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {schedulings.map((scheduling) => (
        <Card key={scheduling.id} className="@container/card">
          <CardHeader>
            <CardDescription>Agendamento</CardDescription>
            <CardTitle className="text-lg font-semibold tabular-nums">
              {new Date(scheduling.data_agendamento).toLocaleString("pt-BR")}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconCalendarEvent />
                {scheduling.status}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Local: {scheduling.local}
            </div>
            <div className="text-muted-foreground">
              Usuário: {scheduling.user.donor?.name ?? "Nome não disponível"}
            </div>
          </CardFooter>
        </Card>
      ))}

      {schedulings.length === 0 && (
        <div className="col-span-full text-center text-muted-foreground">
          Nenhum agendamento encontrado.
        </div>
      )}
    </div>
  )
}
