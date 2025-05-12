import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface IssueTypeData {
  label: string;
  value: number;
  color: string;
}

interface IssueTypePieChartProps {
  data: IssueTypeData[];
}

const IssueTypePieChart: React.FC<IssueTypePieChartProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  
  useEffect(() => {
    if (!data.length) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set actual canvas dimensions
    canvas.width = 200;
    canvas.height = 200;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;
    
    // Calculate total value
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    // Start at the top (negative y-axis)
    let startAngle = -Math.PI / 2;
    
    // Draw each slice
    data.forEach(item => {
      // Calculate slice angle
      const sliceAngle = (item.value / total) * (Math.PI * 2);
      
      // Calculate end angle
      const endAngle = startAngle + sliceAngle;
      
      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = item.color;
      ctx.fill();
      
      // Draw a white (or dark in dark mode) border between slices
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = theme === 'dark' ? '#1F2937' : '#FFFFFF';
      ctx.stroke();
      
      // Update start angle for next slice
      startAngle = endAngle;
    });
    
    // Draw a circle in the center for a donut chart effect
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = theme === 'dark' ? '#1F2937' : '#FFFFFF';
    ctx.fill();
    
  }, [data, theme]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 200, height: 200 }}>
        <canvas ref={canvasRef} />
        {!data.length && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
            No data available
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4 w-full">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: item.color }}
            />
            <div className="text-sm">
              <span className="font-medium">{item.label}</span>
              <span className={`ml-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                ({item.value})
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IssueTypePieChart;