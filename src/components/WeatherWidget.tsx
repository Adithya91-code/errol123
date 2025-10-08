import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, MapPin } from 'lucide-react';

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

const WeatherWidget: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [selectedRegion, setSelectedRegion] = useState(0);
  const [loading, setLoading] = useState(true);

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
      <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  const currentWeather = weatherData[selectedRegion];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Cloud className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">Regional Weather</h2>
      </div>

      {/* Region Selector */}
      <div className="mb-4">
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {weatherData.map((weather, index) => (
            <option key={index} value={index}>{weather.region}</option>
          ))}
        </select>
      </div>

      {currentWeather && (
        <>
          {/* Current Weather */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">{currentWeather.region}</span>
            </div>
            <div className={`flex justify-center mb-2 ${getConditionColor(currentWeather.condition)}`}>
              {React.createElement(getWeatherIcon(currentWeather.condition), { className: 'h-12 w-12' })}
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">{currentWeather.temperature}°C</div>
            <div className="text-sm text-gray-600 capitalize">{currentWeather.condition}</div>
          </div>

          {/* Weather Details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-sm font-semibold text-gray-800">{currentWeather.humidity}%</div>
                <div className="text-xs text-gray-600">Humidity</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Wind className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm font-semibold text-gray-800">{currentWeather.windSpeed} km/h</div>
                <div className="text-xs text-gray-600">Wind</div>
              </div>
            </div>
          </div>

          {/* 3-Day Forecast */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">3-Day Forecast</h3>
            <div className="space-y-2">
              {currentWeather.forecast.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-800">{day.day}</span>
                  <div className="flex items-center space-x-2">
                    <div className={getConditionColor(day.condition)}>
                      {React.createElement(getWeatherIcon(day.condition), { className: 'h-4 w-4' })}
                    </div>
                    <span className="text-sm text-gray-600">
                      {day.high}°/{day.low}°
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Farming Recommendations */}
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Farming Tips</h4>
            <ul className="text-sm text-green-700 space-y-1">
              {currentWeather.condition === 'sunny' && (
                <>
                  <li>• Perfect weather for harvesting</li>
                  <li>• Increase irrigation for sensitive crops</li>
                </>
              )}
              {currentWeather.condition === 'rainy' && (
                <>
                  <li>• Good for rice and water-loving crops</li>
                  <li>• Check drainage systems</li>
                </>
              )}
              {currentWeather.condition === 'cloudy' && (
                <>
                  <li>• Ideal for transplanting seedlings</li>
                  <li>• Monitor for pest activity</li>
                </>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherWidget;