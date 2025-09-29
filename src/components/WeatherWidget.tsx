import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, MapPin } from 'lucide-react';

interface WeatherData {
  city: string;
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy';
  humidity: number;
  windSpeed: number;
}

const WeatherWidget: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockWeatherData: WeatherData[] = [
      {
        city: 'Mumbai',
        temperature: Math.floor(Math.random() * 10) + 25,
        condition: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)] as any,
        humidity: Math.floor(Math.random() * 30) + 60,
        windSpeed: Math.floor(Math.random() * 15) + 5
      },
      {
        city: 'Delhi',
        temperature: Math.floor(Math.random() * 10) + 22,
        condition: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)] as any,
        humidity: Math.floor(Math.random() * 30) + 50,
        windSpeed: Math.floor(Math.random() * 15) + 8
      },
      {
        city: 'Bangalore',
        temperature: Math.floor(Math.random() * 8) + 20,
        condition: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)] as any,
        humidity: Math.floor(Math.random() * 25) + 65,
        windSpeed: Math.floor(Math.random() * 12) + 6
      },
      {
        city: 'Chennai',
        temperature: Math.floor(Math.random() * 8) + 28,
        condition: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)] as any,
        humidity: Math.floor(Math.random() * 20) + 70,
        windSpeed: Math.floor(Math.random() * 18) + 7
      },
      {
        city: 'Kolkata',
        temperature: Math.floor(Math.random() * 9) + 24,
        condition: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)] as any,
        humidity: Math.floor(Math.random() * 25) + 65,
        windSpeed: Math.floor(Math.random() * 14) + 5
      }
    ];
    
    setWeatherData(mockWeatherData);
    setLoading(false);
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return Sun;
      case 'cloudy': return Cloud;
      case 'rainy': return CloudRain;
      default: return Cloud;
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
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
      <div className="flex items-center space-x-2 mb-6">
        <Cloud className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">Regional Weather</h2>
      </div>

      <div className="space-y-4">
        {weatherData.map((weather, index) => {
          const IconComponent = getWeatherIcon(weather.condition);
          
          return (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="font-semibold text-gray-800">{weather.city}</span>
                </div>
                <div className={`flex items-center space-x-1 ${getConditionColor(weather.condition)}`}>
                  <IconComponent className="h-5 w-5" />
                  <span className="text-2xl font-bold">{weather.temperature}°C</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span>{weather.humidity}% Humidity</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Wind className="h-4 w-4 text-gray-500" />
                  <span>{weather.windSpeed} km/h</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={fetchWeatherData}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Refresh Weather Data
        </button>
      </div>
    </div>
  );
};

export default WeatherWidget;