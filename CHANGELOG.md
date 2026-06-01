# 21.1.0 -
## Features
- IFS-2966:  Anpassungen: 
    - schematics/collection.json
    "schema": "./ng-add/schema.json" zur ng-add Schematic-Definition hinzugefügt.

    schematics/ng-add/package-config.ts
    - devDependencies zum PackageJson Interface hinzugefügt
    - Neue Funktion addDevPackageToPackageJson für ESLint- und Prettier-Pakete als devDependency
    - Neue Funktion addScriptToPackageJson für npm-Scripts (lint, format)

    schematics/ng-add/index.ts
    - Interfaces erweitert (ArchitectOptions, ProjectInfo mit root, sourceRoot, prefix)
    - Neue Funktion isMonorepo() – erkennt Monorepo wenn alle Projekte einen nicht-leeren root haben
    - Neue Funktion getTsConfigPaths() – liest tsConfig-Pfade aus architect.build und architect.test
    - Neue Funktion generateProjectConfigBlock() – generiert pro Projekt einen ESLint-Konfigurationsblock
    - Neue Funktion generateEslintConfigContent() – generiert die vollständige eslint.config.js für einfaches Projekt und Monorepo (gleiche Logik, unterschiedliche
      sourceRoot-Pfade)
    - Neue Funktion setupEslint() – installiert devDeps, erstellt eslint.config.js (wenn nicht vorhanden), gibt Warnung wenn bereits vorhanden
    - ngAdd() akzeptiert jetzt Schema-Parameter und ruft setupEslint() auf wenn options.addEslint === true
    - Neue Funktion extendExistingEslintConfig() – sichert vorhandene eslint.config.js als eslint.config.base.js und erzeugt einen Wrapper
    - Neue Funktion setupPrettier() – installiert @isyfact/prettier-plugin und prettier als devDependencies, erstellt .prettierrc.js und .prettierignore und fügt format-Script hinzu
    - ngAdd() ruft setupPrettier() auf wenn options.addPrettier === true

    eslint.config.js enthält:
    - ignores für karma.conf.js, karma.config.js, node_modules und *.server.ts
    - configs.recommended() (IsyFact TypeScript-Regeln)
    - Pro Projekt: TS-Block, Spec-Block (Test-spezifische Regelausnahmen), HTML-Block und Inline-Template-Block mit Angular-ESLint-Regeln und korrektem prefix

    .prettierrc.js enthält:
    - Verweis auf @isyfact/prettier-plugin (tabWidth: 2, singleQuote: true, printWidth: 120, endOfLine: lf u.a.)

    schematics/ng-add/schema.json + schema.d.ts
    - Neues optionales Flag addPrettier (default: true) mit CLI-Prompt

- IFS-4984: Der `isy-wizard` wurde um einen anpassbaren Footer erweitert. Zusätzlich wurde die Standard-Anordnung der Wizard-Buttons überarbeitet, damit Aktionen konsistent platziert und projektspezifisch per Template angepasst werden können.
- IFS-4928: Tab-Reihenfolge in Dialogen, Fokusverhalten bei Overlays und numerische Ausrichtung in Tabellen wurden verbessert
- IFS-4927: Der Hauptinhalt ist zentriert, Abstände werden über Container-Gaps bzw. Spacing-Tokens gesteuert und doppelte Margins zwischen Komponenten wurden entfernt.
- IFS-4931: Die Komponente `form-wrapper` und der Service zur Übersetzung von Beschriftungen in der _isy-angular-widgets_ Bibliothek wurden überarbeitet
## Fixes
- IFS-2925: Der `InputChar`-Dialog (`isy-input-char-picker-host`) ist nun responsiv: Die Breite ist auf `95vw` begrenzt, sodass der Dialog auf schmalen Viewports (≤ 390 px) nicht überläuft. Unterhalb von 480 px werden linkes und rechtes Panel vertikal gestapelt statt nebeneinander dargestellt.
- IFS-5026: `isy-incomplete-date` setzt Pflichtfelder nun korrekt mit `required` und `aria-required`
- IFS-5439: Performanzproblem bei mehrfacher Einbindung der `InputCharComponent` wurde behoben
- IFS-4947: Farbe für Disabled-Buttons wurde angepasst
- IFS-4999: Die Property `transferISO8601` in der Komponente IsyIncompleteDate konvertiert den Wert nun in die korrekte ISO-8601-Repräsentation.
- IFS-5223: Release v21.0.1 wurde in `main` gemergt und enthält die Anpassung des Font-Family-Namens.
## Demo-Anwendung
- IFS-4541: Eingabefelder für Datum, Uhrzeit und Zeiträume wurden hinzugefügt
- IFS-4931: Modalarme Muster wurden hinzugefügt
- IFS-3587: Auf der Seite _Objekt anzeigen_ wurde ein Beispielpattern zur Erfassung mehrerer einfacher Eingaben ergänzt
  * Exemplarische Umsetzung für Staatsangehörigkeiten mit PrimeNG Chips
  * Mindestens ein Eintrag ist als Pflichtfeld berücksichtigt
  * Die maximale Anzahl von Einträgen ist begrenzt
  * Einträge können wieder entfernt werden
