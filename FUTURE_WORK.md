# Future Work

## Overview

The current version of the Autonomous Vehicle Mapping and Telemetry System successfully demonstrates autonomous navigation, obstacle detection, servo-assisted scanning, pivot turning, telemetry output, and live dashboard visualization support.

Future development will focus on improving mapping accuracy, navigation intelligence, hardware reliability, and data visualization quality.

---

## 1. Wheel Encoder Integration

Wheel encoders would allow the vehicle to measure actual wheel rotation instead of estimating movement from timed motor commands.

Benefits:

- More accurate distance tracking
- Improved position estimation
- Reduced map drift
- Better turning calibration
- Foundation for odometry-based navigation

---

## 2. IMU-Based Heading Estimation

An inertial measurement unit (IMU) could be added to improve heading accuracy.

Benefits:

- More reliable orientation tracking
- Better turn angle measurement
- Reduced heading drift
- Improved mapping consistency

---

## 3. Occupancy Grid Mapping

The current dashboard plots obstacle points using estimated position, heading, scan angle, and ultrasonic distance. A future version could implement a true occupancy grid.

Benefits:

- Grid-based representation of known, unknown, and occupied space
- More robot-vacuum-style mapping behavior
- Better visualization of explored areas
- Stronger foundation for path planning

---

## 4. Improved Localization

Future versions could combine wheel encoders, IMU data, and sensor readings to estimate robot position more accurately.

Potential approaches:

- Dead reckoning with encoder correction
- Sensor fusion
- Kalman filtering
- Map-based correction

---

## 5. SLAM-Inspired Mapping

A long-term improvement would be to explore simultaneous localization and mapping concepts.

While full SLAM may exceed the limitations of an Arduino Uno, parts of the system could be moved to a more powerful processor or external computer for advanced mapping.

Potential upgrades:

- Raspberry Pi companion computer
- ESP32-based telemetry system
- External laptop processing
- LiDAR or camera-based mapping

---

## 6. Improved Power System

The vehicle's reliability can be improved with a stronger and cleaner power system.

Potential improvements:

- Separate regulated supply for servo motor
- Higher-capacity battery pack
- Voltage regulation for sensor stability
- Power switch integration
- Battery voltage monitoring

---

## 7. Sensor Expansion

Additional sensors could improve environmental perception.

Possible additions:

- Rear ultrasonic sensor
- Side ultrasonic sensors
- Infrared proximity sensors
- Bumper/contact sensors
- Line sensors
- 2D LiDAR module

---

## 8. Dashboard Improvements

The dashboard can be expanded into a more advanced robotics monitoring tool.

Potential improvements:

- Stronger occupancy grid rendering
- Session replay
- Map save/load system
- Sensor confidence visualization
- More detailed analytics
- Real-time calibration controls
- Exportable experiment reports

---

## 9. Navigation Algorithm Improvements

The current system uses threshold-based obstacle avoidance and left/right distance comparison. Future algorithms could make navigation more intelligent.

Potential improvements:

- Wall following
- Coverage path planning
- Maze exploration
- Return-to-start behavior
- Obstacle memory
- Path smoothing

---

## 10. Mechanical Design Improvements

Future chassis improvements could improve stability and reliability.

Potential improvements:

- More compact wiring layout
- Better battery placement
- Improved sensor mount rigidity
- Stronger motor mounting points
- Cable management channels
- Modular mounting system for future sensors

---

## Final Direction

The long-term goal is to evolve this project from a proof-of-concept autonomous mapping vehicle into a more accurate mobile robotics platform capable of reliable localization, environmental mapping, intelligent path planning, and advanced telemetry visualization.
