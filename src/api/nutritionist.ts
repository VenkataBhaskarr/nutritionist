import api from '@/lib/api';

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  plan: string;
  lastCheckIn: string;
  progress: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

export interface Appointment {
  id: number;
  clientName: string;
  date: string;
  time: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface NutritionistProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  specialty: string;
  clients: Client[];
  appointments: Appointment[];
  joinDate? : string;
  status?: string
}

export interface Message {
  clientId: number;
  content: string;
}

export const getNutritionistProfile = async (): Promise<NutritionistProfile> => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const response = await api.get('/nutritionist/profile', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: { email: user.email },
    });
    const data = response.data as NutritionistProfile;
    if (!data.clients) data.clients = [];
    if (!data.appointments) data.appointments = [];
    return data;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'Failed to fetch nutritionist profile');
  }
};

export const addClient = async (data: Omit<Client, 'id'>): Promise<Client> => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const response = await api.post('/nutritionist/clients', data, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: { email: user.email },
    });
    return response.data as Client;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'Failed to add client');
  }
};

export const updateClient = async (id: number, data: Omit<Client, 'id'>): Promise<Client> => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const response = await api.put(`/nutritionist/clients/${id}`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: { email: user.email },
    });
    return response.data as Client;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'Failed to update client');
  }
};

export const deleteClient = async (id: number): Promise<void> => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    await api.delete(`/nutritionist/clients/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: { email: user.email },
    });
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'Failed to delete client');
  }
};

export const createAppointment = async (data: Omit<Appointment, 'id'>): Promise<Appointment> => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const response = await api.post('/nutritionist/appointments', data, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: { email: user.email },
    });
    return response.data as Appointment;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'Failed to create appointment');
  }
};

export const updateAppointment = async (id: number, data: Omit<Appointment, 'id'>): Promise<Appointment> => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const response = await api.put(`/nutritionist/appointments/${id}`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: { email: user.email },
    });
    return response.data as Appointment;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'Failed to update appointment');
  }
};

export const deleteAppointment = async (id: number): Promise<void> => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    await api.delete(`/nutritionist/appointments/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: { email: user.email },
    });
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'Failed to delete appointment');
  }
};

export const sendMessage = async (data: Message): Promise<void> => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    await api.post('/nutritionist/messages', data, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: { email: user.email },
    });
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'Failed to send message');
  }
};
