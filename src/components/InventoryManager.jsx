import { useState, useEffect } from 'react';
import { AlertTriangle, Package, TrendingUp, TrendingDown, Bell } from 'lucide-react';

const InventoryManager = ({ fishData }) => {
  const [inventory, setInventory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [criticalStockThreshold, setCriticalStockThreshold] = useState(5);

  useEffect(() => {
    // Initialize inventory data
    const inventoryData = fishData.fishes.map(fish => ({
      id: fish.id,
      name: fish.name,
      category: fish.category,
      currentStock: Math.floor(Math.random() * 50) + 1,
      minStock: Math.floor(Math.random() * 15) + 5,
      maxStock: Math.floor(Math.random() * 100) + 50,
      unit: fish.unit,
      lastUpdated: new Date().toISOString(),
      status: 'normal'
    }));
    
    setInventory(inventoryData);
    generateAlerts(inventoryData);
  }, [fishData.fishes]);

  const generateAlerts = (inventoryData) => {
    const newAlerts = [];
    
    inventoryData.forEach(item => {
      if (item.currentStock <= criticalStockThreshold) {
        newAlerts.push({
          id: Date.now() + Math.random(),
          type: 'critical',
          message: `${item.name} is critically low (${item.currentStock} units)`,
          fishId: item.id,
          timestamp: new Date().toISOString()
        });
      } else if (item.currentStock <= lowStockThreshold) {
        newAlerts.push({
          id: Date.now() + Math.random(),
          type: 'warning',
          message: `${item.name} is running low (${item.currentStock} units)`,
          fishId: item.id,
          timestamp: new Date().toISOString()
        });
      }
    });
    
    setAlerts(newAlerts);
  };

  const updateStock = (fishId, newStock) => {
    const updatedInventory = inventory.map(item => 
      item.id === fishId 
        ? { ...item, currentStock: newStock, lastUpdated: new Date().toISOString() }
        : item
    );
    
    setInventory(updatedInventory);
    generateAlerts(updatedInventory);
  };

  const getStockStatus = (currentStock, minStock) => {
    if (currentStock <= criticalStockThreshold) return 'critical';
    if (currentStock <= lowStockThreshold) return 'warning';
    if (currentStock <= minStock) return 'low';
    return 'normal';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-orange-600 bg-orange-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'critical': return '🔴';
      case 'warning': return '🟡';
      case 'low': return '🟠';
      default: return '🟢';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-600">{alerts.length} alerts</span>
          </div>
        </div>
      </div>

      {/* Stock Alerts */}
      {alerts.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            Stock Alerts
          </h3>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-3 rounded-lg ${
                alert.type === 'critical' ? 'bg-red-50 border border-red-200' :
                alert.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                'bg-orange-50 border border-orange-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">
                      {alert.type === 'critical' ? '🔴' : '🟡'}
                    </span>
                    <span className="font-medium">{alert.message}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inventory Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">
            {inventory.filter(item => getStockStatus(item.currentStock, item.minStock) === 'normal').length}
          </div>
          <div className="text-sm text-gray-600">Normal Stock</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-yellow-600">
            {inventory.filter(item => getStockStatus(item.currentStock, item.minStock) === 'warning').length}
          </div>
          <div className="text-sm text-gray-600">Low Stock</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-red-600">
            {inventory.filter(item => getStockStatus(item.currentStock, item.minStock) === 'critical').length}
          </div>
          <div className="text-sm text-gray-600">Critical Stock</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-green-600">
            {inventory.reduce((sum, item) => sum + item.currentStock, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Units</div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Inventory Details</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fish
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Min Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventory.map((item) => {
                const status = getStockStatus(item.currentStock, item.minStock);
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">{getStatusIcon(status)}</div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.currentStock}</div>
                      <div className="text-sm text-gray-500">units</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.minStock} units
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
                        {status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          const newStock = prompt(`Update stock for ${item.name}:`, item.currentStock);
                          if (newStock && !isNaN(newStock)) {
                            updateStock(item.id, parseInt(newStock));
                          }
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Update Stock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Settings */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Alert Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Low Stock Threshold
            </label>
            <input
              type="number"
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Critical Stock Threshold
            </label>
            <input
              type="number"
              value={criticalStockThreshold}
              onChange={(e) => setCriticalStockThreshold(parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryManager;
