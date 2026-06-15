# System Architecture

## Overview

The Autonomous Vehicle Mapping and Telemetry System is organized as a layered robotics platform. The physical vehicle is responsible for sensing, navigation, obstacle avoidance, movement control, and telemetry generation. The companion dashboard is responsible for receiving live serial data, visualizing the robot state, and rendering an estimated occupancy-style map.

The system is intentionally modular so that each subsystem can be tested independently before integration.

---

## High-Level System Flow

```text
Environment
   ↓
HC-SR04 Ultrasonic Sensor
   ↓
Arduino Uno Perception Logic
   ↓
Autonomous Navigation Decision
   ↓
L298N Motor Driver
   ↓
DC Motors / Vehicle Motion
   ↓
Serial Telemetry Output
   ↓
Web Dashboard Mapping Visualization
```

---

## Hardware Architecture

The hardware platform consists of:

- Arduino Uno R3 microcontroller
- HC-SR04 ultrasonic distance sensor
- SG90 servo motor for directional scanning
- L298N motor driver module
- Two DC drive motors
- Two drive wheels
- Battery holder and power system
- Breadboard and jumper wiring
- Custom 3D-printed chassis
- USB cable for programming and telemetry

The Arduino Uno acts as the central controller. It receives distance readings from the ultrasonic sensor, controls the servo scanning angle, makes autonomous navigation decisions, drives the motors through the L298N motor driver, and streams telemetry packets to the dashboard.

---

## Pin Architecture

| Component | Arduino Pin |
|----------|-------------|
| HC-SR04 Echo | D2 |
| HC-SR04 Trigger | D3 |
| SG90 Servo Signal | D4 |
| L298N ENA | D5 |
| L298N ENB | D6 |
| L298N IN1 | D8 |
| L298N IN2 | D9 |
| L298N IN3 | D10 |
| L298N IN4 | D11 |

All grounds are connected together to maintain a common reference between the Arduino, motor driver, servo, ultrasonic sensor, and power system.

---

## Software Architecture

The firmware is divided into the following functional layers.

### 1. Perception Layer

The perception layer reads the HC-SR04 ultrasonic sensor and converts echo pulse duration into distance measurements in centimeters. Invalid readings are represented as `-1`.

### 2. Scanning Layer

The scanning layer controls the servo-mounted ultrasonic sensor. The sensor scans three directions:

- 90° for front scan
- 150° for left scan
- 30° for right scan

This allows the vehicle to compare available space before choosing a turn direction.

### 3. Navigation Layer

The navigation layer evaluates the front distance reading and chooses the appropriate movement state:

| Distance Condition | Vehicle Behavior |
|-------------------|------------------|
| Greater than 35 cm | Move forward quickly |
| 18 cm to 35 cm | Move forward slowly |
| Less than or equal to 18 cm | Stop, scan left/right, and turn |
| Invalid reading | Stop for safety |

### 4. Motor Control Layer

The motor control layer sends PWM and direction signals to the L298N motor driver. Forward movement drives both motors forward. Turning is performed using pivot turns:

- Left turn: left motor backward, right motor forward
- Right turn: left motor forward, right motor backward

### 5. Mapping and Telemetry Layer

The mapping layer maintains an estimated robot position using simple dead reckoning. Because the vehicle does not yet include wheel encoders or an IMU, the position estimate is approximate.

The firmware outputs telemetry packets using this format:

```text
MAP,step,x,y,heading,scanAngle,distance,state
```

Example:

```text
MAP,15,12,36,90,150,42,LEFT_SCAN
```

The dashboard parses these packets and converts the robot position, heading, sensor angle, and distance into visual map points.

---

## Dashboard Architecture

The dashboard is a browser-based visualization system that connects to the Arduino over USB Serial using the Web Serial API. It reads telemetry packets, updates the live robot state, renders the robot path, and plots detected obstacles on a 2D map.

The dashboard also includes simulation mode so the interface can be demonstrated without hardware connected.

---

## Mapping Limitations

The current mapping system is an estimated occupancy-style visualization. It is not full SLAM. Position updates are based on commanded motion rather than measured wheel rotation. This means the map is useful for visualization and proof-of-concept mapping, but it may drift over time.

Future upgrades such as wheel encoders, IMU support, and localization algorithms would improve mapping accuracy.
