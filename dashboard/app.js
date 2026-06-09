/**
 * Autonomous Vehicle Mapping Dashboard - Core Application Script
 * Built for robotics telemetry visualizer and command center.
 */

// --- Global Application State ---
const State = {
    // Connection State
    connectionStatus: 'Disconnected', // 'Connected', 'Connecting', 'Disconnected', 'Error'
    serialPort: null,
    reader: null,
    writer: null,
    baudRate: 9600,
    
    // Simulation Settings
    isSimMode: true,
    simInterval: null,
    simTimeMultiplier: 1.0,
    
    // Robot Telemetry
    step: 0,
    robotX: 0,
    robotY: 0,
    robotHeading: 90, // Degrees: 0=East (Right), 90=North (Up), 180=West (Left), 270=South (Down)
    scanAngle: 90,    // Servo degrees: 0=Right, 90=Center, 180=Left relative to robot heading
    distance: 150,     // Ultrasonic distance reading in cm
    vehicleState: 'IDLE', // Current state string
    
    // History & Grid Data
    pathHistory: [{ x: 0, y: 0 }],
    obstacles: new Map(), // Key: "x,y", Value: {x, y, timestamp}
    radarSweepHistory: [], // Array of { angle, distance, timestamp }
    
    // Navigation details
    lastTurnDirection: 'NONE',
    minObstacleDistance: Infinity,
    
    // Logs and Timeline
    logs: [],
    isLoggingPaused: false,
    timelineEvents: [],
    
    // Analytics
    startTime: null,
    systemUptimeSeconds: 0,
    totalDistanceTraveled: 0,
    leftTurnsCount: 0,
    rightTurnsCount: 0,
    distanceCount: 0,
    distanceSum: 0,
    minDistanceObserved: Infinity,
    maxDistanceObserved: -Infinity,
    
    // Map Viewport (Pan & Zoom)
    zoomLevel: 1.0,
    mapOffset: { x: 0, y: 0 },
    isDraggingMap: false,
    dragStart: { x: 0, y: 0 },
    centerOnRobotActive: true,
    
    // Manual Override
    isManualOverrideActive: false
};

// Virtual Room Obstacles for Raycasting Simulation
const SimWorld = {
    boundaryMin: -250, // cm
    boundaryMax: 250,  // cm
    boxes: [
        { xmin: 50, xmax: 100, ymin: 50, ymax: 100 },
        { xmin: -150, xmax: -70, ymin: -50, ymax: 30 },
        { xmin: -40, xmax: 40, ymin: -150, ymax: -100 },
        { xmin: 80, xmax: 130, ymin: -120, ymax: -60 },
        { xmin: -80, xmax: -30, ymin: 100, ymax: 150 }
    ]
};

// Canvas context cache
let mapCanvas, mapCtx;
let radarCanvas, radarCtx;

// --- Initialize Application ---
window.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    if (window.lucide) {
        window.lucide.createIcons();
    }
    
    // Initialize Canvas elements
    initCanvases();
    
    // Register UI Listeners
    registerEventListeners();
    
    // Start timers
    startTimers();
    
    // Default starting state
    updateConnectionUI();
    toggleSimulation(true);
});

// --- Canvas Initialization ---
function initCanvases() {
    mapCanvas = document.getElementById('occupancyMapCanvas');
    mapCtx = mapCanvas.getContext('2d');
    
    radarCanvas = document.getElementById('radarCanvas');
    radarCtx = radarCanvas.getContext('2d');
    
    // Resize canvases to fit container bounds
    resizeCanvases();
    window.addEventListener('resize', resizeCanvases);
}

function resizeCanvases() {
    const mapContainer = mapCanvas.parentElement;
    mapCanvas.width = mapContainer.clientWidth;
    mapCanvas.height = mapContainer.clientHeight;
    
    const radarContainer = radarCanvas.parentElement;
    radarCanvas.width = radarContainer.clientWidth;
    // Set aspect ratio or fixed scaling
    radarCanvas.height = radarContainer.clientHeight;
    
    requestAnimationFrame(drawAll);
}

// --- Start System Timers ---
function startTimers() {
    State.startTime = Date.now();
    
    // Clock & Uptime Timer
    setInterval(() => {
        // Live clock
        const now = new Date();
        document.getElementById('currentTimestampText').textContent = now.toTimeString().split(' ')[0];
        
        // System Uptime
        if (State.connectionStatus === 'Connected' || State.isSimMode) {
            State.systemUptimeSeconds++;
            const hrs = String(Math.floor(State.systemUptimeSeconds / 3600)).padStart(2, '0');
            const mins = String(Math.floor((State.systemUptimeSeconds % 3600) / 60)).padStart(2, '0');
            const secs = String(State.systemUptimeSeconds % 60).padStart(2, '0');
            document.getElementById('systemUptimeText').textContent = `${hrs}:${mins}:${secs}`;
        }
    }, 1000);
    
    // Render Animation Loop (Canvas updates)
    function renderLoop() {
        drawAll();
        requestAnimationFrame(renderLoop);
    }
    requestAnimationFrame(renderLoop);
}

// --- Register UI Events ---
function registerEventListeners() {
    // Connection Button
    document.getElementById('connectBtn').addEventListener('click', toggleSerialConnection);
    document.getElementById('baudRateSelect').addEventListener('change', (e) => {
        State.baudRate = parseInt(e.target.value);
    });
    
    // Simulation switch
    document.getElementById('simModeToggle').addEventListener('change', (e) => {
        toggleSimulation(e.target.checked);
    });
    
    // Map HUD and Viewport Controls
    document.getElementById('zoomInBtn').addEventListener('click', () => adjustZoom(1.2));
    document.getElementById('zoomOutBtn').addEventListener('click', () => adjustZoom(0.8));
    document.getElementById('centerRobotBtn').addEventListener('click', centerOnRobot);
    document.getElementById('resetMapBtn').addEventListener('click', resetMapAndData);
    document.getElementById('exportMapBtn').addEventListener('click', exportMapToPNG);
    
    // Map Canvas Panning Drag Events
    mapCanvas.addEventListener('mousedown', (e) => {
        State.isDraggingMap = true;
        State.centerOnRobotActive = false;
        State.dragStart.x = e.clientX - State.mapOffset.x;
        State.dragStart.y = e.clientY - State.mapOffset.y;
    });
    
    window.addEventListener('mousemove', (e) => {
        if (State.isDraggingMap) {
            State.mapOffset.x = e.clientX - State.dragStart.x;
            State.mapOffset.y = e.clientY - State.dragStart.y;
        }
    });
    
    window.addEventListener('mouseup', () => {
        State.isDraggingMap = false;
    });
    
    mapCanvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        const factor = e.deltaY < 0 ? 1.1 : 0.9;
        adjustZoom(factor);
    });
    
    // Logging controls
    document.getElementById('pauseLogBtn').addEventListener('click', togglePauseLogging);
    document.getElementById('clearLogBtn').addEventListener('click', clearLogsUI);
    document.getElementById('exportCsvBtn').addEventListener('click', exportLogsCSV);
    document.getElementById('exportJsonBtn').addEventListener('click', exportLogsJSON);
    
    // Manual Override controls
    document.getElementById('toggleManualOverrideBtn').addEventListener('click', toggleManualOverride);
    
    // Keyboard listener for manual override
    window.addEventListener('keydown', handleKeyboardControl);
    window.addEventListener('keyup', handleKeyboardRelease);
    
    // Manual control keypad buttons
    const bindKeypad = (id, command) => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('mousedown', () => sendManualCommand(command));
            btn.addEventListener('mouseup', () => sendManualCommand('DIR,STOP'));
            btn.addEventListener('mouseleave', () => {
                if (btn.classList.contains('pressed')) {
                    sendManualCommand('DIR,STOP');
                }
            });
        }
    };
    bindKeypad('btnDriveForward', 'DIR,FORWARD');
    bindKeypad('btnDriveBackward', 'DIR,BACKWARD');
    bindKeypad('btnDriveLeft', 'DIR,LEFT');
    bindKeypad('btnDriveRight', 'DIR,RIGHT');
    bindKeypad('btnDriveStop', 'DIR,STOP');
}

// --- Tab System Switcher ---
window.switchExpansionTab = function(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    if (tabName === 'manual') {
        document.getElementById('tabManualBtn').classList.add('active');
        document.getElementById('tabContentManual').classList.add('active');
    } else {
        document.getElementById('tabSystemsBtn').classList.add('active');
        document.getElementById('tabContentSystems').classList.add('active');
    }
};

// --- Web Serial API Connection & Stream ---
async function toggleSerialConnection() {
    if (State.connectionStatus === 'Connected') {
        await disconnectSerial();
    } else {
        await connectSerial();
    }
}

async function connectSerial() {
    if (!("serial" in navigator)) {
        logSystemError("Web Serial API is not supported in this browser. Please try Chrome, Edge, or Opera, or use Simulation Mode.");
        updateConnectionStatus('Error');
        return;
    }

    try {
        updateConnectionStatus('Connecting');
        // Disable simulation switch visually to avoid collision
        document.getElementById('simModeToggle').checked = false;
        toggleSimulation(false);
        
        State.serialPort = await navigator.serial.requestPort();
        await State.serialPort.open({ baudRate: State.baudRate });
        
        // Assert DTR and RTS signals to allow data flow on many Arduinos/clones
        try {
            await State.serialPort.setSignals({ dataTerminalReady: true, requestToSend: true });
        } catch (signalErr) {
            console.warn("Could not assert DTR/RTS signals:", signalErr);
        }
        
        updateConnectionStatus('Connected');
        logSystemEvent(`Connected to Serial port at ${State.baudRate} Baud.`);
        
        // Setup Writer for sending commands
        const encoder = new TextEncoderStream();
        encoder.readable.pipeTo(State.serialPort.writable);
        State.writer = encoder.writable.getWriter();
        
        // Start reader loop
        readSerialStream();
    } catch (err) {
        console.error("Serial error:", err);
        logSystemError(`Serial connection failed: ${err.message}`);
        updateConnectionStatus('Error');
    }
}

async function disconnectSerial() {
    updateConnectionStatus('Connecting');
    try {
        if (State.reader) {
            await State.reader.cancel();
        }
        if (State.writer) {
            await State.writer.close();
            State.writer = null;
        }
        if (State.serialPort) {
            await State.serialPort.close();
            State.serialPort = null;
        }
        updateConnectionStatus('Disconnected');
        logSystemEvent("Serial port disconnected.");
    } catch (err) {
        console.error("Disconnect error:", err);
        updateConnectionStatus('Error');
        logSystemError(`Failed to disconnect serial cleanly: ${err.message}`);
    }
}

async function readSerialStream() {
    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = State.serialPort.readable.pipeTo(textDecoder.writable);
    State.reader = textDecoder.readable.getReader();
    
    let buffer = '';
    
    try {
        while (State.serialPort && State.serialPort.readable) {
            const { value, done } = await State.reader.read();
            if (done) {
                break;
            }
            if (value) {
                buffer += value;
                let lines = buffer.split(/\r?\n/);
                // Keep the last partial line in buffer
                buffer = lines.pop();
                
                for (const line of lines) {
                    const trimmedLine = line.trim();
                    if (trimmedLine.length > 0) {
                        parseIncomingLine(trimmedLine);
                    }
                }
            }
        }
    } catch (err) {
        console.error("Stream reading error:", err);
        logSystemError(`Serial stream interrupted: ${err.message}`);
        updateConnectionStatus('Error');
    } finally {
        State.reader.releaseLock();
    }
}

// --- Serial Command Sender ---
async function sendSerialCommand(commandStr) {
    if (State.isSimMode) {
        // Process manually in simulation mode
        processSimManualCommand(commandStr);
        return;
    }
    
    if (!State.writer) {
        logSystemError("Serial port not writable. Connect to physical Arduino first.");
        return;
    }
    
    try {
        await State.writer.write(commandStr + '\n');
        logRawLine(`[TX] ${commandStr}`, 'serial-out');
    } catch (err) {
        logSystemError(`Failed to send serial command: ${err.message}`);
    }
}

// --- Data Stream Parsing ---
function parseIncomingLine(line) {
    logRawLine(line, 'serial-in');
    
    // Find 'MAP,' index to handle startup noise/junk characters
    const idx = line.indexOf('MAP,');
    if (idx === -1) {
        return; // Filter out packets that don't match our protocol
    }
    
    const cleanLine = line.substring(idx);
    const parts = cleanLine.split(',');
    if (parts.length < 8) {
        return; // Incomplete packet
    }
    
    const step = parseInt(parts[1], 10);
    const x = parseFloat(parts[2]);
    const y = parseFloat(parts[3]);
    const heading = parseFloat(parts[4]);
    const scanAngle = parseFloat(parts[5]);
    const distance = parseFloat(parts[6]);
    const vehicleState = parts[7];
    
    // Validate parsing
    if (isNaN(step) || isNaN(x) || isNaN(y) || isNaN(heading) || isNaN(scanAngle)) {
        return;
    }
    
    updateTelemetry(step, x, y, heading, scanAngle, distance, vehicleState);
}

// --- Telemetry State Updates ---
function updateTelemetry(step, x, y, heading, scanAngle, distance, vehicleState) {
    // 1. Update primary variables
    State.step = step;
    State.robotX = x;
    State.robotY = y;
    State.robotHeading = heading;
    State.scanAngle = scanAngle;
    State.distance = isNaN(distance) || distance < 0 ? null : distance;
    
    const oldState = State.vehicleState;
    State.vehicleState = vehicleState;
    
    // 2. Track Path History
    const lastPos = State.pathHistory[State.pathHistory.length - 1];
    if (!lastPos || Math.hypot(x - lastPos.x, y - lastPos.y) > 1.0) {
        State.pathHistory.push({ x, y });
        // Calculate distance traveled based on Euclidean step segment
        if (lastPos) {
            const segmentDist = Math.hypot(x - lastPos.x, y - lastPos.y);
            State.totalDistanceTraveled += segmentDist;
        }
    }
    
    // 3. Keep Center Tracking aligned if active
    if (State.centerOnRobotActive) {
        centerOnRobot();
    }
    
    // 4. Calculate Obstacles relative to Robot Position
    // The obstacle angle is absolute sensor orientation
    // sensorAngle = robotHeading + (scanAngle - 90)
    // Formula: obsX = robotX + distance * cos(sensorAngle), obsY = robotY + distance * sin(sensorAngle)
    if (State.distance !== null && State.distance > 0 && State.distance < 400) {
        const absoluteSensorAngle = robotHeadingToMathAngle(heading, scanAngle);
        const rad = absoluteSensorAngle * Math.PI / 180;
        
        const obsX = x + State.distance * Math.cos(rad);
        const obsY = y + State.distance * Math.sin(rad);
        
        // Add to map (use rounded coordinate keys to deduplicate/denoise)
        const gridKeyX = Math.round(obsX);
        const gridKeyY = Math.round(obsY);
        const key = `${gridKeyX},${gridKeyY}`;
        
        if (!State.obstacles.has(key)) {
            State.obstacles.set(key, { x: obsX, y: obsY, timestamp: Date.now() });
            
            // Analytics
            State.distanceCount++;
            State.distanceSum += State.distance;
            if (State.distance < State.minDistanceObserved) {
                State.minDistanceObserved = State.distance;
            }
            if (State.distance > State.maxDistanceObserved) {
                State.maxDistanceObserved = State.distance;
            }
        }
        
        // Add to radar history (fading sweep trail)
        State.radarSweepHistory.push({
            angle: scanAngle,
            distance: State.distance,
            timestamp: Date.now()
        });
        
        // Keep radar sweep history bounded
        if (State.radarSweepHistory.length > 50) {
            State.radarSweepHistory.shift();
        }
    } else {
        // Scanned point but no obstacle (clear scan beam)
        State.radarSweepHistory.push({
            angle: scanAngle,
            distance: 400, // Maximum Range
            timestamp: Date.now()
        });
        if (State.radarSweepHistory.length > 50) {
            State.radarSweepHistory.shift();
        }
    }
    
    // Track Turns for Analytics
    if (vehicleState === 'TURN_LEFT' && oldState !== 'TURN_LEFT') {
        State.leftTurnsCount++;
        addTimelineEvent('TURN_LEFT', 'Robot turned Left (90° CCW)', 'state-action');
    } else if (vehicleState === 'TURN_RIGHT' && oldState !== 'TURN_RIGHT') {
        State.rightTurnsCount++;
        addTimelineEvent('TURN_RIGHT', 'Robot turned Right (90° CW)', 'state-action');
    }
    
    if (vehicleState !== oldState) {
        let type = 'state-active';
        if (vehicleState === 'OBSTACLE_STOP' || vehicleState === 'NO_VALID_PATH') {
            type = 'state-obstacle';
        }
        addTimelineEvent(vehicleState, `State transitioned to ${vehicleState}`, type);
    }
    
    // Updates UI texts
    updateUIElements();
}

// Convert robotic heading (0=E, 90=N, 180=W, 270=S) and servo angle (0=Right, 90=Forward, 180=Left relative to robot heading) to mathematical degrees
function robotHeadingToMathAngle(robotHeading, scanAngle) {
    // Relative scan offset: servo 90 is straight forward
    const offset = scanAngle - 90;
    // Absolute direction
    let angle = robotHeading + offset;
    // Normalize to 0-360
    angle = (angle % 360 + 360) % 360;
    return angle;
}

// --- HTML DOM Updates ---
function updateUIElements() {
    document.getElementById('telX').textContent = Math.round(State.robotX);
    document.getElementById('telY').textContent = Math.round(State.robotY);
    document.getElementById('telHeading').textContent = State.robotHeading;
    document.getElementById('telDistance').textContent = State.distance !== null ? Math.round(State.distance) : '--';
    document.getElementById('telScanAngle').textContent = Math.round(State.scanAngle);
    document.getElementById('telStep').textContent = State.step;
    
    const stateEl = document.getElementById('telState');
    stateEl.textContent = State.vehicleState;
    
    // State indicator bar color shift
    const bar = document.getElementById('stateIndicatorBar');
    bar.style.width = '100%';
    
    // Reset colors
    stateEl.style.color = 'var(--accent-cyan)';
    bar.style.backgroundColor = 'var(--accent-cyan)';
    bar.style.boxShadow = 'var(--glow-cyan)';
    
    if (State.vehicleState.includes('SCAN')) {
        stateEl.style.color = 'var(--accent-yellow)';
        bar.style.backgroundColor = 'var(--accent-yellow)';
        bar.style.boxShadow = '0 0 10px rgba(255,189,0,0.5)';
    } else if (State.vehicleState.includes('FORWARD')) {
        stateEl.style.color = 'var(--accent-green)';
        bar.style.backgroundColor = 'var(--accent-green)';
        bar.style.boxShadow = 'var(--glow-green)';
    } else if (State.vehicleState.includes('STOP') || State.vehicleState === 'NO_VALID_PATH') {
        stateEl.style.color = 'var(--accent-red)';
        bar.style.backgroundColor = 'var(--accent-red)';
        bar.style.boxShadow = 'var(--glow-red)';
    }
    
    // Detailed Navigation Block
    const directionNames = { 0: 'EAST (0°)', 90: 'NORTH (90°)', 180: 'WEST (180°)', 270: 'SOUTH (270°)' };
    document.getElementById('navDirection').textContent = directionNames[State.robotHeading] || `${State.robotHeading}°`;
    document.getElementById('navMovement').textContent = State.vehicleState.includes('FORWARD') ? 'FORWARD' : 'STOPPED';
    document.getElementById('navMinObstacle').textContent = State.minDistanceObserved === Infinity ? '--' : `${Math.round(State.minDistanceObserved)} cm`;
    
    let lastTurn = 'NONE';
    if (State.leftTurnsCount > 0 || State.rightTurnsCount > 0) {
        lastTurn = State.vehicleState === 'TURN_LEFT' ? 'LEFT' : (State.vehicleState === 'TURN_RIGHT' ? 'RIGHT' : State.lastTurnDirection);
        if (State.vehicleState === 'TURN_LEFT' || State.vehicleState === 'TURN_RIGHT') {
            State.lastTurnDirection = lastTurn;
        }
    }
    document.getElementById('navLastTurn').textContent = lastTurn;
    
    // Update Analytics Section
    document.getElementById('obstacleCountText').textContent = State.obstacles.size;
    document.getElementById('metricSteps').textContent = State.step;
    document.getElementById('metricDistance').textContent = `${Math.round(State.totalDistanceTraveled)} cm`;
    document.getElementById('metricObstacles').textContent = State.obstacles.size;
    document.getElementById('metricLeftTurns').textContent = State.leftTurnsCount;
    document.getElementById('metricRightTurns').textContent = State.rightTurnsCount;
    
    const avgDist = State.distanceCount > 0 ? (State.distanceSum / State.distanceCount) : null;
    document.getElementById('metricAvgDistance').textContent = avgDist !== null ? `${Math.round(avgDist)} cm` : '--';
    document.getElementById('metricMinDistance').textContent = State.minDistanceObserved === Infinity ? '--' : `${Math.round(State.minDistanceObserved)} cm`;
    document.getElementById('metricMaxDistance').textContent = State.maxDistanceObserved === -Infinity ? '--' : `${Math.round(State.maxDistanceObserved)} cm`;
}

// --- Timeline System ---
function addTimelineEvent(state, message, typeClass) {
    const timestamp = new Date().toTimeString().split(' ')[0];
    
    // Push event to history
    State.timelineEvents.unshift({ timestamp, state, message, typeClass });
    if (State.timelineEvents.length > 30) {
        State.timelineEvents.pop();
    }
    
    // Update timeline container
    const container = document.getElementById('timelineList');
    if (!container) return;
    
    container.innerHTML = '';
    if (State.timelineEvents.length === 0) {
        container.innerHTML = '<div class="timeline-empty">Waiting for telemetry...</div>';
        return;
    }
    
    State.timelineEvents.forEach(evt => {
        const item = document.createElement('div');
        item.className = `timeline-item ${evt.typeClass}`;
        item.innerHTML = `
            <span class="timeline-time">${evt.timestamp}</span>
            <span class="timeline-text"><strong>${evt.state}</strong>: ${evt.message}</span>
        `;
        container.appendChild(item);
    });
}

// --- Logging Console UI Operations ---
function logRawLine(packetText, typeClass) {
    if (State.isLoggingPaused) return;
    
    const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
    
    // Maintain internal array
    State.logs.push({ timestamp, packetText, type: typeClass });
    if (State.logs.length > 500) {
        State.logs.shift(); // Bound memory footprint
    }
    
    // Append to viewport
    const container = document.getElementById('consoleBody');
    if (!container) return;
    
    // Clear initial notice if any
    const initialNotice = container.querySelector('.system-notice');
    if (initialNotice && State.logs.length === 1) {
        container.innerHTML = '';
    }
    
    const line = document.createElement('div');
    line.className = `console-line ${typeClass}`;
    line.textContent = `[${timestamp}] ${packetText}`;
    container.appendChild(line);
    
    // Auto Scroll to bottom
    const viewport = document.getElementById('consoleViewport');
    viewport.scrollTop = viewport.scrollHeight;
}

function logSystemEvent(msg) {
    logRawLine(`[SYS_INFO] ${msg}`, 'system-notice');
}

function logSystemError(msg) {
    logRawLine(`[SYS_ERROR] ${msg}`, 'error');
}

function togglePauseLogging() {
    State.isLoggingPaused = !State.isLoggingPaused;
    const btnText = document.getElementById('pauseLogBtnText');
    const btnIcon = document.querySelector('#pauseLogBtn i');
    
    if (State.isLoggingPaused) {
        btnText.textContent = "Resume";
        btnIcon.setAttribute('data-lucide', 'play');
    } else {
        btnText.textContent = "Pause";
        btnIcon.setAttribute('data-lucide', 'pause');
    }
    if (window.lucide) window.lucide.createIcons();
}

function clearLogsUI() {
    State.logs = [];
    document.getElementById('consoleBody').innerHTML = `
        <div class="console-line system-notice">Console cleared. Log monitoring active...</div>
    `;
}

// --- Data Exporters (CSV/JSON) ---
function exportLogsCSV() {
    if (State.logs.length === 0) {
        alert("No logs available for export.");
        return;
    }
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Timestamp,PacketData,Type\n";
    
    State.logs.forEach(log => {
        // Escaped quotes for CSV safety
        const escapedData = log.packetText.replace(/"/g, '""');
        csvContent += `"${log.timestamp}","${escapedData}","${log.type}"\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `robotic_telemetry_log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function exportLogsJSON() {
    if (State.logs.length === 0) {
        alert("No logs available for export.");
        return;
    }
    
    const jsonStr = JSON.stringify(State.logs, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `robotic_telemetry_log_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// --- Map Zoom & Pan Control ---
function adjustZoom(factor) {
    const nextZoom = State.zoomLevel * factor;
    if (nextZoom >= 0.2 && nextZoom <= 5.0) {
        State.zoomLevel = nextZoom;
        document.getElementById('zoomScaleText').textContent = `${State.zoomLevel.toFixed(1)}x`;
    }
}

function centerOnRobot() {
    State.centerOnRobotActive = true;
    State.mapOffset.x = 0;
    State.mapOffset.y = 0;
}

function resetMapAndData() {
    if (confirm("Reset occupancy grid map, path history, and analytics?")) {
        State.pathHistory = [{ x: 0, y: 0 }];
        State.obstacles.clear();
        State.radarSweepHistory = [];
        State.totalDistanceTraveled = 0;
        State.leftTurnsCount = 0;
        State.rightTurnsCount = 0;
        State.distanceCount = 0;
        State.distanceSum = 0;
        State.minDistanceObserved = Infinity;
        State.maxDistanceObserved = -Infinity;
        State.step = 0;
        State.timelineEvents = [];
        document.getElementById('timelineList').innerHTML = '<div class="timeline-empty">Waiting for telemetry...</div>';
        
        centerOnRobot();
        updateUIElements();
        logSystemEvent("Occupancy map and telemetry databases cleared.");
    }
}

function exportMapToPNG() {
    const link = document.createElement('a');
    link.download = `robot_occupancy_map_${Date.now()}.png`;
    link.href = mapCanvas.toDataURL();
    link.click();
}

// --- Drawing Loop (Map and Radar Canvas) ---
function drawAll() {
    drawOccupancyMap();
    drawRadarSweep();
}

// Render primary Occupancy Map
function drawOccupancyMap() {
    if (!mapCtx) return;
    
    const width = mapCanvas.width;
    const height = mapCanvas.height;
    
    // Clear canvas
    mapCtx.fillStyle = '#05070f';
    mapCtx.fillRect(0, 0, width, height);
    
    // Origin position (center plus offset)
    const oX = width / 2 + State.mapOffset.x;
    const oY = height / 2 + State.mapOffset.y;
    
    // Drawing constants
    const cmPerPixel = 1.0; // Base: 1px = 1cm
    const gridSpacingCm = 20; // Draw grids every 20cm
    const scale = State.zoomLevel / cmPerPixel;
    const gridSpacing = gridSpacingCm * scale;
    
    // 1. Draw Grid Lines
    mapCtx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    mapCtx.lineWidth = 1;
    
    // Verticals
    const startX = oX % gridSpacing;
    for (let x = startX; x < width; x += gridSpacing) {
        mapCtx.beginPath();
        mapCtx.moveTo(x, 0);
        mapCtx.lineTo(x, height);
        mapCtx.stroke();
    }
    
    // Horizontals
    const startY = oY % gridSpacing;
    for (let y = startY; y < height; y += gridSpacing) {
        mapCtx.beginPath();
        mapCtx.moveTo(0, y);
        mapCtx.lineTo(width, y);
        mapCtx.stroke();
    }
    
    // Central Axis Lines
    mapCtx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
    mapCtx.lineWidth = 1.5;
    
    // X axis
    mapCtx.beginPath();
    mapCtx.moveTo(0, oY);
    mapCtx.lineTo(width, oY);
    mapCtx.stroke();
    
    // Y axis
    mapCtx.beginPath();
    mapCtx.moveTo(oX, 0);
    mapCtx.lineTo(oX, height);
    mapCtx.stroke();
    
    // 2. Draw Scanned beam / sensor sweep segment
    if (State.connectionStatus === 'Connected' || State.isSimMode) {
        const mathSensorAngle = robotHeadingToMathAngle(State.robotHeading, State.scanAngle);
        const rad = mathSensorAngle * Math.PI / 180;
        
        // Calculate dynamic line length
        const distanceVal = State.distance !== null ? State.distance : 400;
        const lineLen = distanceVal * scale;
        
        const rScreenX = oX + State.robotX * scale;
        const rScreenY = oY - State.robotY * scale; // invert coordinate systems
        
        const targetX = rScreenX + lineLen * Math.cos(rad);
        const targetY = rScreenY - lineLen * Math.sin(rad); // invert Y
        
        // Draw ultrasonic sensor cone field of view
        const beamWidthAngle = 15; // standard sensor beam width
        const leftRad = (mathSensorAngle - beamWidthAngle / 2) * Math.PI / 180;
        const rightRad = (mathSensorAngle + beamWidthAngle / 2) * Math.PI / 180;
        
        mapCtx.fillStyle = 'rgba(0, 240, 255, 0.06)';
        mapCtx.beginPath();
        mapCtx.moveTo(rScreenX, rScreenY);
        mapCtx.arc(rScreenX, rScreenY, lineLen, -leftRad, -rightRad, true); // true for counterclockwise
        mapCtx.closePath();
        mapCtx.fill();
        
        // Draw center sweep ray line
        mapCtx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
        mapCtx.lineWidth = 1;
        mapCtx.beginPath();
        mapCtx.moveTo(rScreenX, rScreenY);
        mapCtx.lineTo(targetX, targetY);
        mapCtx.stroke();
    }
    
    // 3. Draw Robot Path History
    if (State.pathHistory.length > 1) {
        mapCtx.strokeStyle = 'var(--accent-green)';
        mapCtx.lineWidth = 2.5;
        mapCtx.lineCap = 'round';
        mapCtx.lineJoin = 'round';
        
        mapCtx.shadowColor = 'var(--accent-green)';
        mapCtx.shadowBlur = 8;
        
        mapCtx.beginPath();
        mapCtx.moveTo(oX + State.pathHistory[0].x * scale, oY - State.pathHistory[0].y * scale);
        
        for (let i = 1; i < State.pathHistory.length; i++) {
            mapCtx.lineTo(oX + State.pathHistory[i].x * scale, oY - State.pathHistory[i].y * scale);
        }
        mapCtx.stroke();
        
        // Disable shadow for other renders
        mapCtx.shadowBlur = 0;
    }
    
    // 4. Draw Obstacles
    mapCtx.fillStyle = 'var(--accent-red)';
    mapCtx.shadowColor = 'var(--accent-red)';
    
    State.obstacles.forEach(obs => {
        const obsScreenX = oX + obs.x * scale;
        const obsScreenY = oY - obs.y * scale;
        
        // Skip rendering if it falls outside canvas viewport bounds
        if (obsScreenX < 0 || obsScreenX > width || obsScreenY < 0 || obsScreenY > height) {
            return;
        }
        
        mapCtx.beginPath();
        mapCtx.arc(obsScreenX, obsScreenY, 4 * scale, 0, Math.PI * 2);
        mapCtx.shadowBlur = 8;
        mapCtx.fill();
    });
    mapCtx.shadowBlur = 0;
    
    // 5. Draw Robot Triangle (Blue glowing locator)
    const robScreenX = oX + State.robotX * scale;
    const robScreenY = oY - State.robotY * scale;
    
    mapCtx.save();
    mapCtx.translate(robScreenX, robScreenY);
    // Rotate triangle. In standard Cartesian heading:
    // 0 = East (Right), 90 = North (Up), 180 = West (Left), 270 = South (Down)
    // Canvas rotate uses standard CW angles, but Cartesian is CCW, so invert rotation.
    const headingRad = -State.robotHeading * Math.PI / 180;
    mapCtx.rotate(headingRad);
    
    // Glow
    mapCtx.shadowColor = 'var(--accent-cyan)';
    mapCtx.shadowBlur = 12;
    
    // Triangle dimensions
    const triSize = 10 * State.zoomLevel;
    
    // Draw robot chassis triangle
    mapCtx.fillStyle = 'var(--accent-cyan)';
    mapCtx.beginPath();
    mapCtx.moveTo(triSize * 1.5, 0);              // Front Tip
    mapCtx.lineTo(-triSize, -triSize * 0.8);      // Back Left
    mapCtx.lineTo(-triSize * 0.5, 0);             // Indent center
    mapCtx.lineTo(-triSize, triSize * 0.8);       // Back Right
    mapCtx.closePath();
    mapCtx.fill();
    
    // Add direction line inside robot
    mapCtx.strokeStyle = '#fff';
    mapCtx.lineWidth = 1.5;
    mapCtx.beginPath();
    mapCtx.moveTo(0, 0);
    mapCtx.lineTo(triSize * 1.2, 0);
    mapCtx.stroke();
    
    mapCtx.restore();
}

// Render secondary Radar Sweep Arc
function drawRadarSweep() {
    if (!radarCtx) return;
    
    const w = radarCanvas.width;
    const h = radarCanvas.height;
    
    // Clear radar background
    radarCtx.fillStyle = '#080c18';
    radarCtx.fillRect(0, 0, w, h);
    
    // Center bottom of the viewport represents sensor mounting node
    const radarCX = w / 2;
    const radarCY = h - 25;
    const maxRadius = Math.min(w / 2 - 10, h - 35);
    
    // 1. Draw concentric distance circles (100, 200, 300, 400cm)
    radarCtx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
    radarCtx.lineWidth = 1;
    
    const distances = [100, 200, 300, 400];
    distances.forEach((dist, idx) => {
        const radius = (dist / 400) * maxRadius;
        radarCtx.beginPath();
        radarCtx.arc(radarCX, radarCY, radius, Math.PI, 0, false);
        radarCtx.stroke();
        
        // Add range labels
        radarCtx.fillStyle = 'var(--text-muted)';
        radarCtx.font = '0.55rem JetBrains Mono';
        radarCtx.fillText(`${dist}cm`, radarCX + radius - 15, radarCY + 12);
    });
    
    // 2. Draw angle division rays (30, 60, 90, 120, 150)
    const angles = [30, 60, 90, 120, 150];
    angles.forEach(deg => {
        // Convert to radians (servo coordinates: 0 is right, 90 is straight up, 180 is left)
        const rad = deg * Math.PI / 180;
        const targetX = radarCX + maxRadius * Math.cos(Math.PI - rad); // invert relative left-right
        const targetY = radarCY - maxRadius * Math.sin(Math.PI - rad);
        
        radarCtx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
        radarCtx.beginPath();
        radarCtx.moveTo(radarCX, radarCY);
        radarCtx.lineTo(targetX, targetY);
        radarCtx.stroke();
        
        // Draw labels on ticks
        const textX = radarCX + (maxRadius + 12) * Math.cos(Math.PI - rad) - 6;
        const textY = radarCY - (maxRadius + 12) * Math.sin(Math.PI - rad) + 3;
        radarCtx.fillStyle = 'var(--text-secondary)';
        radarCtx.font = '0.6rem Outfit';
        radarCtx.fillText(`${deg}°`, textX, textY);
    });
    
    // Baseline boundary line
    radarCtx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
    radarCtx.beginPath();
    radarCtx.moveTo(radarCX - maxRadius, radarCY);
    radarCtx.lineTo(radarCX + maxRadius, radarCY);
    radarCtx.stroke();
    
    // 3. Draw sonar sweeps and fading history blips
    State.radarSweepHistory.forEach(blip => {
        const age = Date.now() - blip.timestamp;
        const lifeSpan = 1500; // time in ms for blip trail to disappear
        if (age > lifeSpan) return;
        
        const opacity = 1.0 - (age / lifeSpan);
        const rad = blip.angle * Math.PI / 180;
        const distRad = (blip.distance / 400) * maxRadius;
        
        // Screen position
        const bx = radarCX + distRad * Math.cos(Math.PI - rad);
        const by = radarCY - distRad * Math.sin(Math.PI - rad);
        
        // Draw swept cone trail
        radarCtx.fillStyle = `rgba(0, 240, 255, ${opacity * 0.04})`;
        radarCtx.beginPath();
        radarCtx.moveTo(radarCX, radarCY);
        const coneWidth = 10 * Math.PI / 180;
        radarCtx.arc(radarCX, radarCY, distRad, Math.PI - rad - coneWidth/2, Math.PI - rad + coneWidth/2);
        radarCtx.closePath();
        radarCtx.fill();
        
        // Draw Obstacle blip indicator
        if (blip.distance < 400) {
            radarCtx.fillStyle = `rgba(255, 49, 49, ${opacity})`;
            radarCtx.shadowColor = 'var(--accent-red)';
            radarCtx.shadowBlur = 6 * opacity;
            radarCtx.beginPath();
            radarCtx.arc(bx, by, 5, 0, Math.PI * 2);
            radarCtx.fill();
            radarCtx.shadowBlur = 0;
        }
    });
    
    // 4. Draw active sweep indicator line
    const activeRad = State.scanAngle * Math.PI / 180;
    const ax = radarCX + maxRadius * Math.cos(Math.PI - activeRad);
    const ay = radarCY - maxRadius * Math.sin(Math.PI - activeRad);
    
    // Radar line sweep effect
    radarCtx.strokeStyle = 'var(--accent-cyan)';
    radarCtx.lineWidth = 2;
    radarCtx.shadowColor = 'var(--accent-cyan)';
    radarCtx.shadowBlur = 10;
    radarCtx.beginPath();
    radarCtx.moveTo(radarCX, radarCY);
    radarCtx.lineTo(ax, ay);
    radarCtx.stroke();
    radarCtx.shadowBlur = 0;
}

// --- Connection Indicator Visual Updates ---
function updateConnectionStatus(status) {
    State.connectionStatus = status;
    updateConnectionUI();
}

function updateConnectionUI() {
    const textEl = document.getElementById('connStatusText');
    const indicatorEl = document.getElementById('connStatusIndicator');
    const connectBtn = document.getElementById('connectBtn');
    const connectBtnText = document.getElementById('connectBtnText');
    
    // Remove all classes
    indicatorEl.className = 'status-indicator';
    connectBtn.className = 'btn btn-connect';
    connectBtnText.textContent = "Connect Arduino";
    
    switch (State.connectionStatus) {
        case 'Connected':
            textEl.textContent = 'Connected';
            indicatorEl.classList.add('status-connected');
            connectBtn.classList.add('connected');
            connectBtnText.textContent = "Disconnect";
            break;
            
        case 'Connecting':
            textEl.textContent = 'Connecting';
            indicatorEl.classList.add('status-connecting');
            break;
            
        case 'Disconnected':
            textEl.textContent = 'Disconnected';
            indicatorEl.classList.add('status-disconnected');
            break;
            
        case 'Error':
            textEl.textContent = 'Error';
            indicatorEl.classList.add('status-error');
            break;
    }
}

// --- Interactive Simulation Engine ---

function toggleSimulation(enable) {
    State.isSimMode = enable;
    document.getElementById('simModeToggle').checked = enable;
    
    if (enable) {
        if (State.connectionStatus === 'Connected') {
            disconnectSerial();
        }
        updateConnectionStatus('Disconnected');
        startSimulationLoop();
        logSystemEvent("Simulation Mode activated.");
    } else {
        stopSimulationLoop();
        logSystemEvent("Simulation Mode deactivated.");
    }
}

function startSimulationLoop() {
    if (State.simInterval) clearInterval(State.simInterval);
    
    // Set simulator variables initial value if starting fresh
    let stepNum = State.step || 1;
    let simX = State.robotX || 0;
    let simY = State.robotY || 0;
    let simHeading = State.robotHeading || 90;
    let simServoAngle = 90;
    let simServoDirection = 1; // 1 = Left sweep, -1 = Right sweep
    let simState = 'FAST_FORWARD';
    let localWaitTicks = 0;
    
    // We keep track of simulated scanning values
    let leftScanDist = 400;
    let rightScanDist = 400;
    
    State.simInterval = setInterval(() => {
        if (State.isManualOverrideActive) {
            // Manual overrides handles movement, just update standard scans in background
            simServoAngle += 15 * simServoDirection;
            if (simServoAngle >= 180) { simServoAngle = 180; simServoDirection = -1; }
            if (simServoAngle <= 0) { simServoAngle = 0; simServoDirection = 1; }
            
            // Calculate distance in simulator world
            const simulatedDist = raycastSimWorld(State.robotX, State.robotY, State.robotHeading, simServoAngle);
            
            stepNum++;
            updateTelemetry(
                stepNum,
                State.robotX,
                State.robotY,
                State.robotHeading,
                simServoAngle,
                simulatedDist,
                'MANUAL_OVERRIDE'
            );
            return;
        }
        
        // --- Autonomous Obstacle Avoidance Simulation Logic ---
        
        // 1. Calculate raycast forward distance
        const forwardDist = raycastSimWorld(simX, simY, simHeading, 90);
        
        // 2. Behavioral State Machine
        if (simState === 'FAST_FORWARD') {
            simServoAngle = 90;
            if (forwardDist <= 35) {
                // Obstacle too close, trigger emergency stop
                simState = 'OBSTACLE_STOP';
                localWaitTicks = 2; // stop for 2 ticks (approx 600ms) before scanning
            } else {
                // Move forward
                const speed = 4;
                const rad = simHeading * Math.PI / 180;
                simX += speed * Math.cos(rad);
                simY += speed * Math.sin(rad);
            }
        } 
        else if (simState === 'SLOW_FORWARD') {
            simServoAngle = 90;
            if (forwardDist <= 25) {
                simState = 'OBSTACLE_STOP';
                localWaitTicks = 2;
            } else {
                // Move slower
                const speed = 2;
                const rad = simHeading * Math.PI / 180;
                simX += speed * Math.cos(rad);
                simY += speed * Math.sin(rad);
            }
        }
        else if (simState === 'OBSTACLE_STOP') {
            if (localWaitTicks > 0) {
                localWaitTicks--;
            } else {
                // Stopped, initiate left sweep
                simState = 'LEFT_SCAN';
                simServoAngle = 90;
                leftScanDist = 0;
            }
        }
        else if (simState === 'LEFT_SCAN') {
            // Sweep servo to 150 degrees
            simServoAngle += 30;
            if (simServoAngle >= 150) {
                simServoAngle = 150;
                leftScanDist = raycastSimWorld(simX, simY, simHeading, 150);
                simState = 'RIGHT_SCAN';
            }
        }
        else if (simState === 'RIGHT_SCAN') {
            // Sweep servo to 30 degrees
            simServoAngle -= 30;
            if (simServoAngle <= 30) {
                simServoAngle = 30;
                rightScanDist = raycastSimWorld(simX, simY, simHeading, 30);
                
                // Finished scanning, make navigation decision
                if (leftScanDist > rightScanDist && leftScanDist > 30) {
                    simState = 'TURN_LEFT';
                    localWaitTicks = 1;
                } else if (rightScanDist >= leftScanDist && rightScanDist > 30) {
                    simState = 'TURN_RIGHT';
                    localWaitTicks = 1;
                } else {
                    simState = 'NO_VALID_PATH';
                    localWaitTicks = 3;
                }
            }
        }
        else if (simState === 'TURN_LEFT') {
            if (localWaitTicks > 0) {
                localWaitTicks--;
            } else {
                simHeading = (simHeading + 90) % 360;
                simState = 'FAST_FORWARD';
                simServoAngle = 90;
            }
        }
        else if (simState === 'TURN_RIGHT') {
            if (localWaitTicks > 0) {
                localWaitTicks--;
            } else {
                simHeading = (simHeading - 90 + 360) % 360;
                simState = 'FAST_FORWARD';
                simServoAngle = 90;
            }
        }
        else if (simState === 'NO_VALID_PATH') {
            if (localWaitTicks > 0) {
                localWaitTicks--;
            } else {
                // No route, turn around 180 degrees
                simHeading = (simHeading + 180) % 360;
                simState = 'FAST_FORWARD';
                simServoAngle = 90;
            }
        }
        
        // Boundary collision clamping in sim
        simX = Math.max(SimWorld.boundaryMin + 15, Math.min(SimWorld.boundaryMax - 15, simX));
        simY = Math.max(SimWorld.boundaryMin + 15, Math.min(SimWorld.boundaryMax - 15, simY));
        
        // Calculate sensor distance value
        const currentDist = raycastSimWorld(simX, simY, simHeading, simServoAngle);
        
        stepNum++;
        
        // Formulate packet string
        const simulatedPacket = `MAP,${stepNum},${simX.toFixed(1)},${simY.toFixed(1)},${simHeading},${simServoAngle},${currentDist.toFixed(1)},${simState}`;
        parseIncomingLine(simulatedPacket);
        
    }, 300);
}

function stopSimulationLoop() {
    if (State.simInterval) {
        clearInterval(State.simInterval);
        State.simInterval = null;
    }
}

// Raycast against simulated boxes to return distance in centimeters
function raycastSimWorld(rx, ry, heading, scanAngle) {
    const absAngle = robotHeadingToMathAngle(heading, scanAngle);
    const rad = absAngle * Math.PI / 180;
    const ux = Math.cos(rad);
    const uy = Math.sin(rad);
    
    let minDist = 400; // Max sonar range
    
    // 1. Raycast Outer Boundary walls
    if (Math.abs(ux) > 0.001) {
        const dWallEast = (SimWorld.boundaryMax - rx) / ux;
        if (dWallEast > 0 && dWallEast < minDist) minDist = dWallEast;
        
        const dWallWest = (SimWorld.boundaryMin - rx) / ux;
        if (dWallWest > 0 && dWallWest < minDist) minDist = dWallWest;
    }
    if (Math.abs(uy) > 0.001) {
        const dWallNorth = (SimWorld.boundaryMax - ry) / uy;
        if (dWallNorth > 0 && dWallNorth < minDist) minDist = dWallNorth;
        
        const dWallSouth = (SimWorld.boundaryMin - ry) / uy;
        if (dWallSouth > 0 && dWallSouth < minDist) minDist = dWallSouth;
    }
    
    // 2. Raycast boxes inside room
    SimWorld.boxes.forEach(box => {
        let tmin = 0;
        let tmax = 400;
        
        // X Check
        if (Math.abs(ux) < 0.0001) {
            if (rx < box.xmin || rx > box.xmax) return;
        } else {
            let t1 = (box.xmin - rx) / ux;
            let t2 = (box.xmax - rx) / ux;
            if (t1 > t2) { const tmp = t1; t1 = t2; t2 = tmp; }
            tmin = Math.max(tmin, t1);
            tmax = Math.min(tmax, t2);
        }
        
        // Y Check
        if (Math.abs(uy) < 0.0001) {
            if (ry < box.ymin || ry > box.ymax) return;
        } else {
            let t1 = (box.ymin - ry) / uy;
            let t2 = (box.ymax - ry) / uy;
            if (t1 > t2) { const tmp = t1; t1 = t2; t2 = tmp; }
            tmin = Math.max(tmin, t1);
            tmax = Math.min(tmax, t2);
        }
        
        if (tmin < tmax && tmin > 0) {
            if (tmin < minDist) {
                minDist = tmin;
            }
        }
    });
    
    // Add 2% sensor noise
    const noise = (Math.random() - 0.5) * 1.5;
    return Math.max(2, Math.min(400, minDist + noise));
}

// --- Manual Override Keyboard Mapping ---

function toggleManualOverride() {
    State.isManualOverrideActive = !State.isManualOverrideActive;
    const btn = document.getElementById('toggleManualOverrideBtn');
    const statusText = document.getElementById('manualOverrideStatus');
    const btnIcon = document.querySelector('#toggleManualOverrideBtn i');
    
    if (State.isManualOverrideActive) {
        statusText.textContent = "ACTIVE";
        statusText.className = "override-status active";
        btn.classList.add('active');
        btn.querySelector('span').textContent = "Deactivate Manual Control";
        btnIcon.setAttribute('data-lucide', 'toggle-right');
        
        logSystemEvent("Manual Override Mode ACTIVE. Keyboard controls enabled.");
        addTimelineEvent("MANUAL", "Manual Override Mode Activated", "state-active");
    } else {
        statusText.textContent = "INACTIVE";
        statusText.className = "override-status inactive";
        btn.classList.remove('active');
        btn.querySelector('span').textContent = "Activate Manual Controls";
        btnIcon.setAttribute('data-lucide', 'toggle-left');
        
        logSystemEvent("Manual Override Mode DEACTIVATED. Returning to autonomous mode.");
        sendManualCommand('DIR,STOP');
        addTimelineEvent("AUTO", "Returned to Autonomous Steering", "state-active");
    }
    
    if (window.lucide) window.lucide.createIcons();
}

function handleKeyboardControl(e) {
    if (!State.isManualOverrideActive) return;
    
    let command = '';
    let btnId = '';
    
    switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
            command = 'DIR,FORWARD';
            btnId = 'btnDriveForward';
            break;
        case 's':
        case 'arrowdown':
            command = 'DIR,BACKWARD';
            btnId = 'btnDriveBackward';
            break;
        case 'a':
        case 'arrowleft':
            command = 'DIR,LEFT';
            btnId = 'btnDriveLeft';
            break;
        case 'd':
        case 'arrowright':
            command = 'DIR,RIGHT';
            btnId = 'btnDriveRight';
            break;
        case ' ': // spacebar stop
            command = 'DIR,STOP';
            btnId = 'btnDriveStop';
            e.preventDefault(); // prevent scrolling page
            break;
    }
    
    if (command) {
        const btn = document.getElementById(btnId);
        if (btn && !btn.classList.contains('pressed')) {
            // Visual keypress feedback
            btn.classList.add('pressed');
            sendManualCommand(command);
        }
    }
}

function handleKeyboardRelease(e) {
    if (!State.isManualOverrideActive) return;
    
    let btnId = '';
    switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup': btnId = 'btnDriveForward'; break;
        case 's':
        case 'arrowdown': btnId = 'btnDriveBackward'; break;
        case 'a':
        case 'arrowleft': btnId = 'btnDriveLeft'; break;
        case 'd':
        case 'arrowright': btnId = 'btnDriveRight'; break;
        case ' ': btnId = 'btnDriveStop'; break;
    }
    
    if (btnId) {
        const btn = document.getElementById(btnId);
        if (btn) btn.classList.remove('pressed');
        
        // Halts movement on key release
        if (btnId !== 'btnDriveStop') {
            sendManualCommand('DIR,STOP');
        }
    }
}

function sendManualCommand(cmd) {
    // Visually toggle UI pressed states
    const btnIdMap = {
        'DIR,FORWARD': 'btnDriveForward',
        'DIR,BACKWARD': 'btnDriveBackward',
        'DIR,LEFT': 'btnDriveLeft',
        'DIR,RIGHT': 'btnDriveRight',
        'DIR,STOP': 'btnDriveStop'
    };
    
    // Clear other keypad visual presses
    Object.values(btnIdMap).forEach(id => {
        const btn = document.getElementById(id);
        if (btn && id !== btnIdMap[cmd]) btn.classList.remove('pressed');
    });
    
    const activeBtn = document.getElementById(btnIdMap[cmd]);
    if (activeBtn) activeBtn.classList.add('pressed');
    
    // Send string over Web Serial API
    sendSerialCommand(cmd);
}

// Local simulation reaction to manual control keys
function processSimManualCommand(command) {
    if (!State.isManualOverrideActive) return;
    
    const speed = 6;
    let rad = State.robotHeading * Math.PI / 180;
    
    switch (command) {
        case 'DIR,FORWARD':
            State.robotX += speed * Math.cos(rad);
            State.robotY += speed * Math.sin(rad);
            break;
            
        case 'DIR,BACKWARD':
            State.robotX -= speed * Math.cos(rad);
            State.robotY -= speed * Math.sin(rad);
            break;
            
        case 'DIR,LEFT':
            State.robotHeading = (State.robotHeading + 90) % 360;
            State.lastTurnDirection = 'LEFT';
            break;
            
        case 'DIR,RIGHT':
            State.robotHeading = (State.robotHeading - 90 + 360) % 360;
            State.lastTurnDirection = 'RIGHT';
            break;
            
        case 'DIR,STOP':
            // Halt
            break;
    }
    
    // Keep bounded in simulated universe
    State.robotX = Math.max(SimWorld.boundaryMin + 15, Math.min(SimWorld.boundaryMax - 15, State.robotX));
    State.robotY = Math.max(SimWorld.boundaryMin + 15, Math.min(SimWorld.boundaryMax - 15, State.robotY));
}
