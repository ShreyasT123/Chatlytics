// "use client"
// import React, { useState, useEffect } from 'react';
// import { Search, Settings, Send, User, Plus, Hash, Copy } from 'lucide-react';
// import { 
//   collection, 
//   query, 
//   orderBy, 
//   onSnapshot, 
//   addDoc, 
//   serverTimestamp, 
//   where, 
//   doc, 
//   getDoc,
//   getDocs // Added missing import
// } from 'firebase/firestore';
// import { db, auth } from '@/lib/firebase';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { toast } from "@/hooks/use-toast";

// const ChatInterface = () => {
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [userName, setUserName] = useState(auth.currentUser?.displayName || 'Anonymous');
//   const [activeRoom, setActiveRoom] = useState(null);
//   const [joinedRooms, setJoinedRooms] = useState([]);
//   const [newRoomName, setNewRoomName] = useState('');
//   const [roomToJoin, setRoomToJoin] = useState('');

//   // Fetch joined rooms
//   useEffect(() => {
//     if (!auth.currentUser?.uid) return;

//     const q = query(
//       collection(db, 'userRooms'),
//       where('userId', '==', auth.currentUser.uid)
//     );

//     const unsubscribe = onSnapshot(q, async (snapshot) => {
//       try {
//         const roomsData = [];
//         for (const docSnapshot of snapshot.docs) {
//           const roomRef = doc(db, 'chatRooms', docSnapshot.data().roomId);
//           const roomDoc = await getDoc(roomRef);
//           if (roomDoc.exists()) {
//             roomsData.push({ id: roomDoc.id, ...roomDoc.data() });
//           }
//         }
//         setJoinedRooms(roomsData);
//       } catch (error) {
//         console.error('Error fetching rooms:', error);
//         toast({
//           title: "Error",
//           description: "Failed to fetch rooms",
//           variant: "destructive"
//         });
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   // Fetch messages for active room
//   useEffect(() => {
//     if (!activeRoom) return;

//     // Create a compound query with proper ordering
//     const q = query(
//       collection(db, 'roomMessages'),
//       where('roomId', '==', activeRoom.id),
//       orderBy('timestamp', 'desc') // Ensure ordering by timestamp
//     );

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       try {
//         const messagesData = [];
//         snapshot.forEach((doc) => {
//           messagesData.push({
//             id: doc.id,
//             ...doc.data(),
//             isSent: doc.data().senderId === auth.currentUser?.uid
//           });
//         });
//         setMessages(messagesData.reverse());
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//         toast({
//           title: "Error",
//           description: "Failed to fetch messages",
//           variant: "destructive"
//         });
//       }
//     }, (error) => {
//       console.error('Error in snapshot listener:', error);
//       if (error.code === 'failed-precondition') {
//         toast({
//           title: "Error",
//           description: "The query requires an index. Please create the required index in Firestore.",
//           variant: "destructive"
//         });
//       }
//     });

//     return () => unsubscribe();
//   }, [activeRoom]);

//   const createRoom = async () => {
//     if (!newRoomName.trim()) return;

//     try {
//       // Create new room
//       const roomRef = await addDoc(collection(db, 'chatRooms'), {
//         name: newRoomName,
//         createdBy: auth.currentUser.uid,
//         createdAt: serverTimestamp(),
//       });

//       // Add creator to room members
//       await addDoc(collection(db, 'userRooms'), {
//         userId: auth.currentUser.uid,
//         roomId: roomRef.id,
//         joinedAt: serverTimestamp()
//       });

//       setNewRoomName('');
//       setActiveRoom({ id: roomRef.id, name: newRoomName });
      
//       toast({
//         title: "Room created!",
//         description: `Room ID: ${roomRef.id}`,
//       });
//     } catch (error) {
//       console.error('Error creating room:', error);
//       toast({
//         title: "Error",
//         description: "Failed to create room",
//         variant: "destructive"
//       });
//     }
//   };

//   const joinRoom = async () => {
//     if (!roomToJoin.trim()) return;

//     try {
//       const roomRef = doc(db, 'chatRooms', roomToJoin);
//       const roomDoc = await getDoc(roomRef);
      
//       if (!roomDoc.exists()) {
//         toast({
//           title: "Error",
//           description: "Room not found",
//           variant: "destructive"
//         });
//         return;
//       }

//       // Check if already joined
//       const membershipQuery = query(
//         collection(db, 'userRooms'),
//         where('userId', '==', auth.currentUser.uid),
//         where('roomId', '==', roomToJoin)
//       );
      
//       const existingMembership = await getDocs(membershipQuery);

//       if (!existingMembership.empty) {
//         toast({
//           title: "Info",
//           description: "You're already in this room",
//         });
//         return;
//       }

//       // Join room
//       await addDoc(collection(db, 'userRooms'), {
//         userId: auth.currentUser.uid,
//         roomId: roomToJoin,
//         joinedAt: serverTimestamp()
//       });

//       setRoomToJoin('');
//       setActiveRoom({ id: roomDoc.id, ...roomDoc.data() });
      
//       toast({
//         title: "Success",
//         description: "Joined room successfully",
//       });
//     } catch (error) {
//       console.error('Error joining room:', error);
//       toast({
//         title: "Error",
//         description: "Failed to join room",
//         variant: "destructive"
//       });
//     }
//   };

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!message.trim() || !activeRoom) return;

