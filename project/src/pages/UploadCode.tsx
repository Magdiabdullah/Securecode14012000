import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Github as GitHub, File, Trash2, ArrowRight, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import { uploadFiles, scanRepository } from '../services/uploadService';

const UploadCode: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadMethod, setUploadMethod] = useState<'file' | 'repository'>('file');
  const [files, setFiles] = useState<File[]>([]);
  const [repoUrl, setRepoUrl] = useState('');
  const [language, setLanguage] = useState<'auto' | 'javascript' | 'python'>('auto');
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleRepoScan = async () => {
    if (!repoUrl.trim()) {
      toast.error('Please enter a valid repository URL');
      return;
    }
    
    setIsLoading(true);
    try {
      const scanId = await scanRepository(repoUrl, language);
      toast.success('Repository scan started');
      navigate(`/scans/${scanId}`);
    } catch (error) {
      toast.error('Failed to scan repository');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (files.length === 0) {
      toast.error('Please select at least one file');
      return;
    }
    
    setIsLoading(true);
    try {
      const scanId = await uploadFiles(files, language);
      toast.success('Files uploaded and scan started');
      navigate(`/scans/${scanId}`);
    } catch (error) {
      toast.error('Failed to upload files');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesList = Array.from(e.target.files);
      setFiles(prev => [...prev, ...filesList]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesList = Array.from(e.dataTransfer.files);
      setFiles(prev => [...prev, ...filesList]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Upload Code for Security Analysis</h1>
      
      <div className={`mb-6 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow`}>
        <div className="flex border-b pb-4 mb-4">
          <button
            className={`flex-1 py-2 px-4 rounded-lg mr-2 ${
              uploadMethod === 'file'
                ? 'bg-blue-500 text-white'
                : `${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`
            }`}
            onClick={() => setUploadMethod('file')}
          >
            <div className="flex items-center justify-center">
              <Upload size={18} className="mr-2" />
              Upload Files
            </div>
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-lg ml-2 ${
              uploadMethod === 'repository'
                ? 'bg-blue-500 text-white'
                : `${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`
            }`}
            onClick={() => setUploadMethod('repository')}
          >
            <div className="flex items-center justify-center">
              <GitHub size={18} className="mr-2" />
              GitHub Repository
            </div>
          </button>
        </div>
        
        {uploadMethod === 'file' ? (
          <div>
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : `${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-50'}`
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload size={40} className={`mx-auto mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
              <p className="mb-2 font-medium">Drag and drop files here</p>
              <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Supported file types: .js, .jsx, .ts, .tsx, .py, .php, .java, .go
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Browse Files
              </button>
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".js,.jsx,.ts,.tsx,.py,.php,.java,.go"
              />
            </div>
            
            {files.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Selected Files ({files.length})</h3>
                <div className={`max-h-60 overflow-y-auto rounded-lg border ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  {files.map((file, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center justify-between p-3 ${
                        index !== files.length - 1 ? `border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}` : ''
                      }`}
                    >
                      <div className="flex items-center">
                        <File size={18} className="mr-2 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium truncate max-w-xs">{file.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFile(index)}
                        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">GitHub Repository URL</label>
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/repository"
                className={`w-full p-3 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Enter the full URL to a public GitHub repository
              </p>
            </div>
          </div>
        )}
        
        <div className="mt-6 border-t pt-4">
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Programming Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className={`w-full p-3 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="auto">Auto-detect</option>
              <option value="javascript">JavaScript/TypeScript</option>
              <option value="python">Python</option>
            </select>
          </div>
          
          <button
            onClick={uploadMethod === 'file' ? handleFileUpload : handleRepoScan}
            disabled={isLoading || (uploadMethod === 'file' ? files.length === 0 : !repoUrl)}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Start Security Scan <ArrowRight size={18} className="ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow mb-6`}>
        <h2 className="text-lg font-semibold mb-2">What We Scan For</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h3 className="font-medium">Security Vulnerabilities</h3>
            <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
              SQL injection, XSS, CSRF, and other OWASP Top 10 issues
            </p>
          </div>
          <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h3 className="font-medium">Code Quality Issues</h3>
            <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
              Bugs, anti-patterns, and potential runtime errors
            </p>
          </div>
          <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h3 className="font-medium">Compliance Problems</h3>
            <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
              License issues, PII handling, and regulatory flags
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadCode;