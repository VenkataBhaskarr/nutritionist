import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Client, Message } from '@/api/nutritionist';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (message: Message) => Promise<void>;
  clients: Client[];
}

const MessageModal: React.FC<MessageModalProps> = ({ isOpen, onClose, onSend, clients }) => {
  const [content, setContent] = useState('');
  const [selectedClientIds, setSelectedClientIds] = useState<number[]>([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!content) {
      setError('Please enter a message.');
      return;
    }
    if (selectedClientIds.length === 0) {
      setError('Please select at least one client.');
      return;
    }
    try {
      setIsSubmitting(true);
      for (const clientId of selectedClientIds) {
        await onSend({ clientId, content });
      }
      onClose();
      toast.success('Messages sent successfully');
    } catch (err) {
      setError('Failed to send messages. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClientToggle = (clientId: number) => {
    setSelectedClientIds((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Bulk Message</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="clients">Select Clients</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto border p-2 rounded-md">
              {clients.map((client) => (
                <div key={client.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`client-${client.id}`}
                    checked={selectedClientIds.includes(client.id)}
                    onChange={() => handleClientToggle(client.id)}
                  />
                  <label htmlFor={`client-${client.id}`}>{client.name}</label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="content">Message</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your message here..."
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary-500 hover:bg-primary-600"
          >
            {isSubmitting ? 'Sending...' : 'Send'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MessageModal;