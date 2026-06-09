#include <Servo.h>

Servo scanner;

// --- Pin Configurations ---
// Ultrasonic sensor HC-SR04
const int echoPin = 2;
const int trigPin = 3;

// Servo SG90
const int servoPin = 4;

// L298N Motor Driver
const int ENA = 5;
const int ENB = 6;
const int IN1 = 8;
const int IN2 = 9;
const int IN3 = 10;
const int IN4 = 11;

// --- Speed Settings (PWM) ---
const int fastSpeed = 190;
const int slowSpeed = 120;
const int turnSpeed = 190;

// --- Distance Thresholds (cm) ---
const int slowDistance = 35;
const int stopDistance = 18;

// --- Telemetry & dead-reckoning State ---
int mapStep = 0;
float robotX = 0;
float robotY = 0;
int robotHeading = 90; // Standard layout: 90 = North (Up), 0 = East (Right)
int scanAngle = 90;
String robotState = "IDLE";

// --- Hybrid Control Mode ---
bool manualOverride = false; // Toggled by dashboard via Serial

void setup() {
  Serial.begin(9600);

  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  pinMode(ENA, OUTPUT);
  pinMode(ENB, OUTPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);

  scanner.attach(servoPin);
  scanner.write(90);

  stopCar();
  delay(1000);

  logMapData(90, readDistance(), "BOOT_INITIALIZED");
}

void loop() {
  // 1. Listen for incoming Serial Commands (from Vercel Web Dashboard)
  checkSerialCommands();

  // 2. Check current mode of operation
  if (manualOverride) {
    // In manual mode, loop handles serial command actions, just keep servo centered
    scanner.write(90);
    delay(50); // Small delay to avoid hammering CPU
  } 
  else {
    // --- Autonomous Mode Loop ---
    scanner.write(90);
    delay(400); // Wait for servo to center

    int front = readDistance();

    if (front == -1) {
      stopCar();
      logMapData(90, front, "INVALID_READING_STOP");
      delay(300);
    }
    else if (front > slowDistance) {
      moveForward(fastSpeed);
      // At fastSpeed (190 PWM), robot moves approx 12 cm/sec
      // Loop takes 400ms (servo) + 200ms (bottom delay) = 600ms. Distance is ~7.2cm
      updateEstimatedPosition(7.2);
      logMapData(90, front, "FAST_FORWARD");
    }
    else if (front > stopDistance) {
      moveForward(slowSpeed);
      // At slowSpeed (120 PWM), robot moves approx 7 cm/sec. Distance is ~4.2cm
      updateEstimatedPosition(4.2);
      logMapData(90, front, "SLOW_FORWARD");
    }
    else {
      stopCar();
      logMapData(90, front, "OBSTACLE_STOP");
      scanAndTurn();
    }

    delay(200);
  }
}

// --- Serial Communications Protocol Parser ---
void checkSerialCommands() {
  if (Serial.available() > 0) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();

    if (cmd.length() == 0) return;

    // Toggle manual override states
    if (cmd == "CTRL,MANUAL") {
      manualOverride = true;
      stopCar();
      logMapData(90, readDistance(), "MANUAL_OVERRIDE");
    }
    else if (cmd == "CTRL,AUTO") {
      manualOverride = false;
      stopCar();
      logMapData(90, readDistance(), "FAST_FORWARD");
    }
    
    // Drive movements (only processed when manual override is active)
    if (manualOverride) {
      if (cmd == "DIR,FORWARD") {
        moveForward(fastSpeed);
        // Estimate position change (based on button hold clicks)
        updateEstimatedPosition(3.0); 
        logMapData(90, readDistance(), "FAST_FORWARD");
      }
      else if (cmd == "DIR,BACKWARD") {
        moveBackward(fastSpeed);
        updateEstimatedPosition(-3.0);
        logMapData(90, readDistance(), "FAST_FORWARD");
      }
      else if (cmd == "DIR,LEFT") {
        turnLeftManual(turnSpeed);
        robotHeading = (robotHeading + 90) % 360; // Rotate CCW
        logMapData(90, readDistance(), "TURN_LEFT");
      }
      else if (cmd == "DIR,RIGHT") {
        turnRightManual(turnSpeed);
        robotHeading = (robotHeading - 90 + 360) % 360; // Rotate CW
        logMapData(90, readDistance(), "TURN_RIGHT");
      }
      else if (cmd == "DIR,STOP") {
        stopCar();
        logMapData(90, readDistance(), "OBSTACLE_STOP");
      }
    }
  }
}

