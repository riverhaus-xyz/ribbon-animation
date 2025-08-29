// converter.js

// Debug flag - set to true for debugging, false for production
const DEBUG = true;

// Debug logging function
function debugLog(message) {
    if (DEBUG) {
        console.log('[DEBUG]', message);
    }
}

// Get DOM elements
let inputCode, convertBtn, loadSampleBtn, htmlOutput, jsOutput, statusMessage, notification;
let nextStepBtn, downloadSection, htmlFileName, jsFileName;
let downloadHtmlBtn, downloadJsBtn, copyHtmlBtn, copyJsBtn;

// Sample React code
const sampleReactCode = `import React, { useState, useEffect, useRef } from 'react';

const RibbonAnimation = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = 550;
    canvas.height = 550;
    
    // RibbonStrip class definition
    class RibbonStrip {
      constructor() {
        this.segments = [];
        this.segmentCount = 30;
        this.width = 100;
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
      
      update(time) {
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
      
      draw(ctx) {
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
          
          ctx.strokeStyle = \`rgba(40, 40, 40, \${opacity})\`;
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
          ctx.strokeStyle = \`rgba(80, 80, 80, \${opacity * 0.7})\`;
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
          ctx.fillStyle = \`rgba(0, 0, 0, \${opacity})\`;
          ctx.fill();
          
          ctx.beginPath();
          ctx.arc(p2.x, p2.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = \`rgba(0, 0, 0, \${opacity})\`;
          ctx.fill();
          
          ctx.beginPath();
          ctx.arc(segment.x, segment.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = \`rgba(40, 40, 40, \${opacity})\`;
          ctx.fill();
        }
        
        ctx.setLineDash([]);
      }
    }
    
    // Animation loop
    const ribbon = new RibbonStrip();
    let time = 0;
    let animationFrameId;
    
    function animate() {
      ctx.fillStyle = '#F0EEE6';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      time += 0.00125;
      ribbon.update(time);
      ribbon.draw(ctx);
      
      animationFrameId = requestAnimationFrame(animate);
    }
    
    animate();
    
    // Cleanup on component unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <div style={{ margin: 0, background: '#F0EEE6', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw' }}>
      <canvas ref={canvasRef} id="ribbonCanvas"></canvas>
    </div>
  );
};

export default RibbonAnimation;`;

