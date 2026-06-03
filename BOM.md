# Hardware Bill of Materials (BOM) and Cost Analysis

## Overview

The Hybrid Autonomous Navigation, Mapping, and Manual Override Vehicle was developed using a combination of commercially available electronics, custom-manufactured components, and rapid prototyping techniques. The objective was to create an affordable robotics platform capable of demonstrating concepts typically found in significantly more expensive autonomous systems, including obstacle avoidance, environmental perception, autonomous navigation, digital mapping, wireless communication, and embedded control systems.

A significant portion of the project's hardware originated from the ELEGOO Super Starter Kit for Arduino UNO R3, which provided the foundation for prototyping and development. Additional components were acquired separately to support vehicle mobility, wireless communication, and custom chassis integration.

The following Bill of Materials (BOM) summarizes all major components used throughout the project and their estimated retail value at the time of development.

---

## Hardware Bill of Materials

| Item                                         | Quantity | Acquisition Method      | Cost (CAD) | Purpose                                                                                                                               |
| -------------------------------------------- | -------- | ----------------------- | ---------: | ------------------------------------------------------------------------------------------------------------------------------------- |
| ELEGOO Super Starter Kit for Arduino UNO R3  | 1        | Purchased               |     $49.99 | Primary development kit containing Arduino Uno, ultrasonic sensors, servo motor, breadboard, jumper wires, and supporting electronics |
| Arduino Uno R3                               | 1        | Included in Starter Kit |   Included | Main embedded controller responsible for sensor processing, navigation logic, and motor control                                       |
| HC-SR04 Ultrasonic Sensors                   | 2        | Included in Starter Kit |   Included | Environmental perception, obstacle detection, and mapping measurements                                                                |
| SG90 Servo Motor                             | 1        | Included in Starter Kit |   Included | Rotates ultrasonic sensor to perform directional scanning                                                                             |
| Breadboard                                   | 1        | Included in Starter Kit |   Included | Circuit prototyping and testing                                                                                                       |
| Jumper Wire Set                              | 1        | Included in Starter Kit |   Included | Electrical interconnections between hardware components                                                                               |
| L298N Motor Driver Module                    | 1        | Purchased               |      $5.99 | Controls motor direction, speed, and power delivery                                                                                   |
| DC Gear Motors                               | 2        | Purchased               |     $12.00 | Vehicle propulsion and differential steering                                                                                          |
| Wheels                                       | 2        | Purchased               |      $5.00 | Mechanical mobility system                                                                                                            |
| Bluetooth Module (HC-05)                     | 1        | Purchased               |      $8.99 | Wireless communication and manual override functionality                                                                              |
| Battery Holder and Power Distribution System | 1        | Purchased               |      $5.00 | Electrical power management                                                                                                           |
| AA Batteries                                 | 6        | Purchased               |      $6.00 | Primary power source                                                                                                                  |
| Custom 3D Printed Chassis                    | 1        | Self-Manufactured       |     $10.00 | Structural platform for all electronics and mechanical systems                                                                        |
| Servo Sensor Mount                           | 1        | Self-Manufactured       |      $2.00 | Mounting bracket for ultrasonic scanning assembly                                                                                     |
| Fasteners, Spacers, and Mounting Hardware    | 1 Set    | Purchased               |      $3.00 | Mechanical assembly and component mounting                                                                                            |
| USB Programming Cable                        | 1        | Existing Equipment      |   Included | Programming and debugging interface                                                                                                   |

---

## Component Source Reference

### ELEGOO Super Starter Kit

The majority of the embedded electronics used throughout development were sourced from the ELEGOO Super Starter Kit for Arduino UNO R3.

Official Product Link:

https://www.amazon.ca/dp/B01D8KOZF4

The kit provided:

* Arduino Uno R3
* Ultrasonic Sensors
* Servo Motors
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

| Category                              |  Cost (CAD) |
| ------------------------------------- | ----------: |
| Development Platform and Electronics  |      $55.98 |
| Motion Control Components             |      $17.00 |
| Wireless Communication Components     |       $8.99 |
| Power System Components               |      $11.00 |
| Mechanical Components and Fabrication |      $12.00 |
| Assembly Hardware                     |       $3.00 |
| **Total Estimated Project Cost**      | **$107.97** |

---

## Cost Analysis

One of the primary design goals of this project was to maximize technical capability while maintaining a modest development budget. Rather than relying on specialized robotics hardware, the project utilizes readily available consumer-grade electronics and custom-manufactured components to achieve functionality typically associated with more advanced autonomous robotic platforms.

Despite a total estimated hardware cost of approximately **$108 CAD**, the platform demonstrates a wide range of engineering concepts including autonomous navigation, obstacle avoidance, environmental scanning, digital mapping, Bluetooth communication, embedded systems development, real-time decision making, and robotics control systems.

The modular nature of the platform also allows future upgrades to be implemented without requiring significant redesign. Additional sensors, mapping technologies, localization systems, and advanced navigation algorithms can be integrated using the existing architecture.

---

## Educational and Engineering Value

While the financial cost of the project remains relatively low, the technical complexity provides substantial educational and engineering value. The platform serves as a practical demonstration of:

* Embedded Systems Development
* Robotics Engineering
* Autonomous Navigation
* Environmental Mapping
* Sensor Integration
* Wireless Communication
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

Hybrid Autonomous Navigation, Mapping, and Manual Override Vehicle
2026