- IFS-2989: Die Masken für die Bedienelemente wurden umstrukturiert.
Dadurch können sie nun gezielt über Anker im Bedienkonzept verlinkt werden und bilden die dort beschriebenen Varianten der Bedienelemente nachvollziehbar ab.

# 21.0.1 - 03.05.2026
## Fixes
- IFS-5223: Der referenzierte Font-Family-Name wurde auf `BundesSans Web` korrigiert, damit die systemseitig installierte Schrift korrekt geladen wird.

# 21.0.0 - 16.02.2026
## Breaking Changes
- IFS-5039: Upgrade der Angularversion und PrimeNG-Bibliothek von 20 auf 21 (Detaillierte Migrationshinweise sind im [UPDATELOG.md](UPDATELOG.md) zu finden)
- IFS-5174: `moment.js` wurde aus der Bibliothek und den Unit-Tests entfernt. Die Datumsvalidierung basiert jetzt auf nativer `Date`-Logik (Detaillierte Migrationshinweise sind im [UPDATELOG.md](UPDATELOG.md) zu finden)
## Fixes
- IFS-4948: Der Hover-Status von Navigationselementen wurde farblich vom Active-Status abgegrenzt
- IFS-5039:
  * Im form-wrapper wurde ein Klassenname-Fehler im Template behoben
  * PrimeNG: Eingabefelder wieder korrekt auf volle Breite (w-full) gestylt
  * PrimeNG: Das `severity`-Binding wurde typensicher umgesetzt, sodass nur gültige Severity-Werte übergeben werden und andernfalls `undefined` gesetzt wird
- IFS-5174: Datumsvalidierung ohne Moment: `isInFuture`, `isInPast`, `dateFormat`, `validCreditCardExpirationDate` sowie ISO-Validatoren funktionieren ohne Moment-Abhängigkeit
- IFS-4983:
  * Die Hoehe eines Eingabefeldes mit Sonderzeichen Picker entspricht nun der Standardhoehe
  * Lint errors in Component Tests behoben
## Enhancements
- IFS-5039: Im `form-wrapper` erfolgt die Priorisierung von Fehlermeldungen nun über die Reihenfolge der validationMessages-Keys, zudem wurde die Fehlertextgröße reduziert

# 20.0.0 - 08.08.2025
## Features
- IFS-4761: Upgrade der Angularversion von 19 auf 20 (Detaillierte Migrationshinweise sind im [UPDATELOG.md](UPDATELOG.md) zu finden)
- IFS-4813: Upgrade der PrimeNG-Bibliothek auf Version 20 (Detaillierte Migrationshinweise sind im [UPDATELOG.md](UPDATELOG.md) zu finden)
## Fixes
- IFS-4314: Validierungsfehler des Eingabefeldes `isy-incomplete-date` für ungewisse Datumswerte bei programmatischer Befüllung behoben

# 19.1.0 - 27.06.2025
## Features
- IFS-4374: Die Schriftgröße der Fehlertexte wurde zur Verbesserung der Barrierefreiheit erhöht
## Demo-Anwendung
- IFS-4657: Die Anwendung wurde vollständig auf Standalone-Komponenten umgestellt

# 19.0.1 - 15.05.2025
## Fixes
- IFS-4629: Dark Mode des Standard-Themes wurde deaktiviert

# 19.0.0 - 09.05.2025
## Breaking Changes
- IFS-4629: Das FluentUI-Theme wurde durch das neue PrimeNG-Theming mit dem Standard-Theme Nora ersetzt und entsprechend angepasst.
- IFS-4562: Upgrade Angular- und PrimeNG-Bibliothek auf Version 19 (Detaillierte Migrationshinweise sind im [UPDATELOG.md](UPDATELOG.md) zu finden)
## Dokumentation
- IFS-4549 Verwaltung der Version zentralisiert

