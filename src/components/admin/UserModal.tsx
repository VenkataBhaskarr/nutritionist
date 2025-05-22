import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { Nutritionist, Client } from '@/api/admin';
import { getAllNutritionists } from '@/api/nutritionist';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: Nutritionist | Client | null;
  onSave: (formData: Omit<Nutritionist, 'id' | 'clientCount'> | Omit<Client, 'id' | 'nutritionist'>) => Promise<void>;
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
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        specialization: (user as Nutritionist).specialization || '',
        status: (user as Nutritionist | Client).status|| 'active',
        joinDate: (user as Nutritionist | Client).joinDate || '',
        plan: (user as Client).plan || '',
        age: (user as Client).age ? (user as Client).age.toString() : '',
        gender: (user as Client).gender || '',
        nutritionistId: (user as Client).nutritionistId ? (user as Client).nutritionistId.toString() : '',
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
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const requiredFields = userType === 'nutritionist'
      ? ['name', 'email', 'phone', 'specialization', 'status', 'joinDate']
      : ['name', 'email', 'phone', 'age', 'gender', 'nutritionistId', 'status', 'joinDate'];
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
            age: parseInt(formData.age),
            gender: formData.gender,
            nutritionistId: parseInt(formData.nutritionistId),
            status: formData.status,
            joinDate: formData.joinDate,
            plan: formData.plan,
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
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  required
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
                  required
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
