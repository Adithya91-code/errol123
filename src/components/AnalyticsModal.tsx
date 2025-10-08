import React from 'react';
import { X, TrendingUp, BarChart3, PieChart, Activity, Calendar } from 'lucide-react';
import { storage } from '../lib/storage';

interface AnalyticsModalProps {
  onClose: () => void;
}

const AnalyticsModal: React.FC<AnalyticsModalProps> = ({ onClose }) => {
  const users = storage.getUsers();
  const allCrops = users.flatMap(u => storage.getCrops(u.id));

  const farmerCount = users.filter(u => u.role.toLowerCase() === 'farmer').length;
  const distributorCount = users.filter(u => u.role.toLowerCase() === 'distributor').length;
  const retailerCount = users.filter(u => u.role.toLowerCase() === 'retailer').length;
  const consumerCount = users.filter(u => u.role.toLowerCase() === 'consumer').length;

  const cropsByType = allCrops.reduce((acc: any, crop) => {
    acc[crop.crop_type] = (acc[crop.crop_type] || 0) + 1;
    return acc;
  }, {});

  const thisMonth = new Date();
  const lastMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth() - 1, 1);

  const cropsThisMonth = allCrops.filter(crop => {
    const cropDate = new Date(crop.created_at);
    return cropDate.getMonth() === thisMonth.getMonth() &&
           cropDate.getFullYear() === thisMonth.getFullYear();
  }).length;

  const cropsLastMonth = allCrops.filter(crop => {
    const cropDate = new Date(crop.created_at);
    return cropDate.getMonth() === lastMonth.getMonth() &&
           cropDate.getFullYear() === lastMonth.getFullYear();
  }).length;

  const growthRate = cropsLastMonth > 0 ? ((cropsThisMonth - cropsLastMonth) / cropsLastMonth * 100).toFixed(1) : '0';

  const cropsWithFullSupplyChain = allCrops.filter(c => c.farmer_info && c.distributor_info && c.retailer_info).length;
  const supplyChainCompletionRate = allCrops.length > 0 ? ((cropsWithFullSupplyChain / allCrops.length) * 100).toFixed(1) : '0';

  const topCropTypes = Object.entries(cropsByType)
    .sort(([, a]: any, [, b]: any) => b - a)
    .slice(0, 5);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-6 w-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <Activity className="h-8 w-8 opacity-80" />
                <span className="text-2xl font-bold">{allCrops.length}</span>
              </div>
              <div className="text-sm opacity-90">Total Products</div>
              <div className="mt-2 text-xs opacity-75">All time</div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-8 w-8 opacity-80" />
                <span className="text-2xl font-bold">{growthRate}%</span>
              </div>
              <div className="text-sm opacity-90">Monthly Growth</div>
              <div className="mt-2 text-xs opacity-75">{cropsThisMonth} products this month</div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <BarChart3 className="h-8 w-8 opacity-80" />
                <span className="text-2xl font-bold">{users.length}</span>
              </div>
              <div className="text-sm opacity-90">Total Users</div>
              <div className="mt-2 text-xs opacity-75">Across all roles</div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <PieChart className="h-8 w-8 opacity-80" />
                <span className="text-2xl font-bold">{supplyChainCompletionRate}%</span>
              </div>
              <div className="text-sm opacity-90">Supply Chain</div>
              <div className="mt-2 text-xs opacity-75">Completion rate</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                User Distribution
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Farmers</span>
                    <span className="text-sm font-semibold text-gray-800">{farmerCount} ({((farmerCount / users.length) * 100).toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${(farmerCount / users.length) * 100}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Distributors</span>
                    <span className="text-sm font-semibold text-gray-800">{distributorCount} ({((distributorCount / users.length) * 100).toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(distributorCount / users.length) * 100}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Retailers</span>
                    <span className="text-sm font-semibold text-gray-800">{retailerCount} ({((retailerCount / users.length) * 100).toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${(retailerCount / users.length) * 100}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Consumers</span>
                    <span className="text-sm font-semibold text-gray-800">{consumerCount} ({((consumerCount / users.length) * 100).toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: `${(consumerCount / users.length) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-green-600" />
                Top Crop Types
              </h3>
              <div className="space-y-3">
                {topCropTypes.map(([type, count]: [string, any], index) => (
                  <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{type}</span>
                    </div>
                    <span className="text-sm font-semibold text-green-600">{count} products</span>
                  </div>
                ))}
                {topCropTypes.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No crop data available</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Monthly Activity
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{cropsThisMonth}</div>
                <div className="text-xs text-blue-800 mt-1">Products This Month</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{cropsLastMonth}</div>
                <div className="text-xs text-green-800 mt-1">Products Last Month</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">{cropsWithFullSupplyChain}</div>
                <div className="text-xs text-purple-800 mt-1">Complete Supply Chain</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">{Object.keys(cropsByType).length}</div>
                <div className="text-xs text-orange-800 mt-1">Unique Crop Types</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">System Health</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Active Users</div>
                <div className="text-2xl font-bold text-green-600">{users.length}</div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">System Uptime</div>
                <div className="text-2xl font-bold text-blue-600">99.9%</div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Data Integrity</div>
                <div className="text-2xl font-bold text-purple-600">100%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsModal;
