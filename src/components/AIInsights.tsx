import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, BarChart3, Leaf } from 'lucide-react';
import { Crop } from '../types';
import { storage } from '../lib/storage';
import { useAuth } from '../hooks/useAuth';

interface AIInsight {
  id: string;
  type: 'recommendation' | 'alert' | 'prediction' | 'optimization';
  title: string;
  description: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high';
  cropId?: string;
  actionable: boolean;
}

const AIInsights: React.FC = () => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    generateAIInsights();
  }, [user]);

  const generateAIInsights = async () => {
    setLoading(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const userCrops = user ? storage.getCrops(user.id) : [];
    
    const mockInsights: AIInsight[] = [
      {
        id: '1',
        type: 'alert',
        title: 'Disease Risk Detected',
        description: 'Weather conditions favor fungal diseases. Consider preventive treatment for tomato crops.',
        confidence: 87,
        priority: 'high',
        actionable: true
      },
      {
        id: '2',
        type: 'recommendation',
        title: 'Optimal Harvest Window',
        description: 'Market analysis suggests harvesting wheat crops in the next 5-7 days for maximum profit.',
        confidence: 92,
        priority: 'medium',
        actionable: true
      },
      {
        id: '3',
        type: 'prediction',
        title: 'Price Forecast',
        description: 'Vegetable prices expected to rise by 15% in the next month due to seasonal demand.',
        confidence: 78,
        priority: 'medium',
        actionable: false
      },
      {
        id: '4',
        type: 'optimization',
        title: 'Water Usage Optimization',
        description: 'Reduce irrigation by 20% for corn crops based on soil moisture analysis.',
        confidence: 85,
        priority: 'low',
        actionable: true
      },
      {
        id: '5',
        type: 'recommendation',
        title: 'Companion Planting Suggestion',
        description: 'Plant basil near tomatoes to improve growth and natural pest control.',
        confidence: 73,
        priority: 'low',
        actionable: true
      }
    ];
    
    setInsights(mockInsights);
    setLoading(false);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'alert': return AlertTriangle;
      case 'recommendation': return Lightbulb;
      case 'prediction': return TrendingUp;
      case 'optimization': return BarChart3;
      default: return Brain;
    }
  };

  const getInsightColor = (type: string, priority: string) => {
    if (priority === 'high') return 'border-red-200 bg-red-50';
    if (priority === 'medium') return 'border-yellow-200 bg-yellow-50';
    return 'border-blue-200 bg-blue-50';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="h-6 w-6 text-purple-600 animate-pulse" />
          <h2 className="text-xl font-bold text-gray-800">AI Insights</h2>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-800">AI Insights</h2>
        </div>
        <button
          onClick={generateAIInsights}
          className="text-sm text-purple-600 hover:text-purple-700 font-medium"
        >
          Refresh Insights
        </button>
      </div>

      <div className="space-y-4">
        {insights.map((insight) => {
          const IconComponent = getInsightIcon(insight.type);
          
          return (
            <div
              key={insight.id}
              className={`border rounded-lg p-4 ${getInsightColor(insight.type, insight.priority)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <IconComponent className="h-5 w-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-800">{insight.title}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(insight.priority)}`}>
                    {insight.priority.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">
                    {insight.confidence}% confidence
                  </span>
                </div>
              </div>
              
              <p className="text-gray-700 text-sm mb-3">{insight.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 capitalize">
                    {insight.type}
                  </span>
                  {insight.actionable && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Actionable
                    </span>
                  )}
                </div>
                
                {insight.actionable && (
                  <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                    Take Action
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Powered by FarmChainX AI</span>
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;