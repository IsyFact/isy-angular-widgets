<h1 align="center">
  <a href="https://www.bva.bund.de/DE/Das-BVA/Aufgaben/I/Informationstechnik/IsyFact/isyfact_node.html">
    <img src=".github/assets/logo-isyfact.jpg" alt="IsyFact" width="340">
  </a>
</h1>

<p align="center">
  <strong>isy-angular-widgets</strong> – Widget-Bibliothek für Angular-Anwendungen der öffentlichen Verwaltung
</p>

<p align="center">
  <a href="https://github.com/IsyFact/isy-angular-widgets/actions/workflows/node.js.yml">
    <img src="https://github.com/IsyFact/isy-angular-widgets/actions/workflows/node.js.yml/badge.svg" alt="Node.js CI">
  </a>
  <a href="https://www.npmjs.com/package/@isyfact/isy-angular-widgets">
    <img src="https://img.shields.io/npm/v/@isyfact/isy-angular-widgets" alt="npm-Version">
  </a>
</p>

<p align="center">
  <a href="CONTRIBUTING.md">Contributing Guidelines</a>
</p>

---

## Zielgruppe

Diese Datei richtet sich an Entwicklerinnen und Entwickler, die **den Baustein selbst weiterentwickeln**. Sie beschreibt den Einstieg in das Repository: Aufbau, lokales Setup, Skripte und Qualitätssicherung.

> **Du möchtest die Bibliothek in einer eigenen Anwendung verwenden?**
> Dann ist die [README der Bibliothek](projects/isy-angular-widgets/README.md) der richtige Einstieg. Dort stehen Installation, Konfiguration und die Dokumentation der einzelnen Widgets.
> Hinweise zu Breaking Changes zwischen zwei Versionen enthält die [MIGRATION.md](projects/isy-angular-widgets/MIGRATION.md).

## Repository-Struktur

Das Repository ist ein Angular-Workspace mit zwei Projekten:

