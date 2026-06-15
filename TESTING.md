# Testing Documentation

## Overview

This document summarizes the testing process used to verify the Autonomous Vehicle Mapping and Telemetry System. Testing was completed in stages to confirm each subsystem worked independently before full integration.

The project followed an incremental testing approach:

1. Test each hardware component individually
2. Test paired subsystems such as servo scanning and ultrasonic sensing
3. Integrate motor control with obstacle detection
4. Validate autonomous navigation behavior
5. Verify serial telemetry output for dashboard mapping

---

## Test Environment

Testing was performed on a small indoor floor area with lightweight obstacles placed at varying distances from the vehicle. The Arduino was monitored through the Serial Monitor and later through the browser-based telemetry dashboard.

The following hardware was used during testing:

- Arduino Uno R3
- HC-SR04 ultrasonic sensor
- SG90 servo motor
- L298N motor driver
- Two DC drive motors
- Battery-powered motor supply
- USB connection for programming and telemetry

---

## 1. Ultrasonic Sensor Test

### Purpose

Verify that the HC-SR04 ultrasonic sensor could detect objects and return accurate distance readings.

### Method

The sensor was tested independently using a simple Arduino sketch that triggered the ultrasonic pulse and printed distance readings to the Serial Monitor.

### Expected Result

The sensor should return distance values in centimeters when an object is placed in front of it.

### Result

The sensor successfully returned valid distance readings after correcting the wiring so that:

| Sensor Pin | Arduino Pin |
|-----------|-------------|
| Echo | D2 |
| Trigger | D3 |

### Status

Passed

---

## 2. Servo Motor Test

### Purpose

Verify that the SG90 servo motor could rotate the ultrasonic sensor to different scan positions.

### Method

The servo was tested independently by commanding it to rotate between right, center, and left positions.

### Expected Result

The servo should rotate between 30°, 90°, and 150° smoothly.

### Result

The servo successfully rotated between scan positions and was suitable for directional sensor scanning.

### Status

Passed

---

## 3. Servo + Ultrasonic Scanning Test

### Purpose

Verify that the ultrasonic sensor continued to return valid readings while mounted on the servo.

### Method

The servo was commanded to scan front, left, and right while distance readings were printed to the Serial Monitor.

### Expected Result

The Serial Monitor should display separate readings for:

- Front scan
- Left scan
- Right scan

### Result

The combined servo and ultrasonic system worked correctly. The vehicle could measure objects from multiple directions.

### Status

Passed

---

## 4. Motor Driver and Wheel Test

### Purpose

Verify that the L298N motor driver could control wheel motion.

### Method

The motors were tested using a separate motor test sketch. Forward, reverse, and turning directions were checked.

### Expected Result

Both motors should respond to PWM speed control and direction commands.

### Result

Both motors operated successfully. Motor direction required adjustment during testing to ensure the vehicle moved forward correctly.

### Status

Passed

---

## 5. Autonomous Navigation Test

### Purpose

Verify that the vehicle could detect obstacles, slow down, stop, scan, and turn autonomously.

### Method

Objects were placed in front of the vehicle at different distances. The vehicle was expected to change behavior based on distance thresholds.

### Behavior Rules

| Sensor Reading | Expected Vehicle Response |
|---------------|---------------------------|
| Greater than 35 cm | Move forward quickly |
| 18 cm to 35 cm | Move forward slowly |
| 18 cm or less | Stop, scan left/right, and turn |
| Invalid reading | Stop for safety |

### Result

The vehicle successfully performed autonomous obstacle avoidance using the final firmware. When an obstacle was detected within the stop threshold, the vehicle stopped, scanned left and right, compared distances, and pivoted toward the side with more available space.

### Status

Passed

---

## 6. Pivot Turn Test

### Purpose

Verify that the vehicle could turn in place using opposite wheel directions.

### Method

The turning functions were tested by commanding left and right pivot turns.

### Expected Result

- Left pivot: left wheel backward, right wheel forward
- Right pivot: left wheel forward, right wheel backward

### Result

The vehicle successfully performed pivot turns. Turn duration may require tuning depending on battery level, floor surface, and motor strength.

### Status

Passed

---

## 7. Telemetry Output Test

### Purpose

Verify that the Arduino firmware outputs mapping data in the correct format for the dashboard.

### Method

The Arduino Serial Monitor was used to inspect live telemetry packets.

### Expected Format

```text
MAP,step,x,y,heading,scanAngle,distance,state
```

### Example Output

```text
MAP,15,12,36,90,150,42,LEFT_SCAN
```

### Result

Telemetry packets were successfully generated and matched the expected dashboard format.

### Status

Passed

---

## 8. Dashboard Connection Test

### Purpose

Verify that the browser-based dashboard could receive and visualize telemetry data.

### Method

The Arduino was connected to the computer through USB. The dashboard was opened in a Web Serial compatible browser, and the serial connection was established at 9600 baud.

### Expected Result

The dashboard should update telemetry cards, path history, obstacle points, scan angle, and mapping data in real time.

### Result

The dashboard is designed to parse the Arduino telemetry packet format and render a live mapping visualization. Simulation mode is also available for testing the dashboard without physical hardware.

### Status

Passed for simulation and telemetry format compatibility

---

## Known Limitations

The current mapping system is approximate. The vehicle does not yet include wheel encoders, IMU data, or SLAM-based localization. Position updates are estimated from movement commands, so map accuracy can drift over time.

Battery voltage also affects motor speed and turning accuracy. As a result, pivot duration and speed values may require tuning during repeated tests.

---

## Final Testing Summary

| Subsystem | Status |
|----------|--------|
| Ultrasonic Sensor | Passed |
| Servo Motor | Passed |
| Servo + Sensor Scanning | Passed |
| Motor Driver | Passed |
| Autonomous Navigation | Passed |
| Pivot Turning | Passed |
| Serial Telemetry Output | Passed |
| Dashboard Visualization Compatibility | Passed |

The system successfully demonstrates autonomous navigation, obstacle detection, servo-assisted scanning, pivot turning, telemetry output, and live mapping visualization support.
