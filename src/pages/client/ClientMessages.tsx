import { FC, useEffect, useRef, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import DashboardLayout from '@/components/DashboardLayout';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from '@/lib/api';

interface Message {
  senderId: string;
  receiverId: number;
  content: string;
  sentAt: string; // ISO timestamp
}

interface Nutritionist {
  id: number;
  name: string;
}

const ClientMessages: FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [nutritionist, setNutritionist] = useState<Nutritionist | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        if (!token || !user?.email) {
          throw new Error("User not authenticated.");
        }

        const clientRes = await api.get("/client/email", {
          params: { email: user.email },
          headers: { Authorization: `Bearer ${token}` },
        });

        const clientData = clientRes.data[0];
        const cId = clientData.id;
        setClientId(cId);

        const nutRes = await api.get("/client/nut", {
          params: { email: user.email },
          headers: { Authorization: `Bearer ${token}` },
        });

        const nut = nutRes.data[0];
        setNutritionist({ id: nut.id, name: nut.name });

        const [nutMessages, clientMessages] = await Promise.all([
          api.post(
            `/nuts/messagesFromNut`,
            { nId: nut.id, cId },
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          api.post(
            `/nuts/messagesFromClient`,
            { nId: nut.id, cId },
            { headers: { Authorization: `Bearer ${token}` } }
          ),
        ]);

        const combined = [...nutMessages.data, ...clientMessages.data].sort(
          (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
        );

        setMessages(combined);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const sendMessage = async () => {
    if (!messageText.trim() || !nutritionist || !clientId) return;

    const token = localStorage.getItem("token");
    const content = messageText.trim();

    try {
      await api.post(
        `/client/sendMessage`,
        { nId: nutritionist.id, cId: clientId, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newMessage: Message = {
        senderId: clientId,
        receiverId: nutritionist.id,
        content,
        sentAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newMessage]);
      setMessageText('');
      setTimeout(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <DashboardLayout title="Messages" userRole="client">
      <div className="h-[80vh] flex flex-col border rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Loading messages...
          </div>
        ) : nutritionist ? (
          <>
            <div className="px-4 py-3 border-b bg-white">
              <h2 className="text-lg font-semibold">Chat with your nutritionist {nutritionist.name}</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.senderId === clientId ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl text-sm max-w-xs ${
                      msg.senderId === clientId
                        ? 'bg-green-500 text-white'
                        : 'bg-white text-black border'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-xs text-gray-400 mt-1">
                    {new Date(msg.sentAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>

            <div className="p-3 border-t bg-white flex items-center gap-2">
              <Input
                placeholder="Type your message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Button onClick={sendMessage}>Send</Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            No nutritionist assigned.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClientMessages;
