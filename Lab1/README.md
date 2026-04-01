### Testiranje ISR-ova s logičkim analizatorom

Za provjeru ispravnog redoslijeda i prioriteta prekida korišten je **PulseView** s `.vcd` snimkom. Slike ispod prikazuju stvarni tok izvršavanja ISR funkcija i kontrolni tok glavnog programa.

#### Redoslijed izvršavanja ISR-ova
![Redoslijed ISR-ova](https://raw.githubusercontent.com/shrv71/RUS-Sic/main/Lab1/images/isr_test.png)

**Zaključci iz analize:**
- **Timer ISR** reagira odmah i ima najviši prioritet.  
- Tipkala po prioritetu: **INT0 > INT1 > INT2**.  
- Preklapanje prekida (**nested interrupts**) funkcionira ispravno.  
- Alarm udaljenosti ne blokira kritične ISR-ove.

#### Control Flow Graph (CFG)
![CFG graf](https://raw.githubusercontent.com/shrv71/RUS-Sic/main/Lab1/images/isr_cfg.png)

CFG prikazuje glavni tok programa i veze između ISR-ova te funkcija za obradu prekida i udaljenosti.