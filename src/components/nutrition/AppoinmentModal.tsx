import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Appointment, Client } from '@/api/nutritionist';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onSave: (formData: Omit<Appointment, 'id'>) => Promise<void>;
  clients: Client[];
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({ isOpen, onClose, appointment, onSave, clients }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    date: '',
    time: '',
    type: '',
    status: 'scheduled' as 'scheduled' | 'completed' | 'cancelled',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (appointment) {
      setFormData({
        clientName: appointment.clientName,
        date: appointment.date,
        time: appointment.time,
        type: appointment.type,
        status: appointment.status,
      });
    } else {
      setFormData({
        clientName: '',
        date: new Date().toISOString().split('T')[0],
        time: '',
        type: '',
        status: 'scheduled',
      });
    }
  }, [appointment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const requiredFields = ['clientName', 'date', 'time', 'type', 'status'];
    if (requiredFields.some(field => !formData[field as keyof typeof formData])) {
      setError('Please fill in all required fields.');
      return;
    }
    try {
      setIsSubmitting(true);
      await onSave(formData);
      onClose();
      toast.success(`Appointment ${appointment ? 'updated' : 'created'} successfully`);
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
          <DialogTitle>{appointment ? 'Reschedule' : 'Schedule'} Appointment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="clientName">Client</Label>
            <select
              id="clientName"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select Client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.name}>{client.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <Input
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'scheduled' | 'completed' | 'cancelled' })}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
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

export default AppointmentModal;
