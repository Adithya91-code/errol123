import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';

interface PriceData {
  crop: string;
  currentPrice: number;
  previousPrice: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
  forecast: 'bullish' | 'bearish' | 'neutral';
}

const CompactPriceTrends: React.FC = () => {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('weekly');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetchPriceData();
  }, [selectedTimeframe]);

  const fetchPriceData = async () => {
    setLoading(true);
    
    // Simulate API call with mock price data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockPriceData: PriceData[] = [
      {
        crop: 'Wheat',
        currentPrice: 2850,
        previousPrice: 2750,
        change: 100,
        changePercent: 3.6,
        trend: 'up',
        forecast: 'bullish'
      },
      {
        crop: 'Rice',
        currentPrice: 3200,
        previousPrice: 3350,
        change: -150,
        changePercent: -4.5,
        trend: 'down',
        forecast: 'bearish'
      },
      {
        crop: 'Tomato',
        currentPrice: 45,
        previousPrice: 38,
        change: 7,
        changePercent: 18.4,
        trend: 'up',
        forecast: 'bullish'
      },
      {
        crop: 'Onion',
        currentPrice: 28,
        previousPrice: 32,
        change: -4,
        changePercent: -12.5,
        trend: 'down',
        forecast: 'neutral'
      },
      {
        crop: 'Potato',
        currentPrice: 22,
        previousPrice: 22,
        change: 0,
        changePercent: 0,
        trend: 'stable',
        forecast: 'neutral'
      }
    ];
    
    setPriceData(mockPriceData);
    setLoading(false);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return BarChart3;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getForecastColor = (forecast: string) => {
    switch (forecast) {
      case 'bullish': return 'bg-green-100 text-green-800';
      case 'bearish': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  const topCrops = priceData.slice(0, 3);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          <h2 className="text-lg font-bold text-gray-800">Price Trends</h2>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Compact View - Top 3 crops */}
      <div className="space-y-2">
        {topCrops.map((item, index) => {
          const TrendIcon = getTrendIcon(item.trend);
          
          return (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-800">{item.crop}</span>
                <span className={`px-1 py-0.5 rounded text-xs font-medium ${getForecastColor(item.forecast)}`}>
                  {item.forecast}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-gray-800">
                  ₹{item.currentPrice}
                </span>
                <div className={`flex items-center space-x-1 ${getTrendColor(item.trend)}`}>
                  <TrendIcon className="h-3 w-3" />
                  <span className="text-xs">
                    {item.changePercent > 0 ? '+' : ''}{item.changePercent}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded View */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          {/* Timeframe Selector */}
          <div className="mb-4">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="w-full text-sm px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          {/* All Crops */}
          <div className="space-y-2">
            {priceData.slice(3).map((item, index) => {
              const TrendIcon = getTrendIcon(item.trend);
              
              return (
                <div key={index} className="p-2 border border-gray-200 rounded">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-semibold text-gray-800">{item.crop}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getForecastColor(item.forecast)}`}>
                      {item.forecast}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-gray-800">
                        ₹{item.currentPrice}
                        <span className="text-xs text-gray-500 font-normal ml-1">
                          {item.crop === 'Wheat' || item.crop === 'Rice' ? '/quintal' : '/kg'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Previous: ₹{item.previousPrice}
                      </div>
                    </div>
                    
                    <div className={`flex items-center space-x-1 ${getTrendColor(item.trend)}`}>
                      <TrendIcon className="h-3 w-3" />
                      <span className="text-xs font-medium">
                        {item.change > 0 ? '+' : ''}{item.change}
                      </span>
                      <span className="text-xs">
                        ({item.changePercent > 0 ? '+' : ''}{item.changePercent}%)
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Market Insights */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">Market Insights</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Tomato prices surging due to seasonal demand</li>
              <li>• Wheat showing strong upward momentum</li>
              <li>• Good time to sell high-value crops</li>
            </ul>
          </div>

          <div className="mt-3 text-xs text-gray-500 text-center">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompactPriceTrends;