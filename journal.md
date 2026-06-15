# Development Journal

## Project: Autonomous Vehicle Mapping and Telemetry System

### Contributors

* Deep Patel
* Adnan Al Haj Ali
* Ammar

---

# April 23, 2026

## Project Initialization

Today marked the beginning of the project planning phase. The team met to discuss potential robotics project ideas that would allow us to explore embedded systems, autonomous navigation, robotics engineering, and real-time data visualization.

Several ideas were considered, including a line-following robot, a basic obstacle-avoidance vehicle, and a more advanced autonomous mapping platform. After evaluating the project scope, available hardware, and technical goals, the team decided to build an autonomous vehicle capable of detecting obstacles, scanning its surroundings, making navigation decisions, and outputting mapping data for a web-based dashboard.

Initial project goals were established:

* Autonomous navigation
* Obstacle avoidance
* Environmental sensing
* Servo-based directional scanning
* Digital mapping support
* Serial telemetry output
* Web dashboard visualization
* Custom chassis design

The project was designed to demonstrate both hardware and software engineering by combining Arduino-based embedded control with a companion website for visualizing the vehicle's mapping data.

---

# April 25, 2026

## Hardware Research and Component Evaluation

Research was conducted on the hardware components needed for an autonomous mapping vehicle. The team evaluated motor drivers, distance sensors, servo motors, power options, and chassis designs.

Key hardware decisions included:

* Arduino Uno selected as the primary microcontroller
* HC-SR04 ultrasonic sensor selected for distance measurement and obstacle detection
* SG90 servo motor selected for rotating the ultrasonic sensor
* L298N motor driver selected for controlling the drive motors
* DC gear motors selected for vehicle movement
* USB serial connection selected for programming and telemetry output

The team also began planning a custom chassis layout that would securely hold the Arduino, motor driver, battery system, motors, wheels, and sensor mount.

---

# April 27, 2026

## System Architecture Design

A high-level system architecture was created to show how the hardware, firmware, and dashboard would work together.

The vehicle was divided into several major subsystems:

* Sensor subsystem
* Servo scanning subsystem
* Autonomous navigation subsystem
* Motor control subsystem
* Mapping and telemetry subsystem
* Web dashboard visualization subsystem
* Safety and stopping logic

Flow diagrams were created to visualize how distance readings would move from the ultrasonic sensor into the Arduino, how the Arduino would make navigation decisions, and how telemetry packets would be sent to the dashboard.

The concept of a servo-mounted ultrasonic scanning platform was introduced to increase environmental awareness beyond a fixed front-facing sensor.

---

# April 30, 2026

## Software Planning

The software architecture was planned before full implementation. A modular structure was chosen so each part of the robot could be tested independently before being integrated.

Planned firmware modules included:

* Distance sensing
* Servo scanning
* Motor control
* Obstacle avoidance
* Mapping logic
* Telemetry output
* Fault detection and safe stopping

The telemetry format was also planned so the Arduino could output structured mapping data to the website. The planned data packet format was:

```text
MAP,step,x,y,heading,scanAngle,distance,state
```

This format allowed the website to read the robot's position estimate, heading, sensor angle, obstacle distance, and current state.

---

# May 3, 2026

## Motor Control Development

Initial motor control development began. The L298N motor driver was connected to the Arduino Uno and basic motor movement was tested.

Successful functionality included:

* Forward motion
* Speed control through PWM
* Left pivot turning
* Right pivot turning
* Stopping behavior

Several wiring adjustments were required during testing to correct motor direction and ensure the vehicle moved forward properly. Motor control became the foundation for the autonomous navigation system.

---

# May 6, 2026

## Servo Motor Testing

The SG90 servo motor was integrated into the system. Initial tests focused on verifying servo movement, angle accuracy, repeatability, and scan positioning.

The servo was tested at the main scan angles used by the project:

* 30° for right-side scanning
* 90° for front scanning
* 150° for left-side scanning

The servo successfully rotated between scan positions and demonstrated reliable operation. This confirmed that it could be used as the rotating platform for the ultrasonic sensor.

