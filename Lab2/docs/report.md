# Lab 2 Izvještaj – Upravljanje potrošnjom energije na ESP32

## Sažetak rješenja

| Stavka | Odgovor |
|---|---|
| Platforma | ESP32 |
| Varijanta | A + B (Event-driven + Periodičko buđenje) |
| Sleep mode | Deep Sleep |
| Buđenje | GPIO eksterni prekid (GPIO0) + Timer (10 s) |
| Čuvanje stanja | RTC memorija (`RTC_DATA_ATTR`) |
| Debouncing | Stabilna provjera stanja gumba (50 ms) |
| Wokwi link | https://wokwi.com/projects/458850021040653313 |

---

## 1. Implementacija

### 1.1 Konfiguracija režima mirovanja

Korišten je **Deep Sleep** za ESP32:
```cpp
esp_sleep_enable_ext0_wakeup(GPIO_NUM_0, 0);
esp_sleep_enable_timer_wakeup((uint64_t)SLEEP_WAKE_SEC * 1000000ULL);
esp_deep_sleep_start();
```

**Prednosti Deep Sleep moda:**
- Najniža potrošnja energije
- Čuva RTC memoriju između buđenja
- Podržava više mehanizama buđenja

### 1.2 Mehanizmi buđenja

#### External Wakeup (Varijanta A)
- GPIO0 konfiguriran kao ulazni prekid
- Aktivira se pada na nizu (FALLING edge)
- Koristi `esp_sleep_enable_ext0_wakeup(GPIO_NUM_0, 0)`

#### Timer Wakeup (Varijanta B)
- Periodičko buđenje svakih 10 sekundi
- Koristi `esp_sleep_enable_timer_wakeup(10 * 1000000ULL)`
- Idealno za periodička mjerenja

### 1.3 Debouncing

Problem: Mehanički prekidači generiraju oscilacije (bounce).

**Riješenje:**
```cpp
bool stableButtonPressed() {
  delay(WAKE_DEBOUNCE_MS);  // 50 ms čekanja
  return digitalRead(BUTTON_PIN) == LOW;
}
```

**Kako radi:**
1. GPIO prekid se aktivira
2. Čeka 50 ms da se signali ustabilizirate
3. Provjerava stabilno stanje pina
4. Ako nije stabilno LOW, ignora事件

**Utjecaj na energiju:** Minimalan jer se debounce mijenja samo tijekom buđenja.

---

## 2. Arhitektura programa

### 2.1 RTC memorija

Korištena za čuvanje stanja između Deep Sleep ciklusa:

```cpp
RTC_DATA_ATTR int bootCount = 0;              // Brojač buđenja
RTC_DATA_ATTR int buttonEventCount = 0;       // Brojač tipke
RTC_DATA_ATTR int totalMeasurements = 0;      // Broj mjerenja
RTC_DATA_ATTR uint16_t temperatureLog[10];    // Temperatura
RTC_DATA_ATTR uint16_t humidityLog[10];       // Vlaga
```

### 2.2 Tok izvršavanja

```
setup()
  ├─> bootCount++
  ├─> Detektira razlog buđenja
  │   ├─> ESP_SLEEP_WAKEUP_EXT0 → handleExternalWake()
  │   ├─> ESP_SLEEP_WAKEUP_TIMER → handleTimerWake()
  │   └─> Inače → blinkActivePhase()
  └─> enterDeepSleep() → esp_deep_sleep_start()
```

### 2.3 Simulirana mjerenja

Temperature i vlage se generiraju koristeći `esp_random()`:
```cpp
void saveFakeMeasurement() {
  uint32_t rnd = esp_random();
  uint16_t temp = 20 + (rnd & 0x0F);           // 20–35°C
  uint16_t hum = 40 + ((rnd >> 4) & 0x1F);     // 40–71%
  // Sprema u RTC log...
}
```

---

## 3. Teorijska analiza potrošnje energije

### 3.1 Pretpostavke

| Parametar | Vrijednost |
|---|---|
| Baterija | 2500 mAh |
| Aktivna struja | ~80 mA |
| Sleep struja | ~0.15 mA |
| Aktivni interval | 4 s |
| Sleep interval | 10 s |
| Ukupni ciklus | 14 s |

### 3.2 Prosječna struja

$$I_{avg} = \frac{I_{active} \times t_{active} + I_{sleep} \times t_{sleep}}{t_{total}}$$

$$I_{avg} = \frac{80 \text{ mA} \times 4 \text{ s} + 0.15 \text{ mA} \times 10 \text{ s}}{14 \text{ s}}$$

$$I_{avg} = \frac{320 + 1.5}{14} \approx 23 \text{ mA}$$

### 3.3 Trajanje baterije

$$T = \frac{Q}{I_{avg}} = \frac{2500 \text{ mAh}}{23 \text{ mA}} \approx 108.7 \text{ h} \approx 4.5 \text{ dana}$$

**Napomena:** Ovo je teoretska procjena koja ne uključuje:
- Inicijalizaciju sustava
- Serijsku komunikaciju
- Stvarne uvjete okruženja
- Pad napona baterije tijekom vremena

---

## 4. Ograničenja simulacije u Wokwi-u

| Aspekt | Ograničenje |
|---|---|
| Potrošnja energije | Nije precizno simulirana |
| RTC memorija | Limitirana u simulatoru |
| Deep Sleep | Logika je točna, ali ne postoji vidljiva simulacija |
| Timer preciznost | Može biti manja od stvarnog |

**Zaključak:** Wokwi je odličan za testiranje logike, ali nije prikladan za precizno mjerenje potrošnje energije.

---

## 5. Rezultati testiranja

### 5.1 Serijski ispis (primjer)

```
=== ESP32 Energy Manager ===
Boot count: 1
Wake reason: 0
[START] Cold boot or reset detected
[ACTIVE] Running active phase: LED blinking
[ACTIVE] Active phase complete
[SLEEP] Entering deep sleep for 10 seconds or button press

=== ESP32 Energy Manager ===
Boot count: 2
Wake reason: 2
[WAKE] Wake source: timer
[TIMER] Measurement 1 stored: 23 C, 55 %
[SLEEP] Entering deep sleep for 10 seconds or button press

=== ESP32 Energy Manager ===
Boot count: 3
Wake reason: 1
[WAKE] Wake source: external button
[EVENT] Button press event #1 registered
[SLEEP] Entering deep sleep for 10 seconds or button press
```

**Interpretacija:**
- Boot 1: Inicijalni start s aktivnom fazom
- Boot 2: Timer buđenje → mjerenje spravljeno
- Boot 3: Vanjski prekid (tipka) → događaj registriran

---

## 6. Preporuke za daljnjih rad

1. **Stvarni hardver:** Koristiti ESPTrace ili Energy Profiler za precizno mjerenje
2. **Optimizacija:** Eksperimentirati s različitim vrijednostima `SLEEP_WAKE_SEC`
3. **Senzori:** Integrirati stvarni senzor temperature/vlage (DHT22, BME280)
4. **Napredniji modes:** Testirati Light Sleep za brže buđenje
5. **ULP coprocessor:** Za još nižu potrošnju kod dugotrajnih wake-up ciklusa

---

## 7. Zaključak

Implementacija prikazuje uspješnu logiku upravljanja energijom na ESP32:
- ✅ Deep Sleep implementiran i funkcionalan
- ✅ Dva mehanizma buđenja (external + timer) implementirani
- ✅ Debouncing riješen na softveru
- ✅ RTC memorija čuva stanje između buđenja
- ✅ Simulated datalogger sprema mjerenja

Wokwi simulator omogućuje testiranje logike, ali stvarna potrošnja energije bi se trebala mjeriti na stvarnom hardveru s odgovarajućim alatima (ARM Energy Profiler, osciloskop s mjeračem struje, itd.).
