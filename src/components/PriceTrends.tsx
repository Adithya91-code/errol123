import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';

interface PriceData {
  crop: string;
  currentPrice: number;
  previousPrice: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
  forecast: 'bullish' | 'bearish' | 'neutral';
}

const PriceTrends: React.FC = () => {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('weekly');

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
      },
      {
        crop: 'Sugarcane',
        currentPrice: 350,
        previousPrice: 340,
        change: 10,
        changePercent: 2.9,
        trend: 'up',
        forecast: 'bullish'
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
      <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-6 w-6 text-green-600" />
          <h2 className="text-xl font-bold text-gray-800">Price Trends</h2>
        </div>
        <select
          value={selectedTimeframe}
          onChange={(e) => setSelectedTimeframe(e.target.value)}
          className="text-sm px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <div className="space-y-3">
        {priceData.map((item, index) => {
          const TrendIcon = getTrendIcon(item.trend);
          
          return (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800">{item.crop}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getForecastColor(item.forecast)}`}>
                  {item.forecast}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-gray-800">
                    ₹{item.currentPrice}
                    <span className="text-sm text-gray-500 font-normal">
                      {item.crop === 'Wheat' || item.crop === 'Rice' || item.crop === 'Sugarcane' ? '/quintal' : '/kg'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Previous: ₹{item.previousPrice}
                  </div>
                </div>
                
                <div className={`flex items-center space-x-1 ${getTrendColor(item.trend)}`}>
                  <TrendIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">
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

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Market Insights</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Tomato prices surging due to seasonal demand</li>
          <li>• Wheat showing strong upward momentum</li>
          <li>• Rice prices may stabilize next week</li>
          <li>• Good time to sell high-value crops</li>
        </ul>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default PriceTrends;