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
  });
  return response.data;
};

// Buscar todos os agendamentos
export const getAllSchedulings = async (): Promise<Scheduling[]> => {
  const response = await api.get<Scheduling[]>('/agendamentos')
  console.log('getAllSchedulings response:', response.data)
  return response.data
}

// Buscar agendamentos de um usuário
export const getUserSchedulings = async (userId: string): Promise<Scheduling[]> => {
  const all = await getAllSchedulings()
  return all.filter((item) => item.usuario_id === userId)
}
