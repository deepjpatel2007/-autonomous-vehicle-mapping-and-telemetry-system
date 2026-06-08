const int trigPin = 2;
const int echoPin = 3;

void setup() {
  Serial.begin(9600);

  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  Serial.println("Ultrasonic Sensor Test Started");
}

void loop() {
  int distance = readDistance();

  if (distance == -1) {
    Serial.println("No valid echo detected");
  } else {
    Serial.print("Distance: ");
    Serial.print(distance);
    Serial.println(" cm");
  }

  delay(500);
}

int readDistance() {
  long total = 0;
  int validReadings = 0;

  for (int i = 0; i < 5; i++) {
    digitalWrite(trigPin, LOW);
    delayMicroseconds(5);

    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);

    long duration = pulseIn(echoPin, HIGH, 30000);

    if (duration > 0) {
      int distance = duration * 0.0343 / 2;

      if (distance > 2 && distance < 300) {
        total += distance;
        validReadings++;
      }
    }

    delay(40);
  }

  if (validReadings == 0) {
    return -1;
  }

  return total / validReadings;
}
