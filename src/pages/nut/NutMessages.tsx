import { FC, useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import DashboardLayout from '@/components/DashboardLayout';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from '@/lib/api';

interface Message {
  senderId: number;
  receiverId: number;
  content: string;
  sentAt: string; // ISO timestamp
}

interface Chat {
  id: number; // client ID
  name: string; // client name
  messages: Message[];
}

const NutMessages: FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [messageText, setMessageText] = useState<string>('');
  const [nutId, setNutId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get user and token from localStorage with proper validation
        const userStr = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!userStr || !token) {
          throw new Error("Authentication data not found. Please login again.");
        }

        let user;
        try {
          user = JSON.parse(userStr);
        } catch (e) {
          throw new Error("Invalid user data. Please login again.");
        }

        if (!user?.email) {
          throw new Error("User email not found. Please login again.");
        }

        // Fetch nutritionist details
        const nutDetails = await api.get(`/nuts/email`, {
          params: { email: user.email },
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!nutDetails.data || nutDetails.data.length === 0) {
          throw new Error("Nutritionist profile not found.");
        }

        const _nutId = nutDetails.data[0]?.id;
        if (!_nutId) {
          throw new Error("Invalid nutritionist ID.");
        }
        
        setNutId(_nutId);

        // Fetch clients
        const clientDetails = await api.get(`/client/byNutId`, {
          params: { id: _nutId },
          headers: { Authorization: `Bearer ${token}` },
        });

        const clients = clientDetails.data || [];

        if (clients.length === 0) {
          setChats([]);
          setLoading(false);
          return;
        }

        // Fetch messages for each client
        const chatPromises = clients.map(async (client: any) => {
          try {
            const [nutMessages, clientMessages] = await Promise.all([
              api.post(
                `/nuts/messagesFromNut`,
                { nId: _nutId, cId: client.id },
                { headers: { Authorization: `Bearer ${token}` } }
              ),
              api.post(
                `/nuts/messagesFromClient`,
                { nId: _nutId, cId: client.id },
                { headers: { Authorization: `Bearer ${token}` } }
              ),
            ]);

            const combinedMessages = [
              ...(nutMessages.data || []), 
              ...(clientMessages.data || [])
            ];

            combinedMessages.sort(
              (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
            );

            return {
              id: client.id,
              name: client.name,
              messages: combinedMessages,
            };
          } catch (err) {
            console.error(`Error fetching messages for client ${client.id}:`, err);
            return {
              id: client.id,
              name: client.name,
              messages: [],
            };
          }
        });

        const chatsData = await Promise.all(chatPromises);
        setChats(chatsData);
        
        // Set first chat as selected if available
        if (chatsData.length > 0) {
          setSelectedChatId(chatsData[0].id);
        }

      } catch (error: any) {
        console.error("Error fetching chat data:", error);
        setError(error.message || "Failed to load chat data. Please try refreshing the page.");
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay to ensure localStorage is ready
    const timeoutId = setTimeout(fetchData, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  const selectedChat = chats.find(chat => chat.id === selectedChatId);

  const sendMessage = async () => {
    if (!messageText.trim() || !selectedChat || !nutId) return;

    const content = messageText.trim();
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication token not found. Please login again.");
      return;
    }

    try {
      await api.post(
        `/nuts/sendMessage`,
        { nId: nutId, cId: selectedChat.id, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newMessage: Message = {
        senderId: nutId,
        receiverId: selectedChat.id,
        content,
        sentAt: new Date().toISOString(),
      };

      const updatedChats = chats.map(chat =>
        chat.id === selectedChat.id
          ? { ...chat, messages: [...chat.messages, newMessage] }
          : chat
      );

      setChats(updatedChats);
      setMessageText('');
      setTimeout(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } catch (err: any) {
      console.error("Failed to send message:", err);
      setError("Failed to send message. Please try again.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView();
  }, [selectedChatId]);

  // Loading state
  if (loading) {
    return (
      <DashboardLayout title="Messages" userRole="nutritionist">
        <div className="flex h-[80vh] items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">Loading your chats...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout title="Messages" userRole="nutritionist">
        <div className="flex h-[80vh] items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Messages" userRole="nutritionist">
      <div className="flex h-[80vh] border rounded-lg overflow-hidden">
        {/* Chat List */}
        <div className="w-1/3 border-r bg-gray-50 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Chats</h2>
          {chats.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <p>No clients found</p>
            </div>
          ) : (
            chats.map(chat => (
              <div
                key={chat.id}
                className={`cursor-pointer p-3 rounded-lg mb-2 ${
                  chat.id === selectedChatId ? 'bg-primary/10' : 'hover:bg-gray-100'
                }`}
                onClick={() => setSelectedChatId(chat.id)}
              >
                <p className="font-medium">{chat.name}</p>
                <p className="text-sm text-gray-500 truncate">
                  {chat.messages.length > 0 
                    ? chat.messages[chat.messages.length - 1]?.content 
                    : "No messages yet"}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
                <h2 className="text-lg font-semibold">{selectedChat.name}</h2>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {selectedChat.messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p>No messages yet. Start a conversation!</p>
                  </div>
                ) : (
                  selectedChat.messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${
                        msg.senderId === nutId ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`px-4 py-2 rounded-2xl text-sm max-w-xs ${
                          msg.senderId === nutId ? 'bg-blue-500 text-white' : 'bg-white text-black border'
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
                  ))
                )}
                <div ref={messageEndRef} />
              </div>
              <div className="p-3 border-t bg-white flex items-center gap-2">
                <Input
                  placeholder="Type a message"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                />
                <Button onClick={sendMessage} disabled={!messageText.trim()}>
                  Send
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              {chats.length === 0 ? "No clients available" : "Select a chat to start messaging"}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NutMessages;