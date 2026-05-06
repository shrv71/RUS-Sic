# Lab 2 – Upravljanje potrošnjom energije na ESP32

## Kratki opis rješenja

Ovo rješenje implementira upravljanje potrošnjom energije na ESP32 mikrokontroleru koristeći **Deep Sleep** režim. Sustav kombinira dvije varijante:

### Varijanta A: Event-Driven (Pametni poštanski sandučić)
- ESP32 je većinu vremena u Deep Sleep modu
- Budi se isključivo putem vanjskog prekida (tipka na GPIO0)
- Nakon buđenja evidentira događaj i vraća se u sleep

### Varijanta B: Periodic Wake-up (Datalogger)
- ESP32 se budi periodički pomoću tajmera (10 sekundi)
- Simulira očitanja senzora (temperatura i vlaga)
- Sprema zadnjih 10 mjerenja u RTC memoriju
- Ispisuje podatke nakon što se prikupi 10 mjerenja

### Ključne osobine
- **Deep Sleep**: `esp_deep_sleep_start()`
- **Vanjski prekid**: `esp_sleep_enable_ext0_wakeup(GPIO_NUM_0, 0)`
- **Timer wake-up**: `esp_sleep_enable_timer_wakeup(10 * 1000000ULL)`
- **RTC memorija**: `RTC_DATA_ATTR` za čuvanje stanja između buđenja
- **Debouncing**: Stabilna provjera stanja tipke nakon buđenja (50 ms delay)

## Struktura repozitorija

```
Lab2/
├── Lab2.md                    # Ovaj dokument
├── src/
│   └── main.ino              # Glavni kod programa
├── docs/
│   ├── report.md             # Detaljni izvještaj
│   └── state_diagram.md      # Dijagram stanja sustava
├── wokwi/
│   ├── main.ino              # Simulator kôd
│   ├── wokwi.toml            # Wokwi konfiguracija
│   └── diagram.json          # Dijagram sa komponentama
└── rezultat/
    └── serial_output.txt     # Primjer serijskog ispisа
```

## Kako pokrenuti simulaciju

1. Otvorite [Wokwi simulator](https://wokwi.com)
2. Učitajte datoteke iz `Lab2/wokwi/` mape
3. Pritisnite gumb za pokretanje ("Play")
4. Promatrajte serijski ispis i ponašanje LED-a

### Wokwi link
Projekt je dostupan na: https://wokwi.com/projects/458850021040653313

## Sažetak implementacije

| Stavka | Odgovor |
|---|---|
| Platforma | ESP32 (ESP32-DevKit-C v4) |
| Varijanta | A + B kombinirano (Event-driven + Periodic) |
| Sleep mode | Deep Sleep |
| Buđenje | GPIO eksterni prekid (tipka GPIO0) + Timer (10 s) |
| Čuvanje stanja | RTC memorija (`RTC_DATA_ATTR`) |
| Debouncing | Stabilna provjera stanja gumba nakon buđenja |
| Aktivna faza | LED blika 4 sekunde (400 ms periode) |
| Periodička mjerenja | Simulirana temperatura i vlaga |
| Wokwi link | U pripremi |

## Ključne funkcije

- `blinkActivePhase()` – Simulira aktivnu fazu rada s LED indikatorom
- `handleExternalWake()` – Obrađuje buđenje putem tipke s debounce-om
- `handleTimerWake()` – Obrađuje periodičko buđenje i sprema mjerenja
- `enterDeepSleep()` – Aktivira Deep Sleep s mehanizmima buđenja
- `saveFakeMeasurement()` – Simulira očitanje senzora i sprema u RTC
- `printMeasurements()` – Ispisuje prikupljena mjerenja nakon 10 očitanja

## Dokaz rada

Serijski ispis pokazuje:
- Broj bootanja (`bootCount`)
- Vrstu buđenja (External / Timer / Cold Boot)
- Bilježenje događaja i mjerenja
- Ispisane podatke nakon prikupljanja 10 mjerenja

Primjer ispisa pronađite u `Lab2/rezultat/serial_output.txt`.
