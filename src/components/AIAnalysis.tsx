import React, { useState } from 'react';
import { X, Brain, Upload, Loader, CheckCircle, AlertTriangle } from 'lucide-react';
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
  const [imagePreview, setImagePreview] = useState<string>(crop?.image_url || '');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [cropType, setCropType] = useState(crop?.crop_type || 'Apple');

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

  const analyzeCondition = async () => {
    if (!imagePreview) return;
    
    setAnalyzing(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate realistic analysis results
    const conditions: AnalysisResult['overallCondition'][] = ['Excellent', 'Good', 'Fair', 'Poor'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    
    const mockResult: AnalysisResult = {
      overallCondition: randomCondition,
      freshness: Math.floor(Math.random() * 30) + 70, // 70-100%
      ripeness: Math.floor(Math.random() * 30) + 70, // 70-100%
      shelfLife: Math.floor(Math.random() * 10) + 3, // 3-12 days
      confidence: Math.floor(Math.random() * 20) + 80, // 80-100%
      detectedIssues: randomCondition === 'Poor' ? ['Minor blemishes', 'Slight discoloration'] : 
                     randomCondition === 'Fair' ? ['Very minor blemishes'] : [],
      recommendations: [
        'Good for immediate sale or processing',
        'Monitor closely for deterioration',
        'Consider 10-15% price reduction',
        'Best used within 2-3 days'
      ]
    };
    
    setAnalysisResult(mockResult);
    setAnalyzing(false);
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Upload and Controls */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Upload className="inline h-4 w-4 mr-1" />
                  Upload Crop Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img
                        src={imagePreview}
                        alt="Crop for analysis"
                        className="w-full h-64 object-cover rounded-lg mx-auto"
                      />
                      <button
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview('');
                          setAnalysisResult(null);
                        }}
                        className="text-sm text-purple-600 hover:text-purple-700"
                      >
                        Change Image
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Crop Type
                </label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Apple">Apple</option>
                  <option value="Banana">Banana</option>
                  <option value="Orange">Orange</option>
                  <option value="Tomato">Tomato</option>
                  <option value="Potato">Potato</option>
                  <option value="Carrot">Carrot</option>
                  <option value="Lettuce">Lettuce</option>
                  <option value="Corn">Corn</option>
                </select>
              </div>

              <button
                onClick={analyzeCondition}
                disabled={analyzing || !imagePreview}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {analyzing ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>Analyzing Condition...</span>
                  </>
                ) : (
                  <>
                    <Brain className="h-5 w-5" />
                    <span>Analyze Condition</span>
                  </>
                )}
              </button>
            </div>

            {/* Right Side - Analysis Results */}
            <div className="space-y-6">
              {analysisResult ? (
                <>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Analysis Results</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Overall Condition</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConditionColor(analysisResult.overallCondition)}`}>
                          {analysisResult.overallCondition}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-gray-600">Freshness</span>
                          <div className="text-2xl font-bold text-green-600">{analysisResult.freshness}%</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Ripeness</span>
                          <div className="text-2xl font-bold text-blue-600">{analysisResult.ripeness}%</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Shelf Life</span>
                          <div className="text-2xl font-bold text-orange-600">{analysisResult.shelfLife} days</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Confidence</span>
                          <div className="text-2xl font-bold text-purple-600">{analysisResult.confidence}%</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {analysisResult.detectedIssues.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-semibold text-red-800 mb-2 flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5" />
                        <span>Detected Issues</span>
                      </h4>
                      <ul className="space-y-1">
                        {analysisResult.detectedIssues.map((issue, index) => (
                          <li key={index} className="text-red-700 text-sm">• {issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-3">Recommendations</h4>
                    <ul className="space-y-2">
                      {analysisResult.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-blue-700 text-sm">{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <div className="bg-gray-50 rounded-lg p-12 text-center">
                  <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Ready for Analysis</h3>
                  <p className="text-gray-500">Upload an image and click "Analyze Condition" to get AI-powered insights about your crop.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysis;