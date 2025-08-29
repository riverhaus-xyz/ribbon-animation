<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Download Generated Files</title>
    <style>
        body {
            font-family: monospace;
            margin: 20px;
            background: white;
            color: black;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
        }
        h1 {
            color: #2c3e50;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }
        .file-preview {
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 15px;
            margin-bottom: 20px;
        }
        .file-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        .file-name {
            font-weight: bold;
            color: #3498db;
        }
        .file-size {
            color: #7f8c8d;
            font-size: 14px;
        }
        .file-content {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 4px;
            padding: 15px;
            font-family: monospace;
            font-size: 14px;
            white-space: pre-wrap;
            max-height: 300px;
            overflow-y: auto;
        }
        .button-container {
            display: flex;
            justify-content: center;
            gap: 15px;
        }
        button {
            background: #3498db;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-family: monospace;
            font-size: 16px;
        }
        button:hover {
            background: #2980b9;
        }
        .secondary-button {
            background: #95a5a6;
        }
        .secondary-button:hover {
            background: #7f8c8d;
        }
        .download-all {
            background: #2ecc71;
            margin-top: 20px;
        }
        .download-all:hover {
            background: #27ae60;
        }
        .workflow-link {
            position: absolute;
            top: 20px;
            right: 20px;
            background: #3498db;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-family: monospace;
            font-size: 16px;
            text-decoration: none;
            z-index: 1000;
            transition: background 0.3s ease;
        }
        .workflow-link:hover {
            background: #2980b9;
        }
        .nav-buttons {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
        }
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #2ecc71;
            color: white;
            padding: 15px 20px;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
        }
        .notification.show {
            transform: translateY(0);
            opacity: 1;
        }
    </style>
</head>
<body>
    <a href="workflow/workflow.html" class="workflow-link">View All Workflow Steps</a>
    
    <div class="container">
        <h1>Download Generated Files</h1>
        <p>Download the HTML and JavaScript files for your standalone animation.</p>
        
        <div class="file-preview">
            <div class="file-header">
                <div class="file-name">index.html</div>
                <div class="file-size">~1.5 KB</div>
            </div>
            <div class="file-content" id="htmlContent">
<!-- HTML content will be loaded here -->
            </div>
            <div class="button-container">
                <button id="downloadHtmlBtn">Download HTML</button>
                <button class="secondary-button" id="copyHtmlBtn">Copy HTML</button>
            </div>
        </div>
        
        <div class="file-preview">
            <div class="file-header">
                <div class="file-name">ribbon-animation.js</div>
                <div class="file-size">~8 KB</div>
            </div>
            <div class="file-content" id="jsContent">
<!-- JavaScript content will be loaded here -->
            </div>
            <div class="button-container">
                <button id="downloadJsBtn">Download JS</button>
                <button class="secondary-button" id="copyJsBtn">Copy JS</button>
            </div>
        </div>
        
        <div class="button-container">
            <button class="download-all" id="downloadAllBtn">Download All Files (ZIP)</button>
        </div>
        
        <div class="nav-buttons">
            <button class="secondary-button" onclick="window.location.href='convert-to-standalone.html'">← Previous: Convert to Standalone</button>
            <button onclick="window.location.href='upload-to-github.html'">Next: Upload to GitHub →</button>
        </div>
    </div>
    
    <div class="notification" id="notification">File downloaded successfully!</div>
    
    <script src="downloader.js"></script>
</body>
</html>
