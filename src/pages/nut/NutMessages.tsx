import { FC, useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import DashboardLayout from '@/components/DashboardLayout';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Chat {
  id: string;
  name: string;
  messages: { sender: string; text: string; timestamp: string }[];
}

const mockChats: Chat[] = [
  {
    id: "1",
    name: "John Doe",
    messages: [
      { sender: "John", text: "Hey! Got my new plan?", timestamp: "10:00 AM" },
      { sender: "You", text: "Yes, sent it yesterday. Check your email!", timestamp: "10:05 AM" },
      { sender: "John", text: "Thanks for the meal plan!", timestamp: "10:07 AM" },
    ],
  },
  {
    id: "2",
    name: "Jane Smith",
    messages: [
      { sender: "Jane", text: "Had a great session today!", timestamp: "9:00 AM" },
      { sender: "You", text: "Happy to hear that!", timestamp: "9:05 AM" },
      { sender: "Jane", text: "See you next week.", timestamp: "9:07 AM" },
    ],
  },
];

const NutMessages: FC = () => {
  const [selectedChatId, setSelectedChatId] = useState<string>(mockChats[0].id);
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [messageText, setMessageText] = useState<string>('');
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const selectedChat = chats.find(chat => chat.id === selectedChatId)!;

  const sendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage = {
      sender: "You",
      text: messageText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedChats = chats.map(chat => {
      if (chat.id === selectedChatId) {
        return { ...chat, messages: [...chat.messages, newMessage] };
      }
      return chat;
    });

    setChats(updatedChats);
    setMessageText('');
    setTimeout(() => {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView();
  }, [selectedChatId]);

  return (
    <DashboardLayout title="Messages" userRole="nutritionist">
      <div className="flex h-[80vh] border rounded-lg overflow-hidden">
        {/* Chat List */}
        <div className="w-1/3 border-r bg-gray-50 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Chats</h2>
          {chats.map(chat => (
            <div
              key={chat.id}
              className={`cursor-pointer p-3 rounded-lg mb-2 ${
                chat.id === selectedChatId ? 'bg-primary/10' : 'hover:bg-gray-100'
              }`}
              onClick={() => setSelectedChatId(chat.id)}
            >
              <p className="font-medium">{chat.name}</p>
              <p className="text-sm text-gray-500 truncate">
                {chat.messages[chat.messages.length - 1]?.text}
              </p>
            </div>
          ))}
        </div>

        {/* Selected Chat Window */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
            <h2 className="text-lg font-semibold">{selectedChat.name}</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {selectedChat.messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  msg.sender === 'You' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl text-sm max-w-xs ${
                    msg.sender === 'You' ? 'bg-blue-500 text-white' : 'bg-white text-black border'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-xs text-gray-400 mt-1">{msg.timestamp}</span>
              </div>
            ))}
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
            <Button onClick={sendMessage}>Send</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NutMessages;
