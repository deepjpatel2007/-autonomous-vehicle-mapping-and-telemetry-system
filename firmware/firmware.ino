#include <Servo.h>

Servo scanner;

// --- Pin Configuration ---
// HC-SR04 ultrasonic sensor
const int echoPin = 2;
const int trigPin = 3;

// SG90 servo motor
const int servoPin = 4;

// L298N motor driver
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

// --- Telemetry and Estimated Mapping State ---
int mapStep = 0;
float robotX = 0;
float robotY = 0;
int robotHeading = 90; // 90 = North/forward on the dashboard map, 0 = East/right

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

  Serial.println("Autonomous Mapping Vehicle Started");
  Serial.println("MAP,step,x,y,heading,scanAngle,distance,state");
  logMapData(90, readDistance(), "BOOT_INITIALIZED");
}

void loop() {
  scanner.write(90);
  delay(700);

  int front = readDistance();
  logMapData(90, front, "FRONT_SCAN");

  if (front == -1) {
    stopCar();
    logMapData(90, front, "INVALID_READING_STOP");
  }
  else if (front > slowDistance) {
    moveForward(fastSpeed);
    updateEstimatedPosition(7.2);
    logMapData(90, front, "FAST_FORWARD");
  }
  else if (front > stopDistance) {
    moveForward(slowSpeed);
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

void scanAndTurn() {
  scanner.write(150);
  delay(1000);
  int left = readDistance();
  logMapData(150, left, "LEFT_SCAN");

  scanner.write(30);
  delay(1000);
  int right = readDistance();
  logMapData(30, right, "RIGHT_SCAN");

  scanner.write(90);
  delay(700);

  if (left == -1 && right == -1) {
    stopCar();
    logMapData(90, -1, "NO_VALID_PATH");
  }
  else if (left > right) {
    pivotLeft(750);
    robotHeading = robotHeading + 90;
    if (robotHeading >= 360) {
      robotHeading = 0;
    }
    logMapData(150, left, "TURN_LEFT");
  }
  else {
    pivotRight(750);
    robotHeading = robotHeading - 90;
    if (robotHeading < 0) {
      robotHeading = 270;
    }
    logMapData(30, right, "TURN_RIGHT");
  }
}

int readDistance() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(5);

  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH, 30000);

  if (duration == 0) {
    return -1;
  }

  int distance = duration * 0.0343 / 2;
  return distance;
}

void logMapData(int scanAngle, int distance, String state) {
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

void updateEstimatedPosition(float distanceCm) {
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

void moveForward(int speedValue) {
  analogWrite(ENA, speedValue);
  analogWrite(ENB, speedValue);

  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);
}

void pivotLeft(int durationMs) {
  analogWrite(ENA, turnSpeed);
  analogWrite(ENB, turnSpeed);

  // Left motor backward, right motor forward
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);

  delay(durationMs);
  stopCar();
}

void pivotRight(int durationMs) {
  analogWrite(ENA, turnSpeed);
  analogWrite(ENB, turnSpeed);

  // Left motor forward, right motor backward
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);

  delay(durationMs);
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
