"use client";
import React, { useState, useEffect, useRef } from "react";
import { Send, User, Plus, Hash, Copy, Image, X } from "lucide-react";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  serverTimestamp,
  where,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
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
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const ChatInterface = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState(
    auth.currentUser?.displayName || "Anonymous"
  );
  const [activeRoom, setActiveRoom] = useState(null);
  const [joinedRooms, setJoinedRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [roomToJoin, setRoomToJoin] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Fetch joined rooms
  useEffect(() => {
    if (!auth.currentUser?.uid) return;

    const q = query(
      collection(db, "userRooms"),
      where("userId", "==", auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      try {
        const roomsData = [];
        for (const docSnapshot of snapshot.docs) {
          const roomRef = doc(db, "chatRooms", docSnapshot.data().roomId);
          const roomDoc = await getDoc(roomRef);
          if (roomDoc.exists()) {
            roomsData.push({ id: roomDoc.id, ...roomDoc.data() });
          }
        }
        setJoinedRooms(roomsData);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        toast({
          title: "Error",
          description: "Failed to fetch rooms",
          variant: "destructive",
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
      collection(db, "roomMessages"),
      where("roomId", "==", activeRoom.id)
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
            timestamp: data.timestamp,
          });
        });
        // Sort messages by timestamp client-side
        setMessages(
          messagesData.sort((a, b) => {
            const timestampA = a.timestamp?.toMillis() || 0;
            const timestampB = b.timestamp?.toMillis() || 0;
            return timestampA - timestampB;
          })
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast({
          title: "Error",
          description: "Failed to fetch messages",
          variant: "destructive",
        });
      }
    });

    return () => unsubscribe();
  }, [activeRoom]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const createRoom = async () => {
    if (!newRoomName.trim()) return;

    try {
      // Create new room
      const roomRef = await addDoc(collection(db, "chatRooms"), {
        name: newRoomName,
        createdBy: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });

      // Add creator to room members
      await addDoc(collection(db, "userRooms"), {
        userId: auth.currentUser.uid,
        roomId: roomRef.id,
        joinedAt: serverTimestamp(),
      });

      setNewRoomName("");
      setActiveRoom({ id: roomRef.id, name: newRoomName });

      toast({
        title: "Room created!",
        description: `Room ID: ${roomRef.id}`,
      });
    } catch (error) {
      console.error("Error creating room:", error);
      toast({
        title: "Error",
        description: "Failed to create room",
        variant: "destructive",
      });
    }
  };

  const joinRoom = async () => {
    if (!roomToJoin.trim()) return;

    try {
      const roomRef = doc(db, "chatRooms", roomToJoin);
      const roomDoc = await getDoc(roomRef);

      if (!roomDoc.exists()) {
        toast({
          title: "Error",
          description: "Room not found",
          variant: "destructive",
        });
        return;
      }

      // Check if already joined
      const membershipQuery = query(
        collection(db, "userRooms"),
        where("userId", "==", auth.currentUser.uid),
        where("roomId", "==", roomToJoin)
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
      await addDoc(collection(db, "userRooms"), {
        userId: auth.currentUser.uid,
        roomId: roomToJoin,
        joinedAt: serverTimestamp(),
      });

      setRoomToJoin("");
      setActiveRoom({ id: roomDoc.id, ...roomDoc.data() });

      toast({
        title: "Success",
        description: "Joined room successfully",
      });
    } catch (error) {
      console.error("Error joining room:", error);
      toast({
        title: "Error",
        description: "Failed to join room",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Only image files are allowed",
        variant: "destructive",
      });
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const clearSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) return null;

    setUploading(true);
    try {
      // Generate a unique filename
      const fileName = `${auth.currentUser?.uid || "anonymous"}-${Date.now()}-${
        selectedImage.name
      }`;
      const filePath = `uploads/${fileName}`;

      // Upload to Supabase
      const { data, error } = await supabase.storage
        .from("media")
        .upload(filePath, selectedImage, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("media")
        .getPublicUrl(filePath);
      console.log("Image URL data:", publicUrlData.publicUrl);

      setUploading(false);
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploading(false);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!message.trim() && !selectedImage) || !activeRoom) return;

    try {
      let imageUrl = null;

      if (selectedImage) {
        imageUrl = await uploadImage();
        if (!imageUrl && !message.trim()) return; // If image upload failed and no text message
      }

      await addDoc(collection(db, "roomMessages"), {
        content: message.trim() || "",
        imageUrl: imageUrl,
        roomId: activeRoom.id,
        senderId: auth.currentUser?.uid || "anonymous",
        senderName: userName,
        timestamp: serverTimestamp(),
        messageType: imageUrl
          ? message.trim()
            ? "text+image"
            : "image"
          : "text",
      });

      setMessage("");
      clearSelectedImage();
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
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
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  const renderMessage = (msg) => {
    return (
      <div
        key={msg.id}
        className={`flex ${msg.isSent ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`max-w-[70%] rounded-2xl p-4 shadow-lg ${
            msg.isSent
              ? "bg-gradient-to-br from-violet-600 to-purple-700 text-white"
              : "bg-gray-800/80 text-gray-100"
          }`}
        >
          <div className="text-sm opacity-80 mb-1">{msg.senderName}</div>

          {msg.content && <p className="leading-relaxed mb-2">{msg.content}</p>}

          {msg.imageUrl && (
            <div className="mt-2 relative">
              <img
                height={100}
                width={100}
                src={msg.imageUrl}
                alt="Shared image"
                className="rounded-lg max-h-60 object-contain bg-black/20 w-full"
                onClick={() => window.open(msg.imageUrl, "_blank")}
              />
            </div>
          )}

          <span className="text-xs mt-2 block opacity-60">
            {formatTimestamp(msg.timestamp)}
          </span>
        </div>
      </div>
    );
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
              <CardTitle className="text-gray-100 font-medium">
                {userName}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-2 p-4">
            <div className="flex items-center justify-between mb-6">
              <span className="text-gray-400 text-sm font-medium">
                Chat Rooms
              </span>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-gray-800/50"
                  >
                    <Plus className="h-4 w-4 text-gray-400" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-800">
                  <DialogHeader>
                    <DialogTitle className="text-gray-100">
                      Chat Rooms
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-300 mb-3">
                        Create New Room
                      </h3>
                      <div className="flex space-x-2">
                        <Input
                          value={newRoomName}
                          onChange={(e) => setNewRoomName(e.target.value)}
                          placeholder="Room name..."
                          className="flex-1 bg-gray-800/50 border-gray-700 text-gray-100"
                        />
                        <Button
                          onClick={createRoom}
                          className="bg-violet-600 hover:bg-violet-700"
                        >
                          Create
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-300 mb-3">
                        Join Room
                      </h3>
                      <div className="flex space-x-2">
                        <Input
                          value={roomToJoin}
                          onChange={(e) => setRoomToJoin(e.target.value)}
                          placeholder="Room ID..."
                          className="flex-1 bg-gray-800/50 border-gray-700 text-gray-100"
                        />
                        <Button
                          onClick={joinRoom}
                          className="bg-violet-600 hover:bg-violet-700"
                        >
                          Join
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {joinedRooms.map((room) => (
              <div
                key={room.id}
                className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  activeRoom?.id === room.id
                    ? "bg-violet-600/20 border border-violet-500/20"
                    : "hover:bg-gray-800/50 border border-transparent"
                }`}
                onClick={() => setActiveRoom(room)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-800/80 flex items-center justify-center">
                    <Hash className="h-4 w-4 text-gray-400" />
                  </div>
                  <span className="text-gray-300 font-medium">{room.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
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
      <div className="flex-1 flex flex-col bg-gray-900/90 backdrop-blur-lg">
        {activeRoom ? (
          <>
            <Card className="border-b border-gray-800 rounded-none bg-transparent">
              <CardHeader className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <Hash className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-100">
                      {activeRoom.name}
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 text-sm hover:text-gray-300"
                      onClick={() => copyRoomId(activeRoom.id)}
                    >
                      ID: {activeRoom.id} <Copy className="ml-2 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                {loading ? (
                  <div className="text-center text-gray-500">
                    Loading messages...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-500">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map(renderMessage)
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Image preview */}
            {imagePreview && (
              <div className="px-4 py-2 border-t border-gray-800 bg-gray-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="relative w-16 h-16 overflow-hidden rounded-md border border-gray-700">
                      <img
                        height={100}
                        width={100}
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-gray-300 text-sm truncate max-w-xs">
                      {selectedImage?.name}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-gray-700/50"
                    onClick={clearSelectedImage}
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </Button>
                </div>
              </div>
            )}

            <Card className="border-t border-gray-800 rounded-none bg-transparent">
              <CardContent className="p-4">
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-center space-x-3"
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-12 w-12 rounded-full hover:bg-gray-800/80"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <Image className="h-5 w-5 text-gray-300" />
                  </Button>
                  <Input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-500 rounded-full py-6"
                    disabled={uploading}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 shadow-lg"
                    disabled={uploading}
                  >
                    {uploading ? (
                      <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
                    ) : (
                      <Send className="h-5 w-5 text-white" />
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 space-y-4">
            <div className="w-16 h-16 rounded-full bg-gray-800/80 flex items-center justify-center">
              <Hash className="h-8 w-8 text-gray-500" />
            </div>
            <p className="text-lg">
              Select a room or create one to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