---

# May 9, 2026

## Ultrasonic Sensor Testing

Testing began on the HC-SR04 ultrasonic sensor. The goal was to verify that the sensor could return useful distance readings in centimeters.

Initial issues were encountered involving invalid readings and wiring confusion. Several troubleshooting steps were performed:

* Verification of trigger and echo pin connections
* Verification of power and ground connections
* Sensor isolation testing
* Serial Monitor diagnostics
* Testing with fixed objects at different distances

After correcting the wiring, accurate distance measurements were successfully obtained. The final working ultrasonic wiring used Echo on D2 and Trigger on D3.

Distance readings responded appropriately to nearby objects and obstacles, confirming that the sensor was suitable for obstacle detection and mapping data collection.

---

# May 12, 2026

## Sensor Scanning System

The ultrasonic sensor was mounted onto the servo platform. Testing focused on collecting environmental measurements from multiple directions.

The sensor successfully performed:

* Front scans
* Left scans
* Right scans

This marked the first successful implementation of environmental scanning. The team observed that scanning significantly improved environmental awareness compared to using a fixed sensor.

This stage was important because the robot needed to compare left and right distances before choosing which direction to turn after detecting an obstacle.

---

# May 16, 2026

## Autonomous Navigation Prototype

The first autonomous navigation algorithm was implemented.

Vehicle behavior included:

* Driving forward when the path was clear
* Slowing down when an object was nearby
* Stopping when an obstacle was too close
* Scanning left and right after stopping
* Selecting the direction with greater available space
* Pivoting toward the safer direction

Initial tests demonstrated successful obstacle avoidance. Additional tuning was required to improve turning behavior, scan timing, and distance thresholds.

The navigation logic was based on two main thresholds:

* Slow distance: 35 cm
* Stop distance: 18 cm

These thresholds allowed the robot to react differently depending on how close an obstacle was.

---

# May 20, 2026

## Pivot Turning and Navigation Improvements

Navigation behavior was refined using pivot turning. Pivot turning allowed the vehicle to rotate more effectively when choosing a new direction after detecting an obstacle.

This allowed:

* Better turning control
* Improved maneuverability
* More reliable obstacle avoidance
* Cleaner direction changes for mapping visualization

Testing showed noticeable improvements in turn accuracy and obstacle avoidance performance. The pivot duration was adjusted to produce consistent left and right turns.

---

# May 24, 2026

## Chassis Design Planning

Design work began on the custom vehicle chassis. Several design goals were established:

* Secure mounting for the Arduino
* Motor driver mounting space
* Battery compartment
* Motor mounting points
* Sensor scanning platform
* Cable management
* Stable weight distribution

Multiple chassis concepts were sketched and evaluated. The chassis needed to support the electronic components while keeping the ultrasonic sensor high enough to scan effectively.

---

# May 28, 2026

## Mapping System Research

Research began on methods for generating a digital representation of the environment.

The team investigated:

* Occupancy grids
* Robotic vacuum navigation concepts
* Environmental reconstruction
* Dead reckoning
* Basic localization
* Telemetry-based visualization

A simplified mapping approach was selected because the Arduino Uno has limited memory and processing power. Instead of performing full SLAM, the robot would output position estimates, heading values, scan angles, and distance readings to a web dashboard.

This allowed the project to demonstrate mapping concepts while keeping the firmware realistic for the Arduino platform.

---

# June 1, 2026

## Integration Testing

Subsystem integration testing began. The main hardware and software components were combined into a complete autonomous prototype.

Components integrated:

* Arduino Uno
* L298N motor driver
* HC-SR04 ultrasonic sensor
* SG90 servo motor
* DC drive motors
* Battery power system
* Serial telemetry output

Successful communication between the major components was achieved. The robot could move forward, detect obstacles, scan left and right, turn, and output telemetry data.

This represented the first complete autonomous mapping prototype.

---

# June 3, 2026

## Web Dashboard Development

Development began on the web-based mapping and telemetry dashboard. The purpose of the website was to display the Arduino vehicle's mapping data in a more visual and professional format.

