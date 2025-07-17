'use client'

import { useEffect, useState } from "react"
import { IconCalendarEvent, IconPencil, IconTrash } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getAllSchedulings, Scheduling, updateScheduling, deleteScheduling } from "@/services/schedulingService"
import { useRefresh } from "@/contexts/RefreshContext"
import toast from "react-hot-toast"
import Cookies from "js-cookie"

export function SectionCards() {
  const [schedulings, setSchedulings] = useState<Scheduling[]>([])
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Scheduling | null>(null)
  const [editDate, setEditDate] = useState("")

  const { refreshKey, triggerRefresh } = useRefresh()

  const token = Cookies.get("token")
  const role = token ? JSON.parse(atob(token.split(".")[1])).role : null
  const isAdmin = role === "ADMIN"

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllSchedulings()
      setSchedulings(data)
    }
    fetchData()
  }, [refreshKey])

  const openEditModal = (item: Scheduling) => {
    setSelectedItem(item)
    setEditDate(item.data_agendamento.split("T")[0])
    setEditModalOpen(true)
  }

  const openDeleteModal = (item: Scheduling) => {
    setSelectedItem(item)
    setDeleteModalOpen(true)
  }

  const handleUpdate = async () => {
    if (!selectedItem) return
    try {
      await updateScheduling(selectedItem.id, {
        data_agendamento: new Date(editDate).toISOString(),
      })
      toast.success("Data atualizada com sucesso!")
      setEditModalOpen(false)
      triggerRefresh()
    } catch (error) {
      console.error(error)
      toast.error("Erro ao atualizar a data")
    }
  }

  const handleDelete = async () => {
    if (!selectedItem) return
    try {
      await deleteScheduling(selectedItem.id)
      toast.success("Agendamento excluído com sucesso!")
      setDeleteModalOpen(false)
      triggerRefresh()
    } catch (error) {
      console.error(error)
      toast.error("Erro ao excluir agendamento")
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {schedulings.map((scheduling) => (
          <Card key={scheduling.id} className="@container/card relative">
            {isAdmin && (
              <>
                <button
                  onClick={() => openEditModal(scheduling)}
                  className="absolute top-2 right-8 text-muted-foreground hover:text-primary"
                  title="Editar agendamento"
                >
                  <IconPencil size={18} />
                </button>
                <button
                  onClick={() => openDeleteModal(scheduling)}
                  className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                  title="Excluir agendamento"
                >
                  <IconTrash size={18} />
                </button>
              </>
            )}

            <CardHeader>
              <CardDescription>Agendamento</CardDescription>
              <CardTitle className="text-lg font-semibold tabular-nums">
                {new Date(scheduling.data_agendamento).toLocaleString("pt-BR")}
              </CardTitle>
            </CardHeader>

            <CardFooter className="flex flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                <strong>Local:</strong> {scheduling.local}
              </div>
              <div className="text-muted-foreground">
                Usuário: {scheduling.user.donor?.name ?? "Nome não disponível"}
              </div>

              <CardAction className="mt-2 self-end">
                <Badge variant="outline">
                  <IconCalendarEvent className="mr-1" size={14} />
                  {scheduling.status}
                </Badge>
              </CardAction>
            </CardFooter>
          </Card>
        ))}

        {schedulings.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground">
            Nenhum agendamento encontrado.
          </div>
        )}
      </div>

      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Editar Data</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="data">Nova data</label>
              <Input
                id="data"
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
              />
            </div>
            <Button onClick={handleUpdate} className="w-full">
              Salvar alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <p>Tem certeza que deseja excluir este agendamento?</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
