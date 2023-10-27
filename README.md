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
4. Neues Angular-Projekt anlegen (npm install wird ausgeführt)
5. Umgehen auf root directory und Ausführung von "ng add /pathToWidgets/isy-angular-widgets/dist/isy-angular-widgets" (kopierter Pfad von Schritt 3)
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
Da der PrimeNG Theme-Designer als Open-Source zur Verfügung steht, wird die aktuelle PrimeNG Designer-Webseite kein Update mehr erhalten. 
Der Theme-Designer ist nur noch bis zur Version 15.4.1 verfügbar.
Momentan wird an einer erweiterten Version des Theme-Designers, dem Advanced-Theme-Editor, gearbeitet. 
Nach der Roadmap von PrimeNG (https://primeng.org/roadmap) ist die Veröffentlichung für Q4 2023 geplant.
Bis dahin wird auf der Designer-Website auf das PrimeNG Sass-Theme verwiesen, um auf die aktuelle Theming-API für weitere Anpassungsoptionen zuzugreifen.

Damit das Isyfact-Theme mit den neuen Bausteinen kompatibel bleibt, sind die untenstehenden Schritte erforderlich um die globalen Styles (isyfact-primeng-bootstrap-light.css) zu generieren.

Als Basis-Theme wird _Bootstrap4 Light Blue_ verwendet.

1. Das Repo primeng-sass-theme von https://github.com/primefaces/primeng-sass-theme klonen
2. In den Dateien primeng-sass-theme/themes/bootstrap4/bootstrap4-light/_variables_light.scss und primeng-sass-theme/themes/bootstrap4/bootstrap4-light/blue/_variables.scss folgende Properties-Variablen angepassen:

| Properties-Variablen      | Wert               | 
|---------------------------|--------------------|
| *reused color variables*  |                    |                   
| $shade200:                | #cce3ec            |
| *global*                  |                    |
| $textColor                | $shade700          |
| $textSecondaryColor       | $shade700          |
| $borderRadius             | 0px                |
| $disabledOpacity          | .75                |
| *Palette*                 |                    |
| $primaryColor             | #45484d            |
| $primaryDarkColor         | #89909a            |
| $primaryDarkerColor       | #89909a            |
| $highlightBg              | #cce3ec            |
| $highlightTextColor       | #495057            |
| *input field*             |                    |
| $inputFocusBorderColor    | $highlightBg       |
| *button*                  |                    |
| $secondaryButtonBg        | $primaryColor      |

3. Sass installieren: npm install -g sass
4. CSS-Theme generieren: Umgehen auf primeng-sass-theme/themes/bootstrap4/bootstrap4-light/blue und sass --update theme.scss:isyfact-primeng-bootstrap-light.css ausführen
5. In der Datei primeng-sass-theme/themes/bootstrap4/bootstrap4-light/blue/isyfact-primeng-bootstrap-light.css in Zeile 2 und 3 die Font-Family in "BundesSans,'Liberation Sans',sans-serif" ändern
6. In der Widgets-Library die Datei isy-angular-widgets/projects/isy-angular-widgets/assets/theme/isyfact-primeng-bootstrap-light.css mit der neu generierten Datei ersetzen und anschließend minifizieren.

## Erstellen von Releases

Releases werden mithilfe einer GitHub Action erzeugt, welche immer dann ausgeführt wird, wenn ein Tag mit einer gültigen Versionsnummer nach Semver erstellt wird.
Diese Versionsnummer wird dann automatisch in die package.json der gebauten Bibliothek ausgetauscht.
Das bedeutet, die Versionsnummer muss nicht manuell in der package.json des Projekts gepflegt werden (Dort steht einfach 0.0.0).
