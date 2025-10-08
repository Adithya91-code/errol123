import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Lightbulb } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface AIChatbotProps {
  onClose: () => void;
}

const AIChatbot: React.FC<AIChatbotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI farming assistant. I can help you with crop recommendations, seasonal advice, and farming best practices. What would you like to know?',
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

  const quickQuestions = [
    'What crops are best for this season?',
    'How to improve soil quality?',
    'Best irrigation practices?',
    'Pest control methods?',
    'Market price predictions?'
  ];

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('season') || lowerMessage.includes('crop') && lowerMessage.includes('best')) {
      return `Based on current weather patterns and market trends, here are the best crops for this season:

🌾 **Rabi Season (Oct-Mar):**
- Wheat: High demand, good prices expected
- Mustard: Excellent for oil production
- Chickpea: Growing market demand
- Barley: Suitable for current weather

🌱 **Summer Crops:**
- Fodder crops: Essential for livestock
- Vegetables: Tomato, cucumber in controlled environment

💡 **Recommendation:** Focus on wheat and chickpea for maximum profitability this season!`;
    }
    
    if (lowerMessage.includes('soil') || lowerMessage.includes('quality')) {
      return `Here are proven methods to improve soil quality:

🌱 **Organic Methods:**
- Add compost and farmyard manure
- Practice crop rotation
- Use green manure crops
- Apply bio-fertilizers

🧪 **Soil Testing:**
- Test pH levels (ideal: 6.0-7.5)
- Check NPK levels
- Monitor organic matter content

💧 **Water Management:**
- Proper drainage systems
- Avoid waterlogging
- Maintain soil moisture

🔄 **Sustainable Practices:**
- Minimal tillage
- Cover cropping
- Integrated nutrient management`;
    }
    
    if (lowerMessage.includes('irrigation') || lowerMessage.includes('water')) {
      return `Smart irrigation practices for better yields:

💧 **Efficient Methods:**
- Drip irrigation: 30-50% water savings
- Sprinkler systems: Good for field crops
- Micro-sprinklers: Ideal for orchards

⏰ **Timing:**
- Early morning (6-8 AM): Best time
- Evening (6-8 PM): Second best
- Avoid midday irrigation

📊 **Water Management:**
- Monitor soil moisture
- Use moisture sensors
- Follow crop water requirements
- Implement rainwater harvesting

🌱 **Crop-Specific Tips:**
- Rice: Maintain 2-5cm water level
- Wheat: Light frequent irrigation
- Vegetables: Regular but controlled watering`;
    }
    
    if (lowerMessage.includes('pest') || lowerMessage.includes('disease')) {
      return `Integrated Pest Management strategies:

🐛 **Prevention First:**
- Use resistant crop varieties
- Maintain field hygiene
- Proper crop rotation
- Balanced fertilization

🌿 **Biological Control:**
- Encourage beneficial insects
- Use bio-pesticides
- Neem-based solutions
- Pheromone traps

🧪 **Chemical Control (Last Resort):**
- Use recommended pesticides
- Follow proper dosage
- Respect pre-harvest intervals
- Rotate chemical groups

🔍 **Regular Monitoring:**
- Weekly field inspections
- Early detection systems
- Weather-based spray decisions
- Record keeping`;
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('market')) {
      return `Market insights and price predictions:

📈 **Current Trends:**
- Wheat: Prices expected to rise 5-8%
- Rice: Stable with slight decline
- Vegetables: High volatility, good profits
- Pulses: Strong demand, increasing prices

💰 **Profit Maximization:**
- Direct marketing to consumers
- Value addition (processing)
- Contract farming opportunities
- Cooperative selling

📊 **Market Intelligence:**
- Monitor mandi prices daily
- Use government price apps
- Follow weather impact on prices
- Plan harvesting timing

🎯 **Strategic Advice:**
- Diversify crop portfolio
- Store produce for better prices
- Explore export opportunities
- Build direct buyer relationships`;
    }
    
    if (lowerMessage.includes('fertilizer') || lowerMessage.includes('nutrient')) {
      return `Balanced fertilization for optimal growth:

🧪 **Soil Testing First:**
- Get soil tested every 2-3 years
- Understand NPK requirements
- Check micronutrient levels

🌱 **Organic Options:**
- Compost: 5-10 tons/hectare
- Vermicompost: 2-3 tons/hectare
- Green manure: Grow and incorporate
- Bio-fertilizers: Cost-effective

⚖️ **Chemical Fertilizers:**
- Follow soil test recommendations
- Use balanced NPK ratios
- Apply in split doses
- Consider slow-release fertilizers

📅 **Application Timing:**
- Base dose: At sowing/planting
- Top dressing: During active growth
- Foliar spray: For quick correction
- Post-harvest: Soil conditioning`;
    }
    
    // Default response
    return `I understand you're asking about "${userMessage}". Here are some general farming tips:

🌾 **Key Success Factors:**
- Choose right crops for your region
- Follow proper planting schedules
- Maintain soil health
- Use integrated pest management
- Monitor market prices

💡 **Need specific help?** Try asking about:
- Seasonal crop recommendations
- Soil improvement methods
- Irrigation best practices
- Pest and disease control
- Market price trends

Feel free to ask more specific questions about any farming topic!`;
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

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputText),
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickQuestion = (question: string) => {
    setInputText(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-20 right-6 w-96 h-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-purple-600 text-white rounded-t-xl">
        <div className="flex items-center space-x-2">
          <Bot className="h-6 w-6" />
          <div>
            <h3 className="font-semibold">AI Farm Assistant</h3>
            <p className="text-xs opacity-90">Online • Ready to help</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-purple-700 rounded-lg transition-colors"
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
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.sender === 'bot' && (
                  <Bot className="h-4 w-4 mt-1 text-purple-600" />
                )}
                {message.sender === 'user' && (
                  <User className="h-4 w-4 mt-1" />
                )}
                <div className="flex-1">
                  <div className="whitespace-pre-wrap text-sm">{message.text}</div>
                  <div className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-purple-200' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Bot className="h-4 w-4 text-purple-600" />
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

      {/* Quick Questions */}
      {messages.length === 1 && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-1 mb-2">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            <span className="text-xs text-gray-600">Quick questions:</span>
          </div>
          <div className="space-y-2">
            {quickQuestions.slice(0, 3).map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                className="w-full text-left text-xs p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about crops, weather, prices..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white p-2 rounded-lg transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;