// Get DOM elements
const inputCode = document.getElementById('inputCode');
const htmlOutput = document.getElementById('htmlOutput');
const jsOutput = document.getElementById('jsOutput');
const convertBtn = document.getElementById('convertBtn');
const loadSampleBtn = document.getElementById('loadSampleBtn');
const notification = document.getElementById('notification');
const statusMessage = document.getElementById('statusMessage');

// Function to show status message
function showStatus(message, isError) {
    statusMessage.textContent = message;
    if (isError) {
        statusMessage.className = 'status-message error';
    } else {
        statusMessage.className = 'status-message success';
    }
}

// Load sample React code
loadSampleBtn.addEventListener('click', function() {
    inputCode.value = `import React, { useEffect, useRef } from 'react';

interface RibbonSegment {
  x: number;
  y: number;
  angle: number;
  width: number;
  height: number;
  depth: number;
}

interface RibbonStrip {
  segments: RibbonSegment[];
  segmentCount: number;
  width: number;
  initialize: () => void;
  update: (time: number) => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

const DramaticRibbonFold = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = 550;
    canvas.height = 550;
    
    class RibbonStrip {
      segments: RibbonSegment[] = [];
      segmentCount: number = 30;
      width: number = 100;
      
      constructor() {
        this.initialize();
      }
      
      initialize() {
        for (let i = 0; i < this.segmentCount; i++) {
          this.segments.push({
            x: 0,
            y: 0,
            angle: 0,
            width: this.width,
            height: 20,
            depth: 0
          });
        }
      }
      
      update(time: number) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        for (let i = 0; i < this.segments.length; i++) {
          const t = i / (this.segments.length - 1);
          const segment = this.segments[i];
          
          const smoothTime = time * 0.25;
          const baseAngle = t * Math.PI * 6 + smoothTime;
          const foldPhase = Math.sin(smoothTime * 0.01 + t * Math.PI * 4);
          const heightPhase = Math.cos(smoothTime * 0.00375 + t * Math.PI * 3);
          
          const radius = 120 + foldPhase * 60;
          segment.x = centerX + Math.cos(baseAngle) * radius;
          segment.y = centerY + Math.sin(baseAngle) * radius + heightPhase * 30;
          
          segment.angle = baseAngle + foldPhase * Math.PI * 0.5;
          segment.width = this.width * (1 + foldPhase * 0.3);
          segment.depth = Math.sin(baseAngle + time * 0.15);
        }
      }
      
      draw(ctx: CanvasRenderingContext2D) {
        ctx.lineWidth = 1.5;
        ctx.setLineDash([2, 2]);
        
        const sortedSegments = [...this.segments].sort((a, b) => {
          const threshold = 0.1;
          return Math.abs(a.depth - b.depth) > threshold ? a.depth - b.depth : 0;
        });
        
        for (let i = 0; i < sortedSegments.length - 1; i++) {
          const current = sortedSegments[i];
          const next = sortedSegments[i + 1];
          
          ctx.save();
          ctx.beginPath();
          
          const cos1 = Math.cos(current.angle);
          const sin1 = Math.sin(current.angle);
          const cos2 = Math.cos(next.angle);
          const sin2 = Math.sin(next.angle);
          
          const p1 = {
            x: current.x - sin1 * current.width/2,
            y: current.y + cos1 * current.width/2
          };
          const p2 = {
            x: current.x + sin1 * current.width/2,
            y: current.y - cos1 * current.width/2
          };
          const p3 = {
            x: next.x + sin2 * next.width/2,
            y: next.y - cos2 * next.width/2
          };
          const p4 = {
            x: next.x - sin2 * next.width/2,
            y: next.y + cos2 * next.width/2
          };
          
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.lineTo(p4.x, p4.y);
          ctx.closePath();
          
          const depthFactor = (current.depth + 1) * 0.5;
          const opacity = 0.6 + depthFactor * 0.4;
          
          ctx.strokeStyle = 'rgba(40, 40, 40, ' + opacity + ')';
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(p2.x, p2.y);
          ctx.lineTo(p4.x, p4.y);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(current.x, current.y);
          ctx.lineTo(next.x, next.y);
          ctx.strokeStyle = 'rgba(80, 80, 80, ' + (opacity * 0.7) + ')';
          ctx.stroke();
          
          ctx.restore();
        }
        
        for (let i = 0; i < sortedSegments.length; i++) {
          const segment = sortedSegments[i];
          const cos = Math.cos(segment.angle);
          const sin = Math.sin(segment.angle);
          
          const p1 = {
            x: segment.x - sin * segment.width/2,
            y: segment.y + cos * segment.width/2
          };
          const p2 = {
            x: segment.x + sin * segment.width/2,
            y: segment.y - cos * segment.width/2
          };
          
          const depthFactor = (segment.depth + 1) * 0.5;
          const opacity = 0.7 + depthFactor * 0.3;
          
          ctx.beginPath();
          ctx.arc(p1.x, p1.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0, 0, 0, ' + opacity + ')';
          ctx.fill();
          
          ctx.beginPath();
          ctx.arc(p2.x, p2.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0, 0, 0, ' + opacity + ')';
          ctx.fill();
          
          ctx.beginPath();
          ctx.arc(segment.x, segment.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(40, 40, 40, ' + opacity + ')';
          ctx.fill();
        }
        
        ctx.setLineDash([]);
      }
    }
    
    const ribbon = new RibbonStrip();
    let time = 0;
    let animationFrameId: number;
    
    function animate() {
      ctx.fillStyle = '#F0EEE6';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      time += 0.00125;
      ribbon.update(time);
      ribbon.draw(ctx);
      
      animationFrameId = requestAnimationFrame(animate);
    }
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ribbon.segments = [];
      time = 0;
    };
  }, []);
  
  return (
    <div style={{
      margin: 0,
      background: '#F0EEE6',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      position: 'relative'
    }}>
      <canvas 
        ref={canvasRef} 
        style={{ 
          display: 'block',
          width: '550px',
          height: '550px'
        }} 
      />
    </div>
  );
};

export default DramaticRibbonFold;`;
});

// Convert React code to standalone files
convertBtn.addEventListener('click', function() {
    const reactCode = inputCode.value;
    if (!reactCode.trim()) {
        showStatus('Please paste some React code first.', true);
        return;
    }
    
    try {
        // Extract the component name
        const componentNameMatch = reactCode.match(/const (\w+) = \(\) =>/);
        const componentName = componentNameMatch ? componentNameMatch[1] : 'RibbonAnimation';
        
        // Generate HTML
        const htmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${componentName}</title>
    <style>
        body {
            margin: 0;
            background: #F0EEE6;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            width: 100vw;
        }
        canvas {
            display: block;
        }
    </style>
</head>
<body>
    <canvas id="ribbonCanvas"></canvas>
    <script src="${componentName.toLowerCase()}.js"></script>
</body>
</html>`;
        
        // Generate JavaScript
        const jsCode = `// ${componentName} - Converted from React
document.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById('ribbonCanvas');
    if (!canvas) return;
    
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = 550;
    canvas.height = 550;
    
    // RibbonStrip class definition
    var RibbonStrip = function() {
        this.segments = [];
        this.segmentCount = 30;
        this.width = 100;
        this.initialize();
    };
    
    RibbonStrip.prototype.initialize = function() {
        for (var i = 0; i < this.segmentCount; i++) {
            this.segments.push({
                x: 0,
                y: 0,
                angle: 0,
                width: this.width,
                height: 20,
                depth: 0
            });
        }
    };
    
    RibbonStrip.prototype.update = function(time) {
        var centerX = canvas.width / 2;
        var centerY = canvas.height / 2;
        
        for (var i = 0; i < this.segments.length; i++) {
            var t = i / (this.segments.length - 1);
            var segment = this.segments[i];
            
            var smoothTime = time * 0.25;
            var baseAngle = t * Math.PI * 6 + smoothTime;
            var foldPhase = Math.sin(smoothTime * 0.01 + t * Math.PI * 4);
            var heightPhase = Math.cos(smoothTime * 0.00375 + t * Math.PI * 3);
            
            var radius = 120 + foldPhase * 60;
            segment.x = centerX + Math.cos(baseAngle) * radius;
            segment.y = centerY + Math.sin(baseAngle) * radius + heightPhase * 30;
            
            segment.angle = baseAngle + foldPhase * Math.PI * 0.5;
            segment.width = this.width * (1 + foldPhase * 0.3);
            segment.depth = Math.sin(baseAngle + time * 0.15);
        }
    };
    
    RibbonStrip.prototype.draw = function(ctx) {
        ctx.lineWidth = 1.5;
        ctx.setLineDash([2, 2]);
        
        var sortedSegments = this.segments.slice().sort(function(a, b) {
            var threshold = 0.1;
            return Math.abs(a.depth - b.depth) > threshold ? a.depth - b.depth : 0;
        });
        
        for (var i = 0; i < sortedSegments.length - 1; i++) {
            var current = sortedSegments[i];
            var next = sortedSegments[i + 1];
            
            ctx.save();
            ctx.beginPath();
            
            var cos1 = Math.cos(current.angle);
            var sin1 = Math.sin(current.angle);
            var cos2 = Math.cos(next.angle);
            var sin2 = Math.sin(next.angle);
            
            var p1 = {
                x: current.x - sin1 * current.width/2,
                y: current.y + cos1 * current.width/2
            };
            var p2 = {
                x: current.x + sin1 * current.width/2,
                y: current.y - cos1 * current.width/2
            };
            var p3 = {
                x: next.x + sin2 * next.width/2,
                y: next.y - cos2 * next.width/2
            };
            var p4 = {
                x: next.x - sin2 * next.width/2,
                y: next.y + cos2 * next.width/2
            };
            
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.lineTo(p4.x, p4.y);
            ctx.closePath();
            
            var depthFactor = (current.depth + 1) * 0.5;
            var opacity = 0.6 + depthFactor * 0.4;
            
            ctx.strokeStyle = 'rgba(40, 40, 40, ' + opacity + ')';
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(p2.x, p2.y);
            ctx.lineTo(p4.x, p4.y);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(current.x, current.y);
            ctx.lineTo(next.x, next.y);
            ctx.strokeStyle = 'rgba(80, 80, 80, ' + (opacity * 0.7) + ')';
            ctx.stroke();
            
            ctx.restore();
        }
        
        for (var i = 0; i < sortedSegments.length; i++) {
            var segment = sortedSegments[i];
            var cos = Math.cos(segment.angle);
            var sin = Math.sin(segment.angle);
            
            var p1 = {
                x: segment.x - sin * segment.width/2,
                y: segment.y + cos * segment.width/2
            };
            var p2 = {
                x: segment.x + sin * segment.width/2,
                y: segment.y - cos * segment.width/2
            };
            
            var depthFactor = (segment.depth + 1) * 0.5;
            var opacity = 0.7 + depthFactor * 0.3;
            
            ctx.beginPath();
            ctx.arc(p1.x, p1.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 0, 0, ' + opacity + ')';
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(p2.x, p2.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 0, 0, ' + opacity + ')';
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(segment.x, segment.y, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(40, 40, 40, ' + opacity + ')';
            ctx.fill();
        }
        
        ctx.setLineDash([]);
    };
    
    // Animation loop
    var ribbon = new RibbonStrip();
    var time = 0;
    var animationFrameId;
    
    function animate() {
        ctx.fillStyle = '#F0EEE6';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        time += 0.00125;
        ribbon.update(time);
        ribbon.draw(ctx);
        
        animationFrameId = requestAnimationFrame(animate);
    }
    
    animate();
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', function() {
        cancelAnimationFrame(animationFrameId);
    });
});`;
        
        htmlOutput.value = htmlCode;
        jsOutput.value = jsCode;
        
        showStatus('Code converted successfully!');
        
        // Show notification
        notification.classList.add('show');
        setTimeout(function() {
            notification.classList.remove('show');
        }, 3000);
    } catch (error) {
        showStatus('Error converting code: ' + error.message, true);
        console.error('Conversion error:', error);
    }
});
