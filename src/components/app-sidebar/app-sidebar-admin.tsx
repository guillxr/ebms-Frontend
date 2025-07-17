"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { IconListDetails, IconCirclePlusFilled, IconBox } from "@tabler/icons-react"

import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
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
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { createStock } from "@/services/stockService"
import { useRefresh } from "@/contexts/RefreshContext"
import toast from "react-hot-toast"
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"

const stockSchema = z.object({
  lote: z.string().min(1, "O lote é obrigatório"),
  quantidade: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "A quantidade deve ser um número maior que 0",
    }),
  validade: z.string().min(1, "A validade é obrigatória"),
  blood_type: z.string().min(1, "O tipo sanguíneo é obrigatório"),
})

type StockFormData = z.infer<typeof stockSchema>

type DecodedToken = {
  email: string
  role: "ADMIN" | "DONOR"
  donor?: {
    name: string
  }
}

export function AppSidebarAdmin({
  onSectionChange,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  onSectionChange: (section: "stock" | "agendamentos") => void
}) {
  const { triggerRefresh } = useRefresh()
  const [open, setOpen] = React.useState(false)
  const [userInfo, setUserInfo] = useState<{ name: string; email: string }>({
    name: "",
    email: "",
  })

  useEffect(() => {
    const token = Cookies.get("token")
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token)

        const name =
          decoded.role === "ADMIN"
            ? "Administrador"
            : decoded.donor?.name || "Usuário"

        setUserInfo({
          name,
          email: decoded.email,
        })
      } catch (error) {
        console.error("Erro ao decodificar token JWT:", error)
        setUserInfo({ name: "Usuário", email: "" })
      }
    }
  }, [])

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
        status: "ativo",
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
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 cursor-default"
            >
              <a href="#" tabIndex={-1} onClick={(e) => e.preventDefault()}>
                <span className="text-base font-semibold select-none">EBMS Admin</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              <SidebarMenuItem className="flex items-center gap-2">
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <SidebarMenuButton
                      tooltip="Novo lote"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-8 cursor-pointer"
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
                        <Input
                          id="quantidade"
                          type="number"
                          {...register("quantidade")}
                          min={1}
                          step={1}
                        />
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
                          className="border border-input rounded-md p-2"
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Selecione
                          </option>
                          <option value="A_POSITIVO">A+</option>
                          <option value="A_NEGATIVO">A−</option>
                          <option value="B_POSITIVO">B+</option>
                          <option value="B_NEGATIVO">B−</option>
                          <option value="AB_POSITIVO">AB+</option>
                          <option value="AB_NEGATIVO">AB−</option>
                          <option value="O_POSITIVO">O+</option>
                          <option value="O_NEGATIVO">O−</option>
                        </select>
                        {errors.blood_type && (
                          <span className="text-sm text-red-500">{errors.blood_type.message}</span>
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
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onSectionChange("stock")}
                  className="cursor-pointer flex items-center gap-2"
                  type="button"
                >
                  <IconBox />
                  <span>Estoque</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onSectionChange("agendamentos")}
                  className="cursor-pointer flex items-center gap-2"
                  type="button"
                >
                  <IconListDetails />
                  <span>Agendamentos</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            name: userInfo.name,
            email: userInfo.email,
            avatar: "/avatars/default.jpg",
            role: "ADMIN"
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}