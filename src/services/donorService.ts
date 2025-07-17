import api from './api';

export interface Donor {
  _id: string;
  nome: string;
  email: string;
  tipo_sanguineo: string;
}

// Listar todos os doadores
export const getAllDonors = async (): Promise<Donor[]> => {
  const response = await api.get<Donor[]>('/donors');
  return response.data;
};

// Buscar doador por ID
export const getDonorById = async (id: string): Promise<Donor> => {
  const response = await api.get<Donor>(`/donors/${id}`);
  return response.data;
};

// Buscar doadores por tipo sanguíneo
export const getDonorsByBloodType = async (
  tipo: string
): Promise<Donor[]> => {
  const response = await api.get<Donor[]>(`/donors/blood-type/${tipo}`);
  return response.data;
};

// Atualizar doador
export const updateDonor = async (id: string, data: Partial<Donor>) => {
  const response = await api.put<Donor>(`/donors/${id}`, data);
  return response.data;
};

// Deletar doador
export const deleteDonor = async (id: string) => {
  await api.delete(`/donors/${id}`);
};
