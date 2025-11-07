import { useState } from 'react';
import AdminLogin from '../components/AdminLogin';
import AdminPanel from '../components/AdminPanel';

const Admin = ({ fishData, refreshFishData }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword] = useState('admin123'); // In production, this should be more secure

  const handleLogin = (password) => {
    if (password === adminPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('adminMode', 'true');
      console.log('Admin login successful - setting admin mode');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminMode');
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <AdminPanel 
      fishData={fishData} 
      refreshFishData={refreshFishData}
      onLogout={handleLogout}
    />
  );
};

export default Admin;

