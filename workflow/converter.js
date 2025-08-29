// converter.js - Fixed to handle HTML files
console.log("converter.js loaded");

// Debug flag - set to true for debugging, false for production
const DEBUG = true;

// Debug logging function
function debugLog(message) {
    if (DEBUG) {
        console.log('[DEBUG]', message);
    }
}

// Function to check if input is HTML
function isHtmlInput(input) {
    return input.trim().startsWith('<!DOCTYPE html') || 
           input.trim().startsWith('<html') || 
           input.includes('<canvas') && input.includes('<script src=');
}

// Function to extract information from HTML
function extractFromHtml(htmlCode) {
    debugLog('Extracting information from HTML');
    
    // Extract title
    const titleMatch = htmlCode.match(/<title>(.*?)<\/title>/);
    const title = titleMatch ? titleMatch[1] : 'Animation';
    
    // Extract script file name
    const scriptMatch = htmlCode.match(/<script\s+src="(.*?)"><\/script>/);
    const scriptFile = scriptMatch ? scriptMatch[1] : 'animation.js';
    
    // Extract canvas dimensions
    const canvasMatch = htmlCode.match(/<canvas\s+[^>]*width="(\d+)"[^>]*height="(\d+)"/);
    const width = canvasMatch ? canvasMatch[1] : '550';
    const height = canvasMatch ? canvasMatch[2] : '550';
    
    // Extract background color
    const bgColorMatch = htmlCode.match(/background:\s*(.*?);/);
    const bgColor = bgColorMatch ? bgColorMatch[1] : '#F0EEE6';
    
    debugLog(`Extracted: title=${title}, script=${scriptFile}, dimensions=${width}x${height}, bgColor=${bgColor}`);
    
    return {
        title,
        scriptFile,
        width,
        height,
        bgColor
    };
}

// Function to generate HTML from extracted info
function generateHtmlFromExtracted(info) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${info.title}</title>
    <style>
        body {
            margin: 0;
            background: ${info.bgColor};
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
    <canvas id="ribbonCanvas" width="${info.width}" height="${info.height}"></canvas>
    <script src="${info.scriptFile}"></script>
</body>
</html>`;
}

// Function to generate placeholder JS
function generatePlaceholderJs(scriptFile) {
    return `// This file should contain the JavaScript code from ${scriptFile}
// The conversion process cannot extract JavaScript from HTML files
// Please manually copy the content of ${scriptFile} here

document.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById('ribbonCanvas');
    if (!canvas) return;
    
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Animation code should be here
    console.log('Please replace this with your actual animation code');
});`;
}

// Main conversion function
function convertReactToStandalone(inputCode) {
    debugLog('Converting input to standalone');
    debugLog('Input code length: ' + inputCode.length);
    
    try {
        if (!inputCode || inputCode.trim() === '') {
            throw new Error('No input provided');
        }
        
        // Check if input is HTML
        if (isHtmlInput(inputCode)) {
            debugLog('Input is HTML, extracting information');
            
            const info = extractFromHtml(inputCode);
            const htmlTemplate = generateHtmlFromExtracted(info);
            const jsTemplate = generatePlaceholderJs(info.scriptFile);
            
            return {
                html: htmlTemplate,
                js: jsTemplate,
                htmlName: `${info.title.toLowerCase()}.html`,
                jsName: info.scriptFile
            };
        }
        
        // If not HTML, try to process as React code
        debugLog('Input is not HTML, processing as React code');
        
        // Extract component name
        const componentNameMatch = inputCode.match(/(?:function|const|class)\s+(\w+)/);
        const componentName = componentNameMatch ? componentNameMatch[1] : 'RibbonAnimation';
        
        // Extract canvas dimensions
        const widthMatch = inputCode.match(/canvas\.width\s*=\s*(\d+)/);
        const heightMatch = inputCode.match(/canvas\.height\s*=\s*(\d+)/);
        const width = widthMatch ? widthMatch[1] : '550';
        const height = heightMatch ? heightMatch[1] : '550';
        
        // Extract background color
        const bgColorMatch = inputCode.match(/background:\s*['"]([^'"]+)['"]/);
        const bgColor = bgColorMatch ? bgColorMatch[1] : '#F0EEE6';
        
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
            background: ${bgColor};
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
    
    // Animation code should be here
    console.log('Please replace this with your actual animation code');
});`;
        
        return {
            html: htmlTemplate,
            js: jsTemplate,
            htmlName: `${componentName.toLowerCase()}.html`,
            jsName: `${componentName.toLowerCase()}.js`
        };
        
    } catch (error) {
        debugLog('Conversion error: ' + error.message);
        throw new Error('Failed to convert input to standalone files: ' + error.message);
    }
}

// Make the function available globally
window.convertReactToStandalone = convertReactToStandalone;
