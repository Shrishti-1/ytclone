import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('access'); // unified token

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  return (
    <nav style={{ padding: '10px', backgroundColor: '#222', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <Link to="/" style={{ color: 'white', marginRight: '15px' }}>Home</Link>
        <Link to="/upload" style={{ color: 'white', marginRight: '15px' }}>Upload</Link>

        {/* ✅ Only show these if logged in */}
        {token && (
          <>
            <Link to="/dashboard" style={{ color: 'white', marginRight: '15px' }}>My Videos</Link>
            <Link to="/watch-later" style={{ color: 'white', marginRight: '15px' }}>Watch Later</Link>
          </>
        )}
      </div>

      <div>
        {token ? (
          <button onClick={handleLogout} style={{ backgroundColor: 'red', color: 'white' }}>
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white', marginRight: '15px' }}>Login</Link>
            <Link to="/register" style={{ color: 'white' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