// --- Autonomous Scanning & Navigation Turn Engine ---
void scanAndTurn() {
  // Scan Left
  scanner.write(150);
  delay(800);
  int left = readDistance();
  logMapData(150, left, "LEFT_SCAN");

  // Scan Right
  scanner.write(30);
  delay(800);
  int right = readDistance();
  logMapData(30, right, "RIGHT_SCAN");

  // Center Servo
  scanner.write(90);
  delay(400);

  if (left == -1 && right == -1) {
    stopCar();
    logMapData(90, -1, "NO_VALID_PATH");
    // Turn around 180 degrees
    pivotLeft(1500); 
    robotHeading = (robotHeading + 180) % 360;
  }
  else if (left > right) {
    logMapData(150, left, "TURN_LEFT");
    pivotLeft(750); // CCW turn duration
    robotHeading = (robotHeading + 90) % 360;
  }
  else {
    logMapData(30, right, "TURN_RIGHT");
    pivotRight(750); // CW turn duration
    robotHeading = (robotHeading - 90 + 360) % 360;
  }
}

// --- Ultrasonic Sensor Readout ---
int readDistance() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(5);

  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH, 30000); // 30ms timeout

  if (duration == 0) {
    return -1; // No echo
  }

  int dist = duration * 0.0343 / 2;
  return dist;
}

// --- Serial Packet Logger ---
void logMapData(int scanAngle, int distance, String state) {
  // Protocol Schema: MAP,step,x,y,heading,scanAngle,distance,state
  Serial.print("MAP,");
  Serial.print(mapStep);
  Serial.print(",");
  Serial.print((int)robotX);
  Serial.print(",");
  Serial.print((int)robotY);
  Serial.print(",");
  Serial.print(robotHeading);
  Serial.print(",");
  Serial.print(scanAngle);
  Serial.print(",");
  Serial.print(distance);
  Serial.print(",");
  Serial.println(state);

  mapStep++;
}

// --- Dead-Reckoning Mathematical Odometry ---
void updateEstimatedPosition(float distanceCm) {
  // heading: 90 = North (+Y), 0 = East (+X), 270 = South (-Y), 180 = West (-X)
  if (robotHeading == 0) {
    robotX += distanceCm;
  }
  else if (robotHeading == 90) {
    robotY += distanceCm;
  }
  else if (robotHeading == 180) {
    robotX -= distanceCm;
  }
  else if (robotHeading == 270) {
    robotY -= distanceCm;
  }
}

// --- Motor Control Driving Subroutines (L298N) ---
void moveForward(int speedValue) {
  analogWrite(ENA, speedValue);
  analogWrite(ENB, speedValue);

  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);
}

void moveBackward(int speedValue) {
  analogWrite(ENA, speedValue);
  analogWrite(ENB, speedValue);

  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);
}

// Non-blocking steering helpers for manual keyboard override drives
void turnLeftManual(int speedValue) {
  analogWrite(ENA, speedValue);
  analogWrite(ENB, speedValue);
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);
}

void turnRightManual(int speedValue) {
  analogWrite(ENA, speedValue);
  analogWrite(ENB, speedValue);
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);
}

// Blocking turning behaviors for autonomous path corrections
void pivotLeft(int duration) {
  analogWrite(ENA, turnSpeed);
  analogWrite(ENB, turnSpeed);

  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);

  delay(duration);
  stopCar();
}

void pivotRight(int duration) {
  analogWrite(ENA, turnSpeed);
  analogWrite(ENB, turnSpeed);

  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);

  delay(duration);
  stopCar();
}

void stopCar() {
  analogWrite(ENA, 0);
  analogWrite(ENB, 0);

  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, LOW);
}
