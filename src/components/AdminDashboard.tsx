import React, { useState, useEffect } from 'react';
import { Users, Package, TrendingUp, DollarSign, Activity, UserCheck, ShoppingCart, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { storage } from '../lib/storage';
import { UserRole } from '../types';
import UserManagementModal from './UserManagementModal';
import ProductManagementModal from './ProductManagementModal';
import AnalyticsModal from './AnalyticsModal';

interface AdminStats {
  totalUsers: number;
  farmers: number;
  distributors: number;
  retailers: number;
  consumers: number;
  totalCrops: number;
  activeFarmers: number;
  monthlyRevenue: number;
  newProductsMonth: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    farmers: 0,
    distributors: 0,
    retailers: 0,
    consumers: 0,
    totalCrops: 0,
    activeFarmers: 0,
    monthlyRevenue: 0,
    newProductsMonth: 0
  });
  const [loading, setLoading] = useState(true);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showProductManagement, setShowProductManagement] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadAdminStats();
  }, []);

  const loadAdminStats = () => {
    const users = storage.getUsers();
    const allCrops = storage.getUsers().flatMap(u => storage.getCrops(u.id));
    
    const farmers = users.filter(u => u.role.toLowerCase() === 'farmer').length;
    const distributors = users.filter(u => u.role.toLowerCase() === 'distributor').length;
    const retailers = users.filter(u => u.role.toLowerCase() === 'retailer').length;
    const consumers = users.filter(u => u.role.toLowerCase() === 'consumer').length;
    
    // Calculate active farmers (farmers with crops)
    const farmersWithCrops = new Set(allCrops.map(crop => crop.user_id));
    const activeFarmers = users.filter(u => 
      u.role.toLowerCase() === 'farmer' && farmersWithCrops.has(u.id)
    ).length;

    // Calculate new products this month
    const thisMonth = new Date();
    const newProductsMonth = allCrops.filter(crop => {
      const cropDate = new Date(crop.created_at);
      return cropDate.getMonth() === thisMonth.getMonth() && 
             cropDate.getFullYear() === thisMonth.getFullYear();
    }).length;

    setStats({
      totalUsers: users.length,
      farmers,
      distributors,
      retailers,
      consumers,
      totalCrops: allCrops.length,
      activeFarmers,
      monthlyRevenue: 23800, // Mock data
      newProductsMonth
    });
    
    setLoading(false);
  };

  const getPercentage = (value: number, total: number) => {
    return total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-teal-600 to-green-600 text-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">FarmChainX - Admin Dashboard</h1>
            <p className="text-teal-100 mt-1">Welcome, {user?.name || 'Admin User'}</p>
          </div>
          <div className="text-right">
            <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button className="px-6 py-3 text-teal-600 border-b-2 border-teal-600 font-semibold flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setShowProductManagement(true)}
            className="px-6 py-3 text-gray-600 hover:text-teal-600 font-semibold flex items-center space-x-2 transition-colors"
          >
            <Package className="h-4 w-4" />
            <span>Products</span>
          </button>
          <button
            onClick={() => setShowAnalytics(true)}
            className="px-6 py-3 text-gray-600 hover:text-teal-600 font-semibold flex items-center space-x-2 transition-colors"
          >
            <TrendingUp className="h-4 w-4" />
            <span>Analytics</span>
          </button>
        </div>
      </div>

      {/* User Statistics */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">User Statistics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="text-center">
            <div className="bg-green-100 p-4 rounded-lg mb-3">
              <Users className="h-8 w-8 text-green-600 mx-auto" />
            </div>
            <div className="text-3xl font-bold text-gray-800">{stats.farmers}</div>
            <div className="text-sm text-green-600 font-medium">{getPercentage(stats.farmers, stats.totalUsers)}%</div>
            <div className="text-gray-600 text-sm">Farmers</div>
          </div>

          <div className="text-center">
            <div className="bg-blue-100 p-4 rounded-lg mb-3">
              <Users className="h-8 w-8 text-blue-600 mx-auto" />
            </div>
            <div className="text-3xl font-bold text-gray-800">{stats.consumers}</div>
            <div className="text-sm text-blue-600 font-medium">{getPercentage(stats.consumers, stats.totalUsers)}%</div>
            <div className="text-gray-600 text-sm">Customers</div>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 p-4 rounded-lg mb-3">
              <Users className="h-8 w-8 text-purple-600 mx-auto" />
            </div>
            <div className="text-3xl font-bold text-gray-800">{stats.retailers}</div>
            <div className="text-sm text-purple-600 font-medium">{getPercentage(stats.retailers, stats.totalUsers)}%</div>
            <div className="text-gray-600 text-sm">Retailers</div>
          </div>

          <div className="text-center">
            <div className="bg-orange-100 p-4 rounded-lg mb-3">
              <Users className="h-8 w-8 text-orange-600 mx-auto" />
            </div>
            <div className="text-3xl font-bold text-gray-800">{stats.totalUsers}</div>
            <div className="text-sm text-gray-600">Registered</div>
            <div className="text-gray-600 text-sm">Total Users</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{stats.totalCrops}</div>
            <div className="text-gray-600 text-sm">Total Products</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{stats.activeFarmers}</div>
            <div className="text-gray-600 text-sm">Active Farmers</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">₹{stats.monthlyRevenue.toLocaleString()}</div>
            <div className="text-gray-600 text-sm">Monthly Revenue</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{stats.newProductsMonth}</div>
            <div className="text-gray-600 text-sm">New Products (Month)</div>
          </div>
        </div>
      </div>

      {/* Additional Admin Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <UserCheck className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">User Management</h3>
              <p className="text-sm text-gray-600">Manage all users</p>
            </div>
          </div>
          <button
            onClick={() => setShowUserManagement(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            View All Users
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Product Management</h3>
              <p className="text-sm text-gray-600">Manage all crops</p>
            </div>
          </div>
          <button
            onClick={() => setShowProductManagement(true)}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            View All Products
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Analytics</h3>
              <p className="text-sm text-gray-600">View detailed reports</p>
            </div>
          </div>
          <button
            onClick={() => setShowAnalytics(true)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            View Analytics
          </button>
        </div>
      </div>

      {/* Modals */}
      {showUserManagement && (
        <UserManagementModal onClose={() => setShowUserManagement(false)} />
      )}

      {showProductManagement && (
        <ProductManagementModal onClose={() => setShowProductManagement(false)} />
      )}

      {showAnalytics && (
        <AnalyticsModal onClose={() => setShowAnalytics(false)} />
      )}
    </div>
  );
};

export default AdminDashboard;