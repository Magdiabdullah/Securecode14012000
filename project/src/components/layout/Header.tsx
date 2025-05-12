import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, Settings, User, Search, Moon, Sun, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [showSearch, setShowSearch] = useState(false);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/upload') return 'Upload Code';
    if (path === '/history') return 'Scan History';
    if (path.startsWith('/projects/')) return 'Project Details';
    if (path.startsWith('/scans/')) return 'Scan Results';
    if (path.startsWith('/code/')) return 'Code Viewer';
    if (path === '/settings') return 'Settings';
    return 'SecureCodeIQ';
  };

  return (
    <header className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-4 py-3`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {children}
          <h1 className="text-xl font-semibold ml-2">{getPageTitle()}</h1>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          {!showSearch ? (
            <button
              onClick={() => setShowSearch(true)}
              className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Search size={20} />
            </button>
          ) : (
            <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 p-4 md:relative md:inset-auto md:bg-transparent md:p-0">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Search..."
                  autoFocus
                  className={`w-full pl-9 pr-4 py-2 rounded-lg text-sm ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 placeholder-gray-400' 
                      : 'bg-gray-100 border-gray-200 placeholder-gray-500'
                  } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <button
                  onClick={() => setShowSearch(false)}
                  className="md:hidden ml-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          )}
          
          <div className="hidden md:relative md:block">
            <input
              type="text"
              placeholder="Search..."
              className={`pl-9 pr-4 py-2 rounded-lg text-sm ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 placeholder-gray-400' 
                  : 'bg-gray-100 border-gray-200 placeholder-gray-500'
              } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          </div>
          
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button
            className={`p-2 rounded-full relative ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500"></span>
          </button>
          
          <button
            onClick={() => navigate('/settings')}
            className={`p-2 rounded-full ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <Settings size={20} />
          </button>
          
          <div className="relative group">
            <button
              className={`flex items-center space-x-2 p-1 rounded ${
                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                {user?.name ? user.name.charAt(0).toUpperCase() : <User size={18} />}
              </div>
            </button>
            
            <div className={`absolute right-0 top-full mt-1 w-48 rounded-md shadow-lg py-1 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } ring-1 ring-black ring-opacity-5 hidden group-hover:block z-10`}>
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                {user?.role === 'admin' && (
                  <span className="mt-1 inline-block px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
                    Admin
                  </span>
                )}
              </div>
              <button
                onClick={() => navigate('/settings')}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                Settings
              </button>
              <button
                onClick={logout}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  theme === 'dark' ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-100 text-red-600'
                }`}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;