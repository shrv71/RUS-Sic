/**
   @file Lab1_interrupts.ino
   @brief Demonstracija višestrukih prekida s prioritetima na ESP32

   Program implementira više izvora prekida:
   - Timer (najviši prioritet)
   - Tipkala (INT0, INT1, INT2)
   - Ultrazvučni senzor (najniži prioritet)

   Prekidi se obrađuju programskom prioritizacijom u glavnoj petlji.

   @details
   Control Flow Graph glavnog programa i ISR-ova:

   @dot
   digraph CFG {
     rankdir=TB;
     loop [shape=box, label="loop()"];
     timer_flag [shape=diamond, label="timerFlag?"];
     handle_timer [shape=box, label="handleTimer()"];
     int_flag [shape=diamond, label="INT flags?"];
     handle_int [shape=box, label="handleInterrupts()"];
     measure [shape=box, label="measureDistance()"];
     handle_dist [shape=box, label="handleDistance()"];

     loop -> timer_flag;
     timer_flag -> handle_timer [label="true"];
     timer_flag -> int_flag [label="false"];
     handle_timer -> loop;

     int_flag -> handle_int [label="true"];
     int_flag -> measure [label="false"];
     handle_int -> loop;

     measure -> handle_dist;
     handle_dist -> loop;
   }
   @enddot
*/

/** @defgroup ISRS Prekidi (Interrupt Service Routines)
    Funkcije koje obrađuju hardverske prekide.
    @{
*/
#define TRIG_PIN 33
#define ECHO_PIN 32

#define LED_TIMER 23
#define LED_ALERT 19
#define LED_INT0 18
#define LED_INT1 5
#define LED_INT2 17

#define BUTTON0 22   ///< Tipka visokog prioriteta (INT0)
#define BUTTON1 4    ///< Tipka srednjeg prioriteta (INT1)
#define BUTTON2 2    ///< Tipka niskog prioriteta (INT2)

/** @brief Zastavice za prekide tipkala */
volatile bool intFlag[3] = {false, false, false};

/** @brief Zastavica za timer prekid */
volatile bool timerFlag = false;

/** @brief Označava da je obrada prekida u tijeku (sprječava konflikte) */
volatile bool interruptInProgress = false;

/** @brief Vrijeme zadnjeg prekida (za debounce) */
volatile unsigned long lastInterruptTime[3] = {0, 0, 0};

/** @brief Vrijeme debounce-a u ms */
const int DEBOUNCE_DELAY = 50;

/** @brief Timer handler */
hw_timer_t *timer = NULL;

/**
   @brief ISR za tipku visokog prioriteta (INT0)
   @ingroup ISRS
   @note Postavlja flag ako je prošao debounce interval.
*/
void IRAM_ATTR ISR_INT0() {
  if (!interruptInProgress && millis() - lastInterruptTime[0] > DEBOUNCE_DELAY) {
    intFlag[0] = true;
    lastInterruptTime[0] = millis();
  }
}

/**
   @brief ISR za tipku srednjeg prioriteta (INT1)
   @ingroup ISRS
*/
void IRAM_ATTR ISR_INT1() {
  if (!interruptInProgress && millis() - lastInterruptTime[1] > DEBOUNCE_DELAY) {
    intFlag[1] = true;
    lastInterruptTime[1] = millis();
  }
}

/**
   @brief ISR za tipku niskog prioriteta (INT2)
   @ingroup ISRS
*/
void IRAM_ATTR ISR_INT2() {
  if (!interruptInProgress && millis() - lastInterruptTime[2] > DEBOUNCE_DELAY) {
    intFlag[2] = true;
    lastInterruptTime[2] = millis();
  }
}

/**
   @brief Timer ISR (najviši prioritet)
   @ingroup ISRS
   @note Samo postavlja zastavicu za obradu u loop() funkciji.
*/
void IRAM_ATTR onTimer() {
  timerFlag = true;
}
/** @} */


