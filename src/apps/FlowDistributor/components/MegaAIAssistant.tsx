import React, { useState } from 'react';
import { Button, Input, Card } from 'shadcn/ui';
import { Mic, MicOff, Send, Sparkles, BarChart3, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const MegaAIAssistant = () => {
  const [isMicOn, setIsMicOn] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
  };

  const sendMessage = () => {
    if (inputValue.trim()) {
      setMessages([...messages, inputValue]);
      setInputValue('');
      // Here you would also trigger the MegaAIAgent service
    }
  };

  return (
    <div className="flex flex-col h-full p-4 bg-gradient-to-r from-purple-500 to-blue-500 dark:from-blue-900 dark:to-purple-900 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <Button onClick={toggleMic} className="bg-white text-black dark:bg-gray-800 rounded-full p-2">
          {isMicOn ? <MicOff /> : <Mic />}
        </Button>
      </div>
      <div className="overflow-y-auto h-64 border rounded-lg p-2 mb-4 bg-white dark:bg-gray-800">
        {messages.map((msg, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="p-2 my-1 bg-gray-200 dark:bg-gray-700 rounded-md"
          >
            {msg}
          </motion.div>
        ))}
      </div>
      <div className="flex">
        <Input 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)} 
          placeholder="Type a message..." 
          className="flex-1 mr-2"
        />
        <Button onClick={sendMessage} className="bg-white text-black dark:bg-gray-800 rounded-full p-2">
          <Send />
        </Button>
      </div>
      <div className="flex mt-4 space-x-2">
        <Button className="bg-green-500 text-white rounded p-2 flex items-center">
          <Download className="mr-1" /> PDF
        </Button>
        <Button className="bg-blue-500 text-white rounded p-2 flex items-center">
          <Download className="mr-1" /> Excel
        </Button>
      </div>
      <div className="mt-4">
        <h3 className="text-lg text-white">Quick Actions:</h3>
        <div className="flex space-x-2">
          <Button className="bg-yellow-500 text-white rounded p-2 flex items-center">
            <Sparkles className="mr-1" /> Suggestions
          </Button>
          <Button className="bg-indigo-500 text-white rounded p-2 flex items-center">
            <BarChart3 className="mr-1" /> Charts
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MegaAIAssistant;