// "use client"
// import React, { useState, useEffect } from 'react';
// import { Search, Settings, Send, User, Moon, Sun } from 'lucide-react';
// import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
// import { db, auth } from '@/lib/firebase';
// import { useTheme } from "next-themes";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Separator } from "@/components/ui/separator";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// const ChatInterface = () => {
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [userName, setUserName] = useState(auth.currentUser?.displayName || 'Anonymous');
//   const { setTheme, theme } = useTheme();

//   useEffect(() => {
//     // Set theme to dark by default
//     setTheme("dark");
//   }, []);

//   useEffect(() => {
//     const q = query(
//       collection(db, 'publicMessages'),
//       orderBy('timestamp', 'desc')
//     );

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const messagesData = [];
//       snapshot.forEach((doc) => {
//         messagesData.push({
//           id: doc.id,
//           ...doc.data(),
//           isSent: doc.data().senderId === auth.currentUser?.uid
//         });
//       });
//       setMessages(messagesData.reverse());
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!message.trim()) return;

//     try {
//       await addDoc(collection(db, 'publicMessages'), {
//         content: message,
//         senderId: auth.currentUser?.uid || 'anonymous',
//         senderName: userName,
//         timestamp: serverTimestamp()
//       });

//       setMessage('');
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };

//   const formatTimestamp = (timestamp) => {
//     if (!timestamp) return '';
//     const date = timestamp.toDate();
//     return new Intl.DateTimeFormat('en-US', {
//       hour: 'numeric',
//       minute: 'numeric',
//       hour12: true
//     }).format(date);
//   };

//   return (
//     <div className="flex h-screen bg-[#524d4d]">
//       {/* Sidebar */}
//       <Card className="w-80 border-r border-[#958888] bg-[#141414] rounded-none">
//         <CardHeader className="space-y-1 p-4 border-b border-[#1A1A1A]">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-2">
//               <div className="w-8 h-8 rounded-full bg-[#333333] flex items-center justify-center">
//                 <User className="text-gray-300 w-5 h-5" />
//               </div>
//               <CardTitle className="text-gray-200">Public Chat</CardTitle>
//             </div>
//           </div>
//           <Input
//             type="text"
//             value={userName}
//             onChange={(e) => setUserName(e.target.value)}
//             placeholder="Set your display name..."
//             className="mt-2 bg-[#1A1A1A] border-[#333333] text-gray-200 placeholder:text-gray-500"
//           />
//         </CardHeader>
//         <CardContent className="text-gray-400">
//           <div className="text-sm">
//             <p>Welcome to the public chat!</p>
//             <p className="mt-2">Everyone can read and send messages here.</p>
//             <p className="mt-2">Current display name: {userName}</p>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Chat Area */}
//       <div className="flex-1 flex flex-col bg-[#141414]">
//         <Card className="border-b border-[#1A1A1A] rounded-none bg-[#141414]">
//           <CardHeader className="p-4">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center">
//                 <User className="text-gray-400 w-6 h-6" />
//               </div>
//               <div>
//                 <h2 className="font-semibold text-gray-200">Public Channel</h2>
//                 <span className="text-sm text-green-500">Open to everyone</span>
//               </div>
//             </div>
//           </CardHeader>
//         </Card>

//         {/* Messages */}
//         <ScrollArea className="flex-1 p-4">
//           <div className="space-y-4">
//             {loading ? (
//               <div className="text-center text-gray-500">Loading messages...</div>
//             ) : (
//               messages.map((msg) => (
//                 <div
//                   key={msg.id}
//                   className={`flex ${msg.isSent ? 'justify-end' : 'justify-start'}`}
//                 >
//                   <div
//                     className={`max-w-[70%] rounded-lg p-3 ${
//                       msg.isSent
//                         ? 'bg-[#1E1E1E] text-gray-200'
//                         : 'bg-[#1A1A1A] text-gray-300'
//                     }`}
//                   >
//                     <div className="text-xs text-gray-400 mb-1">
//                       {msg.senderName}
//                     </div>
//                     <p>{msg.content}</p>
//                     <span className="text-xs mt-1 block text-gray-500">
//                       {formatTimestamp(msg.timestamp)}
//                     </span>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </ScrollArea>

//         {/* Message Input */}
//         <Card className="border-t border-[#1A1A1A] rounded-none bg-[#141414]">
//           <CardContent className="p-4">
//             <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
//               <Input
//                 type="text"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 placeholder="Type a message..."
//                 className="flex-1 bg-[#1A1A1A] border-[#333333] text-gray-200 placeholder:text-gray-500"
//               />
//               <Button 
//                 type="submit" 
//                 size="icon"
//                 className="bg-[#333333] hover:bg-[#444444] text-gray-200"
//               >
//                 <Send className="h-5 w-5" />
//               </Button>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default ChatInterface;

"use client"
import React, { useState, useEffect } from 'react';
import { Search, Settings, Send, User, Moon, Sun } from 'lucide-react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ChatInterface = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState(auth.currentUser?.displayName || 'Anonymous');
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    setTheme("dark");
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, 'publicMessages'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = [];
      snapshot.forEach((doc) => {
        messagesData.push({
          id: doc.id,
          ...doc.data(),
          isSent: doc.data().senderId === auth.currentUser?.uid
        });
      });
      setMessages(messagesData.reverse());
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await addDoc(collection(db, 'publicMessages'), {
        content: message,
        senderId: auth.currentUser?.uid || 'anonymous',
        senderName: userName,
        timestamp: serverTimestamp()
      });

      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Sidebar */}
      <Card className="w-80 bg-gray-900/50 backdrop-blur-lg border-r border-gray-800 rounded-none">
        <CardHeader className="space-y-1 p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                <User className="text-white w-5 h-5" />
              </div>
              <CardTitle className="text-gray-100 font-medium">Public Chat</CardTitle>
            </div>
          </div>
          <Input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Set your display name..."
            className="mt-4 bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-500 rounded-lg"
          />
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4 text-gray-300">
            <p className="leading-relaxed">Welcome to the public chat!</p>
            <Separator className="bg-gray-800" />
            <div className="space-y-2">
              <p className="text-sm">Everyone can read and send messages here.</p>
              <p className="text-sm text-violet-400">Current display name: {userName}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-900/90 backdrop-blur-lg">
        <Card className="border-b border-gray-800 rounded-none bg-transparent">
          <CardHeader className="p-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                <User className="text-white w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-100">Public Channel</h2>
                <span className="text-sm text-emerald-400 flex items-center space-x-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full inline-block"></span>
                  <span>Open to everyone</span>
                </span>
              </div>
            </div>
          </CardHeader>
        </Card>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            {loading ? (
              <div className="text-center text-gray-500">Loading messages...</div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isSent ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl p-4 shadow-lg ${
                      msg.isSent
                        ? 'bg-gradient-to-br from-violet-600 to-purple-700 text-white'
                        : 'bg-gray-800/80 text-gray-100'
                    }`}
                  >
                    <div className="text-sm opacity-80 mb-1">
                      {msg.senderName}
                    </div>
                    <p className="leading-relaxed">{msg.content}</p>
                    <span className="text-xs mt-2 block opacity-60">
                      {formatTimestamp(msg.timestamp)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <Card className="border-t border-gray-800 rounded-none bg-transparent">
          <CardContent className="p-4">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
              <Input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-500 rounded-full py-6"
              />
              <Button 
                type="submit" 
                size="icon"
                className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 shadow-lg"
              >
                <Send className="h-5 w-5 text-white" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatInterface;