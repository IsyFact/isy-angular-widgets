# 16.0.1 - 
## Features
- ISY-576: moment.js wurde durch date-fns ersetzt
## Fixes
- ISY-375 - Analyse: Einsatz von ng-mocks

# 16.0.0 - 10.11.2023
## Breaking Changes
- ISY-144 Upgrade Angular und PrimeNG Bibliothek auf Version 16
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
