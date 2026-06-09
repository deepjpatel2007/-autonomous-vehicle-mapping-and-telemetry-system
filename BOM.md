# Hardware Bill of Materials (BOM) and Cost Analysis

## Overview

The Autonomous Vehicle Mapping and Telemetry System was developed using a combination of commercially available electronics, custom-manufactured components, and rapid prototyping techniques. The objective was to create an affordable robotics platform capable of demonstrating autonomous navigation, obstacle avoidance, environmental perception, servo-assisted scanning, digital mapping, telemetry output, and embedded control systems.

A significant portion of the project's hardware originated from the ELEGOO Super Starter Kit for Arduino UNO R3, which provided the foundation for prototyping and development. Additional components were acquired separately to support vehicle mobility, motor control, power delivery, and custom chassis integration.

The following Bill of Materials (BOM) summarizes the major components used throughout the current autonomous mapping and telemetry version of the project and their estimated retail value at the time of development.

---

## Hardware Bill of Materials

| Item                                         | Quantity | Acquisition Method      | Cost (CAD) | Purpose                                                                                                                               |
| -------------------------------------------- | -------- | ----------------------- | ---------: | ------------------------------------------------------------------------------------------------------------------------------------- |
| ELEGOO Super Starter Kit for Arduino UNO R3  | 1        | Purchased               |     $49.99 | Primary development kit containing Arduino Uno, ultrasonic sensors, servo motor, breadboard, jumper wires, and supporting electronics |
| Arduino Uno R3                               | 1        | Included in Starter Kit |   Included | Main embedded controller responsible for sensor processing, autonomous navigation logic, motor control, and telemetry output          |
| HC-SR04 Ultrasonic Sensor                    | 1        | Included in Starter Kit |   Included | Environmental perception, obstacle detection, distance measurement, and mapping data collection                                       |
| SG90 Servo Motor                             | 1        | Included in Starter Kit |   Included | Rotates the ultrasonic sensor to perform left, center, and right environmental scanning                                                |
| Breadboard                                   | 1        | Included in Starter Kit |   Included | Circuit prototyping and testing                                                                                                       |
| Jumper Wire Set                              | 1        | Included in Starter Kit |   Included | Electrical interconnections between hardware components                                                                               |
| L298N Motor Driver Module                    | 1        | Purchased               |      $5.99 | Controls motor direction, speed, and power delivery                                                                                   |
| DC Gear Motors                               | 2        | Purchased               |     $12.00 | Vehicle propulsion and differential steering                                                                                          |
| Wheels                                       | 2        | Purchased               |      $5.00 | Mechanical mobility system                                                                                                            |
| Battery Holder and Power Distribution System | 1        | Purchased               |      $5.00 | Electrical power management for the vehicle platform                                                                                  |
| AA Batteries                                 | 6        | Purchased               |      $6.00 | Primary power source for the mobile platform                                                                                          |
| Custom 3D Printed Chassis                    | 1        | Self-Manufactured       |     $10.00 | Structural platform for all electronics and mechanical systems                                                                        |
| Servo Sensor Mount                           | 1        | Self-Manufactured       |      $2.00 | Mounting bracket for ultrasonic scanning assembly                                                                                     |
| Fasteners, Spacers, and Mounting Hardware    | 1 Set    | Purchased               |      $3.00 | Mechanical assembly and component mounting                                                                                            |
| USB Programming and Telemetry Cable          | 1        | Existing Equipment      |   Included | Programming interface and live serial telemetry connection to the web dashboard                                                       |

---

## Component Source Reference

### ELEGOO Super Starter Kit

The majority of the embedded electronics used throughout development were sourced from the ELEGOO Super Starter Kit for Arduino UNO R3.

Official Product Link:

https://www.amazon.ca/dp/B01D8KOZF4

The kit provided:

* Arduino Uno R3
* HC-SR04 Ultrasonic Sensors
* SG90 Servo Motor
* Breadboard
* Jumper Wires
* LEDs
* Resistors
* Buttons
* Power Components
* Additional prototyping hardware

This significantly reduced the cost of development while providing a flexible platform for rapid testing and hardware integration.

---

## Cost Summary

| Category                              | Cost (CAD)  |
| ------------------------------------- | ----------: |
| Development Platform and Electronics  |      $49.99 |
| Motion Control Components             |      $17.00 |
| Power System Components               |      $11.00 |
| Mechanical Components and Fabrication |      $12.00 |
| Assembly Hardware                     |       $3.00 |
| **Total Estimated Project Cost**      |  **$92.99** |

---

## Cost Analysis

One of the primary design goals of this project was to maximize technical capability while maintaining a modest development budget. Rather than relying on specialized robotics hardware, the project utilizes readily available consumer-grade electronics and custom-manufactured components to achieve functionality typically associated with more advanced autonomous robotic platforms.

The current autonomous mapping and telemetry version of the platform has an estimated hardware cost of approximately **$93 CAD**. Despite the low cost, the system demonstrates a wide range of engineering concepts including autonomous navigation, obstacle avoidance, servo-assisted environmental scanning, digital mapping, serial telemetry, embedded systems development, real-time decision making, and robotics control systems.

The modular nature of the platform also allows future upgrades to be implemented without requiring significant redesign. Additional sensors, mapping technologies, localization systems, wheel encoders, and advanced navigation algorithms can be integrated using the existing architecture.

---

## Educational and Engineering Value

While the financial cost of the project remains relatively low, the technical complexity provides substantial educational and engineering value. The platform serves as a practical demonstration of:

* Embedded Systems Development
* Robotics Engineering
* Autonomous Navigation
* Environmental Mapping
* Sensor Integration
* Serial Telemetry and Data Visualization
* Control Systems Design
* Real-Time Software Development
* Hardware and Software Integration
* Mechanical Design and Rapid Prototyping
* Systems Engineering
* Technical Documentation

The project was intentionally developed as a portfolio-quality engineering system that demonstrates the application of theoretical concepts through practical implementation.

---

## Contributors

Deep Patel

Adnan Al Haj Ali

Ammar

Autonomous Vehicle Mapping and Telemetry System
2026