# 18.2.1 - 12.03.2025
## Fixes
- IFS-4568: Der Build-Fehler in 18.2.0 aufgrund einer fehlenden Moduldatei wurde behoben
## Dokumentation
- IFS-4508: Verweis auf die Angular-Referenzimplementierung wurde prominent platziert

# 18.2.0 - 09.12.2024
## Features
- IFS-3998: Der Validator `validateDIN91379` für die DIN 91379 wurde in die _isy-angular-widgets_ Bibliothek integriert
- IFS-4098: Für die Bereitstellung unterschiedlicher Buttonvarianten wurden folgende Komponenten überarbeitet:
  * Im `isy-hauptfenster` wurde die Eigenschaft `outlinedLogoutButton` hinzugefügt, um den Logout-Button als Outlined-Button darstellen zu können
  * Im `isy-wizard` wird nur noch der Primärbutton in der gefüllten Primärfarbe dargestellt, alle anderen Buttons werden als Outlined-Buttons dargestellt
  * Der Weiter-Button im `isy-wizard` wird im letzten Schritt des Wizards ausgeblendet
  * Der `InputCharComponent`-Komponente wurde die Eigenschaft `outlinedInputCharButton` hinzugefügt, um den Charpicker-Button als Outlined-Button darstellen zu können
- IFS-4322: Im IsyFact-Theme wurden neue scss-Variablen hinzugefügt:
  * `$isyfactLabelFontWeight`, um Labels fett darstellen zu können
  * `$isyfactProgressSpinnerStroke`, um die Farbe des Progress Spinners anpassen zu können
  * `$isyfactProgressSpinnerAnimation`, um die Animation des Progress Spinners anpassen zu können
## Demo-Anwendung
- IFS-3998: Ein Beispiel für die Anwendung des Validators `validateDIN91379` gemäß DIN 91379 wurde auf der Seite _Objekt-Anzeigen_ ergänzt
- IFS-4098: Für die Bereitstellung unterschiedlicher Buttonvarianten wurden folgende Komponenten in der Demo angepasst:
  * Date-Picker werden nun in der Default-Icon-Variante dargestellt
  * In der Ergebnisliste auf der Seite _Objekt-Suchen_ werden die Aktionsbuttons als Outlined-Buttons und mit unterschiedlichen Farben/Severities dargestellt
  * Der Charpicker-Button wird auf den Seiten _Objekt-Suchen_ und _Objekt-Anzeigen_ als Outlined-Button dargestellt
  * Der Logout-Button wird als Outlined-Button dargestellt
- IFS-4322: Alle Labels werden nun in dicker Schrift dargestellt, um Labels von Inhalten besser unterscheiden zu können
- IFS-4298: Der Dialog zum Hinzufügen und Bearbeiten von Sachverhalten auf der Seite _Objekt-Anzeigen_ lässt sich nun öffnen
## Fixes
- IFS-4298: Der _Charpicker_ `isy-input-char` öffnet sich nicht mehr durch Drücken der Enter-Taste, wenn er nicht im Fokus ist
- IFS-4312: Das Eingabefeld `isy-incomplete-date` für ungewisse Datumswerte zeigt bei leerem Wert keinen Validierungsfehler an
## Dokumentation
- IFS-4249: Die Antora-Version der Online-Dokumentation wird nun durch Git gesetzt

# 18.1.0 - 01.10.2024
## Fixes
- IFS-4096: Die Pflichtfelderkennung der Komponente `isy-form-wrapper` wurde verbessert
- IFS-3776: Im Updatelog wurde die Version des `@isyfact/eslint-plugin` korrigiert
## Demo-Anwendung
- IFS-4054: In der Demo Anwendung wurde ein neuer Reiter _Bedienelemente_ hinzugefügt, in dem die meisten PrimeNG Widgets und Isy-Angular-Widgets exemplarisch eingebaut sind
- IFS-4096: Ein Beispiel der Komponente `isy-form-wrapper` mit dynamischem Fehlertext und Pflichtfeldvalidierung wurde der Seite _Objekt-Anzeigen_ hinzugefügt

# 18.0.0 - 03.09.2024
## Breaking Changes
- IFS-3776: Upgrade der Angularversion von 17 auf 18 (Detaillierte Migrationshinweise sind im [UPDATELOG.md](UPDATELOG.md) zu finden)
## Features
- IFS-4016: Themewechsel im Angular-Baustein - Integration des FluentUI-Themes und Entfernung des Bootstrap-Light-Themes
- IFS-4054: Die Sekundärbuttons auf den Seiten _Objekt-Suchen_ und _Objekt-Anzeigen_ wurden als Outlined-Buttons dargestellt

