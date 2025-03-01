"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X } from "lucide-react";
import useChatStore from "@/store/useChatStore";
import { useLocalStorage } from 'react-use';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { tavily } from "@tavily/core";

const geminiApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
const tavilyApiKey = process.env.NEXT_PUBLIC_TAVILY_API_KEY;

const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const tavilyc = tavily({ apiKey: tavilyApiKey });

const GeminiChat = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchEnabled, setIsSearchEnabled] = useState(true);
  const messages = useChatStore((state) => state.messages);
  const addMessage = useChatStore((state) => state.addMessage);
  const clearMessages = useChatStore((state) => state.clearMessages);
  const [storedMessages, setStoredMessages] = useLocalStorage('gemini-chat-history', []);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (storedMessages && storedMessages.length > 0) {
      clearMessages();
      storedMessages.forEach(message => addMessage(message));
    }
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [storedMessages, addMessage, clearMessages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    setIsLoading(true);

    const userMessage = { role: "user", content: input };
    addMessage(userMessage);
    setStoredMessages([...storedMessages, userMessage]);

    let augmentedPrompt = input;
    if (isSearchEnabled) {
      try {
        const searchResults = await tavilyc.search(input);
        augmentedPrompt = `You are a conversation ai model meant to help all users by engaging with them.You may use the following web search results when needed for crtical information or for info that might need up to data info: ${searchResults.results.map(r => r.content).join('\n')}

Original Query: ${input}`;
      } catch (error) {
        console.error("Tavily Search Error:", error);
      }
    }

    try {
      const result = await model.generateContent(augmentedPrompt);
      const geminiResponse = await result.response;
      const text = await geminiResponse.text();
      const assistantMessage = { role: "assistant", content: text };
      addMessage(assistantMessage);
      setStoredMessages([...storedMessages, userMessage, assistantMessage]);
    } catch (error) {
      console.error("Gemini Error:", error);
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  const handleClearChat = () => {
    clearMessages();
    setStoredMessages([]);
  };

  const toggleChat = () => {
    setOpen(!open);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={toggleChat}
        className={`rounded-full p-4 transition-all duration-1000 ease-in-out transform hover:scale-110 ${
          open ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {open ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white" />
        )}
      </Button>

      <Dialog 
        open={open} 
        onOpenChange={(newOpen) => {
          setOpen(newOpen);
        }}
      >
        <DialogContent className="fixed bottom-20 right-4 w-96 max-h-[80vh] flex flex-col transform transition-all duration-1000 ease-in-out origin-bottom-right data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-right-1/2 data-[state=open]:slide-in-from-right-1/2">
          <div className="p-4 flex-shrink-0">
            <DialogTitle>Gemini Chat Assistant</DialogTitle>
            <DialogDescription>
              Ask me anything! I can use web search (powered by Tavily) to find information.
            </DialogDescription>
          </div>

          <ScrollArea className="flex-grow min-h-0 w-full pr-4" ref={chatContainerRef}>
            <div className="flex flex-col space-y-2 p-4">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`p-2 rounded-lg animate-in slide-in-from-bottom duration-1000 ${
                    message.role === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <strong className="capitalize">{message.role}:</strong> {message.content}
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex flex-col space-y-4 p-4 border-t flex-shrink-0">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                onClick={handleSend} 
                disabled={isLoading || !input.trim()}
                className="transition-all duration-1000 hover:scale-105"
              >
                {isLoading ? "Sending..." : "Send"}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <label htmlFor="search-toggle" className="text-sm font-medium text-gray-700">
                  Enable Web Search:
                </label>
                <input
                  id="search-toggle"
                  type="checkbox"
                  checked={isSearchEnabled}
                  onChange={() => setIsSearchEnabled(!isSearchEnabled)}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleClearChat}
                className="transition-all duration-1000 hover:scale-105"
                size="sm"
              >
                Clear Chat
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GeminiChat;

