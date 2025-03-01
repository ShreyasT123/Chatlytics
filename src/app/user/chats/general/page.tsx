"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Search, Settings, Send, User, Moon, Sun, Image } from 'lucide-react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const ChatInterface = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState(auth.currentUser?.displayName || 'Anonymous');

  // Image support states
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

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

  // Handle image selection from file input
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

    // Create image preview
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

  // Upload image to Supabase and return the public URL
  const uploadImage = async () => {
    if (!selectedImage) return null;

    setUploading(true);
    try {
      // Generate a unique filename
      const fileName = `${auth.currentUser?.uid || "anonymous"}-${Date.now()}-${selectedImage.name}`;
      const filePath = `uploads/${fileName}`;

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from("media")
        .upload(filePath, selectedImage, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      // Retrieve the public URL
      const { data: publicUrlData } = supabase.storage
        .from("media")
        .getPublicUrl(filePath);
      
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
    if ((!message.trim() && !selectedImage)) return;

    try {
      let imageUrl = null;

      if (selectedImage) {
        imageUrl = await uploadImage();
        // If image upload failed and there is no text message, do nothing
        if (!imageUrl && !message.trim()) return;
      }

      await addDoc(collection(db, 'publicMessages'), {
        content: message.trim() || "",
        imageUrl: imageUrl,
        senderId: auth.currentUser?.uid || 'anonymous',
        senderName: userName,
        timestamp: serverTimestamp(),
        messageType: imageUrl ? (message.trim() ? "text+image" : "image") : "text",
      });

      setMessage('');
      clearSelectedImage();
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
                    {msg.content && <p className="leading-relaxed">{msg.content}</p>}
                    {msg.imageUrl && (
                      <div className="mt-2">
                        <img
                          src={msg.imageUrl}
                          alt="Shared"
                          className="rounded-lg max-h-60 object-contain w-full cursor-pointer"
                          onClick={() => window.open(msg.imageUrl, "_blank")}
                        />
                      </div>
                    )}
                    <span className="text-xs mt-2 block opacity-60">
                      {formatTimestamp(msg.timestamp)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Image Preview & Message Form */}
        {imagePreview && (
          <div className="px-4 py-2 border-t border-gray-800 bg-gray-800/50 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative w-16 h-16 overflow-hidden rounded-md border border-gray-700">
                <img
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
              X
            </Button>
          </div>
        )}

        <Card className="border-t border-gray-800 rounded-none bg-transparent">
          <CardContent className="p-4">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
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
      </div>
    </div>
  );
};

export default ChatInterface;
