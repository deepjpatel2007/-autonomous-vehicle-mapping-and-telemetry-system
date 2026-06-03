# Development Journal

## Project: Hybrid Autonomous Navigation, Mapping, and Manual Override Vehicle

### Contributors

* Deep Patel
* Adnan Al Haj Ali
* Ammar

---

# April 23, 2026

## Project Initialization

Today marked the beginning of the project planning phase. The team met to discuss potential robotics project ideas that would allow us to explore concepts in embedded systems, autonomous navigation, and robotics engineering.

Several concepts were considered, including a line-following robot, a Bluetooth-controlled vehicle, and a simple obstacle-avoidance system. After evaluating each option, we decided to pursue a more ambitious project: a hybrid autonomous vehicle capable of environmental scanning, digital mapping, and manual override control.

Initial project goals were established:

* Autonomous navigation
* Obstacle avoidance
* Environmental sensing
* Digital mapping
* Bluetooth manual override
* Custom chassis design

The project scope was intentionally designed to be expandable, allowing additional functionality to be added throughout development.

---

# April 25, 2026

## Hardware Research and Component Evaluation

Research was conducted on available hardware components.

The team evaluated various motor drivers, sensor technologies, and communication systems.

Key decisions included:

* Arduino Uno selected as the primary microcontroller
* HC-SR04 selected for environmental sensing
* SG90 servo selected for sensor scanning
* L298N motor driver selected for motor control
* HC-05 Bluetooth module selected for manual override functionality

Initial discussions also began regarding the design of a custom 3D-printed chassis.

---

# April 27, 2026

## System Architecture Design

A high-level system architecture was developed.

The vehicle was divided into several major subsystems:

* Sensor subsystem
* Navigation subsystem
* Mapping subsystem
* Control subsystem
* Communication subsystem
* Safety subsystem

Flow diagrams were created to visualize data movement between hardware and software components.

The concept of a servo-mounted ultrasonic scanning platform was introduced to increase environmental awareness beyond simple front-facing obstacle detection.

---

# April 30, 2026

## Software Planning

The software architecture was planned before implementation.

A modular structure was chosen to improve maintainability and future scalability.

Planned software modules:

* Distance sensing
* Servo scanning
* Motor control
* Obstacle avoidance
* Mapping logic
* Bluetooth communication
* Fault detection

The decision was made to develop and test each subsystem independently before integrating them into a complete platform.

---

# May 3, 2026

## Motor Control Development

Initial motor control development began.

The L298N motor driver was connected to the Arduino Uno and basic motor movement was tested.

Successful functionality included:

* Forward motion
* Reverse motion
* Left turning
* Right turning
* Speed control through PWM

Several wiring adjustments were required during testing to correct motor direction and ensure proper operation.

---

# May 6, 2026

## Servo Motor Testing

The SG90 servo motor was integrated into the system.

Initial tests focused on:

* Position control
* Angle accuracy
* Sweep testing
* Repeatability

The servo successfully rotated between multiple angles and demonstrated reliable operation.

This confirmed its suitability for use as the environmental scanning platform.

---

# May 9, 2026

## Ultrasonic Sensor Testing

Testing began on the HC-SR04 ultrasonic sensor.

Initial issues were encountered involving invalid readings and communication errors.

Several troubleshooting steps were performed:

* Verification of wiring
* Verification of power connections
* Sensor isolation testing
* Serial Monitor diagnostics

After correcting wiring issues, accurate distance measurements were successfully obtained.

Distance readings responded appropriately to nearby objects and obstacles.

---

# May 12, 2026

## Sensor Scanning System

The ultrasonic sensor was mounted onto the servo platform.

Testing focused on collecting environmental measurements from multiple directions.

The sensor successfully performed:

* Front scans
* Left scans
* Right scans

This marked the first successful implementation of environmental scanning.

The team observed that scanning significantly improved environmental awareness compared to a fixed sensor configuration.

---

# May 16, 2026

## Autonomous Navigation Prototype

The first autonomous navigation algorithm was implemented.

Vehicle behavior included:

* Driving forward
* Detecting obstacles
* Stopping when obstacles were detected
* Scanning left and right
* Selecting a direction with greater available space

Initial tests demonstrated successful obstacle avoidance.

Additional tuning was required to improve turning behavior and reduce unnecessary scanning.

---

# May 20, 2026

## Differential Steering Improvements

Navigation behavior was refined.

Rather than rotating both motors during turns, differential steering was implemented.

This allowed:

* Smoother turns
* Improved maneuverability
* More realistic vehicle movement

Testing showed noticeable improvements in turning accuracy and obstacle avoidance performance.

---

# May 24, 2026

## Chassis Design Planning

Design work began on the custom 3D-printed chassis.

Several design goals were established:

* Secure mounting for Arduino
* Breadboard integration
* Motor mounting points
* Battery compartment
* Sensor mounting platform
* Cable management channels

Multiple chassis concepts were sketched and evaluated.

---

# May 28, 2026

## Mapping System Research

Research began on methods for generating a digital representation of the environment.

The team investigated:

* Occupancy grids
* Robotic vacuum navigation
* SLAM concepts
* Environmental reconstruction techniques

A simplified mapping approach was selected due to the memory limitations of the Arduino platform.

---

# June 1, 2026

## Integration Testing

Subsystem integration testing began.

Components integrated:

* Arduino Uno
* L298N Motor Driver
* Ultrasonic Sensor
* Servo Motor
* Drive Motors

Successful communication between all major components was achieved.

This represented the first complete autonomous prototype.

---

# June 3, 2026

## GitHub Repository Development

Documentation and project organization activities were completed.

Repository structure was established, including:

* README.md
* COST.md
* JOURNAL.md
* Source code directories
* Documentation folders

Comprehensive technical documentation was created to describe system architecture, project goals, hardware selection, software design, and development progress.

---

# Current Status

### Completed

* Hardware selection
* System architecture design
* Motor control implementation
* Servo integration
* Ultrasonic sensing
* Environmental scanning
* Autonomous obstacle avoidance
* GitHub documentation

### In Progress

* Digital mapping implementation
* Bluetooth manual override
* Telemetry system
* Custom 3D-printed chassis

### Future Development

* Advanced mapping
* Localization algorithms
* Improved path planning
* Wireless telemetry dashboard
* Fault-tolerant control system
* Enhanced autonomous navigation

---

# Reflection

This project has provided significant experience in robotics engineering, embedded systems development, hardware integration, software architecture, troubleshooting, and autonomous system design.

The development process highlighted the importance of iterative testing, subsystem isolation, and modular design when building complex embedded systems.

As development continues, the project will serve as a platform for exploring increasingly advanced robotics concepts while strengthening practical engineering and software development skills.