# 17.5.0 - 16.08.2024
## Feature
- IFS-3943: Durch Hinzufügen der Eigenschaft `allowZeroFormat` unterstützt das Eingabefeld für ungewisse Datums `isy-incomplete-date` nun die Verwendung von "00.00.0000" zur Darstellung unbekannter Teile eines Datums.

# 17.4.1 - 08.08.2024
## Feature
- IFS-3776: Der Schematics-Ordner zum Einbinden der _isy-angular-widgets_ Bibliothek wurde aktualisiert

# 17.4.0 - 02.08.2024
## Features
- IFS-3687: Die Rahmen- und Textfarbe von Eingabefeldern wurden an die im Bedienkonzept definierten Farben angepasst
- IFS-3927: Die barrierefreie Zielgröße von mindestens 44x44 Pixel für bedienbare Elemente wurde durch das Theming realisiert
- IFS-3940: Die i18n-Übersetzungsdateien für die PrimeNG-Komponenten wurden in der Bibliothek aktualisiert
- IFS-3944: Der Linksnavigation im `isy-hauptfenster` wurde die Eigenschaft _linksNavigationTitle_ zur Titelfestlegung hinzugefügt
- IFS-2935: Zur Verbesserung der Screenreader-Kompatibilität wurden Labels und Aria-Labels in den Komponenten `isy-input-char` und `isy-hauptfenster` angepasst
## Demo-Anwendung
- IFS-3940: Die i18n-Übersetzungsdateien für die PrimeNG-Komponenten wurden in der Demo-Anwendung aktualisiert
- IFS-3944: Die Linksnavigation hat einen Titel und ist auf die Default-Breite gesetzt
- IFS-2935: Zur Verbesserung der Screenreader-Kompatibilität wurden Labels und Aria-Labels in der gesamten Demo-Anwendung angepasst

# 17.3.1 - 05.07.2024
## Demo-Anwendung
- Die Barrierefreiheit ist innerhalb der Demo Anwendung durch folgende Anpassungen verbessert worden:
  * IFS-2934: Die Bearbeitungsmaske auf der Seite _Objekt-Anzeigen_ wurde entfernt
  * IFS-2763: Checkboxen sind durch Screenreader erreichbar
- IFS-2802: Zum Verringern der Tabellenbreite wird exemplarisch auf der Seite _Objekt-Suchen_ eine Spaltenfilterung in die Tabelle hinzugefügt
## Fixes
- IFS-3882: Beim _Charpicker_ `isy-input-char` wird der Validator aktualisiert, wenn Sonderzeichen hinzugefügt werden
- IFS-3677: Beim Aktualisieren der Demo-Anwendung bleiben die Inhalte der Seitenleisten innerhalb des `isy-hauptfenster` erhalten

# 17.3.0 - 24.05.2024
## Features
- IFS-2876: Aria-Label-Attribute wurden zur Verbesserung der Barrierefreiheit an Icons und Buttons in den Komponenten `isy-hauptfenster`, `isy-wizard` und `isyInputChar` hinzugefügt
- IFS-3684: Das Basis-Theme _Bootstrap4 Light Blue_ wurde als SCSS in das _IsyFact-Theme_ integriert. Eine Live-Bearbeitung der Variablen ist nun möglich
- IFS-3118: Das Eingabefeld für ungewisse Datums `isy-incomplete-date` kann nun Datumswerte im ISO 8601 Format für die Datenübertragung ausgeben. Ein Validator für ungewisse Datumswerte im ISO 8601 Format wurde zur Bibliothek hinzugefügt
- IFS-3644: Im `isy-form-wrapper` wurde das Label der Formularfelder von Float-Label auf Static-Label geändert
- IFS-3645: Infield Top-Aligned Label (IFTA Label) wurde zum `isy-form-wrapper` als optionale Labelvariante hinzugefügt
- IFS-3605: Icons zum Öffnen und Schließen der Seitenleisten sind in einfache Chevrons verändert worden
## Demo-Anwendung
- ISY-1044: Ein Widget für die Erfassung von mehreren Eingabewerten ist auf der Seite _Objekt anzeigen_ hinzugefügt
- IFS-3644: Die Komponente `isy-form-wrapper` wurde für alle Formularfelder in der Demo-App eingesetzt und die nicht mehr benötigte `RequiredLabelComponent` wurde von der Seite _Objekt suchen_ entfernt
- Die Barrierefreiheit ist innerhalb der Demo Anwendung durch folgende Anpassungen verbessert worden:
  * IFS-2933: Navigationslinks werden beim Verwenden von Screenreadern vor und nach dem Seitenwechsel angekündigt
  * IFS-2933: Sprunglinks erhalten einen Fokus
  * IFS-2933: Alle Browser-Tabs haben einen individuellen Titel und werden nach einem Seitenwechsel entsprechend angepasst
  * IFS-2876: Aria-Label-Attribute wurden an Icons und Buttons hinzugefügt
  * IFS-3606: Zum Beschriften von Formularelementen, wie Datums oder Kreditkartenspezifikationen, wurde die PrimeNG-Eingabemaske hinzugefügt
- IFS-3605: Panels werden optisch an Accordions angenähert
## Fixes
- IFS-3590: Die Dialoge _Charpicker_, _Objekt-Anlegen_ und _Objekt-Bearbeiten_ werden oberhalb der Hauptnavigation des `isy-hauptfenster` angezeigt
- IFS-3605: Accordion im _Charpicker_ klappt nun beim Klicken auf "Alle" die anderen Accordion-Tabs ein
## Dokumentation
- IFS-3646: Eine Antora Dokumentation für den Angular Baustein wurde hinzugefügt

# 17.2.0 - 19.03.2024
## Fixes
- ISY-775: Abschnitt Getting Started in der Readme beschreibt Einsatz des Bausteins mit Standalone Components
- ISY-618: Das Eingabefeld für ungewisse Datumswerte kann jetzt normale Datumswerte mit der Eingabe von Punkten vervollständigen
- ISY-905: Linksnavigation und Informationsbereich können jetzt wieder korrekt eingeklappt werden und die Breite der Linksnavigation und des Informationsbereichs liegt nun standardmäßig wieder bei 15em
- ISY-1014: Die `isy-seiten-toolbar` wird jetzt immer über dem Hauptmenü des `isy-hauptfenster` angezeigt
- ISY-907: Kontrast im Hauptmenü des `isy-hauptfenster` wurde verbessert
## Features
- ISY-906: Verwendung von HTML Landmarks `nav` (Hauptnavigation), `banner` (Header) und `aside` (Linksnavigation & Informationsbereich) im `isy-hauptfenster`
- ISY-874: Hinzufügen der Component `isy-seiten-toolbar`, die für das Seitentoolbar Template des `isy-hauptfenster` entwickelt wurde und beim vertikalen Scrollen am oberen Rand des Bildschirms haften bleibt
- ISY-681: Hinzufügen der Component `isy-form-wrapper` mit folgenden Funktionalitäten für beliebige Eingabefelder
  * Automatische Platzierung und Styling des Labels
  * Automatische Platzierung und Styling von Fehlernachrichten
- ISY-877: `isy-form-wrapper` Component um Pflichtfeldfunktionalität erweitert
- ISY-682: Pipe `IncompleteDatePipe` zur Anzeige von ungewissen Datumswerten wurde hinzugefügt
- ISY-914: Die `isy-wizard` Komponente beinhaltet verschiedene Breakpoints für eine verbesserte Unterstützung von Responsive Layouts
## Demo-Anwendung
- ISY-876: Toast Notifications werden jetzt immer am unteren rechten Rand angezeigt
- ISY-630: Das HTML lang-Attribut passt sich der gewählten Sprache automatisch an, um die Zugänglichkeit der Website zu verbessern
- ISY-647: Alle Formulare wurden von rechtsbündigen Labels auf Floating-Labels umgestellt
- ISY-634: Formulare wurden auf den Seiten _Objekt suchen_ und _Objekt Anzeigen_ für verbesserte Responsivität überarbeitet
- ISY-978: Die Tabelle auf der Seite _Objekt suchen_ zeigt exemplarisch, wie ein Zeilenumbruch in der Tabellenüberschrift verhindert werden kann
- ISY-816: Die Tabelle auf der Seite _Objekt suchen_ verwendet jetzt die PrimeNG Standard Filter und Sortierung
- ISY-389: Imports in der Demo-Anwendung zur Library gehen nun über den Library-Namen

