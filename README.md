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

Das Projekt verwendet Tailwind CSS v4 über die PostCSS-Integration.
PrimeNG-Design-Tokens werden über `tailwindcss-primeui` als Tailwind-Utilities verfügbar gemacht.

Die globale Tailwind-Einbindung erfolgt über eine zentrale CSS-Datei, z. B.:

```css
@import "tailwindcss";
@plugin "tailwindcss-primeui";
```

Falls Tailwind-Klassen aus der Widgets-Bibliothek oder der Demo-Anwendung erkannt werden müssen, müssen die entsprechenden Quellpfade über `@source` eingebunden werden. Beispiel:

```css
@import "tailwindcss";
@plugin "tailwindcss-primeui";

@source "../projects/isy-angular-widgets";
@source "../projects/isy-angular-widgets-demo";
```

Die konkreten Pfade hängen davon ab, wo die zentrale Tailwind-CSS-Datei abgelegt ist.

### Hinweis zu PrimeFlex

Die Widgets-Bibliothek verwendet keine PrimeFlex-Utilities mehr.
Neue Layouts und Utility-Klassen sollen mit Tailwind CSS umgesetzt werden.

Bestehende komponentenspezifische `.scss`-Dateien können weiterhin verwendet werden.
Anpassungen sind nur erforderlich, wenn dort PrimeFlex-Klassen direkt verwendet oder nachgebildet wurden.

### Widgets-Bibliothek lokal an ein neues Projekt anbinden

Im Root-Verzeichnis des Projekts wird durch den nachstehenden Shortcut-Befehl aus der `package.json` die Widgets-Bibliothek gebaut und anschließend verpackt:

```shell
npm run build-and-pack:widgets_lib
```

Dadurch wird im Verzeichnis `dist/isy-angular-widgets` eine TGZ-Datei der Bibliothek erzeugt, zum Beispiel:

```text
dist/isy-angular-widgets/isyfact-isy-angular-widgets-0.0.0.tgz
```

Im nächsten Schritt erfolgt die Installation dieser Bibliothek in einem neuen Angular-Projekt. Hierfür wird der Pfad zur TGZ-Datei benötigt. Im Root-Verzeichnis des neuen Angular-Projekts ist der folgende Befehl auszuführen:

**Angular 21:**
```shell
npm install "file:[WIDGETS_LIB_PATH].tgz"
```

**Angular 22** (wegen PrimeNG-21-Peer-Dependency-Konflikten):
```shell
npm install "file:[WIDGETS_LIB_PATH].tgz" --legacy-peer-deps
```

Nach der Installation kann die Schematic der Bibliothek ausgeführt werden:

```shell
ng generate @isyfact/isy-angular-widgets:ng-add
```

Der direkte Aufruf von `ng add` auf die lokale TGZ-Datei sollte nicht verwendet werden, da Angular CLI bei lokalen Paketdateien die Paketinformationen unter Umständen nicht korrekt auslesen kann.

#### Hinweis bei Verwendung mit Angular 22

Die Bibliothek unterstützt Angular 21 und Angular 22.
Da PrimeNG 21 offiziell für Angular 21 entwickelt wurde, meldet `npm` bei Angular-22-Projekten einen Peer-Dependency-Konflikt.

Die Schematic überspringt in diesem Fall den automatischen Package-Install und gibt stattdessen einen Hinweis aus.
Anschließend muss die Installation manuell ausgeführt werden:

```shell
npm install --legacy-peer-deps
```

Diese Option weist `npm` an, Peer-Dependency-Konflikte zu ignorieren.
Die Kombination aus Angular 22 und PrimeNG 21 ist im geprüften Projektumfang lauffähig, stellt jedoch keine offiziell deklarierte Versionskombination dar.
Einzelne PrimeNG-Komponenten sollten in der eigenen Anwendung zusätzlich getestet werden.

Eine zusätzliche Aktivierung von Angular-Animationen über `provideAnimations`, `provideAnimationsAsync` oder `BrowserAnimationsModule` ist für Angular 21 und PrimeNG 21 nicht mehr erforderlich. Angular hat die bisherigen Animation-Provider als deprecated markiert. PrimeNG 21 verwendet native CSS-Animationen.

Falls ein Projekt weiterhin eigene Legacy-Animationen aus `@angular/animations` verwendet, muss dies projektbezogen geprüft und perspektivisch auf native CSS-Animationen migriert werden.

### Demo-Anwendung starten

Neben den Widgets können in der Demo-Anwendung praktische Beispiele für die Umsetzung von Styleguide-Patterns oder querschnittlichen Aspekten betrachtet werden.
Die Demo-Anwendung kann mit folgendem Befehl gestartet werden:

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

### Browser-Hinweis

Tailwind CSS v4 setzt moderne Browser voraus.
Vor der Entwicklung oder Migration sollte geprüft werden, ob die Browser-Anforderungen des Projekts damit vereinbar sind.

### Prettier für Demo-Anwendung und Widgets-Bibliothek ausführen

Zur Überprüfung der Demo-Anwendung und der Widgets-Bibliothek auf Code-Formatierungsfehler mithilfe von Prettier kann folgender Befehl ausgeführt werden:

```shell
npm run prettier:check
```
Um Code-Formatierungsfehler innerhalb der Demo-Anwendung und der Widgets-Bibliothek mithilfe von Prettier zu beheben, kann folgender Befehl ausgeführt werden:

```shell
npm run prettier:fix
```

### E2E-Tests für Demo-Anwendung ausführen

Für die Demo-Anwendung wurden exemplarisch einige E2E-Tests mit dem Framework [TestCafe](https://testcafe.io/) umgesetzt.
Um die Tests auszuführen, muss zunächst die Demo-Anwendung gestartet werden (siehe oben).
Für die Ausführung der Tests wird der Webbrowser Chrome benötigt, alternativ kann das `e2e`-Skript angepasst und dort ein anderer Browser eingetragen werden.
Die Tests werden mit folgendem Befehl gestartet.

```shell
npm run e2e
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
