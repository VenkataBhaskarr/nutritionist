import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { Nutritionist, getAllNutritionists } from '@/api/nutritionist';
import { Client as AdminClient } from '@/api/client';
import { Client as NutritionistClient } from '@/api/nutritionist';

type ModalClient = AdminClient | NutritionistClient;

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: Nutritionist | ModalClient | null;
  onSave: (formData: Omit<Nutritionist, 'id' | 'clientCount'> | Omit<ModalClient, 'id' | 'nutritionist'>) => Promise<void>;
  userType: 'nutritionist' | 'client';
  nutritionists?: Nutritionist[];
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, user, onSave, userType, nutritionists: propNutritionists }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    specialization: '',
    status: 'active' as 'active' | 'inactive',
    joinDate: '',
    plan: '',
    age: '',
    gender: '',
    nutritionistId: '',
    lastCheckIn: '',
    progress: '',
  });
  const [nutritionists, setNutritionists] = useState<Nutritionist[]>([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (propNutritionists) {
      setNutritionists(propNutritionists);
    } else if (userType === 'client') {
      const fetchNutritionists = async () => {
        try {
          const data = await getAllNutritionists();
          setNutritionists(data);
        } catch (err) {
          setError('Failed to fetch nutritionists.');
        }
      };
      fetchNutritionists();
    }
  }, [userType, propNutritionists]);

  useEffect(() => {
    if (user) {
      const isAdminClient = 'nutritionist' in user; // AdminClient has 'nutritionist' field
      const isNutritionistClient = 'lastCheckIn' in user; // NutritionistClient has 'lastCheckIn'

      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        specialization: (user as Nutritionist).specialization || '',
        status: (user as Nutritionist | ModalClient).status || 'active',
        joinDate: (user as Nutritionist | ModalClient).joinDate || '',
        plan: (user as AdminClient | NutritionistClient).plan || '',
        age: isAdminClient && (user as AdminClient).age ? (user as AdminClient).age.toString() : '',
        gender: isAdminClient ? (user as AdminClient).gender || '' : '',
        nutritionistId: isAdminClient && (user as AdminClient).nutritionistId ? (user as AdminClient).nutritionistId.toString() : '',
        lastCheckIn: isNutritionistClient ? (user as NutritionistClient).lastCheckIn || '' : '',
        progress: isNutritionistClient ? (user as NutritionistClient).progress || '' : '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        specialization: '',
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
        plan: '',
        age: '',
        gender: '',
        nutritionistId: '',
        lastCheckIn: '',
        progress: '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const requiredFields = userType === 'nutritionist'
      ? ['name', 'email', 'phone', 'specialization', 'status', 'joinDate']
      : ['name', 'email', 'phone', 'status', 'joinDate', 'age', 'gender'];
    if (requiredFields.some(field => !formData[field as keyof typeof formData])) {
      setError('Please fill in all required fields.');
      return;
    }
    try {
      setIsSubmitting(true);
      const data = userType === 'nutritionist'
        ? {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            specialization: formData.specialization,
            status: formData.status,
            joinDate: formData.joinDate,
          }
        : {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            age: formData.age ? parseInt(formData.age) : undefined,
            gender: formData.gender || undefined,
            nutritionistId: formData.nutritionistId ? parseInt(formData.nutritionistId) : undefined,
            status: formData.status,
            joinDate: formData.joinDate,
            plan: formData.plan || undefined,
            lastCheckIn: formData.lastCheckIn || undefined,
            progress: formData.progress || undefined,
            nutritionist: undefined, // Will be set by backend in AdminClient context
          };
      await onSave(data);
      onClose();
      toast.success(`${userType.charAt(0).toUpperCase() + userType.slice(1)} ${user ? 'updated' : 'added'} successfully`);
    } catch (err) {
      setError('Failed to save. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user ? 'Edit' : 'Add'} {userType.charAt(0).toUpperCase() + userType.slice(1)}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          {userType === 'nutritionist' ? (
            <>
              <div>
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <Label htmlFor="joinDate">Join Date</Label>
                <Input
                  id="joinDate"
                  type="date"
                  value={formData.joinDate}
                  onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <Label htmlFor="plan">Plan</Label>
                <Input
                  id="plan"
                  value={formData.plan}
                  onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="lastCheckIn">Last Check-in</Label>
                <Input
                  id="lastCheckIn"
                  type="date"
                  value={formData.lastCheckIn}
                  onChange={(e) => setFormData({ ...formData, lastCheckIn: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="progress">Progress (%)</Label>
                <Input
                  id="progress"
                  type="number"
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <Label htmlFor="nutritionistId">Nutritionist</Label>
                <select
                  id="nutritionistId"
                  value={formData.nutritionistId}
                  onChange={(e) => setFormData({ ...formData, nutritionistId: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select Nutritionist</option>
                  {nutritionists.map((n) => (
                    <option key={n.id} value={n.id}>{n.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <Label htmlFor="joinDate">Join Date</Label>
                <Input
                  id="joinDate"
                  type="date"
                  value={formData.joinDate}
                  onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                  required
                />
              </div>
            </>
          )}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary-500 hover:bg-primary-600"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;
