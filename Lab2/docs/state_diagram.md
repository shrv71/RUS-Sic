# Dijagram stanja sustava

## Stanja sustava

```mermaid
stateDiagram-v2
    [*] --> ColdBoot
    ColdBoot --> ActivePhase: first boot or reset
    
    ActivePhase --> PrepareSleep: active phase complete (4 s)
    
    PrepareSleep --> DeepSleep: all peripherals disabled
    
    DeepSleep --> ExternalWakeup: button pressed (GPIO0)\nor manually triggered
    DeepSleep --> TimerWakeup: 10 seconds elapsed
    
    ExternalWakeup --> DebouncingDelay: GPIO0 interrupt detected
    DebouncingDelay --> CheckStable
    CheckStable -->|yes| HandleButtonEvent: register event
    CheckStable -->|no| IgnoreBounce: bounce detected
    
    HandleButtonEvent --> IndicateLED: blink LED 200 ms
    IndicateLED --> PrepareSleep: event logged
    
    IgnoreBounce --> PrepareSleep: no event recorded
    
    TimerWakeup --> MeasureData: simulate sensor reading
    MeasureData --> SaveToRTC: store in RTC buffer
    SaveToRTC --> CheckMeasurements{10 measurements\ncollected?}
    CheckMeasurements -->|yes| PrintReport: print all data
    PrintReport --> ResetBuffer: clear buffer
    CheckMeasurements -->|no| PrepareSleep: continue
    ResetBuffer --> PrepareSleep: buffer reset
    
    PrepareSleep --> DeepSleep: enter deep sleep
    
    DeepSleep --> [*]
```

---

## Detalji stanja

### 1. **ColdBoot**
- ESP32 se prvi put pokreće ili je resetiran
- `bootCount` je 0 ili nedefinirano
- Provjerava se razlog buđenja

**Akcije:**
- Inicijalizira se serijska komunikacija
- Postavlja se GPIO mody (LED = OUTPUT, BUTTON = INPUT_PULLUP)
- Inkrementira se `bootCount`

**Prijelaz:** → `ActivePhase`

---

### 2. **ActivePhase**
- Simulira aktivnu fazu rada mikrokontrolera
- LED blika s periodom 400 ms (200 ms ON, 200 ms OFF)
- Traje 4 sekunde

**Akcije:**
- LED se automatski blinks
- Nema obrade podataka

**Prijelaz:** → `PrepareSleep` nakon 4 sekunde

---

### 3. **PrepareSleep**
- Priprema sustav za ulazak u Deep Sleep
- Onemogućavaju se nepotrebne periferije
- Gase se svaki signali koji bi potrošili energiju

**Akcije:**
- Gašenje LED-a
- Inicijalizacija Deep Sleep parametara

**Prijelaz:** → `DeepSleep`

---

### 4. **DeepSleep**
- Mikrokontroler ulazi u najnižu razinu potrošnje
- RTC memorija ostaje aktivna
- Čeka jedan od mehanizama buđenja

**Mehanizmi buđenja:**
1. **Vanjski prekid (GPIO0):** Pritisku na tipku
2. **Timer:** Periodički nakon 10 sekundi

**Prijelaz:** 
- → `ExternalWakeup` ako je pritisnuta tipka
- → `TimerWakeup` nakon 10 sekundi

---

### 5. **ExternalWakeup**
- Detektirano je buđenje putem vanjskog prekida
- GPIO0 prekid je okidan (FALLING edge)

**Akcije:**
- Ispis: `[WAKE] Wake source: external button`
- Inicijalizacija debounce procedura

**Prijelaz:** → `DebouncingDelay`

---

### 6. **DebouncingDelay**
- Čeka se stabilizacija signala nakon mehaničkog okidanja
- Čeka se 50 ms (`WAKE_DEBOUNCE_MS`)

**Akcije:**
- `delay(50)`
- Procesor ostaje aktivan tijekom čekanja

**Prijelaz:** → `CheckStable`

---

### 7. **CheckStable** (Decision)
- Provjerava se je li pin GPIO0 stabilno u LOW stanju
- Ako je stabilan, događaj je validan
- Ako nije stabilan, to je bounce i ignora se

**Prijelaz:**
- Ako je LOW → `HandleButtonEvent`
- Ako je HIGH → `IgnoreBounce`

---

### 8. **HandleButtonEvent**
- Događaj tipke je registriran kao „stvaran"
- Inkrementira se `buttonEventCount`

**Akcije:**
- `buttonEventCount++`
- Ispis: `[EVENT] Button press event #X registered`
- LED blink kao indikacija (200 ms)

**Prijelaz:** → `IndicateLED`

---

### 9. **IndicateLED**
- LED se upali kao vizualna indikacija događaja
- LED je uključen 200 ms

**Akcije:**
- `digitalWrite(LED_PIN, HIGH)`
- `delay(200)`
- `digitalWrite(LED_PIN, LOW)`

**Prijelaz:** → `PrepareSleep`

---

### 10. **IgnoreBounce**
- Detektirano je bounce-anje (signal nije stabilan)
- Događaj se ignora

**Akcije:**
- Ispis: `[EVENT] Bounce ignored: button state unstable`
- Nema inkrementiranja brojača

**Prijelaz:** → `PrepareSleep`

---

### 11. **TimerWakeup**
- Detektirano je buđenje putem tajmera
- Prošlo je 10 sekundi od zadnjeg ulaska u Deep Sleep

**Akcije:**
- Ispis: `[WAKE] Wake source: timer`
- Inicijalizacija mjerenja

**Prijelaz:** → `MeasureData`

---

### 12. **MeasureData**
- Simulira se očitanje senzora (temperatura, vlaga)
- Koristi se `esp_random()` za generiranje podataka

**Akcije:**
```cpp
uint16_t temp = 20 + (esp_random() & 0x0F);       // 20–35°C
uint16_t hum = 40 + ((esp_random() >> 4) & 0x1F); // 40–71%
```

**Prijelaz:** → `SaveToRTC`

---

### 13. **SaveToRTC**
- Generirani podaci se sprema u RTC memoriju
- RTC memorija čuva zadnjih 10 mjerenja

**Akcije:**
```cpp
int index = totalMeasurements % MAX_MEASUREMENTS;
temperatureLog[index] = temp;
humidityLog[index] = hum;
totalMeasurements++;
```
- Ispis: `[TIMER] Measurement #X stored: Y C, Z %`

**Prijelaz:** → `CheckMeasurements`

---

### 14. **CheckMeasurements** (Decision)
- Provjerava se je li prikupljeno 10 mjerenja
- Ako je, ispisuju se svi podaci
- Ako nije, sustav se vraća u sleep

**Prijelaz:**
- Ako je 10 mjerenja → `PrintReport`
- Ako je manje → `PrepareSleep`

---

### 15. **PrintReport**
- Ispisuje se izvještaj o prikupljenim mjerenjima
- Prikazuje se svih 10 temperaturnih i vlažnostnih vrijednosti

**Akcije:**
```cpp
Serial.println("[REPORT] 10 periodic measurements collected:");
for (int i = 0; i < 10; i++) {
  Serial.printf("  #%02d  temp=%d C, hum=%d %%\n", i+1, 
                temperatureLog[i], humidityLog[i]);
}
```

**Prijelaz:** → `ResetBuffer`

---

### 16. **ResetBuffer**
- Briše se sadržaj RTC memorije za mjerenja
- Buffer se resetira za sljedeći ciklus

**Akcije:**
- `totalMeasurements = 0` (logički reset)
- Ispis: `[REPORT] Measurement buffer reset for next cycle`

**Prijelaz:** → `PrepareSleep`

---

## Glavni tok programa

```
START
  └─> Inicijalizacija (setup)
  
      ├─ Ako je prvi boot
      │  └─> ColdBoot → ActivePhase → ... → DeepSleep
      │
      ├─ Ako je buđenje tipkom
      │  └─> ExternalWakeup → DebouncingDelay → 
      │      CheckStable → [HandleButtonEvent | IgnoreBounce]
      │      → PrepareSleep → DeepSleep
      │
      └─ Ako je timer buđenje
         └─> TimerWakeup → MeasureData → SaveToRTC →
             CheckMeasurements → [PrintReport | PrepareSleep]
             → DeepSleep

   ... (循環) ...
   
END (sustav se vraća u DeepSleep)
```

---

## Vremenski dijagram

```
Vremenska skala
┌─────────────────────────────────────────────┐
│ Boot 1: Cold Boot + Active Phase (4 s)      │
├─────────────────────────────────────────────┤
      0 s        2 s        4 s
      |----------|----------|......
      Setup    Active      Sleep
      
├─────────────────────────────────────────────┐
│ Boot 2: Timer Wake + Measurement (50 ms)    │
├─────────────────────────────────────────────┤
      4 s    10 s    10.05 s
      |------|.|------|......
      Sleep  Timer   Measure & Save
      
├─────────────────────────────────────────────┐
│ Boot 3: External Wake + Button (50 ms)      │
├─────────────────────────────────────────────┤
     14 s   15.3 s  15.35 s
      |------|.|------|......
      Sleep  Button  Debounce
      
└─────────────────────────────────────────────┘
```
