import React, { useState } from 'react';
import { X, Brain, Upload, Loader, CheckCircle, AlertTriangle, Info, Camera } from 'lucide-react';
import { Crop } from '../types';

interface AIAnalysisProps {
  crop?: Crop | null;
  onClose: () => void;
}

interface AnalysisResult {
  overallCondition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  freshness: number;
  ripeness: number;
  shelfLife: number;
  confidence: number;
  detectedIssues: string[];
  recommendations: string[];
}

const AIAnalysis: React.FC<AIAnalysisProps> = ({ crop, onClose }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [cropType, setCropType] = useState('Apple');

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
    
    // Generate mock AI analysis results based on crop type
    const mockResult: AnalysisResult = {
      overallCondition: ['Excellent', 'Good', 'Fair'][Math.floor(Math.random() * 3)] as any,
      freshness: Math.floor(Math.random() * 30) + 70, // 70-100
      ripeness: Math.floor(Math.random() * 30) + 70, // 70-100
      shelfLife: Math.floor(Math.random() * 10) + 3, // 3-12 days
      confidence: Math.floor(Math.random() * 20) + 80, // 80-100
      detectedIssues: Math.random() > 0.7 ? ['Very minor blemishes', 'Slight overripening'] : [],
      recommendations: [
        'Good for immediate sale or processing',
        'Monitor closely for deterioration',
        'Consider 10-15% price reduction',
        'Best used within 2-3 days'
      ],
    };
    
    setAnalysisResult(mockResult);
    setAnalyzing(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excellent': return 'text-green-600 bg-green-100';
      case 'Good': return 'text-blue-600 bg-blue-100';
      case 'Fair': return 'text-yellow-600 bg-yellow-100';
      case 'Poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const cropTypes = ['Apple', 'Banana', 'Orange', 'Tomato', 'Potato', 'Onion', 'Carrot', 'Wheat', 'Rice'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">AI Crop Condition Analysis</h2>
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

          {/* Crop Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Crop Type
            </label>
            <select
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {cropTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
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
                  <Camera className="h-12 w-12 text-gray-400 mx-auto" />
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
                  <p className="text-xs text-gray-500">Upload a clear image of your crop for analysis</p>
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
                  <span>Analyze Condition</span>
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

                {/* Overall Condition */}
                <div className="mb-6 text-center">
                  <div className="mb-4">
                    <span className={`inline-block px-4 py-2 rounded-full text-lg font-bold ${getConditionColor(analysisResult.overallCondition)}`}>
                      {analysisResult.overallCondition}
                    </span>
                  </div>
                  <p className="text-gray-600">Overall Condition Assessment</p>
                </div>

                {/* Detailed Scores */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Freshness</h4>
                    <div className={`text-3xl font-bold ${getScoreColor(analysisResult.freshness)}`}>
                      {analysisResult.freshness}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className={`h-2 rounded-full ${
                          analysisResult.freshness >= 90 ? 'bg-green-500' :
                          analysisResult.freshness >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${analysisResult.freshness}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Ripeness</h4>
                    <div className={`text-3xl font-bold ${getScoreColor(analysisResult.ripeness)}`}>
                      {analysisResult.ripeness}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className={`h-2 rounded-full ${
                          analysisResult.ripeness >= 90 ? 'bg-green-500' :
                          analysisResult.ripeness >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${analysisResult.ripeness}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4 md:col-span-2">
                    <h4 className="font-semibold text-gray-700 mb-2">Shelf Life & Confidence</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-2xl font-bold text-orange-600">{analysisResult.shelfLife} days</p>
                        <p className="text-sm text-gray-600">Estimated shelf life</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-600">{analysisResult.confidence}%</p>
                        <p className="text-sm text-gray-600">Analysis confidence</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detected Issues */}
                {analysisResult.detectedIssues.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-yellow-800 mb-2 flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5" />
                      <span>Detected Issues</span>
                    </h4>
                    <div className="space-y-2">
                      {analysisResult.detectedIssues.map((issue, index) => (
                        <p key={index} className="text-yellow-700">• {issue}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-blue-800 mb-3">Recommendations</h4>
                  <ul className="space-y-2">
                    {analysisResult.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-blue-700">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Analysis Summary */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Analysis Summary</h4>
                  <p className="text-sm text-gray-700">
                    Based on the uploaded image, your {cropType.toLowerCase()} shows {analysisResult.overallCondition.toLowerCase()} condition 
                    with {analysisResult.freshness}% freshness and {analysisResult.ripeness}% ripeness. 
                    The estimated shelf life is {analysisResult.shelfLife} days.
                  </p>
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
                  a.download = `crop-analysis-${cropType}-${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Download Report
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysis;