import React, { useState } from 'react';
import { X, Brain, Camera, Upload, Loader, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Crop } from '../types';

interface AIAnalysisProps {
  crop?: Crop | null;
  onClose: () => void;
}

interface AnalysisResult {
  healthScore: number;
  diseaseDetection: {
    detected: boolean;
    diseases: string[];
    confidence: number;
  };
  recommendations: string[];
  marketPrediction: {
    expectedPrice: number;
    demandLevel: 'Low' | 'Medium' | 'High';
    bestHarvestTime: string;
  };
  environmentalFactors: {
    soilHealth: number;
    weatherImpact: string;
    pestRisk: 'Low' | 'Medium' | 'High';
  };
}

const AIAnalysis: React.FC<AIAnalysisProps> = ({ crop, onClose }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisType, setAnalysisType] = useState<'disease' | 'health' | 'market'>('disease');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateAIAnalysis = async () => {
    setAnalyzing(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate mock AI analysis results
    const mockResult: AnalysisResult = {
      healthScore: Math.floor(Math.random() * 30) + 70, // 70-100
      diseaseDetection: {
        detected: Math.random() > 0.7,
        diseases: Math.random() > 0.7 ? ['Leaf Blight', 'Powdery Mildew'] : [],
        confidence: Math.floor(Math.random() * 20) + 80 // 80-100
      },
      recommendations: [
        'Increase watering frequency by 20%',
        'Apply organic fertilizer rich in nitrogen',
        'Monitor for pest activity in the next 7 days',
        'Consider companion planting with marigolds',
        'Harvest within 2-3 weeks for optimal quality'
      ],
      marketPrediction: {
        expectedPrice: Math.floor(Math.random() * 50) + 25, // $25-75 per kg
        demandLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)] as 'Low' | 'Medium' | 'High',
        bestHarvestTime: 'Next 2-3 weeks'
      },
      environmentalFactors: {
        soilHealth: Math.floor(Math.random() * 30) + 70, // 70-100
        weatherImpact: 'Favorable conditions expected',
        pestRisk: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)] as 'Low' | 'Medium' | 'High'
      }
    };
    
    setAnalysisResult(mockResult);
    setAnalyzing(false);
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDemandLevelColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskLevelColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">AI Crop Analysis</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {crop && (
            <div className="mb-6 p-4 bg-orange-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Analyzing Crop: {crop.name}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <p><strong>Type:</strong> {crop.crop_type}</p>
                <p><strong>Soil:</strong> {crop.soil_type}</p>
                <p><strong>Harvest Date:</strong> {new Date(crop.harvest_date).toLocaleDateString()}</p>
                <p><strong>Expiry Date:</strong> {new Date(crop.expiry_date).toLocaleDateString()}</p>
              </div>
            </div>
          )}

          {/* Analysis Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Analysis Type
            </label>
            <div className="flex space-x-4">
              {[
                { value: 'disease', label: 'Disease Detection', icon: AlertTriangle },
                { value: 'health', label: 'Health Assessment', icon: CheckCircle },
                { value: 'market', label: 'Market Analysis', icon: Info }
              ].map(({ value, label, icon: Icon }) => (
                <label
                  key={value}
                  className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-all ${
                    analysisType === value
                      ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-500 ring-opacity-20'
                      : 'border-gray-300 hover:border-purple-300'
                  }`}
                >
                  <input
                    type="radio"
                    value={value}
                    checked={analysisType === value}
                    onChange={(e) => setAnalysisType(e.target.value as any)}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <Icon className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-gray-800">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Crop Image for Analysis
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {imagePreview ? (
                <div className="space-y-4">
                  <img
                    src={imagePreview}
                    alt="Crop for analysis"
                    className="w-full h-48 object-cover rounded-lg mx-auto"
                  />
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview('');
                    }}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                  <div>
                    <label className="cursor-pointer">
                      <span className="text-purple-600 hover:text-purple-700 font-medium">
                        Click to upload
                      </span>
                      <span className="text-gray-600"> or drag and drop</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Analyze Button */}
          <div className="mb-6">
            <button
              onClick={simulateAIAnalysis}
              disabled={analyzing || (!selectedImage && !crop?.image_url)}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {analyzing ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  <span>Analyzing with AI...</span>
                </>
              ) : (
                <>
                  <Brain className="h-5 w-5" />
                  <span>Start AI Analysis</span>
                </>
              )}
            </button>
          </div>

          {/* Analysis Results */}
          {analysisResult && (
            <div className="space-y-6">
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Analysis Complete</span>
                </h3>

                {/* Health Score */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Health Score</h4>
                    <div className={`text-3xl font-bold ${getHealthScoreColor(analysisResult.healthScore)}`}>
                      {analysisResult.healthScore}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className={`h-2 rounded-full ${
                          analysisResult.healthScore >= 90 ? 'bg-green-500' :
                          analysisResult.healthScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${analysisResult.healthScore}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Soil Health</h4>
                    <div className={`text-3xl font-bold ${getHealthScoreColor(analysisResult.environmentalFactors.soilHealth)}`}>
                      {analysisResult.environmentalFactors.soilHealth}%
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{analysisResult.environmentalFactors.weatherImpact}</p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Market Demand</h4>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getDemandLevelColor(analysisResult.marketPrediction.demandLevel)}`}>
                      {analysisResult.marketPrediction.demandLevel}
                    </span>
                    <p className="text-lg font-bold text-gray-800 mt-2">
                      ${analysisResult.marketPrediction.expectedPrice}/kg
                    </p>
                  </div>
                </div>

                {/* Disease Detection */}
                {analysisResult.diseaseDetection.detected && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-red-800 mb-2 flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5" />
                      <span>Disease Detection Alert</span>
                    </h4>
                    <div className="space-y-2">
                      {analysisResult.diseaseDetection.diseases.map((disease, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-red-700 font-medium">{disease}</span>
                          <span className="text-sm text-red-600">
                            {analysisResult.diseaseDetection.confidence}% confidence
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-blue-800 mb-3">AI Recommendations</h4>
                  <ul className="space-y-2">
                    {analysisResult.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-blue-700">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Environmental Factors */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-3">Environmental Assessment</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-green-700 mb-1">Pest Risk Level</p>
                      <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${getRiskLevelColor(analysisResult.environmentalFactors.pestRisk)}`}>
                        {analysisResult.environmentalFactors.pestRisk}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-green-700 mb-1">Best Harvest Time</p>
                      <p className="font-medium text-green-800">{analysisResult.marketPrediction.bestHarvestTime}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            {analysisResult && (
              <button
                onClick={() => {
                  const analysisData = JSON.stringify(analysisResult, null, 2);
                  const blob = new Blob([analysisData], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `ai-analysis-${crop?.name || 'crop'}-${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Export Report
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysis;