## Development Setup

### Konzeptdokumentation

Eine ausführliche Dokumentation zum Konzept der _isy-angular-widgets_ Bibliothek, ist auf der Seite [Konzept Angular](https://isyfact.github.io/isy-angular-widgets-doc/current/konzept/konzept.html) beschrieben.

### Prerequisites

Auf dem PC müssen die neueste [Node und Npm LTS Version](https://nodejs.org/en/download/) installiert sein.

Anschließend muss das Projekt aus GitHub bezogen werden.

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

Im Root-Verzeichnis des Projekts wird durch den nachstehenden Shortcut-Befehl aus der `package.json` die Widgets-Bibliothek gebaut und anschließend verpackt.

```shell
npm run build-and-pack:widgets_lib
```

Im nächsten Schritt erfolgt die Installation dieser Bibliothek in einem neuen Angular-Projekt. Hierfür wird der Pfad zur TGZ-Datei benötigt. Im Root-Verzeichnis des neuen Angular-Projekts ist der folgende Befehl auszuführen.

```shell
ng add [WIDGETS_LIB_PATH].tgz
```

Anschließend ist die Aktivierung von Animationen notwendig. Je nach Projekttyp gibt es unterschiedliche Vorgehensweisen.
In Standalone-Projekten muss in `app.config.ts` die Methode `provideAnimations` importiert und bereitstellt werden.
In None-Standalone-Projekten erfolgt das Aktivieren von Animationen durch das Importieren und Hinzufügen von `BrowserAnimationsModule` zum `AppModule`.

### Demo-Anwendung starten

Neben den Widgets können in der Demo-Anwendung praktische Beispiele für die Umsetzung von Styleguide-Patterns oder querschnittlichen Aspekten betrachtet werden.
Die Demo-Anwendung kann mit folgendem Befehl gestartet werden. 

```
$ npm run start
```

#### Prettier für Demo-Anwendung und Widgets-Bibliothek ausführen
Zur Überprüfung der Demo-Anwendung und der Widgets-Bibliothek auf Code-Formatierungsfehler mithilfe von Prettier, kann folgender Befehl ausgeführt werden.
```
$ npm run prettier:check
```
Um Code-Formatierungsfehler innerhalb der Demo-Anwendung und der Widgets-Bibliothek mithilfe von Prettier zu beheben, kann folgender Befehl ausgeführt werden.
```
$ npm run prettier:fix
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

Ab PrimeNG Version 18 wurde ein neues Theming-System eingeführt. 
Die Erstellung und Anpassung von Themes mit diesem neuen System ist kostenfrei möglich. PrimeNG stellt hierzu eine umfangreiche [Dokumentationen](https://primeng.org/theming) sowie Beispiele bereit, die den Einstieg erleichtern.

Für eine visuelle und benutzerfreundlichere Gestaltung von Themes bietet PrimeNG ab Version 19 einen neuen Theme-Designer an, der jedoch kostenpflichtig ist. 

Mit Version 19 der `isy-angular-widgets`-Bibliothek wurde das ursprünglich verwendete FluentUI-Theme durch das neue PrimeNG-Theming-System ersetzt.
Als Standard-Theme wurde `Nora` ausgewählt und an das bestehende Look-and-Feel der Widgets-Bibliothek sowie der Anwendung angepasst.

## Erstellen von Releases

Releases werden mithilfe einer GitHub Action erzeugt, welche immer dann ausgeführt wird, wenn ein Tag mit einer gültigen Versionsnummer nach Semver erstellt wird.
Diese Versionsnummer wird dann automatisch in die package.json der gebauten Bibliothek ausgetauscht.
Das bedeutet, die Versionsnummer muss nicht manuell in der package.json des Projekts gepflegt werden (Dort steht einfach 0.0.0).
