import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

interface WeatherData {
  region: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: 'sunny' | 'cloudy' | 'rainy';
  forecast: {
    day: string;
    high: number;
    low: number;
    condition: string;
  }[];
}

const CompactWeatherWidget: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [selectedRegion, setSelectedRegion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    setLoading(true);
    
    // Simulate API call with mock data for different regions
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockWeatherData: WeatherData[] = [
      {
        region: 'North India',
        temperature: 28,
        humidity: 65,
        windSpeed: 12,
        condition: 'sunny',
        forecast: [
          { day: 'Today', high: 28, low: 18, condition: 'Sunny' },
          { day: 'Tomorrow', high: 26, low: 16, condition: 'Cloudy' },
          { day: 'Wed', high: 24, low: 15, condition: 'Rainy' }
        ]
      },
      {
        region: 'South India',
        temperature: 32,
        humidity: 78,
        windSpeed: 8,
        condition: 'cloudy',
        forecast: [
          { day: 'Today', high: 32, low: 24, condition: 'Cloudy' },
          { day: 'Tomorrow', high: 30, low: 22, condition: 'Rainy' },
          { day: 'Wed', high: 29, low: 21, condition: 'Sunny' }
        ]
      },
      {
        region: 'West India',
        temperature: 35,
        humidity: 45,
        windSpeed: 15,
        condition: 'sunny',
        forecast: [
          { day: 'Today', high: 35, low: 25, condition: 'Sunny' },
          { day: 'Tomorrow', high: 36, low: 26, condition: 'Sunny' },
          { day: 'Wed', high: 34, low: 24, condition: 'Cloudy' }
        ]
      },
      {
        region: 'East India',
        temperature: 29,
        humidity: 82,
        windSpeed: 10,
        condition: 'rainy',
        forecast: [
          { day: 'Today', high: 29, low: 22, condition: 'Rainy' },
          { day: 'Tomorrow', high: 27, low: 20, condition: 'Rainy' },
          { day: 'Wed', high: 28, low: 21, condition: 'Cloudy' }
        ]
      }
    ];
    
    setWeatherData(mockWeatherData);
    setLoading(false);
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny': return Sun;
      case 'cloudy': return Cloud;
      case 'rainy': return CloudRain;
      default: return Cloud;
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny': return 'text-yellow-600';
      case 'cloudy': return 'text-gray-600';
      case 'rainy': return 'text-blue-600';
      default: return 'text-gray-600';
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

  const currentWeather = weatherData[selectedRegion];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Cloud className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-bold text-gray-800">Weather</h2>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {currentWeather && (
        <>
          {/* Compact View */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={getConditionColor(currentWeather.condition)}>
                {React.createElement(getWeatherIcon(currentWeather.condition), { className: 'h-8 w-8' })}
              </div>
              <div>
                <div className="text-xl font-bold text-gray-800">{currentWeather.temperature}°C</div>
                <div className="text-xs text-gray-600">{currentWeather.region}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">{currentWeather.humidity}% humidity</div>
              <div className="text-xs text-gray-500">{currentWeather.windSpeed} km/h wind</div>
            </div>
          </div>

          {/* Expanded View */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              {/* Region Selector */}
              <div className="mb-4">
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(Number(e.target.value))}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {weatherData.map((weather, index) => (
                    <option key={index} value={index}>{weather.region}</option>
                  ))}
                </select>
              </div>

              {/* 3-Day Forecast */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-800">3-Day Forecast</h4>
                {currentWeather.forecast.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                    <span className="font-medium text-gray-800">{day.day}</span>
                    <div className="flex items-center space-x-2">
                      <div className={getConditionColor(day.condition)}>
                        {React.createElement(getWeatherIcon(day.condition), { className: 'h-3 w-3' })}
                      </div>
                      <span className="text-gray-600">{day.high}°/{day.low}°</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Farming Tips */}
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                <h4 className="text-sm font-semibold text-green-800 mb-1">Quick Tips</h4>
                <ul className="text-xs text-green-700 space-y-1">
                  {currentWeather.condition === 'sunny' && (
                    <>
                      <li>• Good for harvesting</li>
                      <li>• Increase irrigation</li>
                    </>
                  )}
                  {currentWeather.condition === 'rainy' && (
                    <>
                      <li>• Good for rice crops</li>
                      <li>• Check drainage</li>
                    </>
                  )}
                  {currentWeather.condition === 'cloudy' && (
                    <>
                      <li>• Ideal for transplanting</li>
                      <li>• Monitor pests</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CompactWeatherWidget;