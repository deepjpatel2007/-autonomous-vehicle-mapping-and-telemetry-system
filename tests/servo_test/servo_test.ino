#include <Servo.h>

Servo testServo;

const int servoPin = 4;

void setup() {
  Serial.begin(9600);

  testServo.attach(servoPin);

  Serial.println("Servo Test Started");
  Serial.println("Servo will move left, center, and right repeatedly.");
}

void loop() {
  Serial.println("Looking Left");
  testServo.write(150);
  delay(1000);

  Serial.println("Looking Center");
  testServo.write(90);
  delay(1000);

  Serial.println("Looking Right");
  testServo.write(30);
  delay(1000);
}
