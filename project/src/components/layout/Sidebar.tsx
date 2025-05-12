import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Upload, 
  History, 
  Folder, 
  Settings, 
  AlertTriangle,
  Shield,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = useTheme();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Upload Code', path: '/upload', icon: <Upload size={20} /> },
    { name: 'Scan History', path: '/history', icon: <History size={20} /> },
    { name: 'Projects', path: '/projects', icon: <Folder size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div
      className={`${
        collapsed ? 'w-16' : 'w-64'
      } transition-all duration-300 ease-in-out ${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      } border-r ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      } flex flex-col h-screen`}
    >
      <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} p-4 border-b ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-500" />
            <h1 className="text-xl font-bold">SecureCodeIQ</h1>
          </div>
        )}
        {collapsed && <Shield className="h-8 w-8 text-blue-500" />}
        <div className="flex items-center">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-1 rounded-full ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            } hidden lg:block`}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ml-2"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>
      
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `
                  ${
                    isActive
                      ? `${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'} text-blue-500`
                      : `${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`
                  }
                  flex items-center px-4 py-3 rounded-lg mx-2 group transition-colors duration-200
                `}
                end={item.path === '/'}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && (
                  <span className="ml-3 transition-opacity duration-200">{item.name}</span>
                )}
                {collapsed && (
                  <div className="fixed left-16 ml-1 scale-0 group-hover:scale-100 transition-transform duration-200 origin-left z-50">
                    <div className={`px-2 py-1 rounded bg-gray-800 text-white text-sm whitespace-nowrap shadow-lg`}>
                      {item.name}
                    </div>
                  </div>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className={`p-4 mt-auto ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-blue-50'
      } rounded-lg mx-2 mb-4 flex items-center group transition-all duration-200 cursor-pointer hover:ring-2 hover:ring-blue-500`}>
        <AlertTriangle className={`h-5 w-5 ${
          theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'
        }`} />
        {!collapsed && (
          <div className="ml-3">
            <p className="text-sm font-medium">Security Status</p>
            <p className="text-xs">3 critical issues</p>
          </div>
        )}
        {collapsed && (
          <div className="fixed left-16 ml-1 scale-0 group-hover:scale-100 transition-transform duration-200 origin-left z-50">
            <div className={`px-2 py-1 rounded bg-gray-800 text-white text-sm whitespace-nowrap shadow-lg`}>
              3 critical security issues
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;