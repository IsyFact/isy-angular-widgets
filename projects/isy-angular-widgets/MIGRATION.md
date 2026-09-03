# Migration von Version 21 auf Version 22

## Überblick

- Bibliothek und Demo-Anwendung wurden von Angular 21 auf **Angular 22** migriert.
- **PrimeNG bleibt bewusst auf Version 21.** PrimeNG 22 und höher werden nicht mehr unter der MIT-Lizenz, sondern unter dem PrimeUI-Lizenzmodell veröffentlicht. Ein Upgrade wurde daher aus Lizenz- und Kostengründen zurückgestellt.
- PrimeFlex wurde vollständig durch **Tailwind CSS v4** ersetzt.
- Der Build- und Test-Stack wurde auf die Builder aus `@angular/build` umgestellt.
- Die Peer-Dependencies der Bibliothek unterstützen Angular 21 **und** Angular 22; ein sofortiger Wechsel auf Angular 22 ist nicht erforderlich.
- Die öffentliche Widget-API wurde nicht grundlegend verändert. Es wurden keine Komponenten, Direktiven oder Services entfernt oder umbenannt.

## Breaking Changes

### Angular- und Tooling-Upgrade auf Version 22

Die zentralen Angular-Pakete wurden auf `^22.0.5` angehoben, TypeScript auf `~6.0.3` und `ng-packagr` auf `22.0.1`. Angular CLI und Angular ESLint wurden auf die 22er-Linie aktualisiert.

**Auswirkung:** Primär für Maintainer sowie die CI-/Build-Infrastruktur relevant. Ältere Node.js-, TypeScript- oder Tooling-Versionen sind mit Angular 22 nicht mehr kompatibel. Bestehende Build-Skripte, CI-Images oder projektspezifische Tooling-Integrationen können Anpassungen benötigen.

**Migration:**

- Lokale Node.js-Version und CI-Images auf eine mit Angular 22 kompatible Version aktualisieren.
- Eigene Build-Skripte, Builder-Optionen und Build-Hooks auf Kompatibilität mit `@angular/build` prüfen.
- Nach dem Update Library-Build, Anwendungs-Build und Tests vollständig ausführen.

### Builder-Wechsel auf `@angular/build`

Build, Development-Server, Übersetzungsextraktion und Tests verwenden nun die Builder aus `@angular/build` statt der bisherigen Devkit-Builder:

| Ziel                | Builder                          |
|---------------------|----------------------------------|
| Bibliothek (Build)  | `@angular/build:ng-packagr`      |
| Bibliothek (Test)   | `@angular/build:karma`           |
| Anwendung (Build)   | `@angular/build:application`     |
| Anwendung (Serve)   | `@angular/build:dev-server`      |
| Anwendung (i18n)    | `@angular/build:extract-i18n`    |
| Anwendung (Test)    | `@angular/build:karma`           |

**Auswirkung:** Unterstützte Optionen und das Verhalten der Builder können von den bisherigen Devkit-Buildern abweichen. Build-Artefakte, statische Ressourcen und Medien werden unter dem neuen Build-System teilweise anders verarbeitet. Integrationen, die direkt oder indirekt vom bisherigen Devkit-Builder abhängen, müssen überprüft werden.

**Migration:**

- Individuelle Optionen und Overrides in der `angular.json` gegen das Schema von `@angular/build` prüfen.
- Bei Font- oder Asset-404 in Tests Asset-Mappings für die Font-Verzeichnisse ergänzen (z. B. `node_modules/primeicons/fonts` → `media`) und in der Development-Konfiguration `outputHashing: media` setzen.

### PrimeFlex entfernt – Umstellung auf Tailwind CSS v4

Die Bibliothek verwendet keine PrimeFlex-Utilities mehr. Für Utility-Klassen wird **Tailwind CSS v4** eingesetzt, für die PrimeNG-Integration zusätzlich `tailwindcss-primeui`.

