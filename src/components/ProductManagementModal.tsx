import React, { useState } from 'react';
import { X, Package, Search, Filter, Calendar, User, Truck, Store } from 'lucide-react';
import { storage } from '../lib/storage';
import { Crop } from '../types';

interface ProductManagementModalProps {
  onClose: () => void;
}

const ProductManagementModal: React.FC<ProductManagementModalProps> = ({ onClose }) => {
  const allUsers = storage.getUsers();
  const allCrops = allUsers.flatMap(u => storage.getCrops(u.id));

  const [crops, setCrops] = useState<Crop[]>(allCrops);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const cropTypes = ['all', ...Array.from(new Set(allCrops.map(c => c.crop_type)))];

  const filteredCrops = crops.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         crop.crop_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || crop.crop_type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (crop: Crop) => {
    const expiryDate = new Date(crop.expiry_date);
    const today = new Date();
    const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) {
      return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">Expired</span>;
    } else if (daysUntilExpiry <= 7) {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">Expiring Soon</span>;
    } else {
      return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Fresh</span>;
    }
  };

  const getSupplyChainStatus = (crop: Crop) => {
    if (crop.retailer_info) return { stage: 'Retailer', color: 'purple', icon: Store };
    if (crop.distributor_info) return { stage: 'Distributor', color: 'blue', icon: Truck };
    if (crop.farmer_info) return { stage: 'Farmer', color: 'green', icon: User };
    return { stage: 'Farmer', color: 'green', icon: User };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center space-x-3">
            <Package className="h-6 w-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {cropTypes.map(type => (
                  <option key={type} value={type} className="capitalize">
                    {type === 'all' ? 'All Types' : type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-green-600">{crops.length}</div>
              <div className="text-sm text-green-800">Total Products</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-blue-600">
                {crops.filter(c => new Date(c.expiry_date) > new Date()).length}
              </div>
              <div className="text-sm text-blue-800">Active Products</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {crops.filter(c => {
                  const daysUntilExpiry = Math.floor((new Date(c.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  return daysUntilExpiry > 0 && daysUntilExpiry <= 7;
                }).length}
              </div>
              <div className="text-sm text-yellow-800">Expiring Soon</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-red-600">
                {crops.filter(c => new Date(c.expiry_date) <= new Date()).length}
              </div>
              <div className="text-sm text-red-800">Expired</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supply Chain
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Harvest Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Farmer
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCrops.map((crop) => {
                  const scStatus = getSupplyChainStatus(crop);
                  const Icon = scStatus.icon;
                  return (
                    <tr key={crop.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {crop.image_url ? (
                            <img src={crop.image_url} alt={crop.name} className="h-10 w-10 rounded-lg object-cover" />
                          ) : (
                            <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <Package className="h-5 w-5 text-green-600" />
                            </div>
                          )}
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{crop.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full">
                          {crop.crop_type}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {getStatusBadge(crop)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className={`flex items-center text-${scStatus.color}-600`}>
                          <Icon className="h-4 w-4 mr-2" />
                          <span className="text-sm font-medium">{scStatus.stage}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          {new Date(crop.harvest_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          {new Date(crop.expiry_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {crop.farmer_info ? (
                          <div>
                            <div className="font-medium">{crop.farmer_info.name}</div>
                            <div className="text-xs text-gray-400">{crop.farmer_info.location}</div>
                          </div>
                        ) : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredCrops.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No products found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductManagementModal;