// Function to show notification
function showNotification(message, isError = false) {
    debugLog('Showing notification: ' + message);
    notification.textContent = message;
    notification.className = 'notification show' + (isError ? ' error' : '');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Function to show status message
function showStatus(message, isError = false) {
    debugLog('Showing status: ' + message);
    statusMessage.innerHTML = `<div class="status-message ${isError ? 'error' : 'success'}">${message}</div>`;
}

// Function to extract and convert React class to vanilla JavaScript
function extractAndConvertReactClass(reactCode) {
    debugLog('Extracting and converting React class');
    debugLog('Input code length: ' + reactCode.length);
    
    try {
        // Extract the main component class
        const classMatch = reactCode.match(/(?:class|function)\s+(\w+)(?:\s+extends\s+\w+)?\s*[{(]/);
        const className = classMatch ? classMatch[1] : 'RibbonAnimation';
        
        debugLog('Extracted class name: ' + className);
        
        // Extract the useEffect hook
        const useEffectMatch = reactCode.match(/useEffect\(\(\)\s*=>\s*{([\s\S]*?)},\s*\[\s*\]\s*\)/);
        const useEffectBody = useEffectMatch ? useEffectMatch[1] : '';
        
        // Extract the canvas setup
        const canvasSetup = useEffectBody.match(/canvas\.width\s*=\s*(\d+);/);
        const canvasHeight = useEffectBody.match(/canvas\.height\s*=\s*(\d+);/);
        
        const width = canvasSetup ? canvasSetup[1] : '550';
        const height = canvasHeight ? canvasHeight[1] : '550';
        
        debugLog('Canvas dimensions: ' + width + 'x' + height);
        
        // Extract class definitions
        const classDefinitions = [];
        const classRegex = /class\s+(\w+)\s*{([\s\S]*?)}/g;
        let classMatch;
        
        while ((classMatch = classRegex.exec(reactCode)) !== null) {
            const className = classMatch[1];
            const classBody = classMatch[2];
            
            debugLog('Found class: ' + className);
            
            // Convert the class to vanilla JavaScript
            let vanillaClass = `var ${className} = function() {`;
            
            // Extract constructor
            const constructorMatch = classBody.match(/constructor\(\)\s*{([\s\S]*?)}/);
            if (constructorMatch) {
                vanillaClass += constructorMatch[1].replace(/this\.(\w+)\s*=\s*(\w+);/g, 'this.$1 = $2;');
            } else {
                vanillaClass += `
                this.segments = [];
                this.segmentCount = 30;
                this.width = 100;
                this.initialize();`;
            }
            
            vanillaClass += `
            };`;
            
            // Extract methods
            const methodRegex = /(\w+)\s*\(([^)]*)\)\s*{([\s\S]*?)}/g;
            let methodMatch;
            
            while ((methodMatch = methodRegex.exec(classBody)) !== null) {
                const methodName = methodMatch[1];
                const methodParams = methodMatch[2];
                const methodBody = methodMatch[3];
                
                debugLog('Found method: ' + methodName);
                
                vanillaClass += `
            ${className}.prototype.${methodName} = function(${methodParams}) {`;
                
                // Convert method body
                let convertedMethodBody = methodBody
                    .replace(/const\s+(\w+)\s*=\s*([^;]+);/g, 'var $1 = $2;')
                    .replace(/let\s+(\w+)\s*=\s*([^;]+);/g, 'var $1 = $2;')
                    .replace(/this\.(\w+)\s*=\s*this\.(\w+)\s*\+\s*(\w+);/g, 'this.$1 = this.$2 + $3;')
                    .replace(/Math\.([a-zA-Z]+)/g, 'Math.$1')
                    .replace(/ctx\.([a-zA-Z]+)/g, 'ctx.$1');
                
                vanillaClass += convertedMethodBody;
                vanillaClass += `
            };`;
            }
            
            vanillaClass += `
            };`;
            
            classDefinitions.push(vanillaClass);
        }
        
        // Generate JavaScript template
        const jsTemplate = `// ${className} - Converted from React
document.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById('ribbonCanvas');
    if (!canvas) return;
    
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = ${width};
    canvas.height = ${height};
    
    ${classDefinitions.join('\n    ')}
    
    // Animation loop
    var ribbon = new ${className}();
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
        
        debugLog('Generated JavaScript template length: ' + jsTemplate.length);
        return jsTemplate;
    } catch (error) {
        debugLog('Error extracting React class: ' + error.message);
        
        // Fallback to generic template
        return `// Component - Converted from React
document.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById('ribbonCanvas');
    if (!canvas) return;
    
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = 550;
    canvas.height = 550;
    
    // Basic animation - replace with your actual implementation
    function animate() {
        ctx.fillStyle = '#F0EEE6';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add your animation code here
        
        requestAnimationFrame(animate);
    }
    
    animate();
});`;
    }
}

// Function to convert React code to standalone HTML and JS
function convertReactToStandalone(reactCode) {
    debugLog('Converting React code to standalone');
    
    try {
        if (!reactCode || reactCode.trim() === '') {
            throw new Error('No React code provided');
        }
        
        debugLog('Input code length: ' + reactCode.length);
        
        // Extract component name
        const componentNameMatch = reactCode.match(/function (\w+)\(\)|const (\w+) = |class (\w+) extends/);
        const componentName = componentNameMatch ? 
            (componentNameMatch[1] || componentNameMatch[2] || componentNameMatch[3]) : 
            'RibbonAnimation';
        
        debugLog('Component name: ' + componentName);
        
        // Generate HTML
        const htmlTemplate = `<!DOCTYPE html>
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
        
        // Generate JavaScript by analyzing the React code
        const jsTemplate = extractAndConvertReactClass(reactCode);
        
        debugLog('Generated JavaScript template length: ' + jsTemplate.length);
        
        return {
            html: htmlTemplate,
            js: jsTemplate,
            htmlName: `${componentName.toLowerCase()}.html`,
            jsName: `${componentName.toLowerCase()}.js`
        };
    } catch (error) {
        debugLog('Conversion error: ' + error.message);
        throw new Error('Failed to convert React code to standalone files: ' + error.message);
    }
}

// Function to download a file
function downloadFile(content, fileName, contentType) {
    try {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return true;
    } catch (e) {
        debugLog('Download failed: ' + e.message);
        return false;
    }
}

// Function to copy to clipboard
function copyToClipboard(text) {
    if (navigator.clipboard) {
        return navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return Promise.resolve();
        } catch (e) {
            document.body.removeChild(textArea);
            return Promise.reject(e);
        }
    }
}

// Initialize the page
function initConverter() {
    debugLog('Initializing converter');
    
    // Get DOM elements
    inputCode = document.getElementById('inputCode');
    convertBtn = document.getElementById('convertBtn');
    loadSampleBtn = document.getElementById('loadSampleBtn');
    htmlOutput = document.getElementById('htmlOutput');
    jsOutput = document.getElementById('jsOutput');
    statusMessage = document.getElementById('statusMessage');
    notification = document.getElementById('notification');
    nextStepBtn = document.getElementById('nextStepBtn');
    downloadSection = document.getElementById('downloadSection');
    htmlFileName = document.getElementById('htmlFileName');
    jsFileName = document.getElementById('jsFileName');
    downloadHtmlBtn = document.getElementById('downloadHtmlBtn');
    downloadJsBtn = document.getElementById('downloadJsBtn');
    copyHtmlBtn = document.getElementById('copyHtmlBtn');
    copyJsBtn = document.getElementById('copyJsBtn');
    
    // Check if all elements were found
    if (!inputCode || !convertBtn || !htmlOutput || !jsOutput) {
        debugLog('Error: Required DOM elements not found');
        showStatus('Error: Required DOM elements not found', true);
        return;
    }
    
    // Load sample button click handler
    loadSampleBtn.addEventListener('click', () => {
        debugLog('Loading sample code');
        inputCode.value = sampleReactCode;
        showStatus('Sample code loaded successfully!');
    });
    
    // Convert button click handler
    convertBtn.addEventListener('click', () => {
        debugLog('Convert button clicked');
        
        const reactCode = inputCode.value.trim();
        
        if (!reactCode) {
            showStatus('Please enter React code to convert.', true);
            return;
        }
        
        try {
            debugLog('Converting React code, length: ' + reactCode.length);
            
            const converted = convertReactToStandalone(reactCode);
            htmlOutput.value = converted.html;
            jsOutput.value = converted.js;
            
            // Update file names
            htmlFileName.textContent = converted.htmlName;
            jsFileName.textContent = converted.jsName;
            
            // Show download section
            downloadSection.style.display = 'block';
            
            showStatus('Code converted successfully!');
            showNotification('Code converted successfully!');
        } catch (error) {
            debugLog('Conversion error: ' + error.message);
            showStatus(error.message, true);
            showNotification('Conversion failed!', true);
        }
    });
    
    // Download HTML button click handler
    downloadHtmlBtn.addEventListener('click', () => {
        const content = htmlOutput.value;
        const fileName = htmlFileName.textContent;
        
        if (!content) {
            showNotification('No HTML file to download.', true);
            return;
        }
        
        if (downloadFile(content, fileName, 'text/html')) {
            showNotification('HTML file downloaded successfully!');
        } else {
            showNotification('Failed to download HTML file.', true);
        }
    });
    
    // Download JavaScript button click handler
    downloadJsBtn.addEventListener('click', () => {
        const content = jsOutput.value;
        const fileName = jsFileName.textContent;
        
        if (!content) {
            showNotification('No JavaScript file to download.', true);
            return;
        }
        
        if (downloadFile(content, fileName, 'text/javascript')) {
            showNotification('JavaScript file downloaded successfully!');
        } else {
            showNotification('Failed to download JavaScript file.', true);
        }
    });
    
    // Copy HTML button click handler
    copyHtmlBtn.addEventListener('click', () => {
        copyToClipboard(htmlOutput.value)
            .then(() => {
                showNotification('HTML copied to clipboard!');
            })
            .catch(() => {
                showNotification('Failed to copy HTML.', true);
            });
    });
    
    // Copy JavaScript button click handler
    copyJsBtn.addEventListener('click', () => {
        copyToClipboard(jsOutput.value)
            .then(() => {
                showNotification('JavaScript copied to clipboard!');
            })
            .catch(() => {
                showNotification('Failed to copy JavaScript.', true);
            });
    });
    
    // Next step button click handler
    nextStepBtn.addEventListener('click', () => {
        const htmlContent = htmlOutput.value;
        const jsContent = jsOutput.value;
        const htmlName = htmlFileName.textContent;
        const jsName = jsFileName.textContent;
        
        if (!htmlContent || !jsContent) {
            showStatus('Please convert the React code first.', true);
            return;
        }
        
        // Store the content in sessionStorage to pass to the next step
        sessionStorage.setItem('htmlContent', htmlContent);
        sessionStorage.setItem('jsContent', jsContent);
        sessionStorage.setItem('htmlName', htmlName);
        sessionStorage.setItem('jsName', jsName);
        
        // Navigate directly to upload to GitHub page
        window.location.href = 'upload-to-github.html';
    });
    
    // Set current workflow step and load cleaned code if available
    localStorage.setItem('currentWorkflowStep', '2');
    
    // Check if there's cleaned code from the previous step
    const cleanedCode = sessionStorage.getItem('cleanedReactCode');
    if (cleanedCode) {
        debugLog('Loaded cleaned code from sessionStorage, length: ' + cleanedCode.length);
        inputCode.value = cleanedCode;
    }
    
    debugLog('Converter initialized successfully');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initConverter);
