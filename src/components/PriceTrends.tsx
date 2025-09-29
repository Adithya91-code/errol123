import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';

interface PriceData {
  crop: string;
  currentPrice: number;
  previousPrice: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
  market: string;
}

const PriceTrends: React.FC = () => {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPriceData();
  }, []);

  const fetchPriceData = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const crops = ['Rice', 'Wheat', 'Tomato', 'Onion', 'Potato', 'Apple', 'Banana', 'Cotton'];
    const markets = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai'];
    
    const mockPriceData: PriceData[] = crops.map(crop => {
      const currentPrice = Math.floor(Math.random() * 50) + 20;
      const changePercent = (Math.random() - 0.5) * 20; // -10% to +10%
      const previousPrice = currentPrice / (1 + changePercent / 100);
      const change = currentPrice - previousPrice;
      
      return {
        crop,
        currentPrice,
        previousPrice,
        change: Math.round(change * 100) / 100,
        changePercent: Math.round(changePercent * 100) / 100,
        trend: changePercent > 2 ? 'up' : changePercent < -2 ? 'down' : 'stable',
        market: markets[Math.floor(Math.random() * markets.length)]
      };
    });
    
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
      case 'up': return 'text-green-600 bg-green-100';
      case 'down': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <DollarSign className="h-6 w-6 text-green-600" />
        <h2 className="text-xl font-bold text-gray-800">Market Price Trends</h2>
      </div>

      <div className="space-y-3">
        {priceData.slice(0, 6).map((item, index) => {
          const TrendIcon = getTrendIcon(item.trend);
          
          return (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-gray-800">{item.crop}</span>
                    <span className="text-xs text-gray-500">({item.market})</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">
                    ₹{item.currentPrice}/kg
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium ${getTrendColor(item.trend)}`}>
                    <TrendIcon className="h-4 w-4" />
                    <span>{item.changePercent > 0 ? '+' : ''}{item.changePercent}%</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {item.change > 0 ? '+' : ''}₹{item.change}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={fetchPriceData}
          className="text-sm text-green-600 hover:text-green-700 font-medium"
        >
          Refresh Price Data
        </button>
      </div>
    </div>
  );
};

export default PriceTrends;