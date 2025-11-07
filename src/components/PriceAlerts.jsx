import { useState, useEffect } from 'react';
import { Bell, BellOff, TrendingDown, TrendingUp, X, CheckCircle } from 'lucide-react';

const PriceAlerts = ({ fishData, addNotification }) => {
  const [alerts, setAlerts] = useState([]);
  const [alertsLoaded, setAlertsLoaded] = useState(false);
  const [showAddAlert, setShowAddAlert] = useState(false);
  const [newAlert, setNewAlert] = useState({
    fishId: '',
    targetPrice: '',
    alertType: 'below', // 'below' or 'above'
    isActive: true
  });

  useEffect(() => {
    // Load alerts from localStorage
    const savedAlerts = localStorage.getItem('priceAlerts');
    if (savedAlerts) {
      try {
        const parsed = JSON.parse(savedAlerts);
        if (Array.isArray(parsed)) {
          setAlerts(parsed);
        }
      } catch (error) {
        console.error('Failed to parse saved price alerts:', error);
      }
    }
    setAlertsLoaded(true);
  }, []);

  useEffect(() => {
    if (!alertsLoaded) return;
    // Save alerts to localStorage
    localStorage.setItem('priceAlerts', JSON.stringify(alerts));
  }, [alerts, alertsLoaded]);

  const findFishById = (id) => {
    if (!fishData?.fishes) return undefined;
    return fishData.fishes.find((fish) => String(fish.id) === String(id));
  };

  const addAlert = () => {
    if (!newAlert.fishId || newAlert.targetPrice === '') {
      return;
    }

    const fish = findFishById(newAlert.fishId);
    const targetPriceValue = parseFloat(newAlert.targetPrice);

    if (!fish || Number.isNaN(targetPriceValue)) {
      return;
    }

    const alert = {
      id: Date.now(),
      fishId: String(newAlert.fishId),
      fishName: fish.name,
      currentPrice: fish.rate,
      targetPrice: targetPriceValue,
      alertType: newAlert.alertType,
      isActive: newAlert.isActive,
      createdAt: new Date().toISOString(),
      triggered: false
    };

    setAlerts(prevAlerts => {
      const updatedAlerts = [...prevAlerts, alert];
      return evaluateAlerts(updatedAlerts, { notify: false });
    });

    setNewAlert({ fishId: '', targetPrice: '', alertType: 'below', isActive: true });
    setShowAddAlert(false);
  };

  const removeAlert = (alertId) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== alertId));
  };

  const toggleAlert = (alertId) => {
    setAlerts(prevAlerts => {
      const updatedAlerts = prevAlerts.map(alert => 
        alert.id === alertId 
          ? { ...alert, isActive: !alert.isActive }
          : alert
      );
      return evaluateAlerts(updatedAlerts, { notify: false });
    });
  };

  const evaluateAlerts = (alertList, options = { notify: true }) => {
    if (!Array.isArray(alertList) || alertList.length === 0) return alertList;
    if (!fishData?.fishes || fishData.fishes.length === 0) return alertList;

    let hasChanges = false;
    const triggeredAlerts = [];

    const updatedAlerts = alertList.map(alert => {
      const fish = findFishById(alert.fishId);
      if (!fish) {
        if (alert.triggered || alert.currentPrice !== alert.currentPrice) {
          hasChanges = true;
        }
        return {
          ...alert,
          currentPrice: alert.currentPrice ?? null,
          triggered: false
        };
      }

      const currentPrice = typeof fish.rate === 'number' ? fish.rate : Number(fish.rate);
      if (Number.isNaN(currentPrice)) {
        return alert;
      }

      const shouldTrigger =
        alert.isActive &&
        (
          (alert.alertType === 'below' && currentPrice <= alert.targetPrice) ||
          (alert.alertType === 'above' && currentPrice >= alert.targetPrice)
        );

      if (alert.currentPrice !== currentPrice || alert.triggered !== shouldTrigger) {
        hasChanges = true;
      }

      if (shouldTrigger && !alert.triggered) {
        triggeredAlerts.push({
          ...alert,
          currentPrice
        });
      }

      return {
        ...alert,
        currentPrice,
        triggered: shouldTrigger
      };
    });

    if (options.notify && triggeredAlerts.length > 0) {
      triggeredAlerts.forEach(updatedAlert => {
        showNotification(updatedAlert);
        if (typeof addNotification === 'function') {
          const directionText =
            updatedAlert.alertType === 'below' ? 'fell to' : 'rose to';
          addNotification(
            `${updatedAlert.fishName} price ${directionText} ₹${updatedAlert.currentPrice} (target ₹${updatedAlert.targetPrice})`,
            'success'
          );
        }
      });
    }

    return hasChanges ? updatedAlerts : alertList;
  };

  const showNotification = (alert) => {
    if (typeof window === 'undefined') return;
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    try {
      new Notification(`Price Alert: ${alert.fishName}`, {
        body: `Price is now ₹${alert.currentPrice} (${alert.alertType} your target of ₹${alert.targetPrice})`,
        icon: '/images/fish/placeholder.jpg'
      });
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  };

  useEffect(() => {
    if (!alertsLoaded) return;
    if (!fishData?.fishes || fishData.fishes.length === 0) return;

    setAlerts(prevAlerts => evaluateAlerts(prevAlerts, { notify: true }));
  }, [fishData, alertsLoaded]);

  const getAlertStatus = (alert) => {
    const fish = findFishById(alert.fishId);
    if (!fish) return 'error';

    const currentPrice = fish.rate;
    if (alert.alertType === 'below' && currentPrice <= alert.targetPrice) {
      return 'triggered';
    } else if (alert.alertType === 'above' && currentPrice >= alert.targetPrice) {
      return 'triggered';
    }
    return 'active';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'triggered': return 'text-green-600 bg-green-100';
      case 'active': return 'text-blue-600 bg-blue-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'triggered': return <CheckCircle className="h-4 w-4" />;
      case 'active': return <Bell className="h-4 w-4" />;
      case 'error': return <X className="h-4 w-4" />;
      default: return <BellOff className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
            <Bell className="h-6 w-6 mr-2 text-blue-600" />
            Price Alerts
          </h3>
          <p className="text-gray-600">Get notified when fish prices change</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={requestNotificationPermission}
            className="btn-secondary text-sm"
          >
            Enable Notifications
          </button>
          <button
            onClick={() => setShowAddAlert(true)}
            className="btn-primary"
          >
            Add Alert
          </button>
        </div>
      </div>

      {/* Add Alert Form */}
      {showAddAlert && (
        <div className="card p-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4">Create Price Alert</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fish</label>
              <select
                value={newAlert.fishId}
                onChange={(e) => setNewAlert({...newAlert, fishId: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="">Select a fish</option>
                {fishData.fishes.map(fish => (
                  <option key={fish.id} value={fish.id}>
                    {fish.name} - ₹{fish.rate}/kg
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Price (₹)</label>
              <input
                type="number"
                value={newAlert.targetPrice}
                onChange={(e) => setNewAlert({...newAlert, targetPrice: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Enter target price"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alert When Price</label>
              <select
                value={newAlert.alertType}
                onChange={(e) => setNewAlert({...newAlert, alertType: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="below">Goes Below Target</option>
                <option value="above">Goes Above Target</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={newAlert.isActive}
                onChange={(e) => setNewAlert({...newAlert, isActive: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                Active Alert
              </label>
            </div>
          </div>
          
          <div className="flex space-x-3 mt-6">
            <button onClick={addAlert} className="btn-primary">
              Create Alert
            </button>
            <button
              onClick={() => setShowAddAlert(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.length > 0 ? (
          alerts.map((alert) => {
            const status = getAlertStatus(alert);
            const fish = findFishById(alert.fishId);
            const currentPrice = fish ? fish.rate : alert.currentPrice;
            
            return (
              <div key={alert.id} className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${getStatusColor(status)}`}>
                      {getStatusIcon(status)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{alert.fishName}</h4>
                      <p className="text-sm text-gray-600">
                        Alert when price {alert.alertType} ₹{alert.targetPrice}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleAlert(alert.id)}
                      className={`p-2 rounded-full ${
                        alert.isActive 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {alert.isActive ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => removeAlert(alert.id)}
                      className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Current Price</p>
                    <p className="text-xl font-bold text-gray-900">₹{currentPrice}</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Target Price</p>
                    <p className="text-xl font-bold text-blue-600">₹{alert.targetPrice}</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Price Difference</p>
                    <div className="flex items-center justify-center space-x-1">
                      {currentPrice < alert.targetPrice ? (
                        <TrendingDown className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`font-bold ${
                        currentPrice < alert.targetPrice ? 'text-green-500' : 'text-red-500'
                      }`}>
                        ₹{Math.abs(currentPrice - alert.targetPrice).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {status === 'triggered' && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-green-700 font-medium">
                        Alert Triggered! Price is now ₹{currentPrice}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-600 mb-2">No price alerts set</h4>
            <p className="text-gray-500">Create alerts to get notified when fish prices change</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceAlerts;
