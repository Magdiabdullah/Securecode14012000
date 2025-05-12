import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface RiskScoreGaugeProps {
  score: number;
  size?: 'small' | 'medium' | 'large';
}

const RiskScoreGauge: React.FC<RiskScoreGaugeProps> = ({ score, size = 'large' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const [animatedScore, setAnimatedScore] = useState(0);
  
  // Calculate dimensions based on size
  const getDimensions = () => {
    switch (size) {
      case 'small': return { width: 120, height: 120, thickness: 8 };
      case 'medium': return { width: 160, height: 160, thickness: 10 };
      case 'large': return { width: 200, height: 200, thickness: 12 };
    }
  };
  
  const dimensions = getDimensions();

  useEffect(() => {
    // Animate the score from 0 to the actual value
    const duration = 1000; // 1 second animation
    const startTime = Date.now();
    
    const animateScore = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentScore = Math.round(progress * score);
      
      setAnimatedScore(currentScore);
      
      if (progress < 1) {
        requestAnimationFrame(animateScore);
      }
    };
    
    animateScore();
  }, [score]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set actual canvas dimensions
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = (canvas.width / 2) - (dimensions.thickness / 2);
    
    // Draw background arc (gray)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI * 0.75, Math.PI * 2.25, false);
    ctx.lineWidth = dimensions.thickness;
    ctx.strokeStyle = theme === 'dark' ? '#374151' : '#E5E7EB';
    ctx.stroke();
    
    // Calculate score ratio and corresponding angle
    const ratio = animatedScore / 100;
    const angleOffset = Math.PI * 0.75; // Start at 135 degrees
    const angleDiff = Math.PI * 1.5; // Total arc is 270 degrees
    const angle = angleOffset + (ratio * angleDiff);
    
    // Get color based on score
    const getScoreColor = () => {
      if (animatedScore >= 80) return '#10B981'; // Green
      if (animatedScore >= 60) return '#FBBF24'; // Yellow
      if (animatedScore >= 40) return '#F97316'; // Orange
      return '#EF4444'; // Red
    };
    
    // Draw score arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, angleOffset, angle, false);
    ctx.lineWidth = dimensions.thickness;
    ctx.strokeStyle = getScoreColor();
    ctx.lineCap = 'round';
    ctx.stroke();
    
  }, [animatedScore, theme, dimensions]);

  // Get text size based on gauge size
  const getTextSize = () => {
    switch (size) {
      case 'small': return { score: 'text-2xl', label: 'text-xs' };
      case 'medium': return { score: 'text-3xl', label: 'text-sm' };
      case 'large': return { score: 'text-4xl', label: 'text-base' };
    }
  };
  
  const textSize = getTextSize();
  
  // Get color based on score
  const getTextColor = () => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="relative" style={{ width: dimensions.width, height: dimensions.height }}>
      <canvas ref={canvasRef} />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`${textSize.score} font-bold ${getTextColor()}`}>{animatedScore}</span>
        <span className={`${textSize.label} ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Security Score
        </span>
      </div>
    </div>
  );
};

export default RiskScoreGauge;