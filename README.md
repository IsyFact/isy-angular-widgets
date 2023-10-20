## Development Setup

### Prerequisites

Auf dem PC müssen die neueste [Node und Npm LTS Version](https://nodejs.org/en/download/) installiert sein.

Anschließend muss das Projekt aus GitHub bezogen werden

```shell
git clone https://github.com/IsyFact/isy-angular-widgets.git
cd isy-angular-widget
```

### Dependencies Installieren

Vor der ersten Ausführung bzw. beim Ergänzen neuer Pakete muss das Projekt mit folgendem Befehl installiert werden.

```shell
npm install
```

### Widgets-Bibliothek lokal an ein neues Projekt anbinden

1. Öffnen isy-angular-widgets
2. Im root directory "npm run build:widgets_lib" ausführen
3. Umgehen auf Pfad "/isy-angular-widgets/dist/isy-angular-widgets" und Pfad kopieren
4. Neues Angular-Projekt Version 15 neu anlegen (npm install wird ausgeführt)
5. Umgehen auf root directory und Ausführung von "npm add /pathToWidgets/isy-angular-widgets/dist/isy-angular-widgets" (kopierter Pfad von Schritt 3)
6. Im Modul, wo die eine ausgewählte Komponente z.B. Input-Char verwendet werden soll, müssen folgende Module unter "modules" hinzugefügt werden: BrowserAnimationsModule und je nach Fall vlt. auch BrowserModule oder/auch CommonModule
7. Innerhalb der Datei angular.json, unter: architect->build->options muss folgendes property hinzugefügt werden: "preserveSymlinks": true - Hintergrund: Bei Windows entsteht oft wegen den Pfaden ein Fehler und es tritt eine Fehlermeldung bezüglich inject() auf. Unter Linux gibt es keine Probleme
8. Applikation starten
9. Aus isy-angular-widgets ein beliebiges Widget integrieren

### Demo-Anwendung starten

Neben den Widgets können in der Demo-Anwendung praktische Beispiele für die Umsetzung von Styleguide-Patterns oder querschnittlichen Aspekten betrachtet werden.
Die Demo-Anwendung kann mit folgendem Befehl gestartet werden. 

```
$ npm run start
```

#### Prettier für Demo-Anwendung und Widgets-Bibliothek ausführen
Zur Überprüfung der Demo-Anwendung und der Widgets-Bibliothek auf Code-Formatierungsfehler mithilfe von Prettier, kann folgender Befehl ausgeführt werden.
```
$ npm run prettier . --check
```
Um Code-Formatierungsfehler innerhalb der Demo-Anwendung und der Widgets-Bibliothek mithilfe von Prettier zu beheben, kann folgender Befehl ausgeführt werden.
```
$ npm run prettier --write .
```


#### E2E-Tests für Demo-Anwendung ausführen

Für die Demo-Anwendung wurden exemplarisch einige E2E-Tests mit dem Framework [TestCafe](https://testcafe.io/) umgesetzt.
Um die Tests auszuführen, muss zunächst die Demo-Anwendung gestartet werden (siehe oben).
Für die Ausführung der Tests wird der Webbrowser Chrome benötigt, alternativ kann das `e2e` Skript angepasst und dort ein anderer Browser eingetragen werden.
Die Tests werden mit folgendem Befehlt gestartet.

```
$ npm run e2e
```

### PrimeNG-Designer
Die globalen Styles (isyfact-primeng-bootstrap-light.css) werden vom [PrimeNG-Theme-Designer](https://designer.primeng.org/#/) generiert.


Als Basis-Theme wird _Bootstrap Light_ verwendet.
Für das aktuelle Theme wurden folgende Einstellungen im PrimeNG-Theme-Designer verwenden:

| Einstellungen        | Wert                                    | 
|----------------------|-----------------------------------------|
| *General*            |                                         |
| Font Family          | BundesSans,'Liberation Sans',sans-serif |
| Text                 | 73, 80, 87                              |
| Secondary Text       | 73, 80, 87                              |
| Border Radius        | 0px                                     |
| Disabled Opacity     | 0.75                                    |
| *Palette*            |                                         |
| Primary              | 69, 72, 77                              |
| Primary Dark         | 137, 144, 154                           |
| Primary Darker       | 137, 144, 154                           |
| Highlight Background | 204, 227, 236                           |
| Text on Highlight    | 73, 80, 87                              |
| Hover Background     | 204, 227, 236                           |
| *Forms*              |                                         |
| Focus Border         | 204, 227, 236                           |
| *Buttons*            |                                         |
| Secondary Background | 69, 72, 77                              |

## Erstellen von Releases

Releases werden mithilfe einer GitHub Action erzeugt, welche immer dann ausgeführt wird, wenn ein Tag mit einer gültigen Versionsnummer nach Semver erstellt wird.
Diese Versionsnummer wird dann automatisch in die package.json der gebauten Bibliothek ausgetauscht.
Das bedeutet, die Versionsnummer muss nicht manuell in der package.json des Projekts gepflegt werden (Dort steht einfach 0.0.0).
