import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Leaf } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI farming assistant. I can help you choose the best crops for this season, provide farming tips, and answer questions about agriculture. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const cropRecommendations = {
    winter: ['Wheat', 'Barley', 'Peas', 'Mustard', 'Chickpea', 'Lentils'],
    summer: ['Rice', 'Cotton', 'Sugarcane', 'Maize', 'Sorghum', 'Pearl Millet'],
    monsoon: ['Rice', 'Cotton', 'Sugarcane', 'Jute', 'Groundnut', 'Sesame'],
    spring: ['Tomato', 'Potato', 'Onion', 'Cabbage', 'Cauliflower', 'Carrot']
  };

  const farmingTips = [
    'Use organic fertilizers to improve soil health and crop quality.',
    'Implement crop rotation to prevent soil depletion and pest buildup.',
    'Monitor weather conditions regularly for optimal planting and harvesting.',
    'Use drip irrigation to conserve water and improve crop yield.',
    'Test soil pH regularly and adjust with lime or sulfur as needed.',
    'Practice integrated pest management to reduce chemical pesticide use.'
  ];

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('crop') && (message.includes('season') || message.includes('best') || message.includes('recommend'))) {
      const currentMonth = new Date().getMonth();
      let season = 'spring';
      
      if (currentMonth >= 11 || currentMonth <= 2) season = 'winter';
      else if (currentMonth >= 3 && currentMonth <= 5) season = 'spring';
      else if (currentMonth >= 6 && currentMonth <= 8) season = 'monsoon';
      else season = 'summer';
      
      const crops = cropRecommendations[season as keyof typeof cropRecommendations];
      return `For the current ${season} season, I recommend these crops: ${crops.join(', ')}. These crops are well-suited for the current weather conditions and market demand.`;
    }
    
    if (message.includes('weather') || message.includes('climate')) {
      return 'Weather plays a crucial role in farming. Monitor temperature, rainfall, and humidity regularly. Use weather forecasting to plan planting and harvesting. Consider climate-resistant varieties for unpredictable weather patterns.';
    }
    
    if (message.includes('soil') || message.includes('fertilizer')) {
      return 'Healthy soil is the foundation of good farming. Test your soil pH (ideal range: 6.0-7.0), add organic matter like compost, and use balanced fertilizers. Consider soil testing every 2-3 years for optimal results.';
    }
    
    if (message.includes('pest') || message.includes('disease')) {
      return 'For pest and disease management: Use integrated pest management (IPM), encourage beneficial insects, rotate crops, maintain field hygiene, and use resistant varieties when possible. Early detection is key!';
    }
    
    if (message.includes('water') || message.includes('irrigation')) {
      return 'Efficient water management is crucial. Use drip irrigation or sprinkler systems, mulch to retain moisture, collect rainwater, and water during cooler parts of the day to reduce evaporation.';
    }
    
    if (message.includes('price') || message.includes('market')) {
      return 'For better market prices: Research local market demands, consider value-added processing, form farmer groups for better bargaining power, and use digital platforms to reach more buyers directly.';
    }
    
    if (message.includes('organic') || message.includes('natural')) {
      return 'Organic farming benefits: Use compost and green manure, practice crop rotation, encourage biodiversity, avoid synthetic chemicals, and get organic certification for premium prices.';
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return 'Hello! I\'m here to help with all your farming questions. You can ask me about crop recommendations, farming techniques, pest management, soil health, or market advice. What would you like to know?';
    }
    
    if (message.includes('thank')) {
      return 'You\'re welcome! I\'m always here to help with your farming questions. Feel free to ask anything about crops, farming techniques, or agricultural best practices. Happy farming! 🌱';
    }
    
    // Default response with a random farming tip
    const randomTip = farmingTips[Math.floor(Math.random() * farmingTips.length)];
    return `I'd be happy to help with that! Here's a useful farming tip: ${randomTip} Feel free to ask me about crop recommendations, farming techniques, pest management, or market advice.`;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputText),
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all transform hover:scale-110 z-50"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col z-50">
          {/* Header */}
          <div className="bg-green-600 text-white p-4 rounded-t-xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-white/20 p-2 rounded-full">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">AI Farm Assistant</h3>
                <p className="text-xs text-green-100">Online • Ready to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`p-2 rounded-full ${message.sender === 'user' ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {message.sender === 'user' ? (
                      <User className="h-4 w-4 text-green-600" />
                    ) : (
                      <Leaf className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-green-100' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2 max-w-[80%]">
                  <div className="p-2 rounded-full bg-gray-100">
                    <Leaf className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about crops, farming tips..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;