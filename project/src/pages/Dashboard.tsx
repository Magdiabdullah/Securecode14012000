import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ShieldCheck, Check, Code, ExternalLink, History, FileText } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { fetchDashboardStats, fetchRecentScans } from '../services/scanService';
import { DashboardStats, RecentScan } from '../types/scanTypes';
import RiskScoreGauge from '../components/dashboard/RiskScoreGauge';
import IssueTypePieChart from '../components/dashboard/IssueTypePieChart';
import ActionCard from '../components/ui/ActionCard';
import StatCard from '../components/ui/StatCard';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const dashboardStats = await fetchDashboardStats();
        setStats(dashboardStats);
        
        const scans = await fetchRecentScans();
        setRecentScans(scans);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
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
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user?.name}</h1>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            Here's the current security status of your code.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => navigate('/upload')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            New Scan
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Security Score" 
          value={stats?.securityScore || 0} 
          unit="/ 100" 
          trend={stats?.securityScoreTrend || 0} 
          icon={<ShieldCheck className={`${stats?.securityScore && stats.securityScore > 70 ? 'text-green-500' : 'text-yellow-500'}`} />} 
        />
        <StatCard 
          title="Total Issues" 
          value={stats?.totalIssues || 0} 
          trend={stats?.totalIssuesTrend || 0} 
          trendReversed
          icon={<AlertTriangle className={`${stats?.totalIssues && stats.totalIssues > 10 ? 'text-red-500' : 'text-yellow-500'}`} />} 
        />
        <StatCard 
          title="Scanned Files" 
          value={stats?.scannedFiles || 0} 
          trend={stats?.scannedFilesTrend || 0} 
          icon={<Code className="text-blue-500" />} 
        />
        <StatCard 
          title="Resolved Issues" 
          value={stats?.resolvedIssues || 0} 
          trend={stats?.resolvedIssuesTrend || 0} 
          icon={<Check className="text-green-500" />} 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`col-span-1 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6`}>
          <h2 className="text-xl font-semibold mb-4">Overall Risk Score</h2>
          <div className="flex justify-center">
            <RiskScoreGauge score={stats?.securityScore || 0} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Critical</p>
              <p className="text-lg font-semibold text-red-500">{stats?.criticalIssues || 0}</p>
            </div>
            <div>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>High</p>
              <p className="text-lg font-semibold text-orange-500">{stats?.highIssues || 0}</p>
            </div>
            <div>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Medium</p>
              <p className="text-lg font-semibold text-yellow-500">{stats?.mediumIssues || 0}</p>
            </div>
          </div>
        </div>
        
        <div className={`col-span-1 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6`}>
          <h2 className="text-xl font-semibold mb-4">Issue Types</h2>
          <IssueTypePieChart data={stats?.issueTypes || []} />
        </div>
        
        <div className={`col-span-1 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6`}>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <ActionCard 
              title="Upload New Code" 
              description="Scan files or GitHub repositories" 
              icon={<Code size={20} />}
              onClick={() => navigate('/upload')}
            />
            <ActionCard 
              title="View Scan History" 
              description="Review all previous scans" 
              icon={<History size={20} />}
              onClick={() => navigate('/history')}
            />
            <ActionCard 
              title="Generate Security Report" 
              description="Create PDF or JSON export" 
              icon={<FileText size={20} />}
              onClick={() => {/* Export functionality */}}
            />
          </div>
        </div>
      </div>
      
      <div className={`rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Scans</h2>
          <button 
            onClick={() => navigate('/history')}
            className={`text-sm flex items-center ${
              theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
            }`}
          >
            View All <ExternalLink size={14} className="ml-1" />
          </button>
        </div>
        
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
              {recentScans.map((scan) => (
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

export default Dashboard;