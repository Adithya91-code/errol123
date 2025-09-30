import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, Eye, AlertCircle } from 'lucide-react';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy';
  visibility: number;
  uvIndex: number;
  forecast: {
    day: string;
    high: number;
    low: number;
    condition: string;
    rainChance: number;
  }[];
}

interface WeatherAlert {
  type: 'warning' | 'advisory' | 'watch';
  title: string;
  description: string;
  impact: string;
}

const AIWeatherIntegration: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockWeatherData: WeatherData = {
      temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
      humidity: Math.floor(Math.random() * 30) + 50, // 50-80%
      windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
      condition: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)] as any,
      visibility: Math.floor(Math.random() * 5) + 8, // 8-12 km
      uvIndex: Math.floor(Math.random() * 8) + 3, // 3-10
      forecast: [
        { day: 'Today', high: 28, low: 18, condition: 'Sunny', rainChance: 10 },
        { day: 'Tomorrow', high: 26, low: 16, condition: 'Partly Cloudy', rainChance: 30 },
        { day: 'Wed', high: 24, low: 15, condition: 'Rainy', rainChance: 80 },
        { day: 'Thu', high: 27, low: 17, condition: 'Sunny', rainChance: 5 },
        { day: 'Fri', high: 29, low: 19, condition: 'Sunny', rainChance: 15 }
      ]
    };

    const mockAlerts: WeatherAlert[] = [
      {
        type: 'warning',
        title: 'Heavy Rain Expected',
        description: 'Significant rainfall expected Wednesday afternoon',
        impact: 'May affect outdoor farming activities and irrigation schedules'
      }
    ];

    setWeatherData(mockWeatherData);
    setWeatherAlerts(mockAlerts);
    setLoading(false);
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny': return Sun;
      case 'cloudy': case 'partly cloudy': return Cloud;
      case 'rainy': return CloudRain;
      default: return Cloud;
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny': return 'text-yellow-600';
      case 'cloudy': case 'partly cloudy': return 'text-gray-600';
      case 'rainy': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return 'border-red-200 bg-red-50 text-red-800';
      case 'advisory': return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'watch': return 'border-blue-200 bg-blue-50 text-blue-800';
      default: return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!weatherData) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Cloud className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">Weather & AI Recommendations</h2>
      </div>

      {/* Current Weather */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className={`flex justify-center mb-2 ${getConditionColor(weatherData.condition)}`}>
            {React.createElement(getWeatherIcon(weatherData.condition), { className: 'h-8 w-8' })}
          </div>
          <div className="text-2xl font-bold text-gray-800">{weatherData.temperature}°C</div>
          <div className="text-sm text-gray-600 capitalize">{weatherData.condition}</div>
        </div>

        <div className="flex items-center space-x-2">
          <Droplets className="h-5 w-5 text-blue-500" />
          <div>
            <div className="font-semibold text-gray-800">{weatherData.humidity}%</div>
            <div className="text-sm text-gray-600">Humidity</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Wind className="h-5 w-5 text-gray-500" />
          <div>
            <div className="font-semibold text-gray-800">{weatherData.windSpeed} km/h</div>
            <div className="text-sm text-gray-600">Wind Speed</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Eye className="h-5 w-5 text-purple-500" />
          <div>
            <div className="font-semibold text-gray-800">{weatherData.visibility} km</div>
            <div className="text-sm text-gray-600">Visibility</div>
          </div>
        </div>
      </div>

      {/* Weather Alerts */}
      {weatherAlerts.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Weather Alerts</h3>
          {weatherAlerts.map((alert, index) => (
            <div key={index} className={`border rounded-lg p-4 ${getAlertColor(alert.type)}`}>
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="h-5 w-5" />
                <h4 className="font-semibold">{alert.title}</h4>
              </div>
              <p className="text-sm mb-2">{alert.description}</p>
              <p className="text-xs opacity-75">{alert.impact}</p>
            </div>
          ))}
        </div>
      )}

      {/* 5-Day Forecast */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">5-Day Forecast</h3>
        <div className="grid grid-cols-5 gap-2">
          {weatherData.forecast.map((day, index) => (
            <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-800 mb-1">{day.day}</div>
              <div className={`mb-2 ${getConditionColor(day.condition)}`}>
                {React.createElement(getWeatherIcon(day.condition), { className: 'h-6 w-6 mx-auto' })}
              </div>
              <div className="text-xs text-gray-600 mb-1">
                <span className="font-semibold">{day.high}°</span>/{day.low}°
              </div>
              <div className="text-xs text-blue-600">{day.rainChance}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Farming Recommendations */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-800 mb-3">AI Farming Recommendations</h3>
        <ul className="space-y-2 text-sm text-green-700">
          <li className="flex items-start space-x-2">
            <span className="text-green-600 mt-1">•</span>
            <span>Current humidity levels are optimal for most crops. Continue regular watering schedule.</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-600 mt-1">•</span>
            <span>Heavy rain expected Wednesday - consider covering sensitive crops and adjusting irrigation.</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-600 mt-1">•</span>
            <span>UV index is moderate - good conditions for outdoor farming activities.</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-600 mt-1">•</span>
            <span>Wind conditions are favorable for natural pollination of flowering crops.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AIWeatherIntegration;