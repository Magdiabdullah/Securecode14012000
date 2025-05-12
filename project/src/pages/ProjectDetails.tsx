import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { AlertTriangle, Clock, Code, FileText } from 'lucide-react';

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjectDetails = async () => {
      try {
        // TODO: Implement project details fetching
        setLoading(false);
      } catch (error) {
        console.error('Error loading project details:', error);
        setLoading(false);
      }
    };

    loadProjectDetails();
  }, [projectId]);

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
        <h1 className="text-2xl font-bold">Project Details</h1>
        <button
          onClick={() => navigate('/upload')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          New Scan
        </button>
      </div>

      <div className={`rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center space-x-4 p-4 rounded-lg bg-opacity-10 bg-blue-500">
            <Code className="text-blue-500" size={24} />
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Total Files</p>
              <p className="text-xl font-semibold">0</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 rounded-lg bg-opacity-10 bg-red-500">
            <AlertTriangle className="text-red-500" size={24} />
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Issues Found</p>
              <p className="text-xl font-semibold">0</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 rounded-lg bg-opacity-10 bg-yellow-500">
            <Clock className="text-yellow-500" size={24} />
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Last Scan</p>
              <p className="text-xl font-semibold">Never</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 rounded-lg bg-opacity-10 bg-green-500">
            <FileText className="text-green-500" size={24} />
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Reports</p>
              <p className="text-xl font-semibold">0</p>
            </div>
          </div>
        </div>
      </div>

      <div className={`rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6`}>
        <h2 className="text-xl font-semibold mb-4">Project Information</h2>
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          No project information available.
        </p>
      </div>
    </div>
  );
};

export default ProjectDetails;