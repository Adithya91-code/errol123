import React, { useState, useEffect } from 'react';
import { Users, Package, TrendingUp, DollarSign, Eye, UserCheck, ShoppingCart, BarChart3, Activity, AlertCircle } from 'lucide-react';
import { storage } from '../lib/storage';

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

  useEffect(() => {
    loadAdminStats();
  }, []);

  const loadAdminStats = async () => {
    setLoading(true);
    
    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get actual data from storage
    const users = storage.getUsers();
    const allCrops = storage.getCrops('all'); // Get all crops
    
    const farmers = users.filter(u => u.role === 'farmer').length;
    const distributors = users.filter(u => u.role === 'distributor').length;
    const retailers = users.filter(u => u.role === 'retailer').length;
    const consumers = users.filter(u => u.role === 'consumer').length;
    
    // Calculate recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentCrops = allCrops.filter(crop => 
      new Date(crop.created_at) > thirtyDaysAgo
    ).length;
    
    setStats({
      totalUsers: users.length,
      farmers,
      distributors,
      retailers,
      consumers,
      totalCrops: allCrops.length,
      activeFarmers: Math.floor(farmers * 0.8), // Assume 80% are active
      monthlyRevenue: Math.floor(Math.random() * 50000) + 20000, // Mock revenue
      newProductsMonth: recentCrops
    });
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">Monitor and manage your FarmChainX platform</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Activity className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* User Statistics */}
      <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">User Statistics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="flex justify-center mb-3">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600 mb-1">{stats.farmers}</div>
            <div className="text-sm text-green-700 font-medium">Farmers</div>
            <div className="text-xs text-green-600 mt-1">23.7%</div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <div className="flex justify-center mb-3">
              <UserCheck className="h-8 w-8 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-1">{stats.consumers}</div>
            <div className="text-sm text-blue-700 font-medium">Customers</div>
            <div className="text-xs text-blue-600 mt-1">63.2%</div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
            <div className="flex justify-center mb-3">
              <ShoppingCart className="h-8 w-8 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-1">{stats.retailers}</div>
            <div className="text-sm text-purple-700 font-medium">Retailers</div>
            <div className="text-xs text-purple-600 mt-1">13.2%</div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
            <div className="flex justify-center mb-3">
              <Users className="h-8 w-8 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-orange-600 mb-1">{stats.totalUsers}</div>
            <div className="text-sm text-orange-700 font-medium">Total Users</div>
            <div className="text-xs text-orange-600 mt-1">Registered</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-gray-800 mb-1">{stats.totalCrops}</div>
            <div className="text-sm text-gray-600">Total Products</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-gray-800 mb-1">{stats.activeFarmers}</div>
            <div className="text-sm text-gray-600">Active Farmers</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-gray-800 mb-1">₹{stats.monthlyRevenue.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Monthly Revenue</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-gray-800 mb-1">{stats.newProductsMonth}</div>
            <div className="text-sm text-gray-600">New Products (Month)</div>
          </div>
        </div>
      </div>

      {/* Platform Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <span>Platform Growth</span>
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">User Registration Rate</span>
              <span className="text-green-600 font-semibold">+12.5%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Crop Listings</span>
              <span className="text-blue-600 font-semibold">+8.3%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Transaction Volume</span>
              <span className="text-purple-600 font-semibold">+15.7%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Platform Revenue</span>
              <span className="text-orange-600 font-semibold">+22.1%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span>System Alerts</span>
          </h3>
          <div className="space-y-3">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="text-sm font-medium text-yellow-800">Server Load High</div>
              <div className="text-xs text-yellow-600">Current load: 78% - Consider scaling</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-sm font-medium text-blue-800">New Feature Request</div>
              <div className="text-xs text-blue-600">Mobile app requested by 45+ users</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="text-sm font-medium text-green-800">Backup Completed</div>
              <div className="text-xs text-green-600">Daily backup successful at 2:00 AM</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Platform Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">New farmer registered: John Smith (Farmer ID: 234)</span>
            <span className="text-xs text-gray-500 ml-auto">2 minutes ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-700">New crop listing: Organic Tomatoes by Farmer 123</span>
            <span className="text-xs text-gray-500 ml-auto">15 minutes ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Supply chain updated: Distributor 456 received crops</span>
            <span className="text-xs text-gray-500 ml-auto">1 hour ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-sm text-gray-700">QR code scanned: Consumer verified crop authenticity</span>
            <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;