// Mock AI service for fix suggestions and explanations

export const getAIFix = (issueId: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock response based on issue ID
      if (issueId === 'issue1') {
        resolve(`I've analyzed the XSS vulnerability in your code. Here's how to fix it:

Replace this:
\`\`\`jsx
{error && <div className="error-message" dangerouslySetInnerHTML={{ __html: error }} />}
\`\`\`

With this:
\`\`\`jsx
{error && <div className="error-message">{error}</div>}
\`\`\`

This change prevents XSS attacks by treating the error message as plain text rather than interpreting it as HTML. React will automatically escape any potentially dangerous characters.

If you need to display formatted text, consider using a library like DOMPurify to sanitize the HTML first:

\`\`\`jsx
import DOMPurify from 'dompurify';

// Then in your component:
{error && <div className="error-message" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(error) }} />}
\`\`\`

Remember to also validate and sanitize data on the server side, as client-side validation alone is not sufficient.`);
      } else {
        resolve(`I've analyzed the issue and here's my suggested fix:

1. First, identify the root cause of the vulnerability
2. Replace the unsafe code with a more secure alternative
3. Add proper validation and sanitization
4. Test thoroughly to ensure the fix doesn't introduce new issues

For more specific guidance, please provide the full context of the code.`);
      }
    }, 1200);
  });
};

export const getAIExplanation = (issueId: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock response based on issue ID
      if (issueId === 'issue1') {
        resolve(`This is a Cross-Site Scripting (XSS) vulnerability in your React application.

The issue occurs because you're using the dangerouslySetInnerHTML prop with user-controlled data (the error message). The name "dangerous" is intentional - this React feature bypasses the automatic HTML escaping that React normally does to protect against XSS.

When using dangerouslySetInnerHTML with content that includes user input or data from external sources, you're creating an XSS vulnerability. If an attacker can control the error message (for example, by causing a specific error on your backend), they could inject malicious JavaScript that would execute in your users' browsers.

For example, if the error message contained:
\`<img src="x" onerror="alert(document.cookie)">\`

This would execute the JavaScript and potentially steal user cookies or perform other malicious actions.

XSS attacks can lead to session hijacking, credential theft, defacement, or distribution of malware to your users.`);
      } else {
        resolve(`This security issue could potentially expose your application to attacks. 

The vulnerability works by exploiting unvalidated or improperly sanitized user input, allowing malicious actors to inject code or commands that the application then executes.

To understand the severity:
- Consider what data might be exposed
- Evaluate if it could lead to authentication bypass
- Determine if it affects all users or only specific ones
- Check if it requires authentication to exploit

Security issues like this one should be addressed promptly as they can significantly impact your application's security posture.`);
      }
    }, 1200);
  });
};