import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Users, UserCheck, UserPlus, User } from 'lucide-react';
import StatCard from '@/components/admin/StatsCard';
import DataTable from '@/components/admin/DataTable';
import UserModal from './UserModal';
import api from '@/lib/api';

interface Nutritionist {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  specialty: string;
  clients: number;
}

interface Client {
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

interface AdminProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

const DeleteConfirmDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  type: 'nutritionist' | 'client';
}> = ({ isOpen, onClose, onConfirm, type }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await onConfirm();
      onClose();
    } catch (err) {
      setError('Failed to delete. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {type.charAt(0).toUpperCase() + type.slice(1)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Are you sure you want to delete this {type}?</p>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Confirm'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const AdminDashboard: React.FC = () => {
  const [nutritionists, setNutritionists] = useState<Nutritionist[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalUser, setModalUser] = useState<Nutritionist | Client | null>(null);
  const [modalType, setModalType] = useState<'nutritionist' | 'client' | ''>('');
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    id: number | null;
    type: 'nutritionist' | 'client' | null;
  }>({ isOpen: false, id: null, type: null });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const [nutritionistsData, clientsData] = await Promise.all([
          api.get('/nuts/nutritionists', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data),
          api.get('/client/clients', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data),
          // api.get('/admin/profile', {
          //   params: { email: user.email },
          //   headers: { Authorization: `Bearer ${token}` },
          // }).then(res => res.data),
        ]);
        setNutritionists(Array.isArray(nutritionistsData) ? nutritionistsData : []);
        setClients(Array.isArray(clientsData) ? clientsData : []);
        // setAdminProfile(profileData || null);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAdd = (type: 'nutritionist' | 'client') => {
    setModalType(type);
    setModalUser(null);
    setModalOpen(true);
  };

  const handleEdit = (user: Nutritionist | Client, type: 'nutritionist' | 'client') => {
    setModalType(type);
    setModalUser(user);
    setModalOpen(true);
  };

  const handleDelete = async (id: number, type: 'nutritionist' | 'client') => {
    try {
      if (type === 'nutritionist') {
        await api.delete(`/nutritionists/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setNutritionists(nutritionists.filter(n => n.id !== id));
      } else {
        await api.delete(`/clients/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setClients(clients.filter(c => c.id !== id));
      }
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete';
      toast.error(errorMessage);
      throw err;
    }
  };

  const handleSave = async (formData: Omit<Nutritionist, 'id' | 'clients'> | Omit<Client, 'id'>) => {
    if (!modalType) return;
    try {
      if (modalType === 'nutritionist') {
        if (modalUser && (modalUser as Nutritionist).id) {
          const updated = await api.put(
            `/nutritionists/${(modalUser as Nutritionist).id}`,
            formData,
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
          ).then(res => res.data);
          setNutritionists(nutritionists.map(n => n.id === (modalUser as Nutritionist).id ? updated : n));
        } else {
          const created = await api.post('/nutritionists', formData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }).then(res => res.data);
          setNutritionists([...nutritionists, created]);
        }
      } else if (modalType === 'client') {
        if (modalUser && (modalUser as Client).id) {
          const updated = await api.put(
            `/clients/${(modalUser as Client).id}`,
            formData,
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
          ).then(res => res.data);
          setClients(clients.map(c => c.id === (modalUser as Client).id ? updated : c));
        } else {
          const created = await api.post('/clients', formData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }).then(res => res.data);
          setClients([...clients, created]);
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save';
      toast.error(errorMessage);
      throw err;
    }
  };

  const handleView = (id: number, type: 'nutritionist' | 'client') => {
    navigate(`/dashboard/admin/${type}/${id}`);
  };

  if (loading) {
    return (
      <DashboardLayout title="Admin Dashboard" userRole="admin">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Admin Dashboard" userRole="admin">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Admin Dashboard" userRole="admin">
      <div className="space-y-6">
        {adminProfile && (
          <Card>
            <CardHeader>
              <CardTitle>Admin Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary-500" />
                </div>
                <div>
                  <p className="font-medium">{adminProfile.name}</p>
                  <p className="text-sm text-gray-500">{adminProfile.email}</p>
                  <p className="text-sm text-gray-500">{adminProfile.phone}</p>
                  <p className="text-sm text-gray-500">{adminProfile.address || 'Not provided'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Nutritionists"
            value={nutritionists.length}
            icon={UserCheck}
          />
          <StatCard
            title="Total Clients"
            value={clients.length}
            icon={Users}
          />
          <StatCard
            title="Avg. Clients per Nutritionist"
            value={nutritionists.length > 0 ? (clients.length / nutritionists.length).toFixed(1) : '0.0'}
            icon={UserPlus}
          />
        </div>

        <DataTable
          title="Nutritionists"
          data={nutritionists}
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
            { key: 'address', label: 'Address' },
            { key: 'specialty', label: 'Specialty' },
            { key: 'clients', label: 'Clients' },
          ]}
          actions={{
            view: (id) => handleView(id, 'nutritionist'),
            edit: (item) => handleEdit(item, 'nutritionist'),
            delete: (id) => setDeleteDialog({ isOpen: true, id, type: 'nutritionist' }),
          }}
          onAdd={() => handleAdd('nutritionist')}
          renderCell={(key, item) => (key === 'address' ? item.address || 'Not provided' : item[key as keyof typeof item])}
        />

        <DataTable
          title="Clients"
          data={clients}
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
            { key: 'address', label: 'Address' },
            { key: 'nutritionist', label: 'Nutritionist' },
            { key: 'plan', label: 'Plan' },
          ]}
          actions={{
            view: (id) => handleView(id, 'client'),
            edit: (item) => handleEdit(item, 'client'),
            delete: (id) => setDeleteDialog({ isOpen: true, id, type: 'client' }),
          }}
          onAdd={() => handleAdd('client')}
          renderCell={(key, item) => (key === 'address' ? item.address || 'Not provided' : item[key as keyof typeof item])}
        />

        {modalType !== '' && (
          <UserModal
            isOpen={modalOpen}
            onClose={() => {
              setModalOpen(false);
              setModalType('');
              setModalUser(null);
            }}
            user={modalUser}
            onSave={handleSave}
            userType={modalType}
            nutritionists={nutritionists}
          />
        )}

        {deleteDialog.isOpen && deleteDialog.id !== null && deleteDialog.type !== null && (
          <DeleteConfirmDialog
            isOpen={deleteDialog.isOpen}
            onClose={() => setDeleteDialog({ isOpen: false, id: null, type: null })}
            onConfirm={() => handleDelete(deleteDialog.id!, deleteDialog.type!)}
            type={deleteDialog.type}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
