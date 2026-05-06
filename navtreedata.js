/*
 @licstart  The following is the entire license notice for the JavaScript code in this file.

 The MIT License (MIT)

 Copyright (C) 1997-2020 by Dimitri van Heesch

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 and associated documentation files (the "Software"), to deal in the Software without restriction,
 including without limitation the rights to use, copy, modify, merge, publish, distribute,
 sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or
 substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 @licend  The above is the entire license notice for the JavaScript code in this file
*/
var NAVTREE =
[
  [ "RUS_Lab1_prekid", "index.html", [
    [ "Testiranje ISR-ova s logičkim analizatorom", "index.html", null ],
    [ "Lab 2 Izvještaj – Upravljanje potrošnjom energije na ESP32", "dd/d6e/md_Lab2_2docs_2report.html", [
      [ "Sažetak rješenja", "dd/d6e/md_Lab2_2docs_2report.html#autotoc_md4", null ],
      [ "1. Implementacija", "dd/d6e/md_Lab2_2docs_2report.html#autotoc_md6", [
        [ "1.1 Konfiguracija režima mirovanja", "dd/d6e/md_Lab2_2docs_2report.html#autotoc_md7", null ],
        [ "1.2 Mehanizmi buđenja", "dd/d6e/md_Lab2_2docs_2report.html#autotoc_md8", [
          [ "External Wakeup (Varijanta A)", "dd/d6e/md_Lab2_2docs_2report.html#autotoc_md9", null ],
          [ "Timer Wakeup (Varijanta B)", "dd/d6e/md_Lab2_2docs_2report.html#autotoc_md10", null ]
        ] ],
        [ "1.3 Debouncing", "dd/d6e/md_Lab2_2docs_2report.html#autotoc_md11", null ]
      ] ],
      [ "2. Arhitektura programa", "dd/d6e/md_Lab2_2docs_2report.html#autotoc_md13", [
        [ "2.1 RTC memorija", "dd/d6e/md_Lab2_2docs_2report.html#autotoc_md14", null ],
        [ "2.2 Tok izvršavanja", "dd/d6e/md_Lab2_2docs_2report.html#autotoc_md15", null ],
        [ "2.3 Simulirana mjerenja", "dd/d6e/md_Lab2_2docs_2report.html#autotoc_md16", null ]
      ] ],
      [ "3. Teorijska analiza potrošnje energije", "dd/d6e/md_Lab2_2docs_2report.html#autotoc_md18", [
        [ "3.1 Pretpostavke", "dd/d6e/md_Lab2_2docs_2report.html#autotoc_md19", null ],
        [ "3.2 Prosječna struja", "dd/d6e/md_Lab2_2docs_2report.html#autotoc_md20", null ],
        [ "3.3 Trajanje baterije", "dd/d6e/md_Lab2_2docs_2report.html#autotoc_md21", null ]
      ] ],
      [ "4. Ograničenja simulacije u Wokwi-u", "dd/d6e/md_Lab2_2docs_2report.html#autotoc_md23", null ],
      [ "5. Rezultati testiranja", "dd/d6e/md_Lab2_2docs_2report.html#autotoc_md25", [
        [ "5.1 Serijski ispis (primjer)", "dd/d6e/md_Lab2_2docs_2report.html#autotoc_md26", null ]
      ] ],
      [ "6. Preporuke za daljnjih rad", "dd/d6e/md_Lab2_2docs_2report.html#autotoc_md28", null ],
      [ "7. Zaključak", "dd/d6e/md_Lab2_2docs_2report.html#autotoc_md30", null ]
    ] ],
    [ "Dijagram stanja sustava", "d9/d6c/md_Lab2_2docs_2state__diagram.html", [
      [ "Stanja sustava", "d9/d6c/md_Lab2_2docs_2state__diagram.html#autotoc_md32", null ],
      [ "Detalji stanja", "d9/d6c/md_Lab2_2docs_2state__diagram.html#autotoc_md34", [
        [ "1. <strong>ColdBoot</strong>", "d9/d6c/md_Lab2_2docs_2state__diagram.html#autotoc_md35", null ],
        [ "2. <strong>ActivePhase</strong>", "d9/d6c/md_Lab2_2docs_2state__diagram.html#autotoc_md37", null ],
        [ "3. <strong>PrepareSleep</strong>", "d9/d6c/md_Lab2_2docs_2state__diagram.html#autotoc_md39", null ],
        [ "4. <strong>DeepSleep</strong>", "d9/d6c/md_Lab2_2docs_2state__diagram.html#autotoc_md41", null ],
        [ "5. <strong>ExternalWakeup</strong>", "d9/d6c/md_Lab2_2docs_2state__diagram.html#autotoc_md43", null ],
        [ "6. <strong>DebouncingDelay</strong>", "d9/d6c/md_Lab2_2docs_2state__diagram.html#autotoc_md45", null ],
        [ "7. <strong>CheckStable</strong> (Decision)", "d9/d6c/md_Lab2_2docs_2state__diagram.html#autotoc_md47", null ],
        [ "8. <strong>HandleButtonEvent</strong>", "d9/d6c/md_Lab2_2docs_2state__diagram.html#autotoc_md49", null ],
        [ "9. <strong>IndicateLED</strong>", "d9/d6c/md_Lab2_2docs_2state__diagram.html#autotoc_md51", null ],
        [ "10. <strong>IgnoreBounce</strong>", "d9/d6c/md_Lab2_2docs_2state__diagram.html#autotoc_md53", null ],
        [ "11. <strong>TimerWakeup</strong>", "d9/d6c/md_Lab2_2docs_2state__diagram.html#autotoc_md55", null ],
        [ "12. <strong>MeasureData</strong>", "d9/d6c/md_Lab2_2docs_2state__diagram.html#autotoc_md57", null ],
        [ "13. <strong>SaveToRTC</strong>", "d9/d6c/md_Lab2_2docs_2state__diagram.html#autotoc_md59", null ],
        [ "14. <strong>CheckMeasurements</strong> (Decision)", "d9/d6c/md_Lab2_2docs_2state__diagram.html#autotoc_md61", null ],
        [ "15. <strong>PrintReport</strong>", "d9/d6c/md_Lab2_2docs_2state__diagram.html#autotoc_md63", null ],
        [ "16. <strong>ResetBuffer</strong>", "d9/d6c/md_Lab2_2docs_2state__diagram.html#autotoc_md65", null ]
      ] ],
      [ "Glavni tok programa", "d9/d6c/md_Lab2_2docs_2state__diagram.html#autotoc_md67", null ],
      [ "Vremenski dijagram", "d9/d6c/md_Lab2_2docs_2state__diagram.html#autotoc_md69", null ]
    ] ],
    [ "Lab 2 – Upravljanje potrošnjom energije na ESP32", "d8/d32/md_Lab2_2Lab2.html", [
      [ "Kratki opis rješenja", "d8/d32/md_Lab2_2Lab2.html#autotoc_md71", [
        [ "Varijanta A: Event-Driven (Pametni poštanski sandučić)", "d8/d32/md_Lab2_2Lab2.html#autotoc_md72", null ],
        [ "Varijanta B: Periodic Wake-up (Datalogger)", "d8/d32/md_Lab2_2Lab2.html#autotoc_md73", null ],
        [ "Ključne osobine", "d8/d32/md_Lab2_2Lab2.html#autotoc_md74", null ]
      ] ],
      [ "Struktura repozitorija", "d8/d32/md_Lab2_2Lab2.html#autotoc_md75", null ],
      [ "Kako pokrenuti simulaciju", "d8/d32/md_Lab2_2Lab2.html#autotoc_md76", [
        [ "Wokwi link", "d8/d32/md_Lab2_2Lab2.html#autotoc_md77", null ]
      ] ],
      [ "Sažetak implementacije", "d8/d32/md_Lab2_2Lab2.html#autotoc_md78", null ],
      [ "Ključne funkcije", "d8/d32/md_Lab2_2Lab2.html#autotoc_md79", null ],
      [ "Dokaz rada", "d8/d32/md_Lab2_2Lab2.html#autotoc_md80", null ]
    ] ],
    [ "Upravljanje potrošnjom energije mikrokontrolera", "d8/d96/md_Lab2_2Labos2.html", [
      [ "Cilj zadatka", "d8/d96/md_Lab2_2Labos2.html#autotoc_md82", null ],
      [ "Okruženje", "d8/d96/md_Lab2_2Labos2.html#autotoc_md83", null ],
      [ "Implementacija režima mirovanja", "d8/d96/md_Lab2_2Labos2.html#autotoc_md85", [
        [ "1. Konfiguracija režima mirovanja", "d8/d96/md_Lab2_2Labos2.html#autotoc_md86", null ],
        [ "2. Osnovna funkcionalnost", "d8/d96/md_Lab2_2Labos2.html#autotoc_md88", null ]
      ] ],
      [ "</blockquote>", "d8/d96/md_Lab2_2Labos2.html#autotoc_md89", null ],
      [ "Uvjeti za buđenje iz režima mirovanja", "d8/d96/md_Lab2_2Labos2.html#autotoc_md90", null ],
      [ "Efikasno upravljanje energijom", "d8/d96/md_Lab2_2Labos2.html#autotoc_md92", null ],
      [ "Istraživanje različitih razina režima mirovanja", "d8/d96/md_Lab2_2Labos2.html#autotoc_md94", [
        [ "Za AVR / Arduino:", "d8/d96/md_Lab2_2Labos2.html#autotoc_md95", null ],
        [ "Za ESP32:", "d8/d96/md_Lab2_2Labos2.html#autotoc_md96", null ]
      ] ],
      [ "</blockquote>", "d8/d96/md_Lab2_2Labos2.html#autotoc_md97", null ],
      [ "Dokumentacija i ispitivanje", "d8/d96/md_Lab2_2Labos2.html#autotoc_md98", null ],
      [ "</blockquote>", "d8/d96/md_Lab2_2Labos2.html#autotoc_md99", null ],
      [ "Wokwi simulator", "d8/d96/md_Lab2_2Labos2.html#autotoc_md100", null ],
      [ "Podzadatci", "d8/d96/md_Lab2_2Labos2.html#autotoc_md102", [
        [ "1. Varijanta: Pametni poštanski sandučić (event-driven)", "d8/d96/md_Lab2_2Labos2.html#autotoc_md103", [
          [ "Scenarij", "d8/d96/md_Lab2_2Labos2.html#autotoc_md104", null ],
          [ "Zadatak", "d8/d96/md_Lab2_2Labos2.html#autotoc_md105", null ],
          [ "Izazov: odbijanje kontakta (debouncing)", "d8/d96/md_Lab2_2Labos2.html#autotoc_md106", null ],
          [ "Zahtjev", "d8/d96/md_Lab2_2Labos2.html#autotoc_md107", null ]
        ] ],
        [ "2. Varijanta: Datalogger okoliša (periodičko buđenje)", "d8/d96/md_Lab2_2Labos2.html#autotoc_md109", [
          [ "Scenarij", "d8/d96/md_Lab2_2Labos2.html#autotoc_md110", null ],
          [ "Zadatak", "d8/d96/md_Lab2_2Labos2.html#autotoc_md111", null ],
          [ "ESP32", "d8/d96/md_Lab2_2Labos2.html#autotoc_md112", null ],
          [ "Arduino", "d8/d96/md_Lab2_2Labos2.html#autotoc_md113", null ],
          [ "Obrada podataka", "d8/d96/md_Lab2_2Labos2.html#autotoc_md114", null ]
        ] ],
        [ "Dodatni zadatak (analiza)", "d8/d96/md_Lab2_2Labos2.html#autotoc_md116", null ]
      ] ],
      [ "Predaja rada", "d8/d96/md_Lab2_2Labos2.html#autotoc_md118", [
        [ "Obavezna struktura", "d8/d96/md_Lab2_2Labos2.html#autotoc_md120", null ],
        [ "Što treba sadržavati", "d8/d96/md_Lab2_2Labos2.html#autotoc_md122", null ]
      ] ],
      [ "Wokwi simulacija", "d8/d96/md_Lab2_2Labos2.html#autotoc_md124", [
        [ "</blockquote>", "d8/d96/md_Lab2_2Labos2.html#autotoc_md125", null ]
      ] ],
      [ "Dokaz rada", "d8/d96/md_Lab2_2Labos2.html#autotoc_md126", null ],
      [ "Sažetak", "d8/d96/md_Lab2_2Labos2.html#autotoc_md128", [
        [ "Napomena za ESP korisnike", "d8/d96/md_Lab2_2Labos2.html#autotoc_md130", null ],
        [ "Završna napomena", "d8/d96/md_Lab2_2Labos2.html#autotoc_md131", [
          [ "WokWI simulator", "d8/d96/md_Lab2_2Labos2.html#autotoc_md132", null ]
        ] ]
      ] ]
    ] ],
    [ "Topics", "topics.html", "topics" ],
    [ "Files", "files.html", [
      [ "File List", "files.html", "files_dup" ],
      [ "Globals", "globals.html", [
        [ "All", "globals.html", null ],
        [ "Functions", "globals_func.html", null ],
        [ "Variables", "globals_vars.html", null ],
        [ "Macros", "globals_defs.html", null ]
      ] ]
    ] ]
  ] ]
];

var NAVTREEINDEX =
[
"d3/d46/group__DISTANCE.html"
];

var SYNCONMSG = 'click to disable panel synchronisation';
var SYNCOFFMSG = 'click to enable panel synchronisation';