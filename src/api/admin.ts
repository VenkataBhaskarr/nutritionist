import api from '@/lib/api';

export interface Nutritionist {
  clientCount: number;
  status: string;
  specialization: string;
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  specialty: string;
  clients: number;
  
}

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  nutritionist: string;
  nutritionistId: number;
  plan: string;
  age: number;
  gender: string;
}

export interface AdminProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export const getAllNutritionists = () =>
  api.get('/nutritionists', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  }).then(res => res.data);

export const getAllClients = () =>
  api.get('/clients', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  }).then(res => res.data);

export const getAdminProfile = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return api.get('/admin/profile', {
    params: { email: user.email },
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  }).then(res => res.data);
};

export const createNutritionist = (data: Omit<Nutritionist, 'id' | 'clients'>) =>
  api.post('/nutritionists', data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  }).then(res => res.data);

export const updateNutritionist = (id: number, data: Omit<Nutritionist, 'id' | 'clients'>) =>
  api.put(`/nutritionists/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  }).then(res => res.data);

export const deleteNutritionist = (id: number) =>
  api.delete(`/nutritionists/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  }).then(res => res.data);

export const createClient = (data: Omit<Client, 'id'>) =>
  api.post('/clients', data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  }).then(res => res.data);

export const updateClient = (id: number, data: Omit<Client, 'id'>) =>
  api.put(`/clients/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  }).then(res => res.data);

export const deleteClient = (id: number) =>
  api.delete(`/clients/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  }).then(res => res.data);