**Auswirkung:** Breaking Change auf Styling- und Template-Ebene. Anwendungen, die PrimeFlex-Klassen direkt in Templates oder Styles verwenden, müssen diese auf Tailwind-Utilities umstellen. Betroffen sind insbesondere Layout-, Spacing- und Flex-Utilities (z. B. `grid`, `col-*`, `p-mt-*`, `p-d-flex`, `p-jc-*`, `p-ai-*`). Es wurden keine öffentlichen TypeScript-APIs entfernt. Komponentenspezifische `.scss`-Dateien bleiben nutzbar, sofern dort keine PrimeFlex-Klassen verwendet oder nachgebildet wurden.

**Migration:**

- Tailwind im Zielprojekt einbinden (inklusive `@tailwindcss/postcss` und `tailwindcss-primeui`).
- PrimeFlex-Klassen schrittweise durch Tailwind-Utilities ersetzen. Typische Klassen-Mappings und Einbindungsbeispiele stehen im Abschnitt "Migration von PrimeFlex auf Tailwind CSS" der [README](./README.md).
- Betroffene Formulare, Layouts und responsive Ansichten nach der Umstellung gezielt visuell und funktional prüfen.

### PrimeNG verbleibt auf Version 21

PrimeNG wurde nicht gemeinsam mit Angular aktualisiert. Die eingesetzte Kombination lautet **Angular 22 + PrimeNG 21**.

**Auswirkung:** PrimeNG 21 deklariert Peer-Dependencies auf die Angular-21-Generation (Core, Common, Forms, Router, Platform Browser, CDK). Angular 22 und PrimeNG 21 sind daher keine offiziell deklarierte Versionskombination. Bei der Installation können Peer-Dependency-Warnungen oder – abhängig von der npm-Version – Installationsfehler auftreten.

**Migration:**

- Installation gegebenenfalls mit `npm install --legacy-peer-deps` durchführen. Das Umgehen der Konflikte bestätigt jedoch **keine** technische Kompatibilität und kann reale Versionsprobleme verdecken.
- Angular-, PrimeNG- und Angular-CDK-Versionen im Lockfile eindeutig festschreiben und keine unkontrollierten Major- oder Minor-Updates zulassen.
- Die tatsächlich verwendeten PrimeNG-Komponenten in der eigenen Anwendung testen (siehe [Bekannte Einschränkungen und Risiken](#bekannte-einschränkungen-und-risiken)).

### Change Detection: `ChangeDetectionStrategy.Eager` statt `Default`

Angular 22 verwendet für Komponenten standardmäßig `OnPush`. Betroffene Komponenten der Bibliothek wurden deshalb explizit auf `ChangeDetectionStrategy.Eager` gesetzt, um das bisherige Verhalten beizubehalten.

**Auswirkung:** `ChangeDetectionStrategy.Default` ist in Angular 22 nur noch ein veralteter Alias für `Eager`. In eigenen Komponenten, die bislang implizit auf die vollständige Prüfung angewiesen waren, kann sich das Aktualisierungsverhalten unter Angular 22 ändern.

**Migration:**

- Eigene Komponenten, die auf vollständige Change-Detection-Durchläufe angewiesen sind, explizit auf `ChangeDetectionStrategy.Eager` setzen.
- Eine Umstellung auf `OnPush` pro Komponente bewerten – ein pauschaler Wechsel kann bei komplexen Interaktionen zu Verhaltensänderungen führen.
- Test-Setups und Provider-Konfigurationen an die geänderten Rahmenbedingungen anpassen.

## Bibliothek

### Peer-Dependencies auf Angular 21 und 22 erweitert

```json
{
  "peerDependencies": {
    "@angular/common": "^21.1.4 || ^22.0.0",
    "@angular/core": "^21.1.4 || ^22.0.0",
    "@primeuix/themes": "^2.0.3",
    "primeng": "^21.1.3",
    "primeicons": "^7.0.0",
    "tailwindcss": "^4.0.0",
    "tailwindcss-primeui": "^0.6.1"
  }
}
```

Bestehende Angular-21-Consumer müssen **nicht** unmittelbar auf Angular 22 migrieren. Die erweiterte Peer-Dependency bedeutet nicht, dass PrimeNG 21 Angular 22 offiziell unterstützt – die Kompatibilitätsaussage gilt nur für die im Projekt verwendeten und getesteten Komponenten. Die Verwendung der Bibliothek zusammen mit PrimeNG 22 ist nicht Bestandteil dieser Migration.

### `ng-add`-Schematik

- Die Schematik trägt für `@angular/common` und `@angular/core` die Angular-22-Linie (`^22.0.0`) in Zielprojekte ein; die ergänzten Angular-ESLint-Pakete wurden ebenfalls auf die 22er-Linie angehoben.
- In erkannten Angular-22-Projekten überspringt die Schematik den automatischen `npm install`, da dieser wegen der PrimeNG-21-Peer-Dependencies mit `ERESOLVE` fehlschlägt. Stattdessen wird ein Hinweis ausgegeben, dass `npm install --legacy-peer-deps` **manuell** auszuführen ist. Für Angular 21 bleibt das bisherige Verhalten mit automatischem Install erhalten.
- Das Schematics-Paket wird als CommonJS ausgeliefert (`schematics/package.json` mit `"type": "commonjs"`), da die Library-Bundles als ESM veröffentlicht werden. Ohne diese Trennung schlug `ng generate @isyfact/isy-angular-widgets:ng-add` mit `exports is not defined in ES module scope` fehl.

### Bugfix im veröffentlichten Bundle

Ein interner Self-Import über den nicht auflösbaren Subpath `@isy-angular-widgets/public-api` in `input-char-dialog.component.ts` wurde durch einen relativen Import ersetzt. Dieser Verweis führte im Consumer-Build (Vite/esbuild) zu `Could not resolve "@isy-angular-widgets/public-api"`.

## Werkzeuge und Konfiguration (Maintainer/CI)

Die folgenden Punkte betreffen ausschließlich die Weiterentwicklung des Repositories und sind für Library-Consumer nicht migrationsrelevant:

- **ESLint:** Die Flat-Config in `eslint.config.js` wurde an die exportierte Paketstruktur von Angular ESLint 22 angepasst. Veraltete Zugriffe auf `angular.configs.recommended.rules` bzw. `angularTemplate.configs.recommended.rules` führten sonst zu `Cannot read properties of undefined (reading 'recommended')`.
- **Schematics-TSConfig:** `baseUrl` entfernt, `module` und `moduleResolution` auf `node16` gesetzt, um TS6-Deprecation-Fehler im Schematics-Build zu vermeiden.
- **Extended Diagnostics:** `nullishCoalescingNotNullable` und `optionalChainNotNullable` wurden auf `suppress` gesetzt. Die allgemeine TypeScript-Typprüfung bleibt aktiv; die Suppressions sind nach weiteren Angular-22-Anpassungen erneut zu bewerten.
- **Karma-Builder:** Bei Testläufen mit `@angular/build:karma` können weiterhin 404-Warnungen für Font-Dateien (`primeicons.woff2`, `LiberationSans-Regular.woff2`) im Web-Server-Log erscheinen. Ursache ist das Zusammenspiel aus CSS-`url()`-Auflösung und dem virtuellen Karma-Dateisystem. Die Tests laufen davon unbeeinflusst erfolgreich durch.

## Bekannte Einschränkungen und Risiken

Die Kombination aus Angular 22 und PrimeNG 21 ist im geprüften Projektumfang lauffähig; es sind keine blockierenden Build-, Test- oder Laufzeitprobleme bekannt. Eine vollständige Kompatibilitätsgarantie besteht jedoch nicht. Das kurzfristige technische Risiko wird als **mittel** bewertet.

- **Build- und Compiler-Inkompatibilitäten:** Angular 22 verwendet eine neuere Compiler-, Builder- und TypeScript-Version, als für PrimeNG 21 vorgesehen. Template-, Typ- oder Metadatenfehler können auch erst durch spätere Angular-22-Patch- oder Minor-Updates sichtbar werden.
- **Laufzeitfehler:** Fehler können erst bei konkreten Benutzerinteraktionen auftreten und deshalb von Build- und Unit-Tests unentdeckt bleiben. Besonders relevant sind Dialoge, Overlays, Dropdowns/Selects, Autocomplete, Tabellen, DatePicker, Menüs, Tooltips und dynamisch geladene Komponenten. Typische Fehlerbilder sind nicht aktualisierte Komponenten, falsch positionierte oder nicht schließende Overlays, ausbleibende Events, unzuverlässige Fokussteuerung sowie abweichende Styles oder Animationen.
- **Angular-CDK-Versionskonflikte:** PrimeNG 21 erwartet ein CDK aus der Angular-21-Generation. Sowohl CDK 21 mit Core 22 als auch CDK 22 mit PrimeNG 21 ergeben eine gemischte Konstellation. Betroffen sein können Overlays, Fokussteuerung, Accessibility, Portals, Drag-and-Drop und dynamische Positionierung. Die eingesetzte CDK-Version ist zu dokumentieren und bei jedem Update erneut zu validieren.
- **Testabdeckung:** Automatisierte Tests decken nicht alle Zustände und Interaktionen ab – insbesondere Tastaturbedienung, responsive Darstellung, Formularvalidierung, dynamische Inhalte, komplexe Tabelleninteraktionen, Barrierefreiheit, verschiedene Browser und Touch-Bedienung.
- **Fehlende Upstream-Anpassungen:** Das bisherige öffentliche PrimeNG-Repository wurde archiviert. Bereits veröffentlichte MIT-Versionen bleiben verfügbar, eine gezielte Weiterentwicklung für Angular 22 kann jedoch nicht vorausgesetzt werden. Fehler, die ausschließlich in dieser Kombination auftreten, müssen gegebenenfalls projektintern umgangen werden.
- **Wartungs- und Sicherheitsrisiko:** Fehlerbehebungen und Sicherheitskorrekturen neuerer PrimeNG-Versionen können nicht unmittelbar übernommen werden. Das Risiko steigt, je länger PrimeNG 21 mit neueren Angular-Versionen kombiniert wird.
- **Zukünftiger Migrationsaufwand:** Je länger Angular aktualisiert wird, während PrimeNG auf Version 21 verbleibt, desto größer wird der spätere Versionssprung – inklusive technischer Änderungen und neuer Lizenzbedingungen.

**Empfehlungen:**

- Peer-Dependency-Warnungen dokumentieren und nicht dauerhaft über `--legacy-peer-deps` oder `--force` ausblenden.
- Neben Unit-Tests gezielte Integrations- und UI-Tests für alle verwendeten PrimeNG-Komponenten durchführen; Tastaturbedienung, Fokussteuerung, Barrierefreiheit und responsive Darstellung zusätzlich manuell prüfen.
- Jede Aktualisierung von Angular 22 erneut mit PrimeNG 21 testen.
- Eine Migration auf PrimeNG 22 als separate technische, lizenzrechtliche und wirtschaftliche Entscheidung behandeln.

---

# Migration von Version 20 auf Version 21

## Überblick

- Angular: v20 → **v21.1.4**
- PrimeNG: v20 → **v21.1.1**
- `@primeuix/themes`: **^2.0.3**
- Migrationshinweise von [update.angular.io](https://update.angular.io) und dem [PrimeNG Migration Guide](https://primeng.org/migration/v21) wurden umgesetzt.

## Breaking Changes

### PrimeNG: CSS-basierte Animationen

PrimeNG v21 verwendet CSS-basierte Animationen, da das Angular-Animations-Paket als deprecated markiert wurde.

**Auswirkung:** `showTransitionOptions` und `hideTransitionOptions` sind deprecated und haben keine Wirkung mehr. Die Properties existieren weiterhin, werden jedoch ignoriert.

**Migration:** `provideAnimations()` aus der `app.config.ts` entfernen.

### Moment.js aus der Bibliothek entfernt

Moment.js wird weder in der Bibliothek noch in deren Unit-Tests verwendet. Die Datumsvalidierung basiert jetzt auf nativer `Date`-Logik.

**Auswirkung:** **Moment.js ist keine (Peer-)Abhängigkeit mehr.** Consumer können weiterhin Moment-Objekte übergeben, sofern `toDate()` verfügbar ist (Backward Compatibility).

**Migration:** Empfohlen wird die Übergabe von `Date`-Objekten oder ISO-Strings.

Unterstützte Eingabeformate der Validatoren:

- `isInFuture` / `isInPast` akzeptieren:
  - `Date`
  - ISO-Date-Only (`YYYY-MM-DD`)
  - ISO-DateTime mit `Z` oder Offset (z. B. `2099-12-31T00:00:00+01:00`)
  - `DD.MM.YYYY`
  - `DD-MM-YYYY` (primär als `DD-MM-YYYY` interpretiert, optionaler Fallback `MM-DD-YYYY`)
  - `number` (Timestamp)
  - Moment-ähnliche Objekte mit `toDate()`
- `dateFormat(...)` unterstützt die in der Bibliothek verwendeten Formate (u. a. `YYYY-MM-DD`, `DD.MM.YYYY`, `HH:mm:ss`, `YYYY-MM-DDTHH:mm:ss[Z]`, `MM/YY`) sowie `Date` und Moment-ähnliche Objekte via `toDate()`.

> **Wichtig:** `isoDateTime` bleibt strikt und akzeptiert ausschließlich `YYYY-MM-DDTHH:mm:ssZ` mit literalem `Z` am Ende (UTC). Offsets wie `+01:00` sind ungültig.

### `form-wrapper`: Priorisierung der Fehlermeldungen

Die Priorisierung von Fehlermeldungen erfolgt nun über die Reihenfolge der `validationMessages`-Keys statt über die zuvor implizite Reihenfolge aus `control.errors`. Zusätzlich ist `validationMessages` **nicht mehr optional**.

**Auswirkung:** Bei mehreren gleichzeitig verletzten Validatoren kann sich die angezeigte Fehlermeldung ändern. Die Fehlertextgröße wurde reduziert.

**Migration:** `validationMessages` in der gewünschten Priorisierungsreihenfolge definieren und explizit setzen.

### Tests: `ng-mocks` ist unter Angular 21 nicht mehr kompatibel

Die Tests der Bibliothek wurden von `ng-mocks` / `MockComponents(...)` auf eigene Standalone-Stubs und `overrideComponent(...)` umgestellt. Zusätzlich wurde `provideZoneChangeDetection()` im Test-Modul ergänzt und die Test-Plattform modernisiert.

**Auswirkung:** Eigene Testsuiten, die auf `ng-mocks` basieren, laufen unter Angular 21 nicht mehr. Timing- und Async-Verhalten in Tests kann sich ändern.

**Migration:** `ng-mocks` durch Standalone-Stubs und `overrideComponent(...)` ersetzen; bei Bedarf `provideZoneChangeDetection()` ergänzen.

## Deprecations

- **ngx-translate:** `TranslateService.currentLang` ist deprecated – stattdessen `getCurrentLang()` verwenden.
- **Angular Tests:** `BrowserDynamicTestingModule` / `platformBrowserDynamicTesting()` sind deprecated – stattdessen `BrowserTestingModule` und `platformBrowserTesting()` verwenden.

## `isy-wizard`: Button-Anordnung und optionaler Footer (seit 21.1.0)

Der `isy-wizard` unterstützt optional einen projektspezifischen Footer über ein projiziertes Template. Der Standard-Footer bleibt als Fallback erhalten. Die Standard-Anordnung der Buttons wurde überarbeitet, damit Aktionen konsistent platziert werden.

**Auswirkung:** Bestehende Anwendungen ohne Custom-Footer bleiben lauffähig. Wurde bisher implizit von der alten Reihenfolge oder Sichtbarkeit einzelner Aktionen ausgegangen, ist eine Anpassung erforderlich.

**Migration:**

- Reicht die Standard-Anordnung aus, ist keine technische Migration nötig – die geänderte Anordnung sollte jedoch fachlich und visuell geprüft werden.
- Werden eine abweichende Reihenfolge, andere Beschriftungen oder projektspezifisches Styling benötigt, den Footer des `isy-wizard` explizit per Template definieren.

## Aktualisierte Abhängigkeiten

```json
{
  "peerDependencies": {
    "@angular/common": "^21.1.4",
    "@angular/core": "^21.1.4",
    "primeng": "^21.1.1",
    "@primeuix/themes": "^2.0.3"
  }
}
```

Die `ng-add`-Schematik trägt entsprechend `@angular/common@^21.1.4`, `@angular/core@^21.1.4`, `primeng@^21.1.1` und `@primeuix/themes@^2.0.3` ein.

---

# Migration von Version 19 auf Version 20

## Überblick

- Angular: v19 → **v20.1.1**
- PrimeNG: v19 → **v20.0.0**
- Migrationshinweise von [update.angular.io](https://update.angular.io) und dem [PrimeNG Migration Guide](https://primeng.org/migration/v20) wurden umgesetzt.

## Breaking Changes

### ESLint: Umstellung auf das Flat-Config-Format

Das `@isyfact/eslint-plugin` nutzt nun das Flat-Config-Format.

**Auswirkung:** `.eslintrc.js` und `.eslintrc.json` werden nicht mehr unterstützt.

**Migration:** Die Konfiguration auf `eslint.config.js` umstellen – siehe [ESLint Migration Guide](https://eslint.style/guide/migration).

### Umstellung auf `inject()`

Angular führt `inject()` anstelle der klassischen Constructor-Injection ein.

**Auswirkung:** Anpassungen an bestehenden Komponenten oder Services können erforderlich sein.

**Migration:** Auf [`inject()`](https://angular.dev/reference/migrations/inject-function) umstellen. Ist das nicht gewünscht, lässt sich die Regel über `@angular-eslint/no-inject-in-constructor: 'off'` in der ESLint-Konfiguration deaktivieren.

### `@primeng/themes` ersetzt durch `@primeuix/themes`

**Auswirkung:** Paketname, API, Struktur und Build-Konfiguration ändern sich. Anpassungen an Imports, Styles und Konfigurationen sind erforderlich; möglicherweise müssen weitere Abhängigkeiten aktualisiert werden.

**Migration:** Imports und Konfigurationen auf `@primeuix/themes` umstellen.

### Upgrade von ngx-translate v16 auf v17

**Auswirkung:** Das Upgrade kann API-Änderungen und neue Konfigurationen enthalten.

**Migration:** Details im [ngx-translate Migration Guide](https://ngx-translate.org/getting-started/migration-guide/) prüfen.

### Upgrade von Spectator v19.6.2 auf v21.0.1

**Auswirkung:** Betrifft ausschließlich Testcode; das Upgrade kann API-Änderungen enthalten.

**Migration:** Details im [Spectator Changelog](https://github.com/ngneat/spectator/blob/master/CHANGELOG.md) prüfen.

## Aktualisierte Abhängigkeiten

```json
{
  "peerDependencies": {
    "@angular/common": "^20.1.6",
    "@angular/core": "^20.1.6",
    "primeng": "^20.0.1",
    "@primeuix/themes": "^1.2.3"
  }
}
```

Die `ng-add`-Schematik trägt entsprechend `@angular/common@^20.1.6`, `@angular/core@^20.1.6`, `primeng@^20.0.1` und `@primeuix/themes@^1.2.3` ein.

## CI/CD

- GitHub-Actions-Workflow auf `actions/checkout@v4` und `actions/setup-node@v4` aktualisiert.
- Node.js-Version auf `20.x` angehoben.

---

# Migration von Version 18 auf Version 19

## Überblick

- Angular: v18 → **v19.2.9**
- PrimeNG: v17 → **v19.1.2**
- Migrationshinweise von [update.angular.io](https://update.angular.io) und dem [PrimeNG Migration Guide](https://primeng.org/migration/v19) wurden umgesetzt.

## Breaking Changes

### Theming: FluentUI ersetzt durch das PrimeNG-Theming mit Standard-Theme *Nora*

Das FluentUI-Theme wurde entfernt. Das neue IsyFact-Theme wird über `provideIsyFactTheme()` bereitgestellt, die PrimeNG-Konfiguration erfolgt über `providePrimeNG()` statt über `PrimeNGConfig`.

**Auswirkung:** Die alten Themes (`theme.css`, FluentUI) stehen nicht mehr zur Verfügung. Es gelten neue Design-Variablen für das IsyFact-Styling. Der Dark Mode des Standard-Themes wurde mit 19.0.1 deaktiviert.

**Migration:** Theme-Einbindung auf `provideIsyFactTheme()` umstellen und eigene Style-Overrides gegen die neuen Design-Variablen prüfen.

### Umbenennung der Validierungsfehler-Objekte

| Alt                        | Neu                               |
|----------------------------|-----------------------------------|
| `FUTURE`                   | `INVALIDFUTUREDATE`               |
| `PAST`                     | `INVALIDPASTDATE`                 |
| `UNSPECIFIEDDATE`          | `INVALIDUNSPECIFIEDDATE`          |
| `UNSPECIFIEDISODATE`       | `INVALIDUNSPECIFIEDISODATE`       |
| `CREDITCARDEXPIRATIONDATE` | `INVALIDCREDITCARDEXPIRATIONDATE` |
| `CREDITCARD`               | `INVALIDCREDITCARDNUMBER`         |
| `DATE`                     | `INVALIDISODATE`                  |
| `TIME`                     | `INVALIDISOTIME`                  |
| `DATETIME`                 | `INVALIDISODATETIME`              |

**Auswirkung:** Anwendungen, die Fehler-Keys direkt auswerten (z. B. in `validationMessages` oder eigenen Fehlerausgaben), müssen angepasst werden.

**Migration:** Alle Verwendungen der alten Keys auf die neuen Namen umstellen.

### Umstellung auf Standalone-Komponenten

Die NgModules der Bibliothek wurden entfernt: `hauptfenster.module.ts`, `wizard.module.ts`, `incomplete-date.module.ts`, `security.module.ts`.

**Auswirkung:** Imports über diese Module funktionieren nicht mehr.

**Migration:**

- Die Komponenten direkt als Standalone-Komponenten importieren.
- Lazy-Loaded Übersetzungen benötigen `TranslateModule.forChild()`.
- Für konstante Werte wird `readonly` empfohlen.

### PrimeNG: umbenannte und ersetzte Komponenten

Umbenannte Komponenten:

| Alt            | Neu            |
|----------------|----------------|
| `Calendar`     | `DatePicker`   |
| `Dropdown`     | `Select`       |
| `InputSwitch`  | `ToggleSwitch` |
| `OverlayPanel` | `Popover`      |
| `Sidebar`      | `Drawer`       |

Ersetzte bzw. veraltete Komponenten:

| Alt             | Neu                                       |
|-----------------|-------------------------------------------|
| `Chips`         | `AutoComplete` (`multiple`, ohne Typeahead) |
| `TabMenu`       | `Tabs` (ohne Panels)                      |
| `Steps`         | `Stepper` (ohne Panels)                   |
| `InlineMessage` | `Message`                                 |
| `TabView`       | `Tabs`                                    |
| `Accordion`     | `AccordionPanel` + `Header` + `Content`   |
| `Messages`      | `Message`                                 |

Weitere API-Änderungen in PrimeNG v19:

- `TriStateCheckbox` → `p-checkbox` mit `indeterminate`
- Checkbox-Label über `<label>` statt über das `label`-Property
- `pInputTextarea` → `pTextarea`
- `severity="warning"` → `severity="warn"`
- `size` → `badgeSize`
- `Message` → `ToastMessageOptions` (wegen Namenskonflikt)

## Deprecations

- Der Output `stepperIndexChange` des `isy-wizard` wurde in `indexChange` umbenannt; `stepperIndexChange` ist deprecated.

## Neue Funktionen

- `skip-links`-Komponente zur barrierefreien Navigation
- `isy-wizard`: neue Eigenschaft `allowFreeNavigation` für freie Schritt-Navigation
- `form-wrapper`: Unterstützung für eine Label-ID
- Aktiver Zustand in der Linksnavigation farblich hervorgehoben
- Überarbeitetes Styling des `isy-input-char`-Dialogs sowie schreibgeschützter Eingabefelder

## Aktualisierte Abhängigkeiten

```json
{
  "peerDependencies": {
    "@angular/common": "^19.2.9",
    "@angular/core": "^19.2.9",
    "primeflex": "^4.0.0",
    "primeng": "^19.1.2",
    "@primeng/themes": "^19.1.2"
  },
  "dependencies": {
    "tslib": "^2.8.1"
  }
}
```

---

# Migration von Version 17 auf Version 18

## Überblick

- Angular: v17 → **v18.1.4**
- PrimeNG bleibt auf **^17.18.8**, `primeicons` wird auf **^7.0.0** angehoben.
- Migrationshinweise von [update.angular.io](https://update.angular.io) wurden umgesetzt.

## Breaking Changes

### Veraltete Angular-Module ersetzt

| Alt                        | Neu                          |
|----------------------------|------------------------------|
| `HttpClientModule`         | `provideHttpClient()`        |
| `HttpClientTestingModule`  | `provideHttpClientTesting()` |
| `RouterTestingModule`      | `provideRouter()`            |

**Migration:** Die entsprechenden Module in Anwendungs- und Testkonfigurationen durch die Provider-Funktionen ersetzen.

### `resolveJsonModule` erforderlich

In der `tsconfig.json` muss `resolveJsonModule` aktiviert sein, damit Module mit der Endung `.json` importiert werden können. TypeScript löst JSON-Dateien standardmäßig nicht auf; die Bibliothek verwendet `sonderzeichenliste.json` unter anderem in `character.service.ts`.

**Migration:** `"resolveJsonModule": true` in der `tsconfig.json` ergänzen.

## Aktualisierte Abhängigkeiten

```json
{
  "peerDependencies": {
    "@angular/common": "^18.1.4",
    "@angular/core": "^18.1.4",
    "moment": "^2.30.1",
    "primeicons": "^7.0.0",
    "primeng": "^17.18.8"
  },
  "dependencies": {
    "tslib": "^2.6.3"
  }
}
```

---

# Migration von Version 16 auf Version 17

## Breaking Changes

- Upgrade von Angular und PrimeNG auf Version 17. Es sind die Migrationshinweise von [update.angular.io](https://update.angular.io) und dem [PrimeNG Migration Guide](https://primeng.org/migration/v17) zu beachten.

---

# Migration von Version 15 auf Version 16

## Breaking Changes

- Upgrade von Angular und PrimeNG auf Version 16.
- `WidgetsConfigService#getTranslation` erlaubt jetzt auch Werte vom Typ `undefined`.

**Auswirkung:** Eigene Implementierungen bzw. Aufrufer müssen `undefined` als möglichen Rückgabewert behandeln.

---

# Migration von Version 14 auf Version 15

## Breaking Changes

### Angular Router: entfernte Guard-APIs

- Die Implementierung der Interfaces `CanActivate` und `CanLoad` wurde entfernt, da sie deprecated sind.
- Der Parameter `state` wurde aus der Signatur der Auth-Guard-Methode `canActivate` entfernt.
- Die Auth-Guard-Methode `canLoad` wurde entfernt, da das `CanLoad`-Interface deprecated ist.

**Migration:** Auf funktionale Guards umstellen und Aufrufe ohne den `state`-Parameter anpassen. Für `canLoad` stattdessen `canMatch` verwenden.

### CharPicker-API an `p-dialog` angeglichen

Die Properties der Komponente `input-char` wurden an die API von `p-dialog` angeglichen.

**Migration:** Bindings an den CharPicker gegen die neuen Property-Namen prüfen.

---

# Migration von Version 0.8 auf Version 14

## Breaking Changes

Die Properties der `HauptfensterComponent` zur Konfiguration der Seitenleistenbreite wurden ersetzt:

| Alt                       | Neu                        |
|---------------------------|----------------------------|
| `linksNavigationCols`     | `linksNavigationWidth`     |
| `informationsbereichCols` | `informationsbereichWidth` |

**Auswirkung:** Statt einer Spaltenanzahl wird nun eine freie Breitenangabe erwartet (Standard: `15em`).

**Migration:** Bindings umbenennen und die Werte von Spaltenanzahlen auf CSS-Breitenangaben umstellen.

---

# Migration von Version 0.7 auf Version 0.8

## Breaking Changes

Das Security-Paket wurde von `/core/security` nach `/security` verschoben.

**Migration:** Imports auf den neuen Pfad anpassen.
