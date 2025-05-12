import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { fetchFileContent, fetchFileIssues } from '../services/codeService';
import { Issue } from '../types/scanTypes';
import { AlertTriangle, MessageSquare, Lightbulb, ChevronRight, ChevronDown } from 'lucide-react';
import AIFixSuggestion from '../components/scan/AIFixSuggestion';

const CodeViewer: React.FC = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const [searchParams] = useSearchParams();
  const highlightedIssueId = searchParams.get('issue');
  const { theme } = useTheme();
  const [fileContent, setFileContent] = useState<string>('');
  const [filePath, setFilePath] = useState<string>('');
  const [language, setLanguage] = useState<string>('');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const lineRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    const loadFileData = async () => {
      if (fileId) {
        try {
          const fileData = await fetchFileContent(fileId);
          setFileContent(fileData.content);
          setFilePath(fileData.filePath);
          setLanguage(fileData.language);
          
          const fileIssues = await fetchFileIssues(fileId);
          setIssues(fileIssues);
          
          if (highlightedIssueId) {
            const issue = fileIssues.find(i => i.id === highlightedIssueId);
            if (issue) {
              setSelectedIssue(issue);
            }
          }
        } catch (error) {
          console.error('Error loading file data:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadFileData();
  }, [fileId, highlightedIssueId]);

  useEffect(() => {
    if (selectedIssue && lineRefs.current[selectedIssue.lineNumber]) {
      lineRefs.current[selectedIssue.lineNumber]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [selectedIssue]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const lines = fileContent.split('\n');
  
  const getIssuesForLine = (lineNumber: number) => {
    return issues.filter(issue => issue.lineNumber === lineNumber);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-200';
      case 'high': return 'text-orange-500 bg-orange-100 dark:bg-orange-900 dark:text-orange-200';
      case 'medium': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'text-blue-500 bg-blue-100 dark:bg-blue-900 dark:text-blue-200';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className={`rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} overflow-hidden`}>
      <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className="text-lg font-semibold">{filePath}</h2>
        <div className="flex items-center mt-1">
          <span className={`text-sm px-2 py-0.5 rounded ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            {language}
          </span>
          <span className={`ml-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {lines.length} lines
          </span>
          <span className={`ml-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {issues.length} issues
          </span>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row">
        <div className={`w-full md:w-3/4 overflow-auto ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="font-mono text-sm min-h-[500px]">
            {lines.map((line, index) => {
              const lineNumber = index + 1;
              const lineIssues = getIssuesForLine(lineNumber);
              const hasIssues = lineIssues.length > 0;
              const isSelectedLine = selectedIssue && selectedIssue.lineNumber === lineNumber;
              
              return (
                <div 
                  key={lineNumber}
                  ref={el => lineRefs.current[lineNumber] = el}
                  className={`flex ${
                    isSelectedLine 
                      ? `${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50'} border-l-4 border-blue-500` 
                      : hasIssues 
                        ? `${theme === 'dark' ? 'bg-red-900/20' : 'bg-red-50'} border-l-4 border-red-500` 
                        : ''
                  }`}
                >
                  <div className={`w-12 flex-shrink-0 text-right px-2 select-none ${
                    theme === 'dark' ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {lineNumber}
                  </div>
                  <div className="px-4 py-0.5 overflow-x-auto w-full">
                    <span className={hasIssues ? 'border-b border-dashed border-red-400' : ''}>
                      {line || ' '}
                    </span>
                    
                    {hasIssues && (
                      <div className="inline-flex items-center ml-2">
                        {lineIssues.map((issue) => (
                          <button
                            key={issue.id}
                            onClick={() => setSelectedIssue(issue)}
                            className={`inline-flex items-center p-1 rounded-full ${getSeverityColor(issue.severity)}`}
                          >
                            <AlertTriangle size={12} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className={`w-full md:w-1/4 border-t md:border-t-0 md:border-l ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        } overflow-y-auto max-h-[700px]`}>
          {selectedIssue ? (
            <div className="p-4">
              <div className={`px-3 py-2 rounded-lg mb-4 ${getSeverityColor(selectedIssue.severity)}`}>
                <div className="flex items-center">
                  <AlertTriangle size={16} className="mr-2" />
                  <h3 className="font-medium">{selectedIssue.title}</h3>
                </div>
                <p className="text-xs mt-1">Line {selectedIssue.lineNumber}</p>
              </div>
              
              <p className="text-sm mb-4">{selectedIssue.description}</p>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-1">Recommendation</h4>
                <p className="text-sm">{selectedIssue.recommendation}</p>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-1">References</h4>
                <ul className="text-sm">
                  {selectedIssue.references.map((ref, index) => (
                    <li key={index} className="mb-1">
                      <a 
                        href={ref.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 hover:underline"
                      >
                        {ref.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              <AIFixSuggestion issue={selectedIssue} compact={true} />
            </div>
          ) : (
            <div className="p-4">
              <h3 className="font-medium mb-3">Issues in this file</h3>
              {issues.length > 0 ? (
                <div className="space-y-2">
                  {issues.map((issue) => (
                    <button
                      key={issue.id}
                      onClick={() => setSelectedIssue(issue)}
                      className={`w-full text-left p-2 rounded ${
                        theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className={`mt-0.5 flex-shrink-0 rounded-full p-1 ${getSeverityColor(issue.severity)}`}>
                          <AlertTriangle size={12} />
                        </div>
                        <div className="ml-2">
                          <p className="text-sm font-medium">{issue.title}</p>
                          <p className="text-xs">Line {issue.lineNumber}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  No issues found in this file.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeViewer;