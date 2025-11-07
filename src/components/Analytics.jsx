import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Analytics = ({ fishData }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    // Simulate analytics data - in real app, this would come from an API
    const generateAnalyticsData = () => {
      const fishSales = fishData.fishes.map(fish => ({
        name: fish.name,
        sales: Math.floor(Math.random() * 100) + 10,
        revenue: Math.floor(Math.random() * 5000) + 1000,
        stock: fish.inStock ? 'In Stock' : 'Out of Stock'
      }));

      const categoryData = fishData.fishes.reduce((acc, fish) => {
        const category = fish.category;
        if (!acc[category]) {
          acc[category] = { name: category, value: 0, count: 0 };
        }
        acc[category].value += Math.floor(Math.random() * 50) + 10;
        acc[category].count += 1;
        return acc;
      }, {});

      const categoryPieData = Object.values(categoryData);

      return {
        fishSales,
        categoryData: categoryPieData,
        totalRevenue: fishSales.reduce((sum, fish) => sum + fish.revenue, 0),
        totalSales: fishSales.reduce((sum, fish) => sum + fish.sales, 0),
        topSelling: fishSales.sort((a, b) => b.sales - a.sales).slice(0, 5)
      };
    };

    setAnalyticsData(generateAnalyticsData());
  }, [fishData]);

  const COLORS = ['#005f73', '#ee6c4d', '#e0fbfc', '#001219'];

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-end">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-blue-600">₹{analyticsData.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Sales</h3>
          <p className="text-3xl font-bold text-red-500">{analyticsData.totalSales}</p>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Active Fish</h3>
          <p className="text-3xl font-bold text-green-600">{fishData.fishes.filter(f => f.inStock).length}</p>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Categories</h3>
          <p className="text-3xl font-bold text-purple-600">{analyticsData.categoryData.length}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="card p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Fish Sales Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.fishSales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#005f73" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="card p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Category Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analyticsData.categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Selling Fish */}
      <div className="card p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Top Selling Fish</h3>
        <div className="space-y-3">
          {analyticsData.topSelling.map((fish, index) => (
            <div key={fish.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </span>
                <span className="font-medium">{fish.name}</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-600">{fish.sales} sold</p>
                <p className="text-sm text-gray-600">₹{fish.revenue.toLocaleString()} revenue</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