The dashboard was designed to:

* Connect to the Arduino through USB Serial
* Read telemetry packets from the firmware
* Display live robot position data
* Show heading, scan angle, distance, and vehicle state
* Plot the robot path
* Visualize obstacle points on a 2D map
* Include simulation mode for demonstration without hardware

The dashboard helped turn the project from a basic autonomous vehicle into a complete robotics system with live telemetry visualization.

---

# June 6, 2026

## Telemetry Format and Dashboard Integration

The Arduino firmware was updated to output structured mapping packets that the website could parse.

Final telemetry packet format:

```text
MAP,step,x,y,heading,scanAngle,distance,state
```

Example packet:

```text
MAP,15,12,36,90,150,42,LEFT_SCAN
```

Each field represented:

* Step number
* Estimated X position
* Estimated Y position
* Robot heading
* Servo scan angle
* Ultrasonic distance reading
* Current robot state

This format allowed the dashboard to update the live telemetry cards, plot mapping points, and show how the robot was responding to its environment.

---

# June 9, 2026

## Final Firmware Refinement

The firmware was finalized as a fully autonomous system. The final program focused on autonomous movement, obstacle detection, servo scanning, turn selection, and telemetry output.

Final firmware features included:

* Front distance scanning
* Automatic speed adjustment
* Safety stopping on invalid readings
* Left and right environmental scanning
* Turn direction selection based on available space
* Pivot turning
* Estimated position updates
* Serial telemetry output for the dashboard

The firmware was cleaned so the final project matched the actual completed design: an autonomous mapping vehicle with telemetry visualization.

---

# June 12, 2026

## Testing and Debugging

Final testing focused on verifying the full system together.

Tested areas included:

* Ultrasonic distance readings
* Servo scan angles
* Motor driver response
* Forward movement
* Pivot turning
* Obstacle stopping
* Left and right path selection
* Telemetry packet formatting
* Dashboard compatibility

Several issues were resolved during testing, including sensor wiring problems, invalid distance readings, motor direction adjustments, and timing delays between servo movement and distance measurement.

After testing, the vehicle successfully demonstrated autonomous obstacle avoidance and mapping telemetry output.

---

# June 15, 2026

## GitHub Repository Finalization

The GitHub repository was finalized to present the project as a complete portfolio-quality robotics system.

Repository improvements included:

* Final autonomous Arduino firmware
* Updated Bill of Materials
* System architecture documentation
* Testing documentation
* Future work documentation
* MIT license
* Git ignore file
* Professional project organization

The documentation was updated to match the final project scope: an autonomous vehicle with mapping telemetry and a web dashboard for visualization.

---

# Current Status

## Completed

* Hardware selection
* System architecture design
* Motor control implementation
* Servo integration
* Ultrasonic sensing
* Servo-based environmental scanning
* Autonomous obstacle avoidance
* Mapping telemetry output
* Web dashboard for Arduino telemetry visualization
* Testing and debugging
* GitHub project documentation

## Final Project Features

* Autonomous navigation
* Obstacle detection
* Servo-assisted left, center, and right scanning
* Distance-based speed adjustment
* Pivot turning
* Estimated position tracking
* Serial telemetry packet output
* Web-based mapping dashboard
* Simulation mode for dashboard demonstration

## Future Development

* Wheel encoder integration
* IMU-based heading estimation
* Improved occupancy grid mapping
* More accurate localization
* Enhanced path planning
* Improved chassis design
* Stronger power regulation
* Additional sensors

---

# Reflection

This project provided significant experience in robotics engineering, embedded systems development, sensor integration, autonomous navigation, telemetry processing, web-based visualization, hardware troubleshooting, and technical documentation.

The development process highlighted the importance of iterative testing, subsystem isolation, modular design, and careful integration when building a complete mechatronic system.

The final project successfully combines an Arduino-based autonomous vehicle with a web dashboard that displays mapping and telemetry data. This created a stronger engineering project because it demonstrates both physical robotics implementation and software-based visualization.
