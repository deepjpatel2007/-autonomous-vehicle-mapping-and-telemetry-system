# Autonomous Vehicle Mapping and Telemetry System

🚀 **Live Web Command Center:** [autonomous-vehicle-mapping-and-tele-seven.vercel.app](https://autonomous-vehicle-mapping-and-tele-seven.vercel.app/)

## Project Overview

The Autonomous Vehicle Mapping and Telemetry System is a robotics and embedded systems project focused on developing an intelligent mobile platform capable of autonomous navigation, environmental perception, digital mapping, obstacle avoidance, and real-time telemetry visualization. The project combines hardware design, embedded software development, real-time sensor processing, mechanical design, motor control, serial communication, and web-based data visualization into a unified robotic system.

The primary goal of the project is to develop a vehicle capable of exploring an unknown environment while continuously collecting information about its surroundings. Through the use of ultrasonic sensing, servo-assisted environmental scanning, motor control systems, and digital mapping algorithms, the vehicle is able to identify obstacles, determine safe routes, and build a digital representation of the environment as it navigates.

Unlike traditional obstacle-avoidance robots that simply react to nearby objects, this project is designed around the concept of environmental awareness. The vehicle continuously observes and records information about its surroundings to create a simplified digital map similar to the occupancy mapping systems used in robotic vacuum cleaners and autonomous mobile robots. This allows the vehicle to move beyond simple reactive behavior and toward intelligent navigation.

The project serves as a practical demonstration of robotics engineering, embedded systems development, software architecture, control systems, sensor integration, telemetry processing, and intelligent autonomous behavior.

---

# Project Motivation

Autonomous navigation represents one of the most important challenges in robotics. Modern autonomous systems must be capable of perceiving their environment, identifying obstacles, determining safe paths, and adapting to changing conditions in real time. Achieving this requires the integration of sensors, software, hardware, and control algorithms into a cohesive system capable of making intelligent decisions.

The motivation behind this project was to gain hands-on experience with the technologies and engineering principles that power autonomous systems. While many beginner robotics projects focus solely on motor control or simple obstacle avoidance, this project aims to investigate the broader concepts involved in autonomous mobility, including environmental mapping, perception, navigation, telemetry processing, and autonomous decision-making.

By designing and building the system from the ground up, the project provides valuable experience in embedded programming, electronics, mechanical design, prototyping, debugging, system integration, and software engineering. It also serves as a foundation for future exploration into more advanced robotics concepts such as localization, simultaneous localization and mapping (SLAM), computer vision, and machine learning-assisted navigation.

---

# Problem Statement

A robotic system operating in an unfamiliar environment must be capable of identifying obstacles, selecting safe routes, and maintaining awareness of its surroundings. Many low-cost robotic systems rely solely on simple obstacle avoidance, which limits their ability to understand the environment or make informed navigation decisions.

This project addresses that limitation by developing a robotic vehicle capable of collecting environmental information while navigating. The vehicle must be able to operate autonomously, construct a digital representation of its environment, and stream mapping telemetry to a live visualization dashboard.

The system must also be capable of operating within the computational limitations of a microcontroller platform while maintaining reliable performance and real-time responsiveness.

---

# System Objectives

The project was designed around several key objectives.

The first objective is to develop a vehicle capable of autonomous navigation using real-time sensor data. The vehicle should be able to detect obstacles, analyze potential paths, and make movement decisions without user intervention.

The second objective is to implement environmental scanning using a servo-mounted ultrasonic sensor system. This allows the vehicle to observe multiple directions rather than relying solely on forward-facing sensing.

The third objective is to develop a digital mapping system capable of recording environmental measurements and constructing a representation of the surrounding environment.

The fourth objective is to create a real-time telemetry dashboard capable of reading mapping data from the vehicle and visualizing the robot’s movement, scan readings, obstacle points, and estimated environment map.

The fifth objective is to design a modular software architecture that can be expanded with additional sensors, mapping algorithms, and advanced autonomous capabilities in future development phases.

---

# Autonomous Navigation System

The autonomous navigation subsystem is responsible for allowing the vehicle to move safely and intelligently through its environment.

During operation, the ultrasonic sensor continuously measures the distance between the vehicle and nearby obstacles. These measurements are used to determine whether the current path is safe for travel.

When the vehicle encounters an obstacle within a predefined threshold distance, it temporarily halts forward movement and initiates an environmental scan. The servo-mounted sensor rotates through multiple angles to gather information about the surrounding environment.

Distance measurements collected from different directions are compared and evaluated by the navigation algorithm. Based on these measurements, the system identifies the direction that offers the safest and most efficient path forward.

Once a suitable route has been identified, the vehicle adjusts its trajectory and resumes movement. This process repeats continuously throughout operation, enabling autonomous exploration and obstacle avoidance.

---

# Environmental Perception and Scanning

Environmental perception is achieved through a combination of ultrasonic sensing and servo-assisted scanning.

The ultrasonic sensor functions by transmitting high-frequency sound waves and measuring the time required for those waves to return after reflecting from nearby objects. This allows the system to estimate the distance to obstacles within its environment.

The sensor is mounted on a servo motor that enables controlled rotational movement. Rather than measuring only what lies directly in front of the vehicle, the servo allows the sensor to observe multiple directions and collect a wider range of environmental data.

This scanning mechanism significantly improves the vehicle's situational awareness and provides the information necessary for navigation and mapping operations.

---

# Digital Mapping System

One of the primary goals of the project is the creation of a digital representation of the environment.

As the vehicle navigates, sensor measurements are continuously collected and associated with the vehicle's position and orientation. These measurements are used to estimate obstacle locations and generate a simplified occupancy representation of the environment.

The mapping system is conceptually inspired by the techniques used in robotic vacuum cleaners and autonomous mobile robots. Rather than simply avoiding obstacles, the vehicle seeks to understand the structure of the environment and maintain a record of previously observed areas.

The resulting map can be used for visualization, route planning, obstacle tracking, and future navigation improvements.

Future iterations of the project may incorporate more advanced mapping techniques, including occupancy grids, localization algorithms, and SLAM-based approaches.

---

# Web Command Center & Telemetry Dashboard

An interactive, dark-themed robotics command center application was developed to interface directly with the vehicle over a serial connection. The dashboard resides in the `dashboard` directory and provides live coordinate mapping, ultrasonic sweep visualization, analytics tracking, data logger exports, simulation mode, and real-time occupancy-style map rendering.

## Data Stream Protocol (Serial Packet Format)

The vehicle streams mapping telemetry lines over USB serial at 9600 baud using the following CSV packet protocol:

`MAP,step,x,y,heading,scanAngle,distance,state`

### Field Definitions:

* **`step`**: Sequential mapping event number (integer).
* **`x`**: Current estimated vehicle X coordinate in centimeters.
* **`y`**: Current estimated vehicle Y coordinate in centimeters.
* **`heading`**: Robot's interpreted map-space direction ($0^\circ$ = East, $90^\circ$ = North, $180^\circ$ = West, $270^\circ$ = South).
* **`scanAngle`**: Current angular direction of the servo ($30^\circ$ to $150^\circ$, where $90^\circ$ points straight ahead).
* **`distance`**: Current ultrasonic distance sensor reading in centimeters (`-1` indicates no echo or invalid reading).
* **`state`**: Current active state of the robot's navigation engine (e.g., `FRONT_SCAN`, `FAST_FORWARD`, `SLOW_FORWARD`, `OBSTACLE_STOP`, `LEFT_SCAN`, `RIGHT_SCAN`, `TURN_LEFT`, `TURN_RIGHT`, `NO_VALID_PATH`).

## Mapping & Grid Conversion Math

The dashboard parses the incoming telemetry packets and calculates absolute Cartesian coordinate locations for obstacles.

* **Absolute Sensor Direction:** The absolute angle of the sensor beam in grid space is:

  $$\theta_{\text{sensor}} = \theta_{\text{robot}} + (\theta_{\text{scan}} - 90)$$

* **Obstacle Grid Mapping:** If an obstacle is detected within range ($2\text{cm} < D < 400\text{cm}$), its location $(x_{\text{obs}}, y_{\text{obs}})$ is plotted relative to the robot's position:

  $$x_{\text{obs}} = x_{\text{robot}} + D \times \cos\left(\theta_{\text{sensor}} \times \frac{\pi}{180}\right)$$

  $$y_{\text{obs}} = y_{\text{robot}} + D \times \sin\left(\theta_{\text{sensor}} \times \frac{\pi}{180}\right)$$

These coordinates are rounded to the nearest integer and added to a de-duplicated occupancy map, matching a robotic vacuum-style mapping algorithm.

---

# How to Use the Dashboard

## 1. Live Deployment Launch (Recommended / Easiest)

The simplest way to run and connect to the dashboard without installing any dependencies or terminal commands:

1. Open **[autonomous-vehicle-mapping-and-tele-seven.vercel.app](https://autonomous-vehicle-mapping-and-tele-seven.vercel.app/)** in Google Chrome, Microsoft Edge, or Opera.
2. The dashboard runs directly in your browser. Since it is hosted securely under HTTPS, the **Web Serial API is fully enabled** and ready to connect to your Arduino out of the box.

## 2. Quick Launch (Offline Simulator Mode)

If you want to evaluate the dashboard layout, map rendering, telemetry parsing, and simulation features offline:

1. Open the `dashboard/index.html` file directly from the cloned repository.
2. The page will open directly in your web browser.
3. The dashboard defaults to **Simulation Mode**, running a 2D raycasting engine inside a virtual box arena with obstacles. Note: Browsers block Web Serial access on local `file://` URLs, so physical connection is disabled in this mode.

## 3. Secure Local Server Launch (Alternative Developer Mode)

If you want to run the application locally while maintaining Web Serial connection capability:

1. Open a command prompt or terminal.
2. Navigate to the dashboard directory:
   ```bash
   cd dashboard
   ```
3. Run the local static server using Node:
   ```bash
   npx serve .
   ```
   *(If script execution permissions are restricted on Windows, use `cmd /c "set PATH=C:\Program Files\nodejs;%PATH% && npx serve -l 3030 ."`)*
4. Open your web browser and navigate to **[http://localhost:3030](http://localhost:3030)**.

## 4. Connecting to the Vehicle

1. Connect the Arduino Uno to your computer using a USB cable.
2. Toggle the **SIMULATOR** switch in the top bar of the dashboard to **OFF**.
3. Choose the **Baud Rate** corresponding to your code. The default is 9600.
4. Click **Connect Arduino**.
5. Select the serial port corresponding to your Arduino Uno from the browser popup dialog and click **Connect**.

## 5. Dashboard Features & Controls

* **Live Telemetry:** Metrics like current coordinates, heading, step count, distance readings, scan angle, and vehicle state update in real time.
* **Canvas Grid Interaction:** Use the overlay HUD buttons to **Zoom In**, **Zoom Out**, **Center Robot**, **Reset Map**, and **Export Map**. The map export saves a PNG of the current map. You can also click and drag the canvas to pan, or use your mouse wheel to zoom.
* **Fading Sonar Radar:** A sweeping line representing the ultrasonic sensor's active scan angle draws a faded trail of sensor blips.
* **Raw Console Log:** Displays raw telemetry streams. Click **CSV** or **JSON** to download the serial feed history.
* **Simulation Mode:** Allows the dashboard to be tested without the physical Arduino vehicle by generating realistic telemetry packets that match the vehicle's serial output format.

---

# Software Architecture

The software system is organized into multiple functional layers.

The perception layer is responsible for collecting raw sensor data and converting physical measurements into digital information that can be processed by higher-level systems.

The navigation layer interprets environmental information and determines vehicle behavior. This subsystem performs obstacle avoidance, path selection, and movement planning.

The mapping layer processes environmental measurements and updates the vehicle's digital representation of the environment.

The control layer converts navigation decisions into motor commands, regulating speed, steering, and directional movement.

The communication layer manages serial telemetry output between the Arduino vehicle and the web-based dashboard.

The safety layer monitors system status and handles fault detection, recovery procedures, and safe-mode operation.

This layered architecture improves maintainability, scalability, and future extensibility.

---

# Hardware Architecture

The hardware platform consists of an Arduino Uno microcontroller, an L298N motor driver, dual DC drive motors, an ultrasonic sensor, a servo motor, a battery-powered electrical system, and a custom-designed 3D-printed chassis.

The Arduino serves as the central processing unit, coordinating communication between sensors, actuators, and control algorithms.

The motor driver provides the power amplification required to control the drive motors, while the ultrasonic sensor and servo system provide environmental awareness.

The custom chassis provides structural support and enables efficient integration of all hardware components into a compact mobile platform.

---

# Engineering Challenges

The development process involves numerous engineering challenges, including sensor accuracy, environmental noise, power management, real-time decision making, hardware integration, navigation reliability, and software complexity.

The mapping subsystem introduces additional challenges related to memory management, data storage, and environmental reconstruction. Since the project is built on a microcontroller platform with limited computational resources, efficient algorithms and careful system design are essential.

Maintaining reliable autonomous operation requires careful coordination between sensor readings, motor control, mapping logic, telemetry output, and safety mechanisms.

---

# Future Development

Future development will focus on expanding both autonomy and environmental awareness.

Planned enhancements include wheel encoder integration, improved localization systems, occupancy-grid mapping, advanced path planning algorithms, wireless telemetry dashboards, cloud-connected monitoring systems, computer vision integration, machine learning-assisted navigation, and SLAM-inspired environmental reconstruction.

Long-term goals include the development of a fully autonomous exploration platform capable of navigating complex environments while maintaining an accurate and continuously updated map of its surroundings.

---

# Contributors

Deep Patel

Adnan Al Haj Ali

Ammar

This project was developed as a collaborative robotics and embedded systems project focused on autonomous navigation, mapping, telemetry visualization, and environmental perception.
