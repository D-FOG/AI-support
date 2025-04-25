'use client';

import { useState, useEffect } from 'react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai' | 'agent';
  timestamp: string;
}

interface ChatBoxProps {
  ticketId: string;
  initialMessages?: Message[];
  onSendMessage?: (message: string) => void;
  onClose?: () => void;
}

export default function ChatBox({ ticketId, initialMessages = [], onSendMessage, onClose }: ChatBoxProps) {
  void ticketId;
  const [messages, setMessages] = useState<Message[]>([]);

  // Initialize messages when component mounts or ticketId changes
  useEffect(() => {
    setMessages(initialMessages);
    return () => {
      setMessages([]);
      setNewMessage('');
    };
  }, [ticketId, initialMessages]);
  const [newMessage, setNewMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, userMessage]);

    // Simulate AI/agent response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Thank you for your message. Our team will get back to you shortly.',
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, response]);
    }, 1000);

    if (onSendMessage) {
      onSendMessage(newMessage);
    }

    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 p-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-indigo-600 text-white'
                  : message.sender === 'ai'
                  ? 'bg-gray-100 text-gray-900'
                  : 'bg-green-100 text-green-900'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}