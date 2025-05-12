import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { fetchRecentScans } from '../services/scanService';
import type { RecentScan } from '../types/scanTypes';

const ScanHistory: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [scans, setScans] = useState<RecentScan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadScans = async () => {
      try {
        const recentScans = await fetchRecentScans();
        setScans(recentScans);
      } catch (error) {
        console.error('Error loading scan history:', error);
      } finally {
        setLoading(false);
      }
    };

    loadScans();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Scan History</h1>
        <button
          onClick={() => navigate('/upload')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          New Scan
        </button>
      </div>

      <div className={`rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Language</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Issues</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {scans.map((scan) => (
                <tr 
                  key={scan.id} 
                  className={`hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} cursor-pointer`}
                  onClick={() => navigate(`/scans/${scan.id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">{scan.projectName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(scan.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{scan.language}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        scan.criticalIssues > 0 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {scan.totalIssues} issues
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${getRiskColor(scan.securityScore)}`}></div>
                      {scan.securityScore}/100
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      scan.status === 'Completed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {scan.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Helper function to get color based on risk score
const getRiskColor = (score: number) => {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  if (score >= 40) return 'bg-orange-500';
  return 'bg-red-500';
};

export default ScanHistory;