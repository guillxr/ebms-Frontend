import api from "@/services/api"

export type CreateStockData = {
  lote: string
  quantidade: number
  validade: string
  status: string
  blood_type: string
}

export interface StockItem {
  id: string
  lote: string
  quantidade: number
  validade: string
  status: string
  blood_type: string
}

interface UpdateStockData {
  quantidade?: number
  validade?: string
  status?: string
  blood_type?: string
}

export async function createStock(data: CreateStockData) {
  const response = await api.post("/estBlood/stock", data)
  return response.data
}

export async function getStock(): Promise<StockItem[]> {
  try {
    const response = await api.get("/estBlood/stock")
    const data = response.data

    if (Array.isArray(data.res)) {
      return data.res
    }

    console.error("Resposta inesperada de getStock:", data)
    return []
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Erro ao buscar estoque:", error.message)
    } else {
      console.error("Erro desconhecido ao buscar estoque")
    }
    return []
  }
}

export async function updateStock(id: string, data: UpdateStockData) {
  if (!id) throw new Error("ID do lote não informado.")

  const cleanData = Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(data).filter(([key, value]) => value !== undefined)
  )

  const response = await api.put(`/estBlood/stock/${id}`, cleanData)
  return response.data
}

export async function deleteStock(id: string) {
  if (!id) throw new Error("ID do lote não informado.")
  await api.delete(`/estBlood/stock/${id}`)
}