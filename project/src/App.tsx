import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import ScanHistory from './pages/ScanHistory';
import ProjectDetails from './pages/ProjectDetails';
import ScanResults from './pages/ScanResults';
import CodeViewer from './pages/CodeViewer';
import Login from './pages/Login';
import Register from './pages/Register';
import UploadCode from './pages/UploadCode';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="upload" element={<UploadCode />} />
              <Route path="history" element={<ScanHistory />} />
              <Route path="projects/:projectId" element={<ProjectDetails />} />
              <Route path="scans/:scanId" element={<ScanResults />} />
              <Route path="code/:fileId" element={<CodeViewer />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;