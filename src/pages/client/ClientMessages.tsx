// import { FC, useState, useRef, useEffect } from 'react';
// import { Card, CardContent } from "@/components/ui/card";
// import DashboardLayout from '@/components/DashboardLayout';
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import api from '@/lib/api';

// interface Message {
//   senderId: number;
//   receiverId: number;
//   content: string;
//   sentAt: string; // ISO timestamp
// }

// interface Chat {
//   id: number; // client ID
//   name: string; // client name
//   messages: Message[];
// }

// const ClientMessages: FC = () => {
//   const [chats, setChats] = useState<Chat[]>([]);
//   const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
//   const [messageText, setMessageText] = useState<string>('');
//   const messageEndRef = useRef<HTMLDivElement | null>(null);

//   const user = JSON.parse(localStorage.getItem("user") || "{}");
//   const token = localStorage.getItem("token");

//   const [clientId, setClientId] = useState<number | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const clientDetails = await api.get(`/client/email`, {
//           params: { email: user.email },
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const clientId = clientDetails.data[0]?.id;
//         setClientId(clientId);

//         // const clientDetails = await api.get(`/client/byNutId`, {
//         //   params: { id: _nutId },
//         //   headers: { Authorization: `Bearer ${token}` },
//         // });

//         const client = clientDetails.data;

//         const chatPromises = clients.map(async (client: any) => {
//           const [nutMessages, clientMessages] = await Promise.all([
//             api.post(
//               `/nuts/messagesFromNut`,
//               { nId: _nutId, cId: client.id },
//               { headers: { Authorization: `Bearer ${token}` } }
//             ),
//             api.post(
//               `/nuts/messagesFromClient`,
//               { nId: _nutId, cId: client.id },
//               { headers: { Authorization: `Bearer ${token}` } }
//             ),
//           ]);

//           const combinedMessages = [...nutMessages.data, ...clientMessages.data];

//           combinedMessages.sort(
//             (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
//           );

//           return {
//             id: client.id,
//             name: client.name,
//             messages: combinedMessages,
//           };
//         });

//         const chatsData = await Promise.all(chatPromises);
//         setChats(chatsData);
//         setSelectedChatId(chatsData[0]?.id || null);
//       } catch (error) {
//         console.error("Error fetching chat data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const selectedChat = chats.find(chat => chat.id === selectedChatId);

//   const sendMessage = async () => {
//     if (!messageText.trim() || !selectedChat || !nutId) return;

//     const content = messageText.trim();

//     try {
//       await api.post(
//         `/nuts/sendMessage`,
//         { nId: nutId, cId: selectedChat.id, content },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const newMessage: Message = {
//         senderId: nutId,
//         receiverId: selectedChat.id,
//         content,
//         sentAt: new Date().toISOString(),
//       };

//       const updatedChats = chats.map(chat =>
//         chat.id === selectedChat.id
//           ? { ...chat, messages: [...chat.messages, newMessage] }
//           : chat
//       );

//       setChats(updatedChats);
//       setMessageText('');
//       setTimeout(() => {
//         messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//       }, 50);
//     } catch (err) {
//       console.error("Failed to send message:", err);
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') sendMessage();
//   };

//   useEffect(() => {
//     messageEndRef.current?.scrollIntoView();
//   }, [selectedChatId]);

//   return (
//     <DashboardLayout title="Messages" userRole="nutritionist">
//       <div className="flex h-[80vh] border rounded-lg overflow-hidden">
//         {/* Chat List */}
//         <div className="w-1/3 border-r bg-gray-50 p-4 overflow-y-auto">
//           <h2 className="text-lg font-semibold mb-4">Chats</h2>
//           {chats.map(chat => (
//             <div
//               key={chat.id}
//               className={`cursor-pointer p-3 rounded-lg mb-2 ${
//                 chat.id === selectedChatId ? 'bg-primary/10' : 'hover:bg-gray-100'
//               }`}
//               onClick={() => setSelectedChatId(chat.id)}
//             >
//               <p className="font-medium">{chat.name}</p>
//               <p className="text-sm text-gray-500 truncate">
//                 {chat.messages[chat.messages.length - 1]?.content}
//               </p>
//             </div>
//           ))}
//         </div>

//         {/* Chat Window */}
//         <div className="flex-1 flex flex-col">
//           {selectedChat ? (
//             <>
//               <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
//                 <h2 className="text-lg font-semibold">{selectedChat.name}</h2>
//               </div>
//               <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
//                 {selectedChat.messages.map((msg, idx) => (
//                   <div
//                     key={idx}
//                     className={`flex flex-col ${
//                       msg.senderId === nutId ? 'items-end' : 'items-start'
//                     }`}
//                   >
//                     <div
//                       className={`px-4 py-2 rounded-2xl text-sm max-w-xs ${
//                         msg.senderId === nutId ? 'bg-blue-500 text-white' : 'bg-white text-black border'
//                       }`}
//                     >
//                       {msg.content}
//                     </div>
//                     <span className="text-xs text-gray-400 mt-1">
//                       {new Date(msg.sentAt).toLocaleTimeString([], {
//                         hour: '2-digit',
//                         minute: '2-digit',
//                       })}
//                     </span>
//                   </div>
//                 ))}
//                 <div ref={messageEndRef} />
//               </div>
//               <div className="p-3 border-t bg-white flex items-center gap-2">
//                 <Input
//                   placeholder="Type a message"
//                   value={messageText}
//                   onChange={(e) => setMessageText(e.target.value)}
//                   onKeyDown={handleKeyDown}
//                   className="flex-1"
//                 />
//                 <Button onClick={sendMessage}>Send</Button>
//               </div>
//             </>
//           ) : (
//             <div className="flex-1 flex items-center justify-center text-gray-500">
//               No chat selected
//             </div>
//           )}
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default ClientMessages;


function ClientMessages() {
  return (
    <div>
        hI
    </div>
  )
}

export default ClientMessages