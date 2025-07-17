"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"
import { IconCirclePlusFilled, type Icon } from "@tabler/icons-react"
import Cookies from "js-cookie"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { createScheduling } from "@/services/schedulingService"
import { useRefresh } from "@/contexts/RefreshContext"

const schedulingSchema = z.object({
  local: z.string().min(1, "O local é obrigatório"),
  data_agendamento: z.string().min(1, "A data e hora são obrigatórias"),
})

type SchedulingFormData = z.infer<typeof schedulingSchema>

export function NavMain({
  items,
}: {
  items: { title: string; url: string; icon?: Icon }[]
}) {
  const [open, setOpen] = useState(false)
  const { triggerRefresh } = useRefresh()

  const token = Cookies.get("token")

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SchedulingFormData>({
    resolver: zodResolver(schedulingSchema),
    mode: "onChange",
  })

const onSubmit = async (data: SchedulingFormData) => {
  if (!token) {
    toast.error("Token não encontrado. Faça login novamente.")
    return
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    const userId = payload.id

    await createScheduling(
      {
        usuario_id: userId,
        data_agendamento: new Date(data.data_agendamento).toISOString(),
        local: data.local,
      },
      token
    )

    toast.success("Agendamento criado com sucesso!")
    reset()
    setOpen(false)
    triggerRefresh()
  } catch (err) {
    console.error(err)
    toast.error("Erro ao criar agendamento")
  }
}

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <SidebarMenuButton
                  tooltip="Novo agendamento"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-8"
                >
                  <IconCirclePlusFilled />
                  <span>Novo agendamento</span>
                </SidebarMenuButton>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[450px] rounded-2xl p-6">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-semibold text-primary">
                    Novo Agendamento
                  </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="local">Local</Label>
                    <Input id="local" {...register("local")} />
                    {errors.local && (
                      <span className="text-sm text-red-500">{errors.local.message}</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="data_agendamento">Data e Hora</Label>
                    <Input
                      id="data_agendamento"
                      type="datetime-local"
                      {...register("data_agendamento")}
                    />
                    {errors.data_agendamento && (
                      <span className="text-sm text-red-500">
                        {errors.data_agendamento.message}
                      </span>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-primary text-white hover:bg-primary/90"
                  >
                    {isSubmitting ? "Salvando..." : "Salvar"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}