| Projekt | Pfad | Typ | Zweck |
|---|---|---|---|
| `isy-angular-widgets` | `projects/isy-angular-widgets` | Library | Die Widget-Bibliothek. Wird als npm-Paket [`@isyfact/isy-angular-widgets`](https://www.npmjs.com/package/@isyfact/isy-angular-widgets) veröffentlicht. |
| `isy-angular-widgets-demo` | `projects/isy-angular-widgets-demo` | Application | Demo-Anwendung mit Beispielen für Styleguide-Patterns. Wird auf [GitHub Pages](https://isyfact.github.io/isy-angular-widgets/) deployed. |

Ergänzend relevant:

```text
├── .github/workflows/   CI-Pipelines (Build, Test, Pages-Deploy, npm-Publish)
├── docs/                Antora-Konzeptdokumentation
├── tools/               Hilfsskripte für Build und Pages-Deployment
├── CHANGELOG.md         Änderungen je Version
└── CONTRIBUTING.md      Branch-Modell, Commit-Konventionen, Pull Requests
```

Die Demo-Anwendung wird für beide unterstützten Versionslinien veröffentlicht:

| Inhalt | URL |
|---|---|
| Demo (aktuelle Linie) | <https://isyfact.github.io/isy-angular-widgets/> |
| API-Dokumentation (Compodoc) | <https://isyfact.github.io/isy-angular-widgets/documentation/> |
| Demo (ältere Linie) | <https://isyfact.github.io/isy-angular-widgets/v21/> |

## Erste Schritte

### Voraussetzungen

Das Projekt setzt die in der `package.json` unter `engines` definierte Node.js-Version voraus. Die CI baut und testet mit Node.js 24.

### Repository klonen und Abhängigkeiten installieren

```shell
git clone https://github.com/IsyFact/isy-angular-widgets.git
cd isy-angular-widgets
npm install
```

Die Abhängigkeiten müssen auch nach dem Ergänzen neuer Pakete erneut installiert werden.

### Demo-Anwendung starten

Die Demo-Anwendung ist der schnellste Weg, Änderungen an der Bibliothek sichtbar zu machen:

```shell
npm run start
```

## npm-Skripte

| Skript | Beschreibung |
|---|---|
| `npm run start` | Startet die Demo-Anwendung im Development-Server |
| `npm run watch` | Baut die Bibliothek im Watch-Modus |
| `npm run build` | Baut Bibliothek, Demo-Anwendung und Schematics |
| `npm run build:widgets_lib` | Baut ausschließlich die Bibliothek inklusive Schematics |
| `npm run build:widgets_demo` | Baut ausschließlich die Demo-Anwendung |
| `npm run build-and-pack:widgets_lib` | Baut die Bibliothek und erzeugt ein installierbares TGZ-Paket |
| `npm test` | Führt die Unit- und Integrationstests aus |
| `npm run lint` | Lintet Bibliothek und Demo-Anwendung (`lint:lib`, `lint:demo` einzeln) |
| `npm run prettier:check` | Prüft die Codeformatierung |
| `npm run prettier:fix` | Behebt Formatierungsfehler automatisch |
| `npm run e2e` | Führt die E2E-Tests der Demo-Anwendung aus |
| `npm run compodoc:build` | Erzeugt die API-Dokumentation (`compodoc:serve` zeigt sie lokal an) |
| `npm run generate-browser-support` | Aktualisiert die Browser-Support-Konfiguration |

## Qualitätssicherung

Die folgenden Prüfungen entsprechen den zentralen Schritten der CI-Pipeline und sollten vor jedem Pull Request lokal fehlerfrei durchlaufen:

```shell
npm run prettier:check
npm run lint
npm test
npm run build:widgets_lib
npm run build:widgets_demo
```

Zusätzlich führt die CI einen Compodoc-Build, eine SBOM-Erzeugung und einen SonarCloud-Scan aus.

> Pull Requests, welche die CI-Checks nicht erfüllen, werden ungesichtet abgelehnt. Details dazu stehen in der [CONTRIBUTING.md](CONTRIBUTING.md).

### E2E-Tests

Für die Demo-Anwendung sind exemplarisch einige E2E-Tests mit [TestCafe](https://testcafe.io/) umgesetzt. Vor der Ausführung muss die Demo-Anwendung gestartet werden. Benötigt wird der Browser Chrome; alternativ kann im `e2e`-Skript ein anderer Browser eingetragen werden.

```shell
npm run e2e
```

## Bibliothek lokal in einem anderen Projekt testen

Um einen Entwicklungsstand vor dem Release in einer echten Anwendung zu prüfen, wird die Bibliothek gebaut und als TGZ-Paket verpackt:

```shell
npm run build-and-pack:widgets_lib
```

Das Paket liegt anschließend unter `dist/isy-angular-widgets`, zum Beispiel:

```text
dist/isy-angular-widgets/isyfact-isy-angular-widgets-0.0.0.tgz
```

Im Zielprojekt wird das Paket über den Pfad zur TGZ-Datei installiert:

```shell
npm install "file:[WIDGETS_LIB_PATH].tgz"
```

Unter Angular 22 ist wegen der Peer-Dependencies von PrimeNG 21 zusätzlich `--legacy-peer-deps` erforderlich:

```shell
npm install "file:[WIDGETS_LIB_PATH].tgz" --legacy-peer-deps
```

Anschließend kann die Schematic der Bibliothek ausgeführt werden:

```shell
ng generate @isyfact/isy-angular-widgets:ng-add
```

> **Hinweis:** `ng add` sollte nicht direkt auf die lokale TGZ-Datei angewendet werden, da die Angular CLI die Paketinformationen lokaler Dateien unter Umständen nicht korrekt ausliest.

Hintergründe zur Versionskombination aus Angular 22 und PrimeNG 21 stehen in der [MIGRATION.md](projects/isy-angular-widgets/MIGRATION.md).

## Wartungsaufgaben

### Browser-Support-Konfiguration generieren

Die unterstützten Mindest-Browser-Versionen sind statisch in der Bibliothek hinterlegt:

```text
projects/isy-angular-widgets/src/lib/browser-support/browser-support.config.json
```

Die Datei wird über folgendes Skript erzeugt:

```shell
npm run generate-browser-support
```

Das Skript ermittelt die Browser-Versionen anhand der Browser-Support-Regeln des aktuellen Angular-Major-Releases. Die generierte Datei ist Bestandteil der Bibliothek und muss eingecheckt werden. Nach einem Update auf ein neues Angular-Major-Release ist das Skript erneut auszuführen.

Die `HauptfensterComponent` wertet diese Konfiguration beim Laden der Anwendung aus und zeigt bei einer nicht unterstützten Browser-Version eine Warnmeldung an. Die Prüfung ist standardmäßig aktiviert und lässt sich über das Input-Property `checkBrowserVersion` deaktivieren:

```html
<isy-hauptfenster [checkBrowserVersion]="false">
  <!-- Anwendungscode -->
</isy-hauptfenster>
```

## Releases erstellen

Releases werden über eine GitHub Action erzeugt, die ausgeführt wird, sobald ein Tag mit einer gültigen Versionsnummer nach SemVer erstellt wird. Die Versionsnummer wird dabei automatisch in die `package.json` der gebauten Bibliothek eingetragen.

Die Versionsnummer muss deshalb **nicht** manuell in der `package.json` gepflegt werden – dort steht dauerhaft `0.0.0`.

Die Vorbereitung eines Releases erfolgt über einen Branch nach dem Schema `release/<planned-version>`. Details dazu stehen in der [CONTRIBUTING.md](CONTRIBUTING.md).

## Weiterführende Dokumentation

| Dokument | Inhalt |
|---|---|
| [CONTRIBUTING.md](CONTRIBUTING.md) | Branch-Modell, Commit-Konventionen, Pull Requests |
| [README der Bibliothek](projects/isy-angular-widgets/README.md) | Verwendung der Bibliothek in eigenen Anwendungen |
| [MIGRATION.md](projects/isy-angular-widgets/MIGRATION.md) | Breaking Changes und Migrationshinweise je Version |
| [CHANGELOG.md](CHANGELOG.md) | Vollständige Liste aller Änderungen |
| [Konzept Angular](https://isyfact.github.io/isy-angular-widgets-doc/current/konzept/konzept.html) | Konzeptdokumentation der Bibliothek |

## Lizenz

Veröffentlicht unter der [Apache-2.0-Lizenz](LICENSE).
