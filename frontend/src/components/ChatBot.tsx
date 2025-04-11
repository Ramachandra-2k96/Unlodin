import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Truck, ArrowRight, ChevronDown } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "👋 Hi there! I'm your Unlodin assistant. How can I help you with your logistics needs today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Sample bot responses
  const botResponses = [
    "Thanks for reaching out! What specific logistics services are you looking for?",
    "We can help with that! Have you tried our route optimization feature?",
    "Our platform connects you with over 100 carriers to find the best shipping rates.",
    "Would you like to schedule a demo with one of our specialists to learn more?",
    "Is there anything specific about our platform you'd like to know more about?"
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message
    const newUserMessage: Message = {
      id: messages.length + 1,
      text: message,
      isBot: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setMessage('');
    
    // Show bot typing indicator
    setIsTyping(true);
    
    // Simulate bot response after delay
    setTimeout(() => {
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      const newBotMessage: Message = {
        id: messages.length + 2,
        text: randomResponse,
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newBotMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="mb-4 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-80 sm:w-96 max-h-[500px] flex flex-col overflow-hidden"
          >
            {/* Chat header */}
            <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative mr-2">
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-full blur-sm opacity-60"></div>
                  <div className="relative bg-slate-900 rounded-full p-1.5">
                    <Truck className="w-5 h-5 text-yellow-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-medium text-pretty">Unlod<span className='text-yellow-400'>in</span> Assistant</h3>
                  <div className="flex items-center text-xs text-green-400">
                    <span className="w-2 h-2 bg-green-400 rounded-full inline-block mr-1"></span>
                    <span>Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Chat messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-slate-950/50 backdrop-blur-sm">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div 
                      className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                        msg.isBot 
                          ? 'bg-slate-800 text-white rounded-bl-none' 
                          : 'bg-yellow-500 text-slate-900 rounded-br-none'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className="text-xs mt-1 opacity-70 text-right">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Bot typing indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-800 text-white px-4 py-3 rounded-2xl rounded-bl-none max-w-[80%]">
                      <div className="flex space-x-1">
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            {/* Chat input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-900/80 backdrop-blur-sm">
              <div className="flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-full py-2 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
                />
                <button 
                  type="submit"
                  className="ml-2 p-2 bg-yellow-500 text-slate-900 rounded-full hover:bg-yellow-400 transition-colors"
                  disabled={!message.trim()}
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Chat button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 p-4 rounded-full shadow-lg flex items-center justify-center transition-colors relative group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle size={24} />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Notification dot */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-yellow-500"></span>
        )}
      </motion.button>
    </div>
  );
};

export default ChatBot; 