/** @defgroup SETUP Setup funkcije
    Funkcije za inicijalizaciju sustava
    @{
*/
/**
   @brief Inicijalizacija sustava
   @ingroup SETUP
   @details Postavlja pinove, konfigurira prekide i timer.
*/
void setup() {
  Serial.begin(115200);

  pinMode(LED_TIMER, OUTPUT);
  pinMode(LED_ALERT, OUTPUT);
  pinMode(LED_INT0, OUTPUT);
  pinMode(LED_INT1, OUTPUT);
  pinMode(LED_INT2, OUTPUT);

  pinMode(BUTTON0, INPUT_PULLUP);
  pinMode(BUTTON1, INPUT_PULLUP);
  pinMode(BUTTON2, INPUT_PULLUP);

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  attachInterrupt(digitalPinToInterrupt(BUTTON0), ISR_INT0, FALLING);
  attachInterrupt(digitalPinToInterrupt(BUTTON1), ISR_INT1, FALLING);
  attachInterrupt(digitalPinToInterrupt(BUTTON2), ISR_INT2, FALLING);

  timer = timerBegin(1000000);
  timerAttachInterrupt(timer, &onTimer);
  timerAlarm(timer, 1000000, true, 0);
}
/** @} */


/** @defgroup DISTANCE Funkcije za udaljenost
    Obrada ultrazvučnog senzora
    @{
*/
/**
   @brief Mjeri udaljenost pomoću HC-SR04 senzora
   @ingroup DISTANCE
   @return udaljenost u centimetrima (0 ako mjerenje nije valjano)
*/
float measureDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);

  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH);
  float distance = (duration / 2.0) * 0.0343;

  return (duration > 0 && duration < 30000) ? distance : 0;
}
/** @} */


/** @defgroup HANDLERS Obrada događaja
    Funkcije koje obrađuju prekide i udaljenost
    @{
*/

/**
   @brief Obrada timer prekida (najviši prioritet)
   @ingroup HANDLERS
*/
void handleTimer() {
  interruptInProgress = true;

  Serial.println("TIMER (NAJVISI)");
  digitalWrite(LED_TIMER, HIGH);
  delay(200);
  digitalWrite(LED_TIMER, LOW);

  timerFlag = false;
  interruptInProgress = false;
}

/**
   @brief Obrada prekida tipkala prema prioritetu
   @ingroup HANDLERS
   @details Prioritet: INT0 > INT1 > INT2
   @dot
   digraph InterruptPriority {
       rankdir=LR;
       TIMER [label="Timer"];
       INT0 [label="INT0"];
       INT1 [label="INT1"];
       INT2 [label="INT2"];
       TIMER -> INT0;
       INT0 -> INT1;
       INT1 -> INT2;
   }
   @enddot
*/
void handleInterrupts() {
  interruptInProgress = true;

  if (intFlag[0]) {
    Serial.println("INT0 - VISOKI");
    digitalWrite(LED_INT0, HIGH);
    delay(200);
    digitalWrite(LED_INT0, LOW);
    intFlag[0] = false;
  }
  else if (intFlag[1]) {
    Serial.println("INT1 - SREDNJI");
    digitalWrite(LED_INT1, HIGH);
    delay(200);
    digitalWrite(LED_INT1, LOW);
    intFlag[1] = false;
  }
  else if (intFlag[2]) {
    Serial.println("INT2 - NISKI");
    digitalWrite(LED_INT2, HIGH);
    delay(200);
    digitalWrite(LED_INT2, LOW);
    intFlag[2] = false;
  }

  interruptInProgress = false;
}

/**
   @brief Aktivira alarm ako je udaljenost ispod praga
   @ingroup HANDLERS
   @param distance izmjerena udaljenost
*/
void handleDistance(float distance) {
  if (distance > 0 && distance < 100 && !interruptInProgress) {
    Serial.println("ALARM UDALJENOSTI");

    digitalWrite(LED_ALERT, HIGH);
    delay(300);
    digitalWrite(LED_ALERT, LOW);
  }
}
/** @} */


/** @defgroup LOOP Glavna petlja
    Petlja s programskom prioritizacijom
    @{
*/
/**
   @brief Glavna petlja s programskom prioritizacijom
   @ingroup LOOP
   @details Redoslijed:
   1. Timer
   2. Prekidi tipkala
   3. Senzor udaljenosti
*/
void loop() {

  if (timerFlag) {
    handleTimer();
    return;
  }

  if (intFlag[0] || intFlag[1] || intFlag[2]) {
    handleInterrupts();
    return;
  }

  float distance = measureDistance();
  handleDistance(distance);
}
/** @} */