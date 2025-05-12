import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  AlertTriangle, 
  Info, 
  Shield, 
  Filter, 
  Download, 
  ArrowUp, 
  ArrowDown,
  ChevronRight,
  ChevronDown,
  XCircle,
  Clock,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Eye
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { fetchScanResults } from '../services/scanService';
import { generateSecurityReport } from '../services/reportService';
import { ScanResult, Issue } from '../types/scanTypes';
import RiskScoreGauge from '../components/dashboard/RiskScoreGauge';
import AIFixSuggestion from '../components/scan/AIFixSuggestion';

const ScanResults: React.FC = () => {
  const { scanId } = useParams<{ scanId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [sortBy, setSortBy] = useState<'severity' | 'file' | 'type'>('severity');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterSeverity, setFilterSeverity] = useState<string[]>(['critical', 'high', 'medium', 'low']);
  const [filterStatus, setFilterStatus] = useState<string[]>(['open', 'fixed', 'ignored']);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const loadScanResults = async () => {
      if (scanId) {
        try {
          const results = await fetchScanResults(scanId);
          setScanResult(results);
        } catch (error) {
          console.error('Error loading scan results:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadScanResults();
  }, [scanId]);

  const handleDownloadReport = () => {
    if (scanResult) {
      generateSecurityReport(scanResult);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!scanResult) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <XCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold">Scan not found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">The scan you're looking for doesn't exist or was deleted.</p>
        <button
          onClick={() => navigate('/history')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Go to Scan History
        </button>
      </div>
    );
  }

  const handleSortChange = (key: 'severity' | 'file' | 'type') => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  };

  const toggleFilterSeverity = (severity: string) => {
    setFilterSeverity(prev => 
      prev.includes(severity) 
        ? prev.filter(s => s !== severity) 
        : [...prev, severity]
    );
  };

  const toggleFilterStatus = (status: string) => {
    setFilterStatus(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status) 
        : [...prev, status]
    );
  };

  const filteredIssues = scanResult.issues
    .filter(issue => filterSeverity.includes(issue.severity))
    .filter(issue => filterStatus.includes(issue.status));

  const sortedIssues = [...filteredIssues].sort((a, b) => {
    if (sortBy === 'severity') {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const diff = severityOrder[a.severity as keyof typeof severityOrder] - severityOrder[b.severity as keyof typeof severityOrder];
      return sortOrder === 'asc' ? -diff : diff;
    } else if (sortBy === 'file') {
      return sortOrder === 'asc' 
        ? a.filePath.localeCompare(b.filePath) 
        : b.filePath.localeCompare(a.filePath);
    } else {
      return sortOrder === 'asc' 
        ? a.type.localeCompare(b.type) 
        : b.type.localeCompare(a.type);
    }
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-200';
      case 'high': return 'text-orange-500 bg-orange-100 dark:bg-orange-900 dark:text-orange-200';
      case 'medium': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'text-blue-500 bg-blue-100 dark:bg-blue-900 dark:text-blue-200';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Clock size={14} className="text-yellow-500" />;
      case 'fixed': return <CheckCircle2 size={14} className="text-green-500" />;
      case 'ignored': return <XCircle size={14} className="text-gray-400" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">{scanResult.projectName}</h1>
          <div className="flex items-center mt-1">
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Scan completed on {new Date(scanResult.completedAt).toLocaleString()}
            </p>
            <div className={`ml-3 flex items-center ${
              scanResult.status === 'Completed' 
                ? 'text-green-500' 
                : 'text-yellow-500'
            }`}>
              <span className="inline-block w-2 h-2 rounded-full mr-1 bg-current"></span>
              <span className="text-sm font-medium">{scanResult.status}</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-1.5 rounded flex items-center text-sm ${
              theme === 'dark' 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <Filter size={16} className="mr-1" />
            Filters {showFilters ? <ChevronDown size={16} className="ml-1" /> : <ChevronRight size={16} className="ml-1" />}
          </button>
          <button
            onClick={handleDownloadReport}
            className={`px-3 py-1.5 rounded flex items-center text-sm ${
              theme === 'dark' 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <Download size={16} className="mr-1" />
            Export PDF
          </button>
          <button
            onClick={() => navigate(`/projects/${scanResult.projectId}`)}
            className="px-3 py-1.5 bg-blue-600 text-white rounded flex items-center text-sm hover:bg-blue-700"
          >
            Project Details
          </button>
        </div>
      </div>
      
      {showFilters && (
        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow`}>
          <div className="flex flex-wrap gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Severity</h3>
              <div className="flex flex-wrap gap-2">
                {['critical', 'high', 'medium', 'low'].map((severity) => (
                  <button
                    key={severity}
                    onClick={() => toggleFilterSeverity(severity)}
                    className={`px-3 py-1 rounded-full text-xs capitalize ${
                      filterSeverity.includes(severity)
                        ? getSeverityColor(severity)
                        : `${theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'}`
                    }`}
                  >
                    {severity}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Status</h3>
              <div className="flex flex-wrap gap-2">
                {['open', 'fixed', 'ignored'].map((status) => (
                  <button
                    key={status}
                    onClick={() => toggleFilterStatus(status)}
                    className={`px-3 py-1 rounded-full text-xs capitalize flex items-center ${
                      filterStatus.includes(status)
                        ? `${theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`
                        : `${theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'}`
                    }`}
                  >
                    {getStatusIcon(status)}
                    <span className="ml-1">{status}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="col-span-1 lg:col-span-3 space-y-6">
          <div className={`rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Issues Found ({filteredIssues.length})</h2>
              <div className="flex items-center text-sm">
                <span className="mr-2">Sort by:</span>
                <button
                  onClick={() => handleSortChange('severity')}
                  className={`flex items-center px-2 py-1 rounded ${
                    sortBy === 'severity'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : ''
                  }`}
                >
                  Severity
                  {sortBy === 'severity' && (
                    sortOrder === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                  )}
                </button>
                <button
                  onClick={() => handleSortChange('file')}
                  className={`flex items-center px-2 py-1 rounded mx-1 ${
                    sortBy === 'file'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : ''
                  }`}
                >
                  File
                  {sortBy === 'file' && (
                    sortOrder === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                  )}
                </button>
                <button
                  onClick={() => handleSortChange('type')}
                  className={`flex items-center px-2 py-1 rounded ${
                    sortBy === 'type'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : ''
                  }`}
                >
                  Type
                  {sortBy === 'type' && (
                    sortOrder === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              {sortedIssues.length > 0 ? (
                sortedIssues.map((issue) => (
                  <div 
                    key={issue.id}
                    className={`p-4 rounded-lg ${
                      selectedIssue?.id === issue.id
                        ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-100 dark:ring-offset-gray-900'
                        : `${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'}`
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start flex-1 cursor-pointer" onClick={() => setSelectedIssue(issue)}>
                        <div className={`flex-shrink-0 rounded-full p-1.5 ${getSeverityColor(issue.severity)}`}>
                          <AlertTriangle size={16} />
                        </div>
                        <div className="ml-3">
                          <h3 className="font-medium">{issue.title}</h3>
                          <div className="flex flex-wrap items-center mt-1 text-sm">
                            <span className={`capitalize px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(issue.severity)}`}>
                              {issue.severity}
                            </span>
                            <span className={`ml-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              {issue.type}
                            </span>
                            <div className="flex items-center ml-2">
                              {getStatusIcon(issue.status)}
                              <span className={`ml-1 capitalize text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                {issue.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          <div className="flex items-center">
                            <FileText size={14} className="mr-1" />
                            <span>{issue.filePath.split('/').pop()}</span>
                          </div>
                          <span className="text-xs mt-1">Line {issue.lineNumber}</span>
                        </div>
                        <button
                          onClick={() => navigate(`/code/${issue.fileId}?issue=${issue.id}`)}
                          className={`p-2 rounded-lg transition-colors ${
                            theme === 'dark' 
                              ? 'hover:bg-gray-600 text-gray-300' 
                              : 'hover:bg-gray-200 text-gray-600'
                          }`}
                          title="View in code"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={`p-6 text-center rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <Info size={40} className="mx-auto mb-3 text-gray-400" />
                  <h3 className="text-lg font-medium mb-1">No issues match your filters</h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Try changing your filter settings to see more results.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-span-1 space-y-6">
          <div className={`rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <h2 className="text-lg font-semibold mb-3">Security Score</h2>
            <div className="flex justify-center mb-2">
              <RiskScoreGauge score={scanResult.securityScore} size="medium" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-center mt-4">
              {Object.entries(scanResult.issuesBySeverity).map(([severity, count]) => (
                <div key={severity} className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <p className={`text-xs uppercase font-medium ${
                    severity === 'critical' ? 'text-red-500' :
                    severity === 'high' ? 'text-orange-500' :
                    severity === 'medium' ? 'text-yellow-500' :
                    'text-blue-500'
                  }`}>
                    {severity}
                  </p>
                  <p className="text-xl font-bold">{count}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className={`rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <h2 className="text-lg font-semibold mb-3">Scan Details</h2>
            <div className="space-y-3">
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Project
                </p>
                <p className="font-medium">{scanResult.projectName}</p>
              </div>
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Scan Type
                </p>
                <p className="font-medium">{scanResult.scanType}</p>
              </div>
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Language
                </p>
                <p className="font-medium">{scanResult.language}</p>
              </div>
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Files Scanned
                </p>
                <p className="font-medium">{scanResult.filesScanned}</p>
              </div>
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Lines of Code
                </p>
                <p className="font-medium">{scanResult.linesOfCode.toLocaleString()}</p>
              </div>
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Duration
                </p>
                <p className="font-medium">{scanResult.duration} seconds</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {selectedIssue && (
        <div className={`rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold">{selectedIssue.title}</h2>
              <div className="flex items-center mt-1">
                <span className={`capitalize px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(selectedIssue.severity)}`}>
                  {selectedIssue.severity}
                </span>
                <span className={`ml-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {selectedIssue.type}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  <FileText size={14} className="inline mr-1" />
                  {selectedIssue.filePath}:{selectedIssue.lineNumber}
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate(`/code/${selectedIssue.fileId}?issue=${selectedIssue.id}`)}
              className="flex items-center text-blue-500 hover:text-blue-600"
            >
              View in Code <ExternalLink size={14} className="ml-1" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {selectedIssue.description}
              </p>
              
              <h3 className="font-medium mt-4 mb-2">Vulnerable Code</h3>
              <div className={`rounded-lg p-3 font-mono text-sm whitespace-pre-wrap overflow-x-auto ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
              }`}>
                {selectedIssue.codeSnippet}
              </div>
              
              <h3 className="font-medium mt-4 mb-2">Impact</h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {selectedIssue.impact}
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Fix Recommendation</h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {selectedIssue.recommendation}
              </p>
              
              <h3 className="font-medium mt-4 mb-2">References</h3>
              <ul className="space-y-1">
                {selectedIssue.references.map((ref, index) => (
                  <li key={index}>
                    <a 
                      href={ref.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:text-blue-600 hover:underline"
                    >
                      {ref.title}
                    </a>
                  </li>
                ))}
              </ul>
              
              <div className="mt-4">
                <AIFixSuggestion issue={selectedIssue} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanResults;