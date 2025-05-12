import { DashboardStats, RecentScan, ScanResult } from '../types/scanTypes';

// Mock data for dashboard stats
export const fetchDashboardStats = (): Promise<DashboardStats> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        securityScore: 78,
        securityScoreTrend: 5,
        totalIssues: 24,
        totalIssuesTrend: -3,
        scannedFiles: 145,
        scannedFilesTrend: 12,
        resolvedIssues: 36,
        resolvedIssuesTrend: 8,
        criticalIssues: 2,
        highIssues: 5,
        mediumIssues: 10,
        lowIssues: 7,
        issueTypes: [
          { label: 'XSS', value: 5, color: '#EF4444' },
          { label: 'SQL', value: 3, color: '#F97316' },
          { label: 'Auth', value: 7, color: '#FBBF24' },
          { label: 'Config', value: 4, color: '#10B981' },
          { label: 'API', value: 2, color: '#3B82F6' },
          { label: 'Other', value: 3, color: '#8B5CF6' }
        ]
      });
    }, 800);
  });
};

// Mock data for recent scans
export const fetchRecentScans = (): Promise<RecentScan[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          projectId: '101',
          projectName: 'E-commerce Frontend',
          date: '2023-08-15T12:30:45Z',
          language: 'JavaScript',
          securityScore: 82,
          totalIssues: 8,
          criticalIssues: 0,
          status: 'Completed'
        },
        {
          id: '2',
          projectId: '102',
          projectName: 'API Service',
          date: '2023-08-12T09:15:30Z',
          language: 'Python',
          securityScore: 65,
          totalIssues: 15,
          criticalIssues: 2,
          status: 'Completed'
        },
        {
          id: '3',
          projectId: '103',
          projectName: 'Admin Dashboard',
          date: '2023-08-10T14:22:10Z',
          language: 'TypeScript',
          securityScore: 90,
          totalIssues: 3,
          criticalIssues: 0,
          status: 'Completed'
        },
        {
          id: '4',
          projectId: '104',
          projectName: 'User Authentication',
          date: '2023-08-05T11:45:33Z',
          language: 'JavaScript',
          securityScore: 70,
          totalIssues: 12,
          criticalIssues: 1,
          status: 'Completed'
        }
      ]);
    }, 800);
  });
};

