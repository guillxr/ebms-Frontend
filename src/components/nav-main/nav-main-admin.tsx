"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"
import { IconCirclePlusFilled, type Icon } from "@tabler/icons-react"

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
import { useRefresh } from "@/contexts/RefreshContext"
import { createStock } from "@/services/stockService"

const bloodTypes = [
  { label: "A+", value: "A_POSITIVO" },
  { label: "A−", value: "A_NEGATIVO" },
  { label: "B+", value: "B_POSITIVO" },
  { label: "B−", value: "B_NEGATIVO" },
  { label: "AB+", value: "AB_POSITIVO" },
  { label: "AB−", value: "AB_NEGATIVO" },
  { label: "O+", value: "O_POSITIVO" },
  { label: "O−", value: "O_NEGATIVO" },
]

const stockSchema = z.object({
  lote: z.string().min(1, "O lote é obrigatório"),
  quantidade: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "A quantidade deve ser um número maior que 0",
    }),
  validade: z.string().min(1, "A validade é obrigatória"),
  status: z.string().min(1, "O status é obrigatório"),
  blood_type: z.string().min(1, "O tipo sanguíneo é obrigatório"),
})

type StockFormData = z.infer<typeof stockSchema>

export function NavMainAdmin({
  items,
}: {
  items: { title: string; url: string; icon?: Icon }[]
}) {
  const [open, setOpen] = useState(false)
  const { triggerRefresh } = useRefresh()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StockFormData>({
    resolver: zodResolver(stockSchema),
    mode: "onChange",
  })

  const onSubmit = async (data: StockFormData) => {
    try {
      await createStock({
        lote: data.lote,
        quantidade: Number(data.quantidade),
        validade: new Date(data.validade).toISOString(),
        status: data.status,
        blood_type: data.blood_type,
      })

      toast.success("Lote criado com sucesso!")
      reset()
      setOpen(false)
      triggerRefresh()
    } catch (err) {
      console.error(err)
      toast.error("Erro ao criar lote")
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
                  tooltip="Novo lote"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-8"
                >
                  <IconCirclePlusFilled />
                  <span>Novo lote de sangue</span>
                </SidebarMenuButton>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[450px] rounded-2xl p-6">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-semibold text-primary">
                    Novo Lote
                  </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="lote">Lote</Label>
                    <Input id="lote" {...register("lote")} />
                    {errors.lote && (
                      <span className="text-sm text-red-500">{errors.lote.message}</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="quantidade">Quantidade</Label>
                    <Input id="quantidade" type="number" {...register("quantidade")} />
                    {errors.quantidade && (
                      <span className="text-sm text-red-500">{errors.quantidade.message}</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="validade">Validade</Label>
                    <Input id="validade" type="date" {...register("validade")} />
                    {errors.validade && (
                      <span className="text-sm text-red-500">{errors.validade.message}</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="blood_type">Tipo Sanguíneo</Label>
                    <select
                      id="blood_type"
                      {...register("blood_type")}
                      className="border rounded px-3 py-2"
                    >
                      <option value="">Selecione um tipo</option>
                      {bloodTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {errors.blood_type && (
                      <span className="text-sm text-red-500">{errors.blood_type.message}</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      {...register("status")}
                      className="border rounded px-3 py-2"
                    >
                      <option value="ativo">Ativo</option>
                      <option value="inativo">Inativo</option>
                    </select>
                    {errors.status && (
                      <span className="text-sm text-red-500">{errors.status.message}</span>
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