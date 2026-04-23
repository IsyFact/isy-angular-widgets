## Development Setup

### Konzeptdokumentation

Eine ausführliche Dokumentation zum Konzept der _isy-angular-widgets_-Bibliothek ist auf der Seite [Konzept Angular](https://isyfact.github.io/isy-angular-widgets-doc/current/konzept/konzept.html) beschrieben.

### Voraussetzungen

Auf dem Rechner sollten eine aktuelle Node.js-LTS-Version und npm installiert sein.

Anschließend kann das Projekt aus GitHub bezogen werden:

```shell
git clone https://github.com/IsyFact/isy-angular-widgets.git
cd isy-angular-widgets
```

### Abhängigkeiten installieren

Vor der ersten Ausführung bzw. nach dem Ergänzen neuer Pakete müssen die Abhängigkeiten installiert werden:

```shell
npm install
```

Das Projekt verwendet Tailwind CSS v4 über die PostCSS-Integration. Die globale Tailwind-Einbindung erfolgt über die zentrale CSS-Datei, z. B. mit:

```css
@import "tailwindcss";
@import "tailwindcss-primeui";
```

### Widgets-Bibliothek lokal an ein neues Projekt anbinden

Im Root-Verzeichnis des Projekts wird durch den nachstehenden Shortcut-Befehl aus der `package.json` die Widgets-Bibliothek gebaut und anschließend verpackt:

```shell
npm run build-and-pack:widgets_lib
```

Im nächsten Schritt erfolgt die Installation dieser Bibliothek in einem neuen Angular-Projekt. Hierfür wird der Pfad zur TGZ-Datei benötigt. Im Root-Verzeichnis des neuen Angular-Projekts ist der folgende Befehl auszuführen:

```shell
ng add [WIDGETS_LIB_PATH].tgz
```

### Hinweis zu Animationen

`isy-angular-widgets` setzt in aktuellen Versionen nicht pauschal die Aktivierung von Angular-Legacy-Animationen voraus.

Falls im Zielprojekt noch Animationen auf Basis von `@angular/animations` verwendet werden, sind die bisherigen APIs zwar weiterhin nutzbar, aber deprecated. Für neue Implementierungen werden native CSS-Animationen sowie `animate.enter` und `animate.leave` empfohlen.

### Demo-Anwendung starten

Neben den Widgets können in der Demo-Anwendung praktische Beispiele für die Umsetzung von Styleguide-Patterns oder querschnittlichen Aspekten betrachtet werden.
Die Demo-Anwendung kann mit folgendem Befehl gestartet werden:

```shell
$ npm run start
```

### Browser-Hinweis

Tailwind CSS v4 setzt moderne Browser voraus. Vor der Entwicklung oder Migration sollte geprüft werden, ob die Browser-Anforderungen des Projekts damit vereinbar sind.

#### Prettier für Demo-Anwendung und Widgets-Bibliothek ausführen

Zur Überprüfung der Demo-Anwendung und der Widgets-Bibliothek auf Code-Formatierungsfehler mithilfe von Prettier kann folgender Befehl ausgeführt werden:

```shell
$ npm run prettier:check
```

Um Code-Formatierungsfehler innerhalb der Demo-Anwendung und der Widgets-Bibliothek mithilfe von Prettier zu beheben, kann folgender Befehl ausgeführt werden:

```shell
$ npm run prettier:fix
```

#### E2E-Tests für Demo-Anwendung ausführen

Für die Demo-Anwendung wurden exemplarisch einige E2E-Tests mit dem Framework [TestCafe](https://testcafe.io/) umgesetzt.
Um die Tests auszuführen, muss zunächst die Demo-Anwendung gestartet werden (siehe oben).
Für die Ausführung der Tests wird der Webbrowser Chrome benötigt, alternativ kann das `e2e`-Skript angepasst und dort ein anderer Browser eingetragen werden.
Die Tests werden mit folgendem Befehl gestartet.

```shell
$ npm run e2e
```

### PrimeNG-Designer

Ab PrimeNG Version 18 wurde ein neues Theming-System eingeführt.
Die Erstellung und Anpassung von Themes mit diesem neuen System ist kostenfrei möglich. PrimeNG stellt hierzu eine umfangreiche Dokumentation sowie Beispiele bereit, die den Einstieg erleichtern.

Für eine visuelle und benutzerfreundlichere Gestaltung von Themes bietet PrimeNG ab Version 19 einen neuen Theme-Designer an, der jedoch kostenpflichtig ist.

Mit Version 19 der `isy-angular-widgets`-Bibliothek wurde das ursprünglich verwendete FluentUI-Theme durch das neue PrimeNG-Theming-System ersetzt.
Als Standard-Theme wurde `Nora` ausgewählt und an das bestehende Look-and-Feel der Widgets-Bibliothek sowie der Anwendung angepasst.

## Erstellen von Releases

Releases werden mithilfe einer GitHub Action erzeugt, welche immer dann ausgeführt wird, wenn ein Tag mit einer gültigen Versionsnummer nach Semver erstellt wird.
Diese Versionsnummer wird dann automatisch in die `package.json` der gebauten Bibliothek ausgetauscht.
Das bedeutet, die Versionsnummer muss nicht manuell in der `package.json` des Projekts gepflegt werden (dort steht einfach `0.0.0`).
