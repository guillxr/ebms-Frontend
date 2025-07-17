import api from './api'

export interface Scheduling {
  id: string
  usuario_id: string
  data_agendamento: string
  local: string
  status: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    donor: {
      name: string
    } | null
  }
}

// Criar novo agendamento
export const createScheduling = async (
  data: { usuario_id: string; data_agendamento: string; local: string },
  token: string
) => {
  const response = await api.post('/agendamentos', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

// Buscar todos os agendamentos
export const getAllSchedulings = async (): Promise<Scheduling[]> => {
  const response = await api.get<Scheduling[]>('/agendamentos')
  return response.data
}

// Buscar agendamentos de um usuário
export const getUserSchedulings = async (userId: string): Promise<Scheduling[]> => {
  const all = await getAllSchedulings()
  return all.filter((item) => item.usuario_id === userId)
}

// Atualizar data do agendamento
export const updateScheduling = async (id: string, data: { data_agendamento: string }) => {
  const response = await api.put(`/agendamentos/${id}`, data)
  return response.data
}

// Excluir agendamento
export const deleteScheduling = async (id: string) => {
  const response = await api.delete(`/agendamentos/${id}`)
  return response.data
}