<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Discord Message Cleaner</title>
  <style>
    body {
      width: 340px; /* Slightly wider for better spacing */
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      padding: 0;
      margin: 0;
      background-color: #36393f;
      color: #dcddde;
    }
    .header {
      background-color: #5865f2;
      padding: 15px;
      text-align: center;
      border-bottom: 3px solid #4752c4;
    }
    .header h1 {
      font-size: 18px;
      margin: 0;
      color: #ffffff;
    }
    .container {
      padding: 15px;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .form-label {
      font-size: 14px;
      font-weight: 500;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .info-icon {
      color: #b9bbbe;
      cursor: help;
      font-size: 14px;
      margin-left: 6px;
    }
    .info-tooltip {
      position: relative;
      display: inline-block;
    }
    /* Fix for tooltip cutoff - position to the left instead of centered */
    .info-tooltip .tooltip-text {
      visibility: hidden;
      width: 220px; /* Wider tooltip */
      background-color: #202225;
      color: #dcddde;
      text-align: left; /* Left-aligned text is easier to read */
      border-radius: 6px;
      padding: 10px;
      position: absolute;
      z-index: 10; /* Higher z-index to ensure visibility */
      bottom: 125%;
      right: 0; /* Position from right instead of left */
      margin-left: 0; /* Remove left margin */
      opacity: 0;
      transition: opacity 0.3s;
      font-weight: normal;
      font-size: 12px;
      line-height: 1.4; /* Better line spacing */
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3); /* Shadow for depth */
      border: 1px solid #40444b; /* Border for definition */
    }
    .info-tooltip:hover .tooltip-text {
      visibility: visible;
      opacity: 1;
    }
    input[type="text"], input[type="password"], input[type="number"] {
      padding: 10px;
      border-radius: 4px;
      border: 1px solid #202225;
      background-color: #40444b;
      color: #ffffff;
      font-size: 14px;
    }
    input:focus {
      outline: none;
      border-color: #5865f2;
      box-shadow: 0 0 0 2px rgba(88, 101, 242, 0.3);
    }
    .settings-section {
      background-color: #2f3136;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }
    .settings-header {
      font-size: 16px;
      margin-bottom: 12px;
      color: #ffffff;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .settings-icon {
      color: #5865f2;
    }
    .button-group {
      display: flex;
      gap: 10px;
      justify-content: center;
      margin-top: 15px;
    }
    button {
      padding: 10px 18px;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    #startBtn {
      background-color: #5865f2;
      color: white;
      flex: 1;
    }
    #startBtn:hover:not(:disabled) {
      background-color: #4752c4;
      transform: translateY(-1px);
    }
    #startBtn:active:not(:disabled) {
      transform: translateY(1px);
    }
    #stopBtn {
      background-color: #ed4245;
      color: white;
      flex: 1;
    }
    #stopBtn:hover:not(:disabled) {
      background-color: #c03537;
      transform: translateY(-1px);
    }
    #stopBtn:active:not(:disabled) {
      transform: translateY(1px);
    }
    #status {
      text-align: center;
      font-size: 14px;
      margin-top: 15px;
      padding: 12px;
      border-radius: 4px;
      background-color: #2f3136;
      min-height: 20px;
      color: #b9bbbe;
      position: relative; /* For progress indicator */
      overflow: hidden; /* For progress animation */
    }
    .status-running {
      animation: pulse 1.5s infinite;
    }
    /* Progress bar for better visual feedback */
    .status-running::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      height: 3px;
      background-color: #5865f2;
      animation: progress 2s infinite linear;
      width: 100%;
    }
    @keyframes progress {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    @keyframes pulse {
      0% { background-color: #2f3136; }
      50% { background-color: #3b3f45; }
      100% { background-color: #2f3136; }
    }
    #tokenField {
      position: relative;
    }
    #tokenVisibility {
      position: absolute;
      right: 10px;
      top: 10px;
      background: none;
      border: none;
      color: #b9bbbe;
      cursor: pointer;
      padding: 0;
    }
    #tokenVisibility:hover {
      color: #ffffff;
    }
    .icon {
      font-size: 16px;
    }
    .slider-container {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .slider-values {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #b9bbbe;
    }
    input[type="range"] {
      -webkit-appearance: none;
      width: 100%;
      height: 6px;
      border-radius: 3px;
      background: #40444b;
      outline: none;
      margin: 8px 0;
    }
    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #5865f2;
      cursor: pointer;
      transition: all 0.2s;
    }
    input[type="range"]::-webkit-slider-thumb:hover {
      transform: scale(1.1);
      background: #4752c4;
    }
    .range-labels {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #b9bbbe;
    }
    .footer {
      text-align: center;
      font-size: 11px;
      color: #72767d;
      padding: 10px 15px;
      border-top: 1px solid #40444b;
      margin-top: 10px;
    }
    .checkbox-container {
      display: flex;
      align-items: center;
      margin-top: 8px;
      gap: 8px;
    }
    .toggle {
      position: relative;
      display: inline-block;
      width: 40px;
      height: 20px;
    }
    .toggle input {
      opacity: 0;
      width: 0;
      height: 0;
    }
    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #40444b;
      transition: .4s;
      border-radius: 20px;
    }
    .slider:before {
      position: absolute;
      content: "";
      height: 16px;
      width: 16px;
      left: 2px;
      bottom: 2px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }
    input:checked + .slider {
      background-color: #5865f2;
    }
    input:checked + .slider:before {
      transform: translateX(20px);
    }
    .secure-icon {
      color: #5865f2;
      font-size: 16px;
    }
    .encrypted-badge {
      font-size: 10px;
      background-color: rgba(88, 101, 242, 0.3);
      color: #5865f2;
      padding: 2px 6px;
      border-radius: 10px;
      margin-left: 6px;
      display: none;
    }
    .checkbox-label {
      font-size: 13px;
      color: #dcddde;
    }
    /* Status indicator types */
    .status-error {
      background-color: rgba(237, 66, 69, 0.2);
      color: #ed4245;
    }
    .status-success {
      background-color: rgba(87, 242, 135, 0.2);
      color: #57f287;
    }
    .status-warning {
      background-color: rgba(254, 231, 92, 0.2);
      color: #fee75c;
    }
    /* Add animated token indicator for better feedback */
    .token-status {
      display: inline-block;
      height: 8px;
      width: 8px;
      border-radius: 50%;
      margin-left: 8px;
    }
    .token-invalid {
      background-color: #ed4245;
    }
    .token-valid {
      background-color: #57f287;
    }
    .token-pending {
      background-color: #fee75c;
    }
    /* Better scrollbar for tooltips */
    .tooltip-text::-webkit-scrollbar {
      width: 4px;
    }
    .tooltip-text::-webkit-scrollbar-track {
      background: #202225;
    }
    .tooltip-text::-webkit-scrollbar-thumb {
      background: #40444b;
      border-radius: 2px;
    }
    /* Media query for smaller screens */
    @media (max-width: 360px) {
      body {
        width: 300px;
      }
      .info-tooltip .tooltip-text {
        width: 180px;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Discord Message Cleaner</h1>
  </div>
  
  <div class="container">
    <div class="settings-section">
      <div class="settings-header">
        <span class="settings-icon">⚙️</span> Configuration
      </div>
      
      <div class="form-group">
        <div class="form-label">
          <span>Discord Token <span id="encryptedBadge" class="encrypted-badge">Encrypted</span></span>
          <span class="info-tooltip">
            <span class="info-icon">ℹ️</span>
            <span class="tooltip-text">Your Discord authentication token is required to access and delete your messages. It can be securely encrypted on your device.</span>
          </span>
        </div>
        <div id="tokenField">
          <input type="password" id="token" placeholder="Enter your Discord token" autocomplete="off">
          <button id="tokenVisibility" title="Toggle visibility">
            <span class="icon">👁️</span>
          </button>
        </div>
        <div class="checkbox-container">
          <label class="toggle">
            <input type="checkbox" id="rememberToken">
            <span class="slider"></span>
          </label>
          <span class="checkbox-label">Remember token securely</span>
          <span class="info-tooltip">
            <span class="info-icon">ℹ️</span>
            <span class="tooltip-text">Your token will be encrypted and stored locally. No one can access it without your encryption key, which stays on your device.</span>
          </span>
        </div>
      </div>
      
      <div class="form-group">
        <div class="form-label">
          <span>Deletion Speed</span>
          <span class="info-tooltip">
            <span class="info-icon">ℹ️</span>
            <span class="tooltip-text">Higher values reduce the chance of being rate-limited by Discord but make deletion slower. Recommended: 1500-2000ms.</span>
          </span>
        </div>
        <div class="slider-container">
          <input type="range" id="delaySlider" min="1000" max="3000" step="100" value="1500">
          <div class="range-labels">
            <span>Faster</span>
            <span id="delayValue">1500 ms</span>
            <span>Safer</span>
          </div>
        </div>
        <input type="hidden" id="delay" value="1500">
      </div>
      
      <div class="form-group">
        <div class="form-label">
          <span>Batch Size</span>
          <span class="info-tooltip">
            <span class="info-icon">ℹ️</span>
            <span class="tooltip-text">Number of messages to fetch at once. Larger batches are more efficient but might use more memory. Recommended: 25-50 messages.</span>
          </span>
        </div>
        <div class="slider-container">
          <input type="range" id="batchSizeSlider" min="10" max="100" step="5" value="50">
          <div class="range-labels">
            <span>Smaller</span>
            <span id="batchSizeValue">50 messages</span>
            <span>Larger</span>
          </div>
        </div>
        <input type="hidden" id="batchSize" value="50">
      </div>
    </div>
    
    <div class="button-group">
      <button id="startBtn">
        <span class="icon">▶️</span> Start Deletion
      </button>
      <button id="stopBtn" disabled>
        <span class="icon">⏹️</span> Stop
      </button>
    </div>
    
    <div id="status">Ready to delete messages</div>
  </div>
  
  <div class="footer">
    Discord Message Cleaner v1.0 • <span class="secure-icon">🔒</span> Secured
  </div>
  
  <script src="encrypted-storage.js"></script>
  <script src="popup.js"></script>
</body>
</html>