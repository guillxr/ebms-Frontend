"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRefresh } from "@/contexts/RefreshContext"
import {
  getStock,
  updateStock,
  deleteStock,
  type StockItem,
} from "@/services/stockService"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { IconPencil, IconTrash } from "@tabler/icons-react"
import toast from "react-hot-toast"

const bloodTypeLabels: Record<string, string> = {
  A_POSITIVO: "A+",
  A_NEGATIVO: "A−",
  B_POSITIVO: "B+",
  B_NEGATIVO: "B−",
  AB_POSITIVO: "AB+",
  AB_NEGATIVO: "AB−",
  O_POSITIVO: "O+",
  O_NEGATIVO: "O−",
}

export function SectionStock() {
  const [stock, setStock] = useState<StockItem[]>([])
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null)
  const [editData, setEditData] = useState({
    quantidade: "",
    validade: "",
    status: "",
  })

  const { refreshKey, triggerRefresh } = useRefresh()

  useEffect(() => {
    const fetchStock = async () => {
      const data = await getStock()
      setStock(data)
    }

    fetchStock()
  }, [refreshKey])

  const openEditModal = (item: StockItem) => {
    setSelectedItem(item)
    setEditData({
      quantidade: String(item.quantidade),
      validade: item.validade.split("T")[0],
      status: item.status,
    })
    setEditModalOpen(true)
  }

  const openDeleteModal = (item: StockItem) => {
    setSelectedItem(item)
    setDeleteModalOpen(true)
  }

  const handleUpdate = async () => {
    if (!selectedItem) return

    try {
      await updateStock(selectedItem.id, {
        quantidade: Number(editData.quantidade),
        validade: new Date(editData.validade).toISOString(),
        status: editData.status,
      })
      toast.success("Lote atualizado com sucesso!")
      setEditModalOpen(false)
      triggerRefresh()
    } catch (error) {
      console.error(error)
      toast.error("Erro ao atualizar lote")
    }
  }

  const handleDelete = async () => {
    if (!selectedItem) return
    try {
      await deleteStock(selectedItem.id)
      toast.success("Lote removido com sucesso!")
      setDeleteModalOpen(false)
      triggerRefresh()
    } catch (error) {
      console.error(error)
      toast.error("Erro ao remover lote")
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {stock.map((item) => (
          <Card key={item.id} className="@container/card relative">
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => openEditModal(item)}
                className="text-muted-foreground hover:text-primary"
                title="Editar lote"
              >
                <IconPencil size={18} />
              </button>
              <button
                onClick={() => openDeleteModal(item)}
                className="text-muted-foreground hover:text-destructive"
                title="Excluir lote"
              >
                <IconTrash size={18} />
              </button>
            </div>

            <CardHeader>
              <CardDescription>Lote: {item.lote}</CardDescription>
              <CardTitle className="text-lg font-semibold">
                Tipo: {bloodTypeLabels[item.blood_type] || "Indefinido"}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex flex-col items-start text-sm gap-1">
              <span className="font-medium">
                Status: <span className="capitalize">{item.status}</span>
              </span>
              <span className="text-muted-foreground text-sm">
                Validade: {new Date(item.validade).toLocaleDateString()}
              </span>
              <Badge variant="outline">{item.quantidade} bolsas</Badge>
            </CardFooter>
          </Card>
        ))}

        {stock.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground">
            Nenhum lote encontrado.
          </div>
        )}
      </div>

      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Editar Lote</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="quantidade">Quantidade</label>
              <Input
                id="quantidade"
                type="number"
                value={editData.quantidade}
                onChange={(e) =>
                  setEditData({ ...editData, quantidade: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="validade">Validade</label>
              <Input
                id="validade"
                type="date"
                value={editData.validade}
                onChange={(e) =>
                  setEditData({ ...editData, validade: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={editData.status}
                onChange={(e) =>
                  setEditData({ ...editData, status: e.target.value })
                }
                className="border border-input rounded-md p-2"
              >
                <option value="">Selecione</option>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
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
          <p className="text-sm text-muted-foreground mb-4">
            Tem certeza que deseja excluir o lote{" "}
            <strong>{selectedItem?.lote}</strong>?
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="bg-destructive text-white"
            >
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
