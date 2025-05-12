import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Issue } from '../../types/scanTypes';
import { MessageSquare, Lightbulb, Loader2, ChevronRight, ChevronDown } from 'lucide-react';
import { getAIFix, getAIExplanation } from '../../services/aiService';

interface AIFixSuggestionProps {
  issue: Issue;
  compact?: boolean;
}

const AIFixSuggestion: React.FC<AIFixSuggestionProps> = ({ issue, compact = false }) => {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'fix' | 'explain'>('fix');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  
  const handleGetAI = async () => {
    if (!expanded) {
      setExpanded(true);
      return;
    }
    
    setLoading(true);
    try {
      if (mode === 'fix') {
        const fix = await getAIFix(issue.id);
        setAiResponse(fix);
      } else {
        const explanation = await getAIExplanation(issue.id);
        setAiResponse(explanation);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${
      theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'
    } rounded-lg p-3`}>
      <button
        onClick={handleGetAI}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center">
          <div className={`p-1.5 rounded-full ${
            theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-200 text-blue-800'
          }`}>
            <Lightbulb size={compact ? 14 : 18} />
          </div>
          <span className={`ml-2 ${compact ? 'text-sm' : 'text-base'} font-medium`}>
            AI Assistant
          </span>
        </div>
        {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      
      {expanded && (
        <div className="mt-3">
          <div className="flex border rounded-lg overflow-hidden mb-3">
            <button
              onClick={() => setMode('fix')}
              className={`flex-1 py-1.5 text-sm ${
                mode === 'fix'
                  ? 'bg-blue-500 text-white'
                  : `${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`
              }`}
            >
              Suggest Fix
            </button>
            <button
              onClick={() => setMode('explain')}
              className={`flex-1 py-1.5 text-sm ${
                mode === 'explain'
                  ? 'bg-blue-500 text-white'
                  : `${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`
              }`}
            >
              Explain Issue
            </button>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 size={24} className="animate-spin text-blue-500" />
            </div>
          ) : aiResponse ? (
            <div className={`p-3 rounded ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="flex items-start mb-2">
                <MessageSquare size={16} className="mt-1 mr-2 text-blue-500" />
                <p className="text-sm font-medium">AI Assistant</p>
              </div>
              <p className="text-sm whitespace-pre-line">{aiResponse}</p>
            </div>
          ) : (
            <button
              onClick={() => mode === 'fix' ? getAIFix(issue.id) : getAIExplanation(issue.id)}
              className="w-full py-2 px-3 bg-blue-600 text-white rounded flex items-center justify-center hover:bg-blue-700"
            >
              {mode === 'fix' ? 'Get AI Fix Suggestion' : 'Explain This Issue'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AIFixSuggestion;