# 17.1.0 - 18.01.2024
## Fixes
- ISY-632: Prozentuale Größe für die Linksnavigation wird nun korrekt angezeigt
- ISY-641: Input-Char-Eingabefelder in der Demo App werden bei deaktivierter Form deaktiviert
- ISY-614: Die Ecken des CharPickers werden bei Themes mit runden Ecken korrekt dargestellt
- ISY-633: isy-incomplete-date: Keine Breitenkonfigurierbarkeit
- ISY-684: Bessere Unterscheidbarkeit von inaktiven und aktiven Eingabefehlern
## Features
- ISY-722: In isy-wizard wurde der Output `stepperIndexChange` in `indexChange` umbenannt
  * Infolgedessen wurde der bestehende Output `stepperIndexChange` als deprecated markiert
## Demo-Anwendung
- ISY-575: In der Demo-Anwendung wurde ein exemplarischer Dateiupload mit dem attribut `ngDefaultControl` hinzugefügt

# 17.0.0 - 08.12.2023
## Breaking Changes
- ISY-144: Upgrade Angular und PrimeNG Bibliothek auf Version 17
## Fixes
- ISY-375: ng-mocks wird jetzt für Tests eingesetzt und demonstriert
- ISY-574: Der Invalid-Status im ungewissen Datum-Eingabefeld wird jetzt korrekt angezeigt
- ISY-619: Überlappende Date Picker werden jetzt in Wizards korrekt dargestellt
## Demo-Anwendung
- ISY-631: Formulare im Demo-Wizard zeigen jetzt keine Validierungsfehler mehr direkt nach Öffnen des Dialogs an

# 16.0.0 - 10.11.2023
## Breaking Changes
- ISY-144: Upgrade Angular und PrimeNG Bibliothek auf Version 16
  * `WidgetsConfigService#getTranslation` erlaubt jetzt auch Werte vom Typ `undefined`

## Features
- `IncompleteDate`: Registrierung auf `onInput`-Output ist jetzt möglich