//     try {
//       await addDoc(collection(db, 'roomMessages'), {
//         content: message,
//         roomId: activeRoom.id,
//         senderId: auth.currentUser?.uid || 'anonymous',
//         senderName: userName,
//         timestamp: serverTimestamp()
//       });

//       setMessage('');
//     } catch (error) {
//       console.error('Error sending message:', error);
//       toast({
//         title: "Error",
//         description: "Failed to send message",
//         variant: "destructive"
//       });
//     }
//   };

//   const copyRoomId = (roomId) => {
//     navigator.clipboard.writeText(roomId);
//     toast({
//       title: "Copied!",
//       description: "Room ID copied to clipboard",
//     });
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
"use client"
import React, { useState, useEffect } from 'react';
import { Search, Settings, Send, User, Plus, Hash, Copy } from 'lucide-react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  where, 
  doc, 
  getDoc,
  getDocs // Added missing import
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const ChatInterface = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState(auth.currentUser?.displayName || 'Anonymous');
  const [activeRoom, setActiveRoom] = useState(null);
  const [joinedRooms, setJoinedRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [roomToJoin, setRoomToJoin] = useState('');

  // Fetch joined rooms
  useEffect(() => {
    if (!auth.currentUser?.uid) return;

    const q = query(
      collection(db, 'userRooms'),
      where('userId', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      try {
        const roomsData = [];
        for (const docSnapshot of snapshot.docs) {
          const roomRef = doc(db, 'chatRooms', docSnapshot.data().roomId);
          const roomDoc = await getDoc(roomRef);
          if (roomDoc.exists()) {
            roomsData.push({ id: roomDoc.id, ...roomDoc.data() });
          }
        }
        setJoinedRooms(roomsData);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        toast({
          title: "Error",
          description: "Failed to fetch rooms",
          variant: "destructive"
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch messages for active room
  useEffect(() => {
    if (!activeRoom) return;

    // Simplified query without compound index requirement
    const q = query(
      collection(db, 'roomMessages'),
      where('roomId', '==', activeRoom.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      try {
        const messagesData = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          messagesData.push({
            id: doc.id,
            ...data,
            isSent: data.senderId === auth.currentUser?.uid,
            timestamp: data.timestamp
          });
        });
        // Sort messages by timestamp client-side
        setMessages(messagesData.sort((a, b) => {
          const timestampA = a.timestamp?.toMillis() || 0;
          const timestampB = b.timestamp?.toMillis() || 0;
          return timestampA - timestampB;
        }));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: "Error",
          description: "Failed to fetch messages",
          variant: "destructive"
        });
      }
    });

    return () => unsubscribe();
  }, [activeRoom]);

  const createRoom = async () => {
    if (!newRoomName.trim()) return;

    try {
      // Create new room
      const roomRef = await addDoc(collection(db, 'chatRooms'), {
        name: newRoomName,
        createdBy: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });

      // Add creator to room members
      await addDoc(collection(db, 'userRooms'), {
        userId: auth.currentUser.uid,
        roomId: roomRef.id,
        joinedAt: serverTimestamp()
      });

      setNewRoomName('');
      setActiveRoom({ id: roomRef.id, name: newRoomName });
      
      toast({
        title: "Room created!",
        description: `Room ID: ${roomRef.id}`,
      });
    } catch (error) {
      console.error('Error creating room:', error);
      toast({
        title: "Error",
        description: "Failed to create room",
        variant: "destructive"
      });
    }
  };

  const joinRoom = async () => {
    if (!roomToJoin.trim()) return;

    try {
      const roomRef = doc(db, 'chatRooms', roomToJoin);
      const roomDoc = await getDoc(roomRef);
      
      if (!roomDoc.exists()) {
        toast({
          title: "Error",
          description: "Room not found",
          variant: "destructive"
        });
        return;
      }

      // Check if already joined
      const membershipQuery = query(
        collection(db, 'userRooms'),
        where('userId', '==', auth.currentUser.uid),
        where('roomId', '==', roomToJoin)
      );
      
      const existingMembership = await getDocs(membershipQuery);

      if (!existingMembership.empty) {
        toast({
          title: "Info",
          description: "You're already in this room",
        });
        return;
      }

      // Join room
      await addDoc(collection(db, 'userRooms'), {
        userId: auth.currentUser.uid,
        roomId: roomToJoin,
        joinedAt: serverTimestamp()
      });

      setRoomToJoin('');
      setActiveRoom({ id: roomDoc.id, ...roomDoc.data() });
      
      toast({
        title: "Success",
        description: "Joined room successfully",
      });
    } catch (error) {
      console.error('Error joining room:', error);
      toast({
        title: "Error",
        description: "Failed to join room",
        variant: "destructive"
      });
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !activeRoom) return;

    try {
      await addDoc(collection(db, 'roomMessages'), {
        content: message,
        roomId: activeRoom.id,
        senderId: auth.currentUser?.uid || 'anonymous',
        senderName: userName,
        timestamp: serverTimestamp()
      });

      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const copyRoomId = (roomId) => {
    navigator.clipboard.writeText(roomId);
    toast({
      title: "Copied!",
      description: "Room ID copied to clipboard",
    });
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
    <div className="flex h-screen bg-[#524d4d]">
      {/* Sidebar */}
      <Card className="w-80 border-r border-[#958888] bg-[#141414] rounded-none">
        <CardHeader className="space-y-1 p-4 border-b border-[#1A1A1A]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#333333] flex items-center justify-center">
                <User className="text-gray-300 w-5 h-5" />
              </div>
              <CardTitle className="text-gray-200">{userName}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Chat Rooms */}
          <div className="space-y-2 p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">Chat Rooms</span>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Plus className="h-4 w-4 text-gray-400" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Chat Rooms</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {/* Create Room */}
                    <div>
                      <h3 className="text-sm font-medium mb-2">Create New Room</h3>
                      <div className="flex space-x-2">
                        <Input
                          value={newRoomName}
                          onChange={(e) => setNewRoomName(e.target.value)}
                          placeholder="Room name..."
                          className="flex-1"
                        />
                        <Button onClick={createRoom}>Create</Button>
                      </div>
                    </div>
                    
                    {/* Join Room */}
                    <div>
                      <h3 className="text-sm font-medium mb-2">Join Room</h3>
                      <div className="flex space-x-2">
                        <Input
                          value={roomToJoin}
                          onChange={(e) => setRoomToJoin(e.target.value)}
                          placeholder="Room ID..."
                          className="flex-1"
                        />
                        <Button onClick={joinRoom}>Join</Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Room List */}
            {joinedRooms.map((room) => (
              <div
                key={room.id}
                className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                  activeRoom?.id === room.id ? 'bg-[#1A1A1A]' : 'hover:bg-[#1A1A1A]'
                }`}
                onClick={() => setActiveRoom(room)}
              >
                <div className="flex items-center space-x-2">
                  <Hash className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">{room.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyRoomId(room.id);
                  }}
                >
                  <Copy className="h-4 w-4 text-gray-400" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-[#141414]">
        {activeRoom ? (
          <>
            <Card className="border-b border-[#1A1A1A] rounded-none bg-[#141414]">
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center">
                      <Hash className="text-gray-400 w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-200">{activeRoom.name}</h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 text-sm"
                        onClick={() => copyRoomId(activeRoom.id)}
                      >
                        ID: {activeRoom.id} <Copy className="ml-2 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center text-gray-500">Loading messages...</div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isSent ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          msg.isSent
                            ? 'bg-[#1E1E1E] text-gray-200'
                            : 'bg-[#1A1A1A] text-gray-300'
                        }`}
                      >
                        <div className="text-xs text-gray-400 mb-1">
                          {msg.senderName}
                        </div>
                        <p>{msg.content}</p>
                        <span className="text-xs mt-1 block text-gray-500">
                          {formatTimestamp(msg.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <Card className="border-t border-[#1A1A1A] rounded-none bg-[#141414]">
              <CardContent className="p-4">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                  <Input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-[#1A1A1A] border-[#333333] text-gray-200 placeholder:text-gray-500"
                  />
                  <Button 
                    type="submit" 
                    size="icon"
                    className="bg-[#333333] hover:bg-[#444444] text-gray-200"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a room or create one to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;