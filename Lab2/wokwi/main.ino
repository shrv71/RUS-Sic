#include <Arduino.h>
#include "esp_sleep.h"

#define LED_PIN 2
#define BUTTON_PIN 0
#define ACTIVE_DURATION_MS 4000
#define BLINK_INTERVAL_MS 400
#define WAKE_DEBOUNCE_MS 50
#define SLEEP_WAKE_SEC 10
#define MAX_MEASUREMENTS 10

RTC_DATA_ATTR int bootCount = 0;
RTC_DATA_ATTR int buttonEventCount = 0;
RTC_DATA_ATTR int totalMeasurements = 0;
RTC_DATA_ATTR uint16_t temperatureLog[MAX_MEASUREMENTS];
RTC_DATA_ATTR uint16_t humidityLog[MAX_MEASUREMENTS];

void blinkActivePhase() {
  unsigned long start = millis();
  unsigned long lastToggle = start;
  bool ledState = false;

  Serial.println("[ACTIVE] Running active phase: LED blinking");
  while (millis() - start < ACTIVE_DURATION_MS) {
    if (millis() - lastToggle >= BLINK_INTERVAL_MS) {
      lastToggle = millis();
      ledState = !ledState;
      digitalWrite(LED_PIN, ledState ? HIGH : LOW);
    }
  }
  digitalWrite(LED_PIN, LOW);
  Serial.println("[ACTIVE] Active phase complete");
}

void printMeasurements() {
  Serial.println("[REPORT] 10 periodic measurements collected:");
  for (int i = 0; i < MAX_MEASUREMENTS; ++i) {
    Serial.printf("  #%02d  temp=%d C, hum=%d %%\n", i + 1, temperatureLog[i], humidityLog[i]);
  }
  Serial.println("[REPORT] Measurement buffer reset for next cycle");
}

void saveFakeMeasurement() {
  uint32_t rnd = esp_random();
  uint16_t temp = 20 + (rnd & 0x0F);
  uint16_t hum = 40 + ((rnd >> 4) & 0x1F);

  int index = totalMeasurements % MAX_MEASUREMENTS;
  temperatureLog[index] = temp;
  humidityLog[index] = hum;
  totalMeasurements++;

  Serial.printf("[TIMER] Measurement %d stored: %d C, %d %%\n", totalMeasurements, temp, hum);

  if (totalMeasurements % MAX_MEASUREMENTS == 0) {
    printMeasurements();
  }
}

bool stableButtonPressed() {
  delay(WAKE_DEBOUNCE_MS);
  return digitalRead(BUTTON_PIN) == LOW;
}

void handleExternalWake() {
  Serial.println("[WAKE] Wake source: external button");

  if (stableButtonPressed()) {
    buttonEventCount++;
    Serial.printf("[EVENT] Button press event #%d registered\n", buttonEventCount);

    digitalWrite(LED_PIN, HIGH);
    delay(200);
    digitalWrite(LED_PIN, LOW);
  } else {
    Serial.println("[EVENT] Bounce ignored: button state unstable");
  }
}

void handleTimerWake() {
  Serial.println("[WAKE] Wake source: timer");
  saveFakeMeasurement();
}

void enterDeepSleep() {
  Serial.printf("[SLEEP] Entering deep sleep for %d seconds or button press\n", SLEEP_WAKE_SEC);

  esp_sleep_enable_ext0_wakeup(GPIO_NUM_0, 0);
  esp_sleep_enable_timer_wakeup((uint64_t)SLEEP_WAKE_SEC * 1000000ULL);

  esp_deep_sleep_start();
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);

  delay(100);
  bootCount++;

  esp_sleep_wakeup_cause_t wakeReason = esp_sleep_get_wakeup_cause();
  Serial.printf("\n=== ESP32 Energy Manager ===\n");
  Serial.printf("Boot count: %d\n", bootCount);
  Serial.printf("Wake reason: %d\n", wakeReason);

  if (wakeReason == ESP_SLEEP_WAKEUP_EXT0) {
    handleExternalWake();
  } else if (wakeReason == ESP_SLEEP_WAKEUP_TIMER) {
    handleTimerWake();
  } else {
    Serial.println("[START] Cold boot or reset detected");
    blinkActivePhase();
  }

  Serial.println("[PREPARE] Disabling unused peripherals and re-entering sleep");
  digitalWrite(LED_PIN, LOW);
  enterDeepSleep();
}

void loop() {
}
