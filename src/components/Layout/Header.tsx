import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Car, Menu, X, User, LogOut, Bell } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowUserMenu(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <Car className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">VehicleRent Pro</span>
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
                Dashboard
              </Link>
              
              {hasRole(['admin', 'staff']) && (
                <>
                  <Link to="/vehicles" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Vehicles
                  </Link>
                  <Link to="/bookings" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Bookings
                  </Link>
                </>
              )}
              
              {hasRole(['customer']) && (
                <>
                  <Link to="/browse" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Browse Vehicles
                  </Link>
                  <Link to="/my-bookings" className="text-gray-700 hover:text-blue-600 transition-colors">
                    My Bookings
                  </Link>
                </>
              )}
              
              {hasRole(['admin']) && (
                <>
                  <Link to="/reports" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Reports
                  </Link>
                  <Link to="/activities" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Activities
                  </Link>
                </>
              )}
            </nav>
          )}

          {/* User Menu */}
          {user ? (
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-700 hover:text-blue-600 transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden md:block">{user.name}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={toggleMenu}
                className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        {user && isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
                Dashboard
              </Link>
              
              {hasRole(['admin', 'staff']) && (
                <>
                  <Link to="/vehicles" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Vehicles
                  </Link>
                  <Link to="/bookings" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Bookings
                  </Link>
                </>
              )}
              
              {hasRole(['customer']) && (
                <>
                  <Link to="/browse" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Browse Vehicles
                  </Link>
                  <Link to="/my-bookings" className="text-gray-700 hover:text-blue-600 transition-colors">
                    My Bookings
                  </Link>
                </>
              )}
              
              {hasRole(['admin']) && (
                <>
                  <Link to="/reports" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Reports
                  </Link>
                  <Link to="/activities" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Activities
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;