import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ScanResult, Issue } from '../types/scanTypes';

const severityColors = {
  critical: '#EF4444',
  high: '#F97316',
  medium: '#FBBF24',
  low: '#3B82F6'
};

export const generateSecurityReport = (scanResult: ScanResult): void => {
  const doc = new jsPDF();
  let yPos = 20;

  // Add logo and header
  doc.setFillColor(59, 130, 246); // Blue background
  doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('Security Scan Report', 20, 25);
  
  doc.setFontSize(12);
  doc.text(new Date(scanResult.completedAt).toLocaleDateString(), 
    doc.internal.pageSize.width - 20, 25, { align: 'right' });

  yPos = 50;

  // Project Info in a styled box
  doc.setDrawColor(59, 130, 246);
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(20, yPos, doc.internal.pageSize.width - 40, 40, 3, 3, 'FD');
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.text(`Project: ${scanResult.projectName}`, 30, yPos + 15);
  doc.text(`Security Score: ${scanResult.securityScore}/100`, 30, yPos + 30);

  yPos += 50;

  // Summary Statistics Table
  autoTable(doc, {
    startY: yPos,
    head: [['Metric', 'Value']],
    body: [
      ['Files Scanned', scanResult.filesScanned.toString()],
      ['Lines of Code', scanResult.linesOfCode.toLocaleString()],
      ['Scan Duration', `${scanResult.duration} seconds`],
      ['Total Issues', Object.values(scanResult.issuesBySeverity).reduce((a, b) => a + b, 0).toString()]
    ],
    headStyles: { fillColor: [59, 130, 246] },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    margin: { left: 20, right: 20 }
  });

  yPos = (doc as any).lastAutoTable.finalY + 20;

  // Issues by Severity Chart
  doc.setFontSize(16);
  doc.text('Issues by Severity', 20, yPos);
  yPos += 10;

  const severities = Object.entries(scanResult.issuesBySeverity);
  const total = severities.reduce((sum, [_, count]) => sum + count, 0);
  let startAngle = 0;

  // Draw pie chart using polygon segments instead of arc
  const centerX = 70;
  const centerY = yPos + 40;
  const radius = 30;
  const segments = 32; // Number of segments to approximate a circle

  severities.forEach(([severity, count]) => {
    const angle = (count / total) * 2 * Math.PI;
    const endAngle = startAngle + angle;
    
    // Convert hex color to RGB
    const hex = severityColors[severity as keyof typeof severityColors];
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    doc.setFillColor(r, g, b);
    
    // Draw pie slice using multiple triangles
    for (let i = 0; i < segments; i++) {
      const segStartAngle = startAngle + (angle * i) / segments;
      const segEndAngle = startAngle + (angle * (i + 1)) / segments;
      
      const x1 = centerX + radius * Math.cos(segStartAngle);
      const y1 = centerY + radius * Math.sin(segStartAngle);
      const x2 = centerX + radius * Math.cos(segEndAngle);
      const y2 = centerY + radius * Math.sin(segEndAngle);
      
      // Draw triangle
      doc.triangle(
        centerX, centerY,
        x1, y1,
        x2, y2,
        'F'
      );
    }
    
    startAngle = endAngle;
  });

  // Legend
  let legendY = yPos + 10;
  severities.forEach(([severity, count]) => {
    const hex = severityColors[severity as keyof typeof severityColors];
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    doc.setFillColor(r, g, b);
    doc.text(`${severity.charAt(0).toUpperCase() + severity.slice(1)}: ${count}`, 120, legendY + 8);
    legendY += 15;
  });

  yPos += 90;

  // Detailed Issues Table
  doc.addPage();
  
  autoTable(doc, {
    head: [['Severity', 'Issue', 'Location', 'Status']],
    body: scanResult.issues.map(issue => [
      issue.severity.toUpperCase(),
      issue.title,
      `${issue.filePath}:${issue.lineNumber}`,
      issue.status
    ]),
    headStyles: { fillColor: [59, 130, 246] },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 80 },
      2: { cellWidth: 40 },
      3: { cellWidth: 30 }
    },
    margin: { left: 20, right: 20 }
  });

  // Detailed Analysis for each issue
  scanResult.issues.forEach((issue: Issue) => {
    doc.addPage();
    
    // Issue Header
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, doc.internal.pageSize.width, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text(issue.title, 20, 20);

    let detailsY = 40;
    
    // Issue Details Table
    autoTable(doc, {
      startY: detailsY,
      body: [
        ['Severity', issue.severity.toUpperCase()],
        ['Type', issue.type],
        ['Status', issue.status],
        ['Location', `${issue.filePath}:${issue.lineNumber}`]
      ],
      theme: 'plain',
      styles: { cellPadding: 5 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 40 },
        1: { cellWidth: 100 }
      },
      margin: { left: 20 }
    });

    detailsY = (doc as any).lastAutoTable.finalY + 10;

    // Description
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Description', 20, detailsY);
    
    const splitDescription = doc.splitTextToSize(issue.description, 170);
    doc.setFontSize(12);
    doc.text(splitDescription, 20, detailsY + 10);

    detailsY += splitDescription.length * 7 + 20;

    // Impact
    doc.setFontSize(14);
    doc.text('Impact', 20, detailsY);
    
    const splitImpact = doc.splitTextToSize(issue.impact, 170);
    doc.setFontSize(12);
    doc.text(splitImpact, 20, detailsY + 10);

    detailsY += splitImpact.length * 7 + 20;

    // Recommendation
    doc.setFontSize(14);
    doc.text('Recommendation', 20, detailsY);
    
    const splitRecommendation = doc.splitTextToSize(issue.recommendation, 170);
    doc.setFontSize(12);
    doc.text(splitRecommendation, 20, detailsY + 10);

    detailsY += splitRecommendation.length * 7 + 20;

    // Code Snippet
    if (detailsY > doc.internal.pageSize.height - 60) {
      doc.addPage();
      detailsY = 20;
    }

    doc.setFillColor(241, 245, 249);
    doc.roundedRect(20, detailsY, doc.internal.pageSize.width - 40, 60, 3, 3, 'F');
    
    doc.setFontSize(12);
    const splitCode = doc.splitTextToSize(issue.codeSnippet, 160);
    doc.text(splitCode, 25, detailsY + 10);
  });

  // Save the PDF
  doc.save(`security-report-${scanResult.projectName}-${new Date().toISOString().split('T')[0]}.pdf`);
};