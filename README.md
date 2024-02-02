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

1. Öffnen isy-angular-widgets.
2. Im Root-Verzeichnis des Projekts "npm run build-and-pack:widgets_lib" ausführen. Dieser Schritt ist erforderlich, um die Bibliothek zu packen. Unter Windows kann es aufgrund von Pfadproblemen zu Fehlern kommen, die so vermieden werden. Unter Linux treten diese Probleme üblicherweise nicht auf.
3. Navigation zum Pfad "/isy-angular-widgets/dist/isy-angular-widgets/isyfact-isy-angular-widgets-0.0.0.tgz" und Pfad kopieren
4. Neues Angular17-Projekt anlegen.
5. Im Root-Verzeichnis des neuen Angular-Projekts "ng add /pathToWidgets/isy-angular-widgets/dist/isy-angular-widgets/isyfact-isy-angular-widgets-0.0.0.tgz" ausführen (kopierter Pfad von Schritt 3).
6. In `app.config.ts` die Methode `provideAnimations` importieren und bereitstellen.
7. Applikation starten.
8. Aus isy-angular-widgets ein beliebiges Widget integrieren. Die Widgets können nun direkt in Standalone-Komponenten importiert werden.

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
2. In den Dateien primeng-sass-theme/themes/bootstrap4/bootstrap4-light/_variables_light.scss und primeng-sass-theme/themes/bootstrap4/bootstrap4-light/blue/_variables.scss folgende Properties-Variablen anpassen:

#### Datei _variables_light.scss
| Properties-Variablen     | Wert                                     | 
|--------------------------|------------------------------------------|
| *reused color variables* |                                          |                   
| $shade200                | #cce3ec                                  |
| *global*                 |                                          |
| $fontFamily              | BundesSans,'Liberation Sans',sans-serif  |
| $textColor               | $shade700                                |
| $textSecondaryColor      | $shade700                                |
| $borderRadius            | 0px                                      |
| $disabledOpacity         | .75                                      |
| *input field*            |                                          |
| $inputFocusBorderColor   | $highlightBg                             |
| *button*                 |                                          |
| $secondaryButtonBg       | $primaryColor                            |
| * :root*                 |                                          |
| font-family              | BundesSans,'Liberation Sans',sans-serif; |
| --font-family            | BundesSans,'Liberation Sans',sans-serif; |

#### _variables.scss
| Properties-Variablen     | Wert                     | 
|--------------------------|--------------------------|
| $primaryColor            | #45484d                  |
| $primaryDarkColor        | #89909a                  |
| $primaryDarkerColor      | #89909a                  |
| $highlightBg             | #cce3ec                  |
| $highlightTextColor      | #495057                  |
| $highlightFocusBg        | darken($highlightBg, 8%) |


3. Sass installieren: `npm install -g sass` 
4. CSS-Theme generieren im Ordner primeng-sass-theme/themes/bootstrap4/bootstrap4-light/blue mit `sass --update theme.scss:isyfact-primeng-bootstrap-light.css --style=compressed`
6. In der Widgets-Library die Datei isy-angular-widgets/projects/isy-angular-widgets/assets/theme/isyfact-primeng-bootstrap-light.css mit der neu generierten Datei ersetzen.

## Erstellen von Releases

Releases werden mithilfe einer GitHub Action erzeugt, welche immer dann ausgeführt wird, wenn ein Tag mit einer gültigen Versionsnummer nach Semver erstellt wird.
Diese Versionsnummer wird dann automatisch in die package.json der gebauten Bibliothek ausgetauscht.
Das bedeutet, die Versionsnummer muss nicht manuell in der package.json des Projekts gepflegt werden (Dort steht einfach 0.0.0).
