// === CONFIGURATION OPTIONS ===
const config = {
    ribbonColor: '#404040',        // Default: dark gray
    backgroundColor: '#F0EEE6',      // Default: beige
    transparentBackground: false    // Default: false
};

// Read URL parameters
function updateConfigFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Debug: Log all parameters
    console.log("URL Parameters:", urlParams.toString());
    
    // 1. Change lines and dots color
    if (urlParams.has('color')) {
        const colorParam = urlParams.get('color');
        config.ribbonColor = '#' + colorParam;
        console.log("Setting ribbon color to:", config.ribbonColor);
    }
    
    // 2. Change background color
    if (urlParams.has('bg')) {
        const bgParam = urlParams.get('bg');
        config.backgroundColor = '#' + bgParam;
        document.body.style.background = config.backgroundColor;
        console.log("Setting background color to:", config.backgroundColor);
    }
    
    // 3. Transparent background
    if (urlParams.has('transparent')) {
        config.transparentBackground = urlParams.get('transparent') === 'true';
        if (config.transparentBackground) {
            document.body.style.background = 'transparent';
            console.log("Setting transparent background");
        }
    }
    
    // Debug: Log final config
    console.log("Final config:", config);
}

// Initialize configuration from URL
updateConfigFromUrl();

// Canvas setup
const canvas = document.getElementById('ribbonCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 550;
canvas.height = 550;

// Ribbon segment class
class RibbonSegment {
    constructor(x, y, angle, width, height, depth) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.width = width;
        this.height = height;
        this.depth = depth;
    }
}

// Ribbon animation class
class RibbonStrip {
    constructor() {
        this.segments = [];
        this.segmentCount = 30;
        this.width = 100;
        this.initialize();
    }
    
    initialize() {
        for (let i = 0; i < this.segmentCount; i++) {
            this.segments.push(new RibbonSegment(
                0, 0, 0, this.width, 20, 0
            ));
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
    
    draw() {
        ctx.lineWidth = 1.5;
        ctx.setLineDash([2, 2]);
        
        const sortedSegments = [...this.segments].sort((a, b) => {
            const threshold = 0.1;
            return Math.abs(a.depth - b.depth) > threshold ? a.depth - b.depth : 0;
        });
        
        // Draw segments
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
            
            // Debug: Log color being used
            const rgb = hexToRgb(config.ribbonColor);
            console.log(`Drawing with color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`);
            
            ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
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
            ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 0.7})`;
            ctx.stroke();
            
            ctx.restore();
        }
        
        // Draw dots
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
            
            const rgb = hexToRgb(config.ribbonColor);
            
            ctx.beginPath();
            ctx.arc(p1.x, p1.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(p2.x, p2.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(segment.x, segment.y, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
            ctx.fill();
        }
        
        ctx.setLineDash([]);
    }
}

// Helper function to convert hex color to RGB
function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    // If the hex is only 3 characters, expand it
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    const bigint = parseInt(hex, 16);
    if (isNaN(bigint)) {
        console.error("Invalid hex color:", hex);
        // Return a default color (black) if invalid
        return { r: 0, g: 0, b: 0 };
    }
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}

// Animation setup
const ribbon = new RibbonStrip();
let time = 0;
let animationFrameId;

function animate() {
    // Handle background
    if (!config.transparentBackground) {
        ctx.fillStyle = config.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        console.log("Filling canvas with background color:", config.backgroundColor);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        console.log("Clearing canvas for transparent background");
    }
    
    time += 0.00125;
    ribbon.update(time);
    ribbon.draw();
    
    animationFrameId = requestAnimationFrame(animate);
}

// Start animation
animate();