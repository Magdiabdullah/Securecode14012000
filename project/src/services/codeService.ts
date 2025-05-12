import { Issue } from '../types/scanTypes';

// Mock file content fetch service
export const fetchFileContent = (fileId: string): Promise<{ filePath: string, content: string, language: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return mock file content based on file ID
      if (fileId === 'file1') {
        resolve({
          filePath: 'src/components/auth/LoginForm.js',
          language: 'JavaScript',
          content: `import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { validateLoginForm } from '../../utils/validation';

const LoginForm = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate form inputs
    const validationError = validateLoginForm(formData);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setLoading(true);
    try {
      await login(formData.email, formData.password);
    } catch (err) {
      // VULNERABILITY: Using dangerouslySetInnerHTML with user-controlled data
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Sign In</h2>
      
      {error && <div className="error-message" dangerouslySetInnerHTML={{ __html: error }} />}
      
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
};

export default LoginForm;`
        });
      } else {
        // Default file content for other file IDs
        resolve({
          filePath: 'src/sample/File.js',
          language: 'JavaScript',
          content: '// This is a sample file\nconsole.log("Hello World");'
        });
      }
    }, 800);
  });
};

// Mock file issues fetch service
export const fetchFileIssues = (fileId: string): Promise<Issue[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return mock issues based on file ID
      if (fileId === 'file1') {
        resolve([
          {
            id: 'issue1',
            fileId: 'file1',
            filePath: 'src/components/auth/LoginForm.js',
            lineNumber: 42,
            title: 'Cross-Site Scripting (XSS) Vulnerability',
            description: 'User input from the login form is being directly rendered to the DOM without proper sanitization, which could allow attackers to inject malicious scripts.',
            severity: 'high',
            type: 'XSS',
            status: 'open',
            codeSnippet: `{error && <div className="error-message" dangerouslySetInnerHTML={{ __html: error }} />}`,
            impact: 'Attackers could inject JavaScript code that executes in users\' browsers, potentially stealing session cookies, tokens, or personal data.',
            recommendation: 'Never use dangerouslySetInnerHTML with untrusted data. Instead, use text content or a library like DOMPurify to sanitize HTML content before rendering.',
            references: [
              { title: 'OWASP XSS Prevention Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html' },
              { title: 'React Security Documentation', url: 'https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml' }
            ]
          }
        ]);
      } else {
        // Return empty array for other file IDs
        resolve([]);
      }
    }, 800);
  });
};