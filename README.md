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

Dadurch wird im Verzeichnis `dist/isy-angular-widgets` eine TGZ-Datei der Bibliothek erzeugt, zum Beispiel:

```text
dist/isy-angular-widgets/isyfact-isy-angular-widgets-0.0.0.tgz
```

Im nächsten Schritt wird die erzeugte TGZ-Datei in einem neuen Angular-Projekt installiert.
Hierfür wird der Pfad zur TGZ-Datei benötigt.
Im Root-Verzeichnis des neuen Angular-Projekts ist folgender Befehl auszuführen:

```shell
npm install "file:[WIDGETS_LIB_PATH].tgz"
```

Nach der Installation kann die Schematic der Bibliothek ausgeführt werden:

```shell
ng generate @isyfact/isy-angular-widgets:ng-add
```

Der direkte Aufruf von `ng add` auf die lokale TGZ-Datei sollte nicht verwendet werden, da Angular CLI bei lokalen Paketdateien die Paketinformationen unter Umständen nicht korrekt auslesen kann.

Eine zusätzliche Aktivierung von Angular-Animationen über `provideAnimations`, `provideAnimationsAsync` oder `BrowserAnimationsModule` ist für Angular 21 und PrimeNG 21 nicht mehr erforderlich. Angular hat die bisherigen Animation-Provider als deprecated markiert. PrimeNG 21 verwendet native CSS-Animationen.

Falls ein Projekt weiterhin eigene Legacy-Animationen aus `@angular/animations` verwendet, muss dies projektbezogen geprüft und perspektivisch auf native CSS-Animationen migriert werden.

### Demo-Anwendung starten

Neben den Widgets können in der Demo-Anwendung praktische Beispiele für die Umsetzung von Styleguide-Patterns oder querschnittlichen Aspekten betrachtet werden.
Die Demo-Anwendung kann mit folgendem Befehl gestartet werden. 

```
$ npm run start
```

### Browser-Versionsprüfung im Hauptfenster

Das Widget `HauptfensterComponent` prüft beim Laden der Anwendung automatisch, ob die vom Client verwendete Browser-Version unterstützt wird. Wird eine nicht unterstützte Browser-Version erkannt, wird im Hauptfenster eine Warnmeldung angezeigt.

Die Prüfung ist standardmäßig aktiviert und muss bei der Verwendung des Hauptfensters nicht zusätzlich konfiguriert werden.

```html
<isy-hauptfenster>
  <!-- Anwendungscode -->
</isy-hauptfenster>
```

Falls die Prüfung in einer Anwendung deaktiviert werden soll, kann dies über das Input-Property `checkBrowserVersion` erfolgen.

```html
<isy-hauptfenster [checkBrowserVersion]="false">
  <!-- Anwendungscode -->
</isy-hauptfenster>
```

#### Browser-Support-Konfiguration generieren

Die unterstützten Mindest-Browser-Versionen werden in der Datei `browser-support.config.json` statisch in der Widgets-Bibliothek hinterlegt.

Die Datei befindet sich unter:

```text
projects/isy-angular-widgets/src/lib/browser-support/browser-support.config.json
```

Die Konfiguration wird über folgendes Skript generiert:

```shell
npm run generate-browser-support
```

Das Skript ermittelt die Browser-Versionen auf Basis der im Generator hinterlegten Browser-Support-Regeln des aktuellen Angular-Major-Releases und aktualisiert die Datei `browser-support.config.json`.

Die generierte Datei ist Bestandteil der Widgets-Bibliothek und muss eingecheckt werden.

Das Skript sollte insbesondere nach einem Update auf ein neues Angular-Major-Release erneut ausgeführt werden.

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