# 15.1.0 - 07.11.2023 
## Features
- ISY-345: Wechsel in nächsten Datum-Abschnitt mit Punkt-Taste für ungewisses Datum-Eingabefeld möglich
## Fixes
- ISY-500: Liberation Font wird jetzt korrekt als Fallback Schriftart verwendet
## Enhancements
- ISY-451: Die Dokumentation der Bibliothek ist auf [GitHub Pages](https://isyfact.github.io/isy-angular-widgets/) verfügbar
- ISY-469: Es wurden fehlende Aria-Labels, Input-IDs hinzugefügt und falsch gesetzten IDs entfernt, um die Barrierefreiheit zu erhöhen
## Demo-Anwendung
- ISY-378: Hinzufügen Beispielen für Validatoren auf der Objekt-Anzeigen-Seite
- ISY-303: Automatisierte Code-Formatierung mit Prettier
- ISY-360: Beim Versuch auf nicht vorhandene Seiten zu navigieren wird jetzt eine Fehlerseite angezeigt
- ISY-516: Entfernen von automatischen Ausblenden von Toast-Notifications

# 15.0.1 - 5.10.2023
## Fixes
- ISY-377: Neue DIN 91379 werden jetzt beim korrekten Grundzeichen angezeigt
- ISY-292: Sekundärfarbe von Buttons für besseren Kontrast angepasst
- Aria-Labels zu Buttons von Hauptfenster und CharPicker hinzugefügt

# 14.2.1 - 5.10.2023
## Fixes
- ISY-377: Neue DIN 91379 werden jetzt beim korrekten Grundzeichen angezeigt
- ISY-292: Sekundärfarbe von Buttons für besseren Kontrast angepasst
- Aria-Labels zu Buttons von Hauptfenster und CharPicker hinzugefügt

# 15.0.0 - 29.09.2023
## Breaking Changes
- ISY-138: Upgrade Angular und PrimeNG Bibliothek auf Version 15
  * Die Implementierung der Interfaces CanActivate, CanLoad wurde entfernt, da deprecated
  * Der Parameter _state_ wurde aus der Signatur der Auth Guard Methode canActivate entfernt
  * Die Auth Guard Methode canLoad wurde entfernt, da CanLoad Interface deprecated
- ISY-371: Breaking Change vor v15: API des CharPickers der API von p-dialog angleichen
  * Properties der Komponente input-char der API von p-dialog angeglichen
## Demo-Anwendung
- ISY-138: Upgrade Angular und PrimeNG Bibliothek auf Version 15
  * Demo-Anwendung und Bibliothek wurden auf Angular und PrimeNg 15 migriert

# 14.2.0 - 29.09.2023
## Features
- ISY-377: Umsetzung der DIN 91379
  * Sonderzeichenliste nach DIN 91379 erweitert
- ISY-373: Deaktiviere @angular-eslint/component-selector für Tests
  * ESLint Selektor Regel für Direktiven und Komponenten Tests wurde deaktiviert
## Fixes
- ISY-316: Readme aus dem Root-Verzeichnis wird für Releases verwendet

# 14.1.0 - 26.09.2023
- ISY-348: Bei ungültigen Datumeingaben wird das Eingabefeld auf "invalid" gesetzt und der Fehler grafisch dargestellt
- ISY-346: Eingabe von verkürzten Jahreszahlen im ungewissen Datum Eingabefeld ist jetzt möglich
- ISY-216: Erstellen von Validatoren für ungewisses Datum
  * Zusätzliche Validatoren für ungewisse Datumswerte integriert
  * Tag und Monat wurden in das Datumformat integriert
## Fixes
- ISY-241: Anpassung des Styles für das Galerie Widget von PrimeNG
  * SCSS Code wurde angepasst
- ISY-134 - Performance Violation im CharPicker
## Demo-Anwendung
- ISY-137: Demonstration der Security Widgets:
  * Demonstration des Security Widgets innerhalb der Demo-Anwendung
  * Dropdown Liste innerhalb des Hauptfenster zur Auswahl einer beliebigen Rolle (Admin oder User) hinzugefügt
  * Änderung der Rolle zur Laufzeit nicht möglich
  * Auswahl der Rolle Admin und anschließende Navigation auf die Seite _Objekt anzeigen_, ermöglicht die Anzeige des Input Switches _Zeige geheime Felder_
  * Auswahl der Rolle User und anschließende Navigation auf die Seite _Objekt anzeigen_, zeigt den Input Switche _Zeige geheime Felder_ nicht an, da fehlende Berechtigung

# 14.0.0 - 30.08.2023
## Breaking Changes
- Die Properties `linksNavigationCols` und `informationsbereichCols` wurden durch `linksNavigationWidth` und `informationsbereichWidth` ersetzt
## Features
- IFS-2010: Header und Seitenleisten werden in der Druckansicht jetzt ausgeblendet
- Anwendungslogos können jetzt mit eigenem HTML gesetzt werden
- Seitenleisten können jetzt in ihrer Breite frei konfiguriert werden
- Behördenspezifische Widgets und die Widgets aus PrimeNG können jetzt in den Sprachen Deutsch und Englisch angezeigt werden 
- ISY-86: Eingabefeld für ungewisses Datum verwendet jetzt eine Eingabemaske für das deutsche Datumsformat
## Fixes
- Seitenleisten werden nun korrekt ausgeblendet, wenn ihr show-Property false, aber collapse-Property true ist
- ISY-132: Der Sonderzeichen-Picker stellt seinen Button nun korrekt neben seinem Eingabefeld (anstatt darunter) dar
## Demo-Anwendung
- ISY-97: Die Demo-Anwendung zeigt ein Dashboard auf der Startseite, welches sich bereits responsive verhält
- ISY-96: Der Sonderzeichen-Picker wird exemplarisch auf der Seite _Objekt suchen_ eingebunden

# 0.8.0 - 15.05.2023
## Breaking Changes
- Security-Paket von /core/security nach /security verschoben
## Features
- IFS-1751: Es wurden spezifische Validator-Methoden für Input Felder hinzugefügt:
  * `isInFuture` - Prüft, ob ein Datum in der Zukunft liegt
  * `isInPast` - Prüft, ob ein Datum in der Vergangenheit liegt
  * `dateFormat` - Prüft, ob ein Datum ein bestimmtes Format einhält
  * `isoDate`, `isoTime` und `isoDateTime` prüfen, ob ein Datum ein gültiges ISO 8601 Datum ist
  * `validCreditCardNumber` - Prüft, ob die Eingabe eine gültige Kreditkartennummer ist
- IFS-1871: Es wurden zwei HttpInterceptors für das automatische Setzen einer CorrelationId im Request Header hinzugefügt
  * `CorrelationIdHttpInterceptor` - Für Anwendungen, die eine CorrelationId nach IsyFact Standard verarbeiten
  * `ZipkinOpenTracingHttpInterceptor` - Für Anwendungen, die Tracing mit Zipkins und OpenTracing implementieren
- IFS-2388: Das Theme wurde überarbeitet, sodass es dem Erscheinungsbild des alten Angular Bausteins möglichst ähnlich ist
  * In der `HauptfensterComponent` kann die Farbe der Anwendung über das Attribut `applicationGroupColor`angepasst werden
  * Die `WizardComponent` erhält die Properties `closable` and `modal`, die standardmäßig auf `true` gesetzt sind
- IFS-1791: Es wurde Dokumentation für die Komponenten hinzugefügt. Sie ist über gitlab pages erreichbar. 

# 0.7.0 - 03.02.2023
## Features
- IFS-1750: Bereitstellung des Special Char Picker Widgets
  * Bekannter Fehler: Der Picker wird falsch dargestellt, wenn er innerhalb eines Elements mit p-fluid verwendet wird. Die Verwendung dieser Stylingklasse ist zu überdenken.

# 0.6.0 - 18.01.2023
## Fixes
- IFS-1750: Bereitstellung des Special Char Picker Widgets (Pre-Release Version)
- IFS-2211: Behebung von mehreren kleinen Anzeigefehlern im Hauptfenster:
  * Im Hauptfenster wird keine vertikale Scrollbar mehr angezeigt, wenn der Inhalt kleiner als die Höhe des Bildschirms ist
  * Im Content-Bereich wird eine horizontale Scrollbar angezeigt, wenn der Inhalt zu breit für den Bildschirm ist
  * Das Logo des Anbieters der Anwendungslandschaft nimmt jetzt weniger Breite ein als zuvor

# 0.5.1 - 21.12.2022
## Fixes
- IFS-1755: Die .woff2-Schriftarten für Liberation Font werden korrekt exportiert und zur Verwendung bereitgestellt. Dies behebt einen Fehler, der den Build in der vorherigen Version verhinderte.
- Das IsyFact-Theme ist jetzt unter node_modules/@isyfact/isy-angular-widgets/assets/theme/isyfact-theme.scss abgelegt. Es müssen entsprechende Änderungen z.B. in der angular.json Datei vorgenommen werden.

# 0.5.0 - 24.11.2022

## Features
- IFS-1680: Es wird nun ein Wizard-Widget bereitgestellt
- IFS-2070: Die Titelzeile im Hauptfenster kann mit beliebigem HTML befüllt werden

## Enhancements
- IFS-2071: Balken im Hauptfenster mit der Standardfarbe hat eine größe von 10px erhalten

# 0.4.0 - 10.10.2022

## Features
- IFS-1789: isy-angular-widgets verwendet jetzt Angular 14 und PrimeNG 14
- IFE-475: Security Modul für die Beschränkung von Rechten auf Navigationspunkte sowie einer Direktive zur Einschränkung der Sichtbarkeit von einzelnen Widgets zu Verfügung gestellt. Außerdem kann ein Rollen/Rechte Mapping in der GUI eingestellt werden
- IFE-538: Die Seitenleisten des Hauptfensters können jetzt so konfiguriert werden, dass der Benutzer sie einklappen kann
- IFE-418: Widget für die Anzeige eines ungewissen Datums wurde bereitgestellt

## Fixes
- IFE-554: Die Seitenleisten nehmen jetzt die komplette Höhe des Browserfensters ein
- IFS-1764: Das Anwendungslogo kann jetzt entsprechend der Vorgaben des Bundesstyleguides angepasst werden
- IFE-500: Es werden keine Platzhaltertexte mehr angezeigt, wenn kein Anwendungslogo im Hauptfenster gesetzt ist

# 0.3.0 - 15.02.2022

## Features
- IFE-461: Im Header wird jetzt ein MegaMenu statt einer Menubar verwendet
- IFE-475: Unterstützung für Rollen und Rechte

# 0.2.0 - 08.02.2022

## Features
- IFE-463: Seitenleisten im Hauptfenster unterstützen Angular router outlets und die Breite der Leisten kann angepasst werden
- IFE-462: Output für Logout-Button in Hauptfenster hinzugefügt

# 0.1.0 - 09.12.2021

## Features
- IFE-408: Hauptfenster Widget mit Seitenleisten, UserInfo und Navigation hinzugefügt
- IFE-413: Standard Isyfact-Theme mit konfigurierbaren Farben für Hauptnavigationspunkte hinzugefügt
- IFE-453: Verwendung des UserInfo-Objekts für den Anwendungsrahmen
- IFE-409: Objekt-Suchen Pattern us dem Styleguide als Beispielseite in Demo-Anwendung hinzugefügt
- IFE-409: Objekt-Bearbeiten Pattern aus dem Styleguide als Beispielseite in Demo-Anwendung hinzugefügt
