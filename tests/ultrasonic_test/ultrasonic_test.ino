const int echoPin = 2;
const int trigPin = 3;

void setup() {
  Serial.begin(9600);

  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  Serial.println("HC-SR04 Test Started");
}

void loop() {

  // Clear trigger
  digitalWrite(trigPin, LOW);
  delayMicroseconds(5);

  // Send pulse
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  // Read echo
  long duration = pulseIn(echoPin, HIGH, 30000);

  if (duration == 0) {
    Serial.println("NO ECHO DETECTED");
  } else {

    float distance = duration * 0.0343 / 2.0;

    Serial.print("Duration: ");
    Serial.print(duration);
    Serial.print(" us");

    Serial.print(" | Distance: ");
    Serial.print(distance);
    Serial.println(" cm");
  }

  delay(500);
}