// Mock data for scan results
export const fetchScanResults = (scanId: string): Promise<ScanResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: scanId,
        projectId: '101',
        projectName: 'E-commerce Frontend',
        scanType: 'Full Scan',
        language: 'JavaScript',
        status: 'Completed',
        startedAt: '2023-08-15T12:20:45Z',
        completedAt: '2023-08-15T12:30:45Z',
        duration: 10,
        securityScore: 82,
        filesScanned: 45,
        linesOfCode: 12500,
        issuesBySeverity: {
          critical: 0,
          high: 3,
          medium: 2,
          low: 3
        },
        issues: [
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
            codeSnippet: `const LoginForm = () => {
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API call...
    } catch (err) {
      setError(err.message);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {error && <div dangerouslySetInnerHTML={{ __html: error }} />}
      {/* Form fields... */}
    </form>
  );
};`,
            impact: 'Attackers could inject JavaScript code that executes in users\' browsers, potentially stealing session cookies, tokens, or personal data.',
            recommendation: 'Never use dangerouslySetInnerHTML with untrusted data. Instead, use text content or a library like DOMPurify to sanitize HTML content before rendering.',
            references: [
              { title: 'OWASP XSS Prevention Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html' },
              { title: 'React Security Documentation', url: 'https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml' }
            ]
          },
          {
            id: 'issue2',
            fileId: 'file2',
            filePath: 'src/services/api.js',
            lineNumber: 27,
            title: 'Hard-coded API Key',
            description: 'An API key is hard-coded directly in the source code. This is a security risk as the key could be extracted from the client-side code.',
            severity: 'high',
            type: 'API Security',
            status: 'open',
            codeSnippet: `const apiClient = axios.create({
  baseURL: 'https://api.example.com',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer a1b2c3d4e5f6g7h8i9j0' // Hard-coded API key
  }
});`,
            impact: 'Anyone with access to the source code (including users of your web application) can extract the API key and use it to make unauthorized API calls.',
            recommendation: 'Never store API keys or sensitive credentials in client-side code. Use environment variables on the server side to store keys, or implement a token exchange service.',
            references: [
              { title: 'OWASP Secure Coding Practices', url: 'https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/migrated_content' },
              { title: 'API Security Best Practices', url: 'https://developers.google.com/identity/protocols/oauth2/web-server#protect-key' }
            ]
          },
          {
            id: 'issue3',
            fileId: 'file3',
            filePath: 'src/utils/validation.js',
            lineNumber: 15,
            title: 'Weak Regular Expression for Email Validation',
            description: 'The email validation regex is too permissive and allows invalid email formats.',
            severity: 'medium',
            type: 'Input Validation',
            status: 'open',
            codeSnippet: `const isValidEmail = (email) => {
  const emailRegex = /^[^@]+@[^@]+$/;
  return emailRegex.test(email);
};`,
            impact: 'The current regex only checks for the presence of an @ symbol with text before and after it. This could allow malformed emails that might cause issues with email delivery or be used in email injection attacks.',
            recommendation: 'Use a more comprehensive regex for email validation or consider using a validation library. Always validate emails both client-side and server-side.',
            references: [
              { title: 'Email Address Regular Expression', url: 'https://emailregex.com/' },
              { title: 'OWASP Input Validation Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html' }
            ]
          },
          {
            id: 'issue4',
            fileId: 'file4',
            filePath: 'src/components/payment/CreditCardForm.js',
            lineNumber: 53,
            title: 'Unprotected Sensitive Data',
            description: 'Credit card information is being stored in local state without any encryption or protection.',
            severity: 'high',
            type: 'Sensitive Data Exposure',
            status: 'open',
            codeSnippet: `const CreditCardForm = () => {
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  
  // Store card data in state
  const handleChange = (e) => {
    setCardData({
      ...cardData,
      [e.target.name]: e.target.value
    });
  };
  
  // Form processing...
};`,
            impact: 'Storing unencrypted credit card information in client-side state could lead to exposure of this sensitive data. If the application is compromised (via XSS, for example), attackers could access this information.',
            recommendation: 'Never store complete credit card information in client-side state. Use a secure payment processor that handles card information directly, or implement tokenization. Only store the minimum necessary information.',
            references: [
              { title: 'PCI DSS Compliance Guide', url: 'https://www.pcicomplianceguide.org/pci-faqs-2/' },
              { title: 'OWASP Sensitive Data Exposure', url: 'https://owasp.org/www-project-top-ten/2017/A3_2017-Sensitive_Data_Exposure' }
            ]
          },
          {
            id: 'issue5',
            fileId: 'file5',
            filePath: 'src/config/security.js',
            lineNumber: 8,
            title: 'Insecure Content Security Policy',
            description: 'The Content Security Policy (CSP) includes unsafe-inline for scripts and allows loading resources from any origin with a wildcard (*).',
            severity: 'medium',
            type: 'Security Configuration',
            status: 'open',
            codeSnippet: `// Set Content Security Policy headers
const cspSettings = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", '*'],
    styleSrc: ["'self'", "'unsafe-inline'", '*'],
    imgSrc: ['*'],
    connectSrc: ['*']
  }
};`,
            impact: 'A permissive Content Security Policy with unsafe-inline and wildcard origins significantly reduces its effectiveness. This could allow execution of injected scripts and loading of malicious resources from any domain.',
            recommendation: 'Avoid using unsafe-inline, unsafe-eval, and wildcard sources in your CSP. Specify trusted domains explicitly for each resource type. Use nonces or hashes instead of unsafe-inline when inline scripts are necessary.',
            references: [
              { title: 'Content Security Policy Reference', url: 'https://content-security-policy.com/' },
              { title: 'OWASP Secure Headers Project', url: 'https://owasp.org/www-project-secure-headers/' }
            ]
          },
          {
            id: 'issue6',
            fileId: 'file6',
            filePath: 'src/utils/parser.js',
            lineNumber: 22,
            title: 'Unsafe Use of eval()',
            description: 'The code uses eval() to execute dynamically generated code, which is a dangerous practice.',
            severity: 'critical',
            type: 'Code Injection',
            status: 'open',
            codeSnippet: `function parseAndExecute(input) {
  // This function takes user input and evaluates it
  try {
    return eval('(' + input + ')');
  } catch (e) {
    console.error('Failed to parse input', e);
    return null;
  }
}`,
            impact: 'Using eval() with user-controllable input can lead to code injection vulnerabilities. Attackers could execute arbitrary JavaScript code in the context of your application.',
            recommendation: 'Never use eval() with untrusted data. Use safer alternatives like JSON.parse() for parsing JSON. If dynamic code execution is necessary, consider using a sandbox or more secure approaches.',
            references: [
              { title: 'JavaScript eval() Security Risks', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#never_use_eval!' },
              { title: 'OWASP Injection Prevention Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html' }
            ]
          },
          {
            id: 'issue7',
            fileId: 'file7',
            filePath: 'src/components/admin/UserManagement.js',
            lineNumber: 104,
            title: 'Unverified Role Check in Frontend',
            description: 'The application relies solely on frontend code to check user roles for displaying admin functionality, without server-side verification.',
            severity: 'high',
            type: 'Access Control',
            status: 'fixed',
            codeSnippet: `function UserManagement() {
  const { user } = useAuth();
  
  // Only check role on the client side
  const isAdmin = user && user.role === 'admin';
  
  return (
    <div>
      <h2>User Management</h2>
      {isAdmin && (
        <div>
          <button>Delete Users</button>
          <button>Modify Permissions</button>
        </div>
      )}
    </div>
  );
}`,
            impact: 'Relying solely on frontend checks for access control is insecure. Users could modify the client-side code or API responses to bypass these checks, potentially gaining access to administrative functions.',
            recommendation: 'Always implement access control checks on the server side. The frontend should only hide or show UI elements based on the user\'s role, but all sensitive actions must be verified on the server.',
            references: [
              { title: 'OWASP Broken Access Control', url: 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/' },
              { title: 'Frontend Security Best Practices', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Frontend_Security_Cheat_Sheet.html' }
            ]
          },
          {
            id: 'issue8',
            fileId: 'file8',
            filePath: 'src/utils/storage.js',
            lineNumber: 36,
            title: 'Sensitive Data in LocalStorage',
            description: 'User authentication tokens are stored in localStorage, which is vulnerable to XSS attacks.',
            severity: 'medium',
            type: 'Insecure Storage',
            status: 'ignored',
            codeSnippet: `// Store authentication token
export const storeAuthToken = (token) => {
  localStorage.setItem('auth_token', token);
};

// Retrieve authentication token
export const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};`,
            impact: 'Storing authentication tokens in localStorage makes them accessible to any JavaScript running on the page. If an XSS vulnerability exists, attackers could steal these tokens and impersonate users.',
            recommendation: 'Use httpOnly cookies for storing authentication tokens when possible. If client-side storage is necessary, consider using more secure options like sessionStorage (with shorter lifetimes) or encryption.',
            references: [
              { title: 'OWASP LocalStorage Security', url: 'https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html#local-storage' },
              { title: 'Auth Token Storage Best Practices', url: 'https://auth0.com/docs/secure/security-guidance/data-security/token-storage' }
            ]
          }
        ]
      });
    }, 1000);
  });
};