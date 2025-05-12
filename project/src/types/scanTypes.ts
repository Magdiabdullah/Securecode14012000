export interface DashboardStats {
  securityScore: number;
  securityScoreTrend: number;
  totalIssues: number;
  totalIssuesTrend: number;
  scannedFiles: number;
  scannedFilesTrend: number;
  resolvedIssues: number;
  resolvedIssuesTrend: number;
  criticalIssues: number;
  highIssues: number;
  mediumIssues: number;
  lowIssues: number;
  issueTypes: {
    label: string;
    value: number;
    color: string;
  }[];
}

export interface RecentScan {
  id: string;
  projectId: string;
  projectName: string;
  date: string;
  language: string;
  securityScore: number;
  totalIssues: number;
  criticalIssues: number;
  status: string;
}

export interface IssueReference {
  title: string;
  url: string;
}

export interface Issue {
  id: string;
  fileId: string;
  filePath: string;
  lineNumber: number;
  title: string;
  description: string;
  severity: string;
  type: string;
  status: string;
  codeSnippet: string;
  impact: string;
  recommendation: string;
  references: IssueReference[];
}

export interface ScanResult {
  id: string;
  projectId: string;
  projectName: string;
  scanType: string;
  language: string;
  status: string;
  startedAt: string;
  completedAt: string;
  duration: number;
  securityScore: number;
  filesScanned: number;
  linesOfCode: number;
  issuesBySeverity: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  issues: Issue[];
}