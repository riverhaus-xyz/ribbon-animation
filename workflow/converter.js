// converter.js - Fixed version that actually analyzes input code
console.log("converter.js loaded");

// Debug flag - set to true for debugging, false for production
const DEBUG = true;

// Debug logging function
function debugLog(message) {
    if (DEBUG) {
        console.log('[DEBUG]', message);
    }
}

// Function to extract component name from React code
function extractComponentName(reactCode) {
    debugLog('Extracting component name');
    
    // Try different patterns to find the component name
    const patterns = [
        /function\s+(\w+)\s*\(/,          // function ComponentName(
        /const\s+(\w+)\s*=\s*\(/,         // const ComponentName = (
        /class\s+(\w+)\s+extends/,        // class ComponentName extends
        /export\s+default\s+function\s+(\w+)\s*\(/,  // export default function ComponentName(
        /export\s+default\s+class\s+(\w+)\s+extends/  // export default class ComponentName extends
    ];
    
    for (const pattern of patterns) {
        const match = reactCode.match(pattern);
        if (match) {
            debugLog('Found component name: ' + match[1]);
            return match[1];
        }
    }
    
    debugLog('No component name found, using default');
    return 'RibbonAnimation';
}

// Function to extract canvas dimensions from React code
function extractCanvasDimensions(reactCode) {
    debugLog('Extracting canvas dimensions');
    
    // Look for canvas.width and canvas.height settings
    const widthMatch = reactCode.match(/canvas\.width\s*=\s*(\d+)/);
    const heightMatch = reactCode.match(/canvas\.height\s*=\s*(\d+)/);
    
    const width = widthMatch ? widthMatch[1] : '550';
    const height = heightMatch ? heightMatch[1] : '550';
    
    debugLog('Canvas dimensions: ' + width + 'x' + height);
    return { width, height };
}

// Function to extract background color from React code
function extractBackgroundColor(reactCode) {
    debugLog('Extracting background color');
    
    // Look for background color in style or canvas fill
    const patterns = [
        /background:\s*['"]([^'"]+)['"]/,    // background: '#F0EEE6'
        /fillStyle\s*=\s*['"]([^'"]+)['"]/,  // fillStyle = '#F0EEE6'
        /backgroundColor:\s*['"]([^'"]+)['"]/ // backgroundColor: '#F0EEE6'
    ];
    
    for (const pattern of patterns) {
        const match = reactCode.match(pattern);
        if (match) {
            debugLog('Found background color: ' + match[1]);
            return match[1];
        }
    }
    
    debugLog('No background color found, using default');
    return '#F0EEE6';
}

// Function to extract classes from React code
function extractClasses(reactCode) {
    debugLog('Extracting classes');
    
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
        
        classDefinitions.push(vanillaClass);
    }
    
    return classDefinitions;
}

// Main conversion function
function convertReactToStandalone(reactCode) {
    debugLog('Converting React code to standalone');
    debugLog('Input code length: ' + reactCode.length);
    
    try {
        if (!reactCode || reactCode.trim() === '') {
            throw new Error('No React code provided');
        }
        
        // Extract component information
        const componentName = extractComponentName(reactCode);
        const { width, height } = extractCanvasDimensions(reactCode);
        const backgroundColor = extractBackgroundColor(reactCode);
        
        debugLog('Component name: ' + componentName);
        debugLog('Canvas dimensions: ' + width + 'x' + height);
        debugLog('Background color: ' + backgroundColor);
        
        // Extract classes
        const classDefinitions = extractClasses(reactCode);
        
        // If no classes were found, create a fallback
        if (classDefinitions.length === 0) {
            debugLog('No classes found, creating fallback');
            classDefinitions.push(`var ${componentName} = function() {
                this.segments = [];
                this.segmentCount = 30;
                this.width = 100;
                this.initialize();
            };
            
            ${componentName}.prototype.initialize = function() {
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
            };
            
            ${componentName}.prototype.update = function(time) {
                const centerX = ${width} / 2;
                const centerY = ${height} / 2;
                
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
            };
            
            ${componentName}.prototype.draw = function(ctx) {
                // Implementation would go here
            };`);
        }
        
        // Generate HTML template
        const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${componentName}</title>
    <style>
        body {
            margin: 0;
            background: ${backgroundColor};
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
        
        // Generate JavaScript template
        const jsTemplate = `// ${componentName} - Converted from React
document.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById('ribbonCanvas');
    if (!canvas) return;
    
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = ${width};
    canvas.height = ${height};
    
    ${classDefinitions.join('\n    ')}
    
    // Animation loop
    var ribbon = new ${componentName}();
    var time = 0;
    var animationFrameId;
    
    function animate() {
        ctx.fillStyle = '${backgroundColor}';
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

// Make the function available globally
window.convertReactToStandalone = convertReactToStandalone;
