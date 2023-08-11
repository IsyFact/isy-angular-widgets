# isy-angular-widgets

[![Node.js CI](https://github.com/IsyFact/isy-angular-widgets/actions/workflows/node.js.yml/badge.svg)](https://github.com/IsyFact/isy-angular-widgets/actions/workflows/node.js.yml)

`isy-angular-widgets` ist eine Widget-Bibliothek, welche Behördenspezifische Komponenten auf Basis von [PrimeNG](https://www.primefaces.org/primeng/) bereitstellt.
Die Bibliothek stellt zudem ein IsyFact Theme bereit, welches sich nach den Richtlinien für Design und Barrierefreiheit des Bundes orientiert.

Zusätzlich beinhaltet das Projekt die Beispielanwendung `isy-angular-widget-demo`, welche praktische Beispiele für die Umsetzung von Patterns des Styleguide sowie querschnittliche Beispiele enthält.

## Getting Started

Mit folgendem Befehl wird die Bibliothek `isy-angular-widgets` zu einem bestehenden Angular Projekt hinzugefügt.

```
$ ng add @isyfact/isy-angular-widgets
```

Die Schematics führt folgende Schritte aus:
- Hinzufügen und Installation der Bibliothek und der notwendigen Abhängigkeiten
- Hinzufügen der Stylesheets der IsyFact
- Hinzufügen der Übersetzungsdateien für die Bibliothek und PrimeNG in deutscher und englischer Sprache

## I18N

Eine Übersetzung der PrimeNG- und Widget-Bibliothek-Komponenten wird mit Hilfe der PrimeNGConfig- und WidgetsConfigService-Instanz durgeführt.

PrimeNGConfig:
Für die Übersetzung der PrimeNG-Komponenten muss PrimeNGConfig von primeng/api importiert und über Dependency Injection injiziert werden.
Ein üblicher Ort ist das Stammverzeichnis der Anwendung, um die von den Komponenten verwendete Standardsprache zu initialisieren.
Englisch ist die Standardsprache und die Funktion setTranslation wird verwendet, um die Werte zu ändern, indem ein Übersetzungsobjekt übergeben wird. Die Verwendung von PrimeNGConfig kann in der offiziellen PrimeNG-Dokumentation (https://www.primefaces.org/primeng-v14-lts/i18n) zu i18n nachgelesen werden.

WidgetsConfigService:
Für die Übersetzung der Widget-Bibliothek-Komponenten muss WidgetsConfigService von isy-angular-widgets/src/lib/i18n/widgets-config.service importiert und über Dependency Injection injiziert werden.
Deutsch ist die Standardsprache. Die Funktion setTranslation des WidgetsConfigService wird verwendet, um die Werte zu ändern, indem ein Übersetzungsobjekt übergeben wird.

## Development Setup

### Prerequisites

Auf dem PC müssen die neueste [Node und Npm LTS Version](https://nodejs.org/en/download/) installiert sein.


Anschließend muss das Projekt aus GitHub bezogen werden

```shell
git clone https://github.com/IsyFact/isy-angular-widgets.git
cd isy-angular-widget
```

### Dependencies Installieren

Vor der ersten Ausführung, bzw. beim Ergänzen neuer Pakete muss das Projekt mit folgendem Befehl installiert werden.

```shell
npm install
```

### Demo Anwendung starten

Neben den Widgets können in der Demo Anwendung praktische Beispiele für die Umsetzung von Styleguide Patterns oder querschnittlichen Aspekten betrachtet werden.
Die Demo Anwendung kann mit folgendem Befehl gestartet werden. 

```
$ npm run start
```

#### E2E Tests für Demoanwendung ausführen

Für die Demoanwendung wurden exemplarisch einige E2E-Tests mit dem Framework [TestCafe](https://testcafe.io/) umgesetzt.
Um die Tests auszuführen, muss zunächst die Demoanwendung gestartet werden (siehe oben).
Für die Ausführung der Tests wird der Webbrowser Chrome benötigt, alternativ kann das `e2e` Skript angepasst und dort ein anderer Browser eingetragen werden.
Die Tests werden mit folgendem Befehlt gestartet.

```
$ npm run e2e
```

### PrimeNG Designer
Die globalen Styles (isyfact-primeng-bootstrap-light.css) werden vom [PrimeNG Theme Designer](https://designer.primeng.org/#/) generiert.


Als Basis Theme wird _Bootstrap Light_ verwendet.
Für das aktuelle Theme wurden folgende Einstellungen im PrimeNG Theme Designer verwenden:

| Einstellungen        | Wert                          | 
|----------------------|-------------------------------|
| *General*            |                               |
| Font Family          | BundesSans,Calibri,sans-serif |
| Text                 | 73, 80, 87                    |
| Border Radius        | 0px                           |
| *Palette*            |                               |
| Primary              | 69, 72, 77                    |
| Primary Dark         | 137, 144, 154                 |
| Primary Darker       | 137, 144, 154                 |
| Highlight Background | 204, 227, 236                 |
| Text on Highlight    | 73, 80, 87                    |
| *Forms*              |                               |
| Focus Border         | 204, 227, 236                 |
