import api from '@/lib/api';

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  age: number;
  gender: string;
  nutritionist: string;
  nutritionistId: number;
  status: 'active' | 'inactive';
  joinDate: string;
  plan: string;
}

export const getAllClients = () =>
  api.get<Client[]>('/clients', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  }).then(res => res.data);

export const createClient = (data: Omit<Client, 'id' | 'nutritionist'>) =>
  api.post<Client>('/clients', data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  }).then(res => res.data);

export const updateClient = (id: number, data: Omit<Client, 'id' | 'nutritionist'>) =>
  api.put<Client>(`/clients/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  }).then(res => res.data);

export const deleteClient = (id: number) =>
  api.delete(`/clients/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  }).then(res => res.data);