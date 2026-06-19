# Autonomous Vehicle Mapping and Telemetry System

🚀 **Live Web Dashboard:** [autonomous-vehicle-mapping-and-tele-seven.vercel.app](https://autonomous-vehicle-mapping-and-tele-seven.vercel.app/)

## Project Overview

The Autonomous Vehicle Mapping and Telemetry System is a completed robotics and embedded systems project focused on autonomous navigation, obstacle detection, environmental scanning, digital mapping, and real-time telemetry visualization. The project combines Arduino firmware, sensor integration, motor control, mechanical design, serial communication, and a browser-based dashboard into one complete autonomous robotics platform.

The vehicle uses an HC-SR04 ultrasonic sensor mounted on an SG90 servo motor to scan its environment from multiple directions. Based on distance readings, the Arduino makes autonomous navigation decisions, slows down near obstacles, stops when necessary, scans left and right, and turns toward the direction with more available space.

While the vehicle navigates, it streams structured telemetry data over USB serial. The companion website reads this data and displays the robot's estimated position, heading, scan angle, obstacle readings, movement state, path history, radar-style scanning, and occupancy-style mapping visualization.

This project demonstrates practical skills in embedded systems, robotics engineering, autonomous navigation, sensor processing, hardware-software integration, telemetry systems, and web-based data visualization.

---
## Device Images

Below are images of the autonomous mapping vehicle, including the physical build, sensor setup, wiring, and testing process.
<img width="672" height="896" alt="image" src="https://github.com/user-attachments/assets/41390316-c1f2-4c2d-b0ba-11f56f7b7fc3" />
<img width="672" height="896" alt="image" src="https://github.com/user-attachments/assets/f4fabea6-c6f2-4112-bb60-6b66a7c9afdf" />
<img width="672" height="896" alt="image" src="https://github.com/user-attachments/assets/f6569b45-1f08-4b97-94f6-2d41650f0c2a" />
<img width="1195" height="896" alt="image" src="https://github.com/user-attachments/assets/fa7b63c1-8bff-4a7f-a8c1-eb7dd290e3cc" />

---

## Final Project Features

- Autonomous obstacle avoidance
- Servo-assisted ultrasonic scanning
- Left, front, and right environmental perception
- Distance-based speed adjustment
- Automatic stop-and-scan behavior
- Pivot turning based on available space
- Estimated position tracking
- Serial telemetry output from Arduino
- Web dashboard for live mapping visualization
- Simulation mode for dashboard demonstration
- Exportable dashboard logs and map visualization
- Modular documentation for architecture, testing, BOM, and future work

---

## Hardware Used

| Component | Purpose |
|----------|---------|
| Arduino Uno R3 | Main embedded controller |
| HC-SR04 Ultrasonic Sensor | Obstacle detection and distance measurement |
| SG90 Servo Motor | Rotates the ultrasonic sensor for directional scanning |
| L298N Motor Driver | Controls motor speed and direction |
| DC Gear Motors | Vehicle propulsion |
| Wheels | Vehicle movement |
| Battery Holder / Power System | Provides power to motors and electronics |
| Breadboard and Jumper Wires | Prototyping and electrical connections |
| Custom 3D-Printed Chassis | Mechanical support structure |
| USB Cable | Programming and serial telemetry connection |

---

## Arduino Pin Layout

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

All grounds are connected together so the Arduino, motor driver, servo, ultrasonic sensor, and battery system share a common reference.

---

## Software and Firmware

The final Arduino firmware is located in:

```text
firmware/firmware.ino
```

The firmware performs:

- Ultrasonic distance measurement
- Servo scanning at left, center, and right angles
- Autonomous obstacle avoidance
- Speed adjustment based on obstacle distance
- Pivot turning
- Estimated X/Y position tracking
- Serial telemetry packet output

The vehicle uses two main distance thresholds:

| Distance Reading | Vehicle Behavior |
|-----------------|------------------|
| Greater than 35 cm | Move forward quickly |
| 18 cm to 35 cm | Move forward slowly |
| 18 cm or less | Stop, scan left/right, and turn |
| Invalid reading | Stop for safety |

---

## Telemetry Data Format

The Arduino streams mapping data over USB serial at 9600 baud using this CSV packet format:

```text
MAP,step,x,y,heading,scanAngle,distance,state
```

Example:

```text
MAP,15,12,36,90,150,42,LEFT_SCAN
```

### Field Definitions

| Field | Description |
|------|-------------|
| step | Sequential telemetry event number |
| x | Estimated robot X position |
| y | Estimated robot Y position |
| heading | Robot heading in map space |
| scanAngle | Servo scan angle |
| distance | Ultrasonic distance reading in centimeters |
| state | Current robot navigation state |

Common robot states include:

```text
BOOT_INITIALIZED
FRONT_SCAN
FAST_FORWARD
SLOW_FORWARD
OBSTACLE_STOP
LEFT_SCAN
RIGHT_SCAN
TURN_LEFT
TURN_RIGHT
NO_VALID_PATH
INVALID_READING_STOP
```

---

## Web Dashboard

The web dashboard is located in:

```text
dashboard/
```

The dashboard connects to the Arduino through the browser using the Web Serial API. It reads the telemetry packets generated by the firmware and visualizes the robot's movement and mapping data.

Dashboard features include:

- Live telemetry cards
- Real-time position display
- Robot heading display
- Ultrasonic distance display
- Servo scan angle display
- Vehicle state display
- 2D occupancy-style map
- Robot path history
- Obstacle plotting
- Radar-style sensor sweep visualization
- Raw serial log display
- CSV/JSON export options
- Map export option
- Simulation mode for testing without the physical robot

---

## How to Run the Dashboard

### Option 1: Live Website

Open the deployed dashboard in a compatible browser:

[autonomous-vehicle-mapping-and-tele-seven.vercel.app](https://autonomous-vehicle-mapping-and-tele-seven.vercel.app/)

Recommended browsers:

- Google Chrome
- Microsoft Edge
- Opera

### Option 2: Local Simulation Mode

To view the dashboard without connecting the Arduino:

1. Clone the repository.
2. Open `dashboard/index.html` in your browser.
3. Keep simulation mode enabled.

### Option 3: Local Web Serial Mode

To connect to the Arduino locally using Web Serial:

```bash
cd dashboard
npx serve -l 3030 .
```

Then open:

```text
http://localhost:3030
```

Connect the Arduino, turn simulator mode off, select 9600 baud, and click **Connect Arduino**.

---

## Mapping Method

The mapping system uses estimated robot position, heading, servo angle, and ultrasonic distance to calculate approximate obstacle locations.

The dashboard converts each sensor reading into map coordinates using the robot's current estimated position and sensor direction.

This creates an occupancy-style visualization inspired by robotic vacuum mapping systems. The current implementation is a proof-of-concept mapping system and does not perform full SLAM.

---

## Repository Structure

```text
.
├── firmware/
│   └── firmware.ino
├── dashboard/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── BOM.md
├── SYSTEM_ARCHITECTURE.md
├── TESTING.md
├── FUTURE_WORK.md
├── journal.md
├── LICENSE
├── .gitignore
└── README.md
```

---

## Documentation

| File | Description |
|-----|-------------|
| `BOM.md` | Hardware bill of materials and cost analysis |
| `SYSTEM_ARCHITECTURE.md` | Hardware, firmware, telemetry, and dashboard architecture |
| `TESTING.md` | Testing process and final validation results |
| `FUTURE_WORK.md` | Planned improvements and future development ideas |
| `journal.md` | Development timeline and project progress record |
| `LICENSE` | MIT license |

---

## Engineering Challenges

Major challenges included:

- Correcting ultrasonic sensor wiring and invalid readings
- Tuning servo scan timing
- Adjusting motor direction and speed values
- Creating reliable stop-and-scan behavior
- Choosing turn direction based on left/right distance comparison
- Producing telemetry data in a dashboard-readable format
- Mapping sensor readings onto a 2D visualization
- Managing the limitations of an Arduino Uno platform

---

## Known Limitations

The current mapping system is approximate because the vehicle does not include wheel encoders, an IMU, or SLAM-based localization. Position updates are estimated from commanded movement, so the map can drift over time.

Battery level, surface friction, motor variation, and turning duration can also affect movement accuracy. Future versions could improve this using encoders, sensor fusion, and more advanced localization algorithms.

---

## Future Improvements

Potential improvements include:

- Wheel encoder odometry
- IMU-based heading correction
- More accurate occupancy-grid mapping
- Improved localization
- Enhanced path planning
- Additional sensors
- Stronger power regulation
- Improved chassis design
- Advanced dashboard analytics
- SLAM-inspired mapping algorithms

---

## Contributors

- Deep Patel
- Adnan Al Haj Ali
- Ammar

---

## Project Status

Completed.

This project was developed as a collaborative robotics and embedded systems project focused on autonomous navigation, obstacle avoidance, mapping telemetry, and web-based visualization.
