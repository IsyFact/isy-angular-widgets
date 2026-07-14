# Update Log - 10.07.2026

## Migration auf Angular v22 inkl. Build-, Routing- und Test-Stabilisierung

### Scope-Hinweis

* Dieser Abschnitt dokumentiert primär die Auswirkungen auf die Bibliothek ***isy-angular-widgets***.
* Als Breaking Changes werden Änderungen eingeordnet, die für Library-Consumer, Maintainer oder die CI-/Build-Infrastruktur relevant sind.
* Änderungen, die ausschließlich die Demo-Anwendung betreffen, sind separat ausgewiesen und stellen nicht automatisch einen Breaking Change der Bibliothek dar.
* Die Demo-Anwendung und die Bibliothek verwenden weiterhin PrimeNG 21.

---

### 1. Kontext und Ziel

* Demo-Anwendung und Bibliothek wurden von Angular 21 auf Angular 22 migriert.
* PrimeNG wurde im Rahmen dieser Migration bewusst nicht auf Version 22 aktualisiert.
* Ziel war es zu prüfen, ob die bestehende Kombination aus Angular 22 und PrimeNG 21 weiterhin lauffähig ist.
* Parallel wurden Regressionen aus der Angular-Migration behoben:
  * 404-Fehler bei Demo-Ressourcen
  * fehlerhafte Navigation auf PrimeNG-Widget-Seiten
  * Font-404-Warnungen in Tests
  * instabiles Verhalten einzelner Tests
* Build-, Test- und Projektkonfiguration wurden an die Angular-22-Toolchain angepasst.
* Die Kombination aus Angular 22 und PrimeNG 21 funktioniert im bisher geprüften Projektumfang.
* Da PrimeNG 21 jedoch für Angular 21 veröffentlicht wurde, bleibt ein technisches Restrisiko bestehen.

---

### 2. Aktualisierte Frameworks und Tools

* Angular: v21.1.4 → **v22.0.5**
* PrimeNG bleibt auf **v21**
* `ng-packagr`: v21 → **v22.0.1**
* TypeScript: v5.9 → **v6.0.3**
* Angular CLI, Angular ESLint und weitere zentrale Tooling-Abhängigkeiten wurden auf Angular 22 aktualisiert.
* Der Build- und Test-Stack wurde auf die Builder aus `@angular/build` umgestellt.
* Demo-Anwendung und Bibliothek wurden auf eine gemeinsame Angular-22-Toolchain ausgerichtet.
* Die ESLint-Konfiguration und die `ng-add`-Schematik wurden an die Angular-22-Toolchain angepasst.

---

### 3. Breaking Changes und Kompatibilitätsrisiken

#### 3.1 Angular- und Tooling-Major-Upgrade auf v22

##### 1. Änderung

* Die zentralen Angular-Pakete im Root-Projekt wurden auf `^22.0.5` aktualisiert:

  * `@angular/animations`
  * `@angular/common`
  * `@angular/compiler`
  * `@angular/core`
  * `@angular/forms`
  * `@angular/platform-browser`
  * `@angular/platform-browser-dynamic`
  * `@angular/router`
* TypeScript wurde auf `~6.0.3` aktualisiert.
* `ng-packagr` wurde auf `22.0.1` angehoben.
* Der Build- und Test-Stack wurde auf die für Angular 22 vorgesehenen Builder aus `@angular/build` umgestellt.

##### 2. Auswirkungen / Migration

* Das Major-Upgrade ist insbesondere für Maintainer und die CI-/Build-Infrastruktur als Breaking Change zu betrachten.
* Ältere Node.js-, TypeScript- oder Tooling-Versionen können mit der neuen Angular-Version inkompatibel sein.
* Bestehende Build-Skripte, CI-Images oder projektspezifische Tooling-Integrationen können Anpassungen benötigen.
* Integrationen, die direkt oder indirekt vom bisherigen Devkit-Builder beziehungsweise dessen Verhalten abhängig sind, müssen überprüft werden.

##### 3. Empfehlung

* Lokale Node.js-Versionen und CI-Images auf eine mit Angular 22 kompatible Version aktualisieren.
* Eigene Build-Skripte, Builder-Optionen und Build-Hooks auf Kompatibilität mit `@angular/build` prüfen.
* Nach Tooling-Updates immer Library-Build, Demo-Build und Tests vollständig ausführen.

---

#### 3.2 Builder-Wechsel in `angular.json`

##### 1. Änderung

* Die Bibliothek verwendet nun:

  * `@angular/build:ng-packagr`
  * `@angular/build:karma`
* Die Demo-Anwendung verwendet nun:

  * `@angular/build:application`
  * `@angular/build:dev-server`
  * `@angular/build:extract-i18n`
  * `@angular/build:karma`

##### 2. Auswirkungen / Migration

* Unterstützte Optionen und das Verhalten der Builder können von den bisherigen Devkit-Buildern abweichen.
* Individuelle Builder-Overrides oder projektspezifische Konfigurationen müssen gegebenenfalls angepasst werden.
* Build-Artefakte, statische Ressourcen und Medien können unter dem neuen Build-System anders verarbeitet werden.

##### 3. Empfehlung

* Für zukünftige Anpassungen die Builder-Konfiguration von `@angular/build` als Grundlage verwenden.
* Individuelle Optionen in `angular.json` darauf prüfen, ob sie weiterhin unterstützt werden.

---

#### 3.3 Weiterverwendung von PrimeNG 21 unter Angular 22

##### 1. Änderung

* Die Demo-Anwendung und die Bibliothek ***isy-angular-widgets*** verwenden weiterhin PrimeNG 21.
* PrimeNG wurde nicht gemeinsam mit Angular auf Version 22 aktualisiert.
* Die eingesetzte Kombination lautet daher:

  * Angular 22
  * PrimeNG 21
  * Angular CDK abhängig von der jeweiligen Projektkonfiguration
* PrimeNG 21 bleibt als bereits veröffentlichte Version unter der MIT-Lizenz verfügbar.
* Erst PrimeNG 22 und spätere Hauptversionen werden unter dem neuen PrimeUI-Lizenzmodell veröffentlicht und nicht mehr als Open-Source-Versionen bereitgestellt.
* Aus Lizenz- und Kostenaspekten wird PrimeNG daher zunächst nicht auf Version 22 aktualisiert.

##### 2. Aktueller Kompatibilitätsstand

* Die Migration von Demo-Anwendung und Bibliothek auf Angular 22 wurde durchgeführt.
* PrimeNG 21 lässt sich im aktuellen Projektstand weiterhin verwenden.
* Die bisher geprüften PrimeNG-Komponenten und Demo-Seiten funktionieren ohne bekannte blockierende Fehler.
* Builds und Tests können mit der Angular-22-Toolchain ausgeführt werden.
* Die vorhandenen Tests wurden an die geänderten Angular-22-Rahmenbedingungen angepasst.
* Die Kombination ist damit im aktuell geprüften Projektumfang lauffähig.
* Daraus kann jedoch keine vollständige Kompatibilitätsgarantie für sämtliche PrimeNG-Komponenten und Anwendungsfälle abgeleitet werden.

##### 3. Hintergrund

* PrimeNG 21 wurde für die Angular-21-Generation entwickelt.
* In den Peer-Dependencies von PrimeNG 21 werden Angular Core, Common, Forms, Router, Platform Browser und Angular CDK aus der Angular-21-Generation erwartet.
* Angular 22 und PrimeNG 21 bilden daher keine offiziell passend deklarierte Versionskombination.
* Das bisherige öffentliche PrimeNG-Repository wurde archiviert. Bereits veröffentlichte MIT-Versionen bleiben verfügbar, während die aktive Weiterentwicklung an anderer Stelle und unter dem neuen Lizenzmodell erfolgt.

##### 4. Risiken

###### Peer-Dependency-Konflikte

* Bei der Installation können Peer-Dependency-Warnungen oder Installationskonflikte auftreten.
* Abhängig von der eingesetzten npm-Version kann die Installation fehlschlagen oder zusätzliche Overrides erfordern.
* Das Umgehen der Konflikte mit `--legacy-peer-deps` oder `--force` bestätigt keine technische Kompatibilität.
* Solche Installationsoptionen können reale Versionsprobleme verdecken.

###### Build- und Compiler-Inkompatibilitäten

* Angular 22 verwendet eine neuere Compiler-, Builder- und TypeScript-Version als die von PrimeNG 21 ursprünglich vorgesehene Umgebung.
* Einzelne PrimeNG-Komponenten können deshalb Template-, Typ- oder Metadatenfehler verursachen.
* Solche Fehler können auch erst durch spätere Angular-22-Patch- oder Minor-Updates sichtbar werden.
* Ein aktuell erfolgreicher Build schließt zukünftige Compiler- oder Builder-Probleme nicht vollständig aus.

###### Laufzeitfehler

* Fehler können erst bei konkreten Benutzerinteraktionen auftreten und deshalb durch reine Build- oder Unit-Tests unentdeckt bleiben.
* Besonders relevant sind komplexe PrimeNG-Komponenten wie:

  * Dialoge
  * Overlays
  * Dropdowns und Select-Komponenten
  * Autocomplete-Komponenten
  * Tabellen
  * DatePicker
  * Menüs
  * Tooltips
  * dynamisch geladene Komponenten
* Mögliche Fehlerbilder sind:

  * Komponenten werden nicht korrekt aktualisiert.
  * Overlays werden falsch positioniert oder nicht geschlossen.
  * Events werden nicht wie erwartet ausgelöst.
  * Fokussteuerung funktioniert nicht zuverlässig.
  * Styles oder Animationen verhalten sich abweichend.
  * Fehler treten nur in bestimmten Browsern oder Interaktionsabläufen auf.

###### Angular-CDK-Versionskonflikte

* PrimeNG 21 erwartet eine Angular-CDK-Version aus der Angular-21-Generation.
* Wird Angular CDK 21 zusammen mit Angular Core 22 verwendet, entsteht eine gemischte Framework-Konstellation.
* Wird Angular CDK ebenfalls auf Version 22 aktualisiert, entspricht dies wiederum nicht mehr der von PrimeNG 21 deklarierten Peer-Dependency.
* Betroffen sein können insbesondere:

  * Overlay-Funktionen
  * Fokussteuerung
  * Accessibility-Funktionen
  * Portals
  * Drag-and-Drop
  * dynamische Positionierung
* Die konkret eingesetzte Angular-CDK-Version muss deshalb gemeinsam mit den verwendeten PrimeNG-Komponenten getestet werden.

###### Änderungen an der Change Detection

* Angular 22 verwendet für Komponenten standardmäßig `OnPush`.
* Für bestehende Komponenten wurde deshalb teilweise explizit `ChangeDetectionStrategy.Eager` gesetzt.
* `ChangeDetectionStrategy.Default` ist in Angular 22 nur noch ein veralteter Alias für `Eager`.
* PrimeNG-21-Komponenten wurden nicht ursprünglich unter diesen Angular-22-Rahmenbedingungen entwickelt.
* Dadurch können Aktualisierungs- oder Darstellungsprobleme auftreten, die nur bei bestimmten Daten- und Eventabläufen sichtbar werden.

###### Unvollständige Testabdeckung

* Automatisierte Tests decken nicht sämtliche Zustände, Eingabekombinationen und Interaktionen der PrimeNG-Komponenten ab.
* Fehler können deshalb trotz erfolgreicher Unit- und Integrationstests in bisher nicht geprüften Randfällen auftreten.
* Dies betrifft insbesondere:

  * Tastaturbedienung
  * Responsive Darstellung
  * Formularvalidierung
  * dynamische Inhalte
  * komplexe Tabelleninteraktionen
  * Fokussteuerung
  * Barrierefreiheit
  * unterschiedliche Browser
  * Touch-Bedienung

###### Fehlende gezielte Upstream-Anpassungen

* Das bisherige PrimeNG-Repository ist archiviert.
* PrimeNG 21 bleibt nutzbar, eine gezielte Weiterentwicklung für Angular 22 kann jedoch nicht vorausgesetzt werden.
* Fehler, die ausschließlich in der Kombination Angular 22 und PrimeNG 21 auftreten, müssen möglicherweise projektintern analysiert und umgangen werden.
* Ein offizieller Fix kann gegebenenfalls nur in PrimeNG 22 oder einer späteren Version verfügbar sein.
* Für den Einsatz dieser Versionen wäre das neue PrimeUI-Lizenzmodell zu berücksichtigen.

###### Wartungs- und Sicherheitsrisiko

* Durch das Verbleiben auf PrimeNG 21 können zukünftige Fehlerbehebungen und Sicherheitskorrekturen neuer PrimeNG-Versionen nicht unmittelbar übernommen werden.
* Falls eine relevante Schwachstelle oder ein kritischer Fehler nur in PrimeNG 22 oder höher behoben wird, muss zwischen einem eigenen Workaround und einer Migration entschieden werden.
* Das Wartungsrisiko steigt, je länger PrimeNG 21 zusammen mit neueren Angular-Versionen verwendet wird.

###### Risiko für Library-Consumer

* Consumer der Bibliothek können eigene Angular-, PrimeNG- oder Angular-CDK-Versionen einsetzen.
* Dadurch können zusätzliche Peer-Dependency-Konflikte entstehen.
* Die Bibliothek kann nicht garantieren, dass jede PrimeNG-21-Komponente in jeder Angular-22-Anwendung identisch funktioniert.
* Consumer sollten die tatsächlich verwendeten Widgets innerhalb ihrer eigenen Anwendung testen.

###### Zukünftiger Migrationsaufwand

* Je länger Angular aktualisiert wird, während PrimeNG auf Version 21 verbleibt, desto größer kann der spätere Versionssprung werden.
* Eine spätere Migration kann gleichzeitig Änderungen aus mehreren Angular- und PrimeNG-Versionen enthalten.
* Zusätzlich müssen dann möglicherweise technische Änderungen und neue Lizenzbedingungen gemeinsam betrachtet werden.
* Dadurch können Aufwand, Testumfang und Projektrisiko einer späteren Migration steigen.

##### 5. Risikobewertung

* Für den aktuellen Projektstand ist die Kombination aus Angular 22 und PrimeNG 21 grundsätzlich lauffähig.
* In den bisher geprüften Bereichen wurden keine blockierenden Fehler festgestellt.
* Die Kombination ist jedoch nicht als vollständig offiziell unterstützte Versionskombination zu bewerten.
* Das kurzfristige Risiko wird als **mittel** bewertet.
* Besonders relevant sind:

  * komplexe PrimeNG-Komponenten
  * Angular-CDK-abhängige Funktionen
  * zukünftige Angular-22-Updates
  * nicht automatisiert getestete Interaktionen
* Das langfristige Risiko steigt durch:

  * fehlende Weiterentwicklung von PrimeNG 21
  * mögliche Sicherheits- oder Browserprobleme
  * wachsenden späteren Migrationsaufwand
  * Abhängigkeit vom neuen PrimeUI-Lizenzmodell für zukünftige PrimeNG-Versionen

##### 6. Empfehlung

* Angular-, PrimeNG- und Angular-CDK-Versionen im Lockfile eindeutig festschreiben.
* Keine unkontrollierten Major- oder Minor-Updates zulassen.
* Jede Aktualisierung von Angular 22 erneut mit PrimeNG 21 testen.
* Peer-Dependency-Warnungen dokumentieren und nicht dauerhaft über `--legacy-peer-deps` oder `--force` ausblenden.
* Neben Unit-Tests gezielte Integrations- und UI-Tests für alle verwendeten PrimeNG-Komponenten durchführen.
* Besonders folgende Komponenten prüfen:

  * Dialoge
  * Overlays
  * Tabellen
  * Menüs
  * Formulare
  * DatePicker
  * Dropdowns und Select-Komponenten
  * Autocomplete
  * Tooltips
* Tastaturbedienung, Fokussteuerung, Barrierefreiheit und responsive Darstellung zusätzlich manuell testen.
* Die verwendete Angular-CDK-Version dokumentieren und bei jedem Update erneut validieren.
* Bekannte Einschränkungen und notwendige Workarounds zentral dokumentieren.
* Die weitere Entwicklung und Lizenzierung von PrimeNG regelmäßig neu bewerten.
* Eine Migration auf PrimeNG 22 als separate technische, lizenzrechtliche und wirtschaftliche Entscheidung behandeln.

---

### 4. Demo-spezifische Änderungen

Die folgenden Änderungen betreffen ausschließlich die Demo-Anwendung und sind nicht als eigene Breaking Changes der öffentlichen Library-API zu bewerten.

#### 4.1 HTTP-Backend explizit auf XHR gesetzt

##### 1. Änderung

* In der Demo-Konfiguration wird der `HttpClient` nun explizit mit XHR bereitgestellt:

```ts
provideHttpClient(withXhr());
```

* Dadurch verwendet der `HttpClient` in der Demo bewusst die XHR-API.
* Das bisherige Transportverhalten im Browser- und Karma-Kontext soll damit stabil und reproduzierbar bleiben.
* Die Angular-Dokumentation weist darauf hin, dass `withXhr()` nicht für SSR-Umgebungen verwendet werden soll. Die Demo ist daher weiterhin als Browser-Anwendung zu behandeln.

##### 2. Auswirkungen / Migration

* Die Änderung betrifft ausschließlich die Demo-Anwendung.
* Für Consumer der Bibliothek entsteht daraus keine zusätzliche Abhängigkeit oder Konfigurationspflicht.
* Anwendungen können ihr HTTP-Backend unabhängig von der Demo konfigurieren.

##### 3. Empfehlung

* Keine direkte Migration für Library-Consumer erforderlich.
* Bei einer späteren SSR-Nutzung der Demo muss die HTTP-Konfiguration erneut geprüft werden.

---

#### 4.2 Routing-Navigation auf absolute Pfade umgestellt

##### 1. Änderung

* Menü- und Applikationsnavigation verwenden nun absolute `routerLink`-Werte.

Beispiel:

```html
/primeng-widgets/primeng-form
```

anstelle eines relativen Pfads.

* Relative Links wurden in verschachtelten Routing-Kontexten teilweise gegen eine unerwünschte Route aufgelöst.
* Dadurch kam es bei einzelnen PrimeNG-Widget-Seiten zu falschen Rücksprüngen oder zur Navigation auf unpassende Seiten.
* Absolute Pfade stellen sicher, dass fest definierte Menüziele unabhängig von der aktuell aktiven Unterroute korrekt aufgerufen werden.

##### 2. Auswirkungen / Migration

* Die relative Routenauflösung wird für die betroffenen Demo-Menüeinträge nicht mehr verwendet.
* Bestehende Annahmen über relative Navigation innerhalb der Demo können sich dadurch ändern.
* Die öffentliche API der Bibliothek ist davon nicht betroffen.

##### 3. Empfehlung

* Absolute Pfade für globale Navigation und fest definierte Hauptmenüziele verwenden.
* Relative Pfade weiterhin nur dort einsetzen, wo bewusst innerhalb einer verschachtelten Route navigiert werden soll.

---

#### 4.3 Builder-Umstellung der Demo-Anwendung

##### 1. Änderung

* Die Demo-Anwendung wurde auf den neuen Application-Build-Stack von Angular umgestellt.
* Build, Development Server, Übersetzungsextraktion und Karma-Tests verwenden nun die Builder aus `@angular/build`.
* Demo-Anwendung und Bibliothek verwenden damit einen einheitlichen Angular-22-Build-Stack.

##### 2. Auswirkungen / Migration

* Die Änderung betrifft primär die lokale Entwicklung sowie die Build- und Testausführung der Demo.
* Library-Consumer müssen ihre Anwendungen aufgrund dieser Demo-Konfiguration nicht anpassen.

---

### 5. Fixes

#### 5.1 Demo-Runtime: 404 auf `main.js` behoben

* Der Development-`baseHref` wurde auf `/` gesetzt.
* Die Produktionskonfiguration verwendet weiterhin:

```text
/isy-angular-widgets/
```

* Die `index.html` der Demo verwendet:

```html
<base href="/" />
```

* Zuvor wurde beim lokalen Development teilweise ein produktionsnaher Basis-Pfad verwendet.
* Dadurch wurden Bundles wie `main.js` unter einer falschen URL angefordert.
* Die Trennung von Development- und Production-`baseHref` beseitigt dieses Problem.
* Lokales `ng serve` liefert die Bundles wieder unter den korrekten Pfaden aus.
* Der für das Deployment benötigte Unterpfad bleibt erhalten.

---

#### 5.2 PrimeNG-Widget-Routen stabilisiert

* Die bisherige dynamische String-Import-Logik wurde durch explizite `loadComponent`-Funktionen für die einzelnen Routen ersetzt.
* Dynamisch zusammengesetzte Import-Pfade waren für den Builder nicht in allen Fällen eindeutig analysierbar.
* Dies konnte zu Problemen bei der Auflösung oder beim Bundling der Komponenten führen.
* Durch explizite Imports können die Abhängigkeiten bereits während des Builds eindeutig bestimmt werden.
* Die PrimeNG-Widget-Komponenten werden dadurch wieder zuverlässig geladen.
* Navigation und Direktaufrufe der Widget-Seiten funktionieren stabiler.

---

#### 5.3 Font- und Asset-404 in Tests eingegrenzt

* `flag-icons.min.css` wurde aus den Library-Test-Styles entfernt, um Konflikte bei der Verarbeitung statischer Medien zu vermeiden.
* Für Demo- und Library-Tests wurden zusätzliche Asset-Mappings für Font-Dateien ergänzt.

  * `node_modules/primeicons/fonts` → `media`
  * `projects/isy-angular-widgets/assets/fonts` → `media`
* Für die Development-Konfiguration wurde `outputHashing: media` gesetzt.
* Unter der neuen Build-Toolchain mit `@angular/build:karma` treten weiterhin 404-Warnungen für einzelne Font-Dateien auf, obwohl die Tests erfolgreich laufen.
* Die Ursache liegt im Zusammenspiel aus CSS-`url()`-Auflösung und dem virtuellen Karma-Dateisystem des neuen Builders.
* Funktional sind die Testläufe nicht blockiert: Library- und Demo-Tests laufen vollständig erfolgreich durch.
* Ein vollständiges Entfernen dieser Warnungen ist derzeit eher ein Builder-Thema als ein Fehler in der Widget-Implementierung.

---

### 6. Interne Anpassungen

#### 6.1 Change Detection auf Angular 22 angepasst

* Betroffene Komponenten in Demo-Anwendung und Bibliothek wurden explizit auf folgende Strategie gesetzt:

```ts
changeDetection: ChangeDetectionStrategy.Eager
```

* Angular 22 verwendet für Komponenten standardmäßig `OnPush`.
* Mit `Eager` wird für bestehende Komponenten, die auf eine vollständige Prüfung während der Change-Detection-Durchläufe angewiesen sind, das bisherige Verhalten explizit beibehalten.
* Der bisherige Wert `ChangeDetectionStrategy.Default` wurde nicht weiterverwendet, da er in Angular 22 nur noch als veralteter Alias für `Eager` vorhanden ist.
* Die zugehörigen Unit-Tests wurden an die geänderten Change-Detection-Rahmenbedingungen angepasst.
* Test-Setups und Provider-Konfigurationen wurden entsprechend aktualisiert.
* Eine fachliche Umstellung aller bestehenden Komponenten auf `OnPush` wurde nicht pauschal erzwungen.
* Eine solche Umstellung soll weiterhin pro Komponente bewertet werden, da sie bei komplexen Interaktionen zu Verhaltensänderungen führen kann.

---

#### 6.2 Extended Diagnostics angepasst

* In mehreren `tsconfig`-Dateien wurden folgende Extended-Diagnostics-Prüfungen auf `suppress` gesetzt:

  * `nullishCoalescingNotNullable`
  * `optionalChainNotNullable`
* Die Anpassung reduziert Diagnosemeldungen, die während der Migration keinen unmittelbaren Mehrwert geliefert haben.
* Die allgemeine TypeScript-Typprüfung bleibt weiterhin aktiv.
* Die Suppressions sollten nach Abschluss weiterer Angular-22-Anpassungen erneut überprüft werden.

---

#### 6.3 Test-Setups aktualisiert

* Betroffene Tests wurden an die neuen Builder- und Change-Detection-Rahmenbedingungen angepasst.
* Provider und Testkonfigurationen wurden dort ergänzt oder geändert, wo sich das Verhalten unter Angular 22 verändert hat.
* Ziel war ein reproduzierbares und stabileres Testverhalten unter der neuen Toolchain.

---

#### 6.4 ESLint-Konfiguration an Angular ESLint 22 angepasst

* Die Root-Konfiguration in `eslint.config.js` wurde an die tatsächlich exportierte Paketstruktur von Angular ESLint 22 angepasst.
* Veraltete Zugriffe auf `angular.configs.recommended.rules` und `angularTemplate.configs.recommended.rules` wurden entfernt.
* Ohne diese Anpassung schlug `ng lint` beziehungsweise `npm run lint` mit `Cannot read properties of undefined (reading 'recommended')` fehl.
* Die projektspezifischen Regeln für Bibliothek und Demo bleiben erhalten, der Konfigurationsfehler im Flat-Config-Setup wurde jedoch beseitigt.
* Eine nicht mehr benötigte `eslint-disable`-Direktive in `incomplete-date.component.ts` wurde im Zuge der Bereinigung entfernt.

---

#### 6.5 Schematics-TSConfig auf TS6/TS7 vorbereitet

* Die Schematics-Compiler-Konfiguration in `projects/isy-angular-widgets/tsconfig.schematics.json` wurde modernisiert.
* Die veralteten Optionen wurden bereinigt bzw. ersetzt:
  * `baseUrl` entfernt (nicht erforderlich bei den verwendeten relativen/paketbasierten Imports)
  * `module` auf `node16` gesetzt
  * `moduleResolution` auf `node16` gesetzt
* Damit treten die TS6-Deprecation-Fehler im Schematics-Build nicht mehr auf.
* Die vollständige Build-Kette (`build:schematics`, `build:widgets_lib`, `build-and-pack:widgets_lib`) wurde erfolgreich validiert.
* Einordnung: interne Build- und Tooling-Anpassung für Maintainer/CI, kein eigener Breaking Change für Library-Consumer.

---

#### 6.6 Bekannte Einschränkung des neuen Karma-Builders

* Bei Testläufen mit `@angular/build:karma` können weiterhin 404-Warnungen für Font-Dateien wie `primeicons.woff2` oder `LiberationSans-Regular.woff2` im Web-Server-Log erscheinen.
* Die Tests selbst sind davon nicht fachlich betroffen und laufen weiterhin erfolgreich durch.
* Die Warnungen wurden als Einschränkung des neuen Angular-22-Karma-Builders eingeordnet, nicht als funktionaler Fehler der Bibliothek.
* Einordnung: internes Tooling-Thema für Maintainer/CI, kein eigener Breaking Change für Library-Consumer.

---

### 7. Änderungen in ***isy-angular-widgets***

#### 7.1 Peer-Dependencies der Bibliothek erweitert

* Die unterstützten Angular-Versionen der Bibliothek wurden auf Angular 21 und Angular 22 erweitert:

```json
{
  "peerDependencies": {
    "@angular/common": "^21.1.4 || ^22.0.0",
    "@angular/core": "^21.1.4 || ^22.0.0",
    "primeng": "^21.0.0"
  }
}
```

* Die bisherige Angular-Peer-Dependency-Range war nach der Aktualisierung des Repositories auf Angular 22 zu eng.
* Dadurch wurde für Angular-22-Consumer eine Inkompatibilität angezeigt, obwohl die Bibliothek entsprechend angepasst wurde.
* Die neue Range bildet die im Projekt geprüfte Nutzung mit Angular 21 und Angular 22 ab.
* Bestehende Angular-21-Consumer müssen nicht unmittelbar auf Angular 22 migrieren.
* PrimeNG bleibt weiterhin auf Version 21 begrenzt.
* Es wurden keine grundlegenden öffentlichen Widget-APIs entfernt oder umbenannt.

#### 7.2 Einschränkung der Kompatibilitätsaussage

* Die erweiterte Angular-Peer-Dependency bedeutet nicht, dass PrimeNG 21 Angular 22 offiziell unterstützt.
* Die Kompatibilitätsaussage gilt nur für die im Projekt verwendeten und getesteten Komponenten.
* Consumer müssen ihre eigene Kombination aus Angular, PrimeNG und Angular CDK zusätzlich prüfen.
* Die Verwendung der Bibliothek in einer Anwendung mit PrimeNG 22 ist nicht Bestandteil dieser Migration.

#### 7.3 `ng-add`-Schematik auf Angular 22 ausgerichtet

* Die Schematik in `projects/isy-angular-widgets/schematics/ng-add/index.ts` wurde an den Angular-22-Stand der Bibliothek angepasst.
* `ng add` trägt für `@angular/common` und `@angular/core` nun die Angular-22-Linie (`^22.0.0`) in Zielprojekte ein.
* Auch die von der Schematik ergänzten Angular-ESLint-Pakete wurden auf die 22er-Linie angehoben.
* Dadurch erzeugt die Schematik keinen zu Angular 22 widersprüchlichen Projektzustand mehr.

#### 7.4 Schematics-Paket auf CommonJS umgestellt

* Das veröffentlichte Paket hat `"type": "module"` in der Root-`package.json`, weil die Library-Bundles als ESM ausgeliefert werden.
* Die Schematics-Dateien werden jedoch als CommonJS (`require`, `exports`) kompiliert.
* Dadurch schlug `npx ng generate @isyfact/isy-angular-widgets:ng-add` mit dem Fehler `exports is not defined in ES module scope` fehl.
* Zur Behebung wurde eine `schematics/package.json` mit `"type": "commonjs"` ergänzt.
* Diese Datei wird über das `postbuild`-Skript in das Dist-Paket kopiert.
* Damit behandelt Node den Schematics-Unterordner als CommonJS, unabhängig vom `type`-Feld der übergeordneten Paket-`package.json`.
* Einordnung: Fix für die Schematic-Ausführbarkeit, kein Breaking Change für Library-Consumer.

#### 7.5 `ng-add`-Schematik überspringt Auto-Install bei Angular 22

* Bei `ng add` führt die Schematik nach dem Schreiben der Projektkonfiguration automatisch `npm install` aus.
* In Angular-22-Projekten schlug dieser automatische Install mit `ERESOLVE` fehl, weil PrimeNG 21 Angular-21-Peer-Dependencies erwartet.
* Die Schematik wurde so angepasst, dass sie bei erkanntem Angular 22 den automatischen Install-Task überspringt.
* Stattdessen wird ein klarer Hinweis ausgegeben, dass `npm install --legacy-peer-deps` manuell ausgeführt werden muss.
* Für Angular 21 bleibt das bisherige Verhalten mit automatischem Install erhalten.
* Einordnung: Robustheitsfixe für die Schematic bei Angular 22, kein Breaking Change für Library-Consumer.

#### 7.6 Interner Self-Import in Library-Quellcode bereinigt

* Die Datei `input-char-dialog.component.ts` importierte `WidgetsConfigService` über `@isy-angular-widgets/public-api`.
* Dieser Alias ist im veröffentlichten ESM-Paket kein auflösbarer Subpath.
* Dadurch enthielt das gebaute Artefakt einen unauflösbaren Verweis, der beim Consumer-Build (Vite/esbuild) zu `Could not resolve "@isy-angular-widgets/public-api"` führte.
* Der Import wurde durch den korrekten relativen Pfad `../../../i18n/widgets-config.service` ersetzt.
* Gleiches gilt für den zugehörigen Spec.
* Einordnung: Bugfix im veröffentlichten Library-Bundle, kein Breaking Change für Library-Consumer.

---

### 8. Änderungskategorien

#### 8.1 Abhängigkeiten und Lockfile

* `package.json` und `package-lock.json` wurden umfangreich aktualisiert.
* Dies betrifft insbesondere:

  * Angular 22
  * Angular CLI 22
  * Angular ESLint 22
  * `@angular/build`
  * TypeScript 6
  * `ng-packagr` 22
  * zugehörige transitive Abhängigkeiten
* PrimeNG bleibt auf Version 21.

#### 8.2 Build- und Test-Konfiguration

* Folgende zentrale Konfigurationsbereiche wurden angepasst:

  * `angular.json`
  * `karma.conf.js` der Demo-Anwendung
  * `karma.conf.js` der Bibliothek
  * Root-`tsconfig.json`
  * projektbezogene `tsconfig.*.json`
  * Asset- und Style-Konfigurationen der Tests

#### 8.3 Routing und Navigation

* Folgende Bereiche der Demo-Anwendung wurden überarbeitet:

  * `primeng-widgets.routes.ts`
  * `navigation-menu.ts`
  * `application-menu.ts`
  * `index.html`
  * Development- und Production-Konfiguration in `angular.json`

#### 8.4 Komponenten und Specs

* Change-Detection-Konfigurationen wurden in Demo- und Library-Komponenten konsolidiert.
* Zugehörige Specs wurden an die Angular-22-Rahmenbedingungen angepasst.
* Test-Provider und TestBed-Konfigurationen wurden entsprechend aktualisiert.

#### 8.5 PrimeNG-Kompatibilität

* Demo-Anwendung und Bibliothek verwenden weiterhin PrimeNG 21.
* Die Kompatibilität mit Angular 22 wurde im vorhandenen Projektumfang geprüft.
* Die bestehende Funktionalität ist derzeit gegeben.
* Wegen der unterschiedlichen Major-Versionen und der auf Angular 21 ausgerichteten PrimeNG-Peer-Dependencies bleibt ein Restrisiko bestehen.
* Die Kombination muss nach jedem weiteren Angular-Update erneut validiert werden.

---

### 9. Build- und Test-Stabilisierung

* Bibliothek und Demo-Anwendung wurden auf die Angular-22-Toolchain umgestellt.
* Die Demo-Bundles werden lokal wieder unter den korrekten Pfaden ausgeliefert.
* PrimeNG-Widget-Routen und Direktaufrufe funktionieren wieder zuverlässig.
* Font-Assets werden in den Testläufen korrekt aufgelöst.
* Die Tests wurden an `ChangeDetectionStrategy.Eager` und die neuen Builder angepasst.
* Wiederkehrende 404-Warnungen für PrimeIcons- und LiberationSans-Fonts wurden beseitigt.
* Die verwendeten PrimeNG-21-Komponenten wurden im vorhandenen Projektumfang mit Angular 22 geprüft.
* Im aktuellen Teststand sind keine blockierenden Kompatibilitätsprobleme bekannt.

---

### 10. Hinweise für Consumer und Maintainer

#### Für Library-Consumer

* Die Bibliothek kann mit Angular 21 und Angular 22 verwendet werden.
* Die Bibliothek verwendet weiterhin PrimeNG 21.
* Consumer müssen damit rechnen, dass der Paketmanager auf die abweichenden Angular-Peer-Dependencies von PrimeNG 21 hinweist.
* Die Kombination funktioniert im aktuell getesteten Projektstand, ist aber nicht als uneingeschränkt offiziell unterstützte Versionskombination zu verstehen.
* Anwendungen sollten insbesondere die tatsächlich verwendeten PrimeNG-Komponenten in ihrer eigenen Umgebung testen.
* Die Nutzung mit PrimeNG 22 ist nicht Bestandteil dieser Migration.

#### Für Maintainer und CI

* Das Angular-22-Major-Upgrade einschließlich Builder-Wechsel ist der zentrale Breaking-Aspekt.
* Zusätzlich ist die Kombination aus Angular 22 und PrimeNG 21 als technisches Restrisiko zu berücksichtigen.
* Build-, Test- und Deployment-Pipelines müssen Peer-Dependency-Konflikte eindeutig erkennen.
* Abhängigkeiten sollten reproduzierbar über das Lockfile installiert werden.
* Bei jedem Angular-Update sind Build-, Unit-, Integrations- und manuelle UI-Tests erforderlich.
* Eine spätere PrimeNG-Migration muss aufgrund der geänderten Lizenzbedingungen separat bewertet und geplant werden.

---

## Zusammenfassung

### Breaking Changes

* Angular und die zentrale Toolchain wurden auf Version 22 aktualisiert.
* TypeScript, `ng-packagr`, Angular CLI und Angular ESLint wurden auf die zu Angular 22 passenden Versionen angehoben.
* Die Build- und Testkonfiguration verwendet nun Builder aus `@angular/build`.
* CI-Images, lokale Node.js-Versionen und individuelle Build-Integrationen müssen auf Angular-22-Kompatibilität geprüft werden.
* PrimeNG bleibt auf Version 21 und wurde nicht gemeinsam mit Angular aktualisiert.
* Aufgrund der auf Angular 21 ausgerichteten PrimeNG-Peer-Dependencies können bei Angular-22-Consumern Installationswarnungen oder Konflikte auftreten.

### Kompatibilitätsbewertung

* Die Kombination aus Angular 22 und PrimeNG 21 funktioniert im aktuell getesteten Projektstand.
* In den bisher geprüften Bereichen sind keine blockierenden Build-, Test- oder Laufzeitprobleme bekannt.
* Eine vollständige oder offizielle Kompatibilitätsgarantie besteht jedoch nicht.
* Das verbleibende technische Risiko wird derzeit als **mittel** bewertet.
* Die Kombination muss nach jedem weiteren Angular-Update erneut getestet werden.

### Weitere Änderungen

* PrimeNG 21 bleibt als bereits veröffentlichte Version MIT-lizenziert.
* PrimeNG 22 wurde bewusst nicht Bestandteil dieser Migration.
* Die Peer-Dependencies der Bibliothek wurden um Angular 22 erweitert.
* Die öffentliche Widget-API wurde nicht grundlegend verändert.
* Die Demo-Anwendung verwendet explizit XHR.
* Die Demo-Navigation wurde für globale Menüziele auf absolute Routen umgestellt.
* Development- und Production-`baseHref` wurden getrennt.
* PrimeNG-Widget-Routen wurden durch explizite `loadComponent`-Imports stabilisiert.
* Font- und Asset-404 in den Tests wurden behoben.
* Bestehendes Change-Detection-Verhalten wurde mit `ChangeDetectionStrategy.Eager` explizit abgesichert.
* Build- und Testkonfigurationen wurden für Angular 22 konsolidiert und stabilisiert.
* Die ESLint-Konfiguration wurde an Angular ESLint 22 angepasst und der Lint-Lauf wiederhergestellt.
* Die `ng-add`-Schematik trägt nun konsistente Angular-22-Versionen in neue Zielprojekte ein.
* Die Schematics-Pakete wurden auf CommonJS umgestellt, damit `ng generate` in ESM-Projekten fehlerfrei läuft.
* Die `ng-add`-Schematik überspringt bei Angular 22 den automatischen `npm install` und gibt einen Hinweis auf `npm install --legacy-peer-deps`.
* Ein interner Self-Import über `@isy-angular-widgets/public-api` in der Library wurde durch einen relativen Import ersetzt und verhindert damit `Could not resolve`-Fehler im Consumer-Build.
* Eine zukünftige Migration auf PrimeNG 22 muss separat technisch, lizenzrechtlich und wirtschaftlich bewertet werden.

---

# Update Log - 18.05.2026

## Migration `IFS-4984` - isy-wizard Button-Anordnung

### 1. Änderung
- Der `isy-wizard` unterstützt optional einen projektspezifischen Footer über ein projiziertes Template.
- Der Standard-Footer des `isy-wizard` bleibt als Fallback erhalten.
- Die Standard-Anordnung der Buttons im Wizard wurde überarbeitet, damit Aktionen konsistent platziert werden können.

### 2. Auswirkungen / Migration
- Bestehende Anwendungen ohne Custom-Footer bleiben lauffähig.
- Anwendungen sollten die geänderte Standard-Anordnung der Wizard-Buttons fachlich und visuell prüfen.
- Falls bisher implizit von der alten Reihenfolge oder Sichtbarkeit einzelner Aktionen ausgegangen wurde, ist eine Anpassung des eigenen Wizards oder ein projektspezifischer Footer zu prüfen.

### 3. Empfehlung
- Wenn die Standard-Anordnung ausreicht, ist keine technische Migration erforderlich.
- Wenn eine abweichende Reihenfolge, andere Beschriftungen oder projektspezifisches Styling benötigt werden, sollte der Footer des `isy-wizard` explizit per Template definiert werden.

---

# Update Log - 16.02.2026

## Migration auf Angular v21 & PrimeNG v21

### 1. Aktualisierte Frameworks & Tools
- Angular: v20 → **v21.1.4**
- PrimeNG: v20 → **v21.1.1**
- Core-Pakete & CLI aktualisiert
- Migrationshinweise von [update.angular.io](https://update.angular.io) und [PrimeNG Migration Guide](https://primeng.org/migration/v21) umgesetzt

---

### 2. **Breaking Changes**

#### PrimeNG Animationen: PrimeNG v21 verwendet CSS-basierte Animationen aufgrund der Deprecation des Angular-Animations-Pakets. `showTransitionOptions` und `hideTransitionOptions` sind deprecated und haben keine Wirkung mehr (Properties existieren weiterhin, werden jedoch ignoriert). Migration: `provideAnimations()` muss aus der `app.config.ts` entfernt werden.

#### Entfernung von Moment.js (Validierung & Tests)
##### 1. Änderung
- Moment.js wird in der Bibliothek nicht mehr verwendet.
- Unit-Tests verwenden kein Moment.js mehr.

##### 2. Auswirkungen / Migration
- **Moment.js ist keine (Peer-)Abhängigkeit mehr.**
- Consumer können weiterhin Moment-Objekte verwenden, sofern `toDate()` verfügbar ist (Backward Compatibility).
  - Empfehlung: Übergabe von `Date` oder ISO-Strings.

##### 3. Unterstützte Eingabeformate (Validierung)
- `isInFuture` / `isInPast` akzeptieren:
  - `Date`
  - ISO-Date-Only (`YYYY-MM-DD`)
  - ISO-DateTime mit `Z` oder Offset (z. B. `2099-12-31T00:00:00+01:00`)
  - `DD.MM.YYYY`
  - `DD-MM-YYYY` (primär interpretiert als `DD-MM-YYYY`, fallback optional als `MM-DD-YYYY`)
  - `number` (Timestamp)
  - Moment-ähnliche Objekte mit `toDate()`

- `dateFormat(...)` unterstützt die in der Bibliothek verwendeten Formate (u. a. `YYYY-MM-DD`, `DD.MM.YYYY`, `HH:mm:ss`, `YYYY-MM-DDTHH:mm:ss[Z]`, `MM/YY`) und akzeptiert zusätzlich `Date` sowie Moment-ähnliche Objekte via `toDate()`.

**Wichtig:** `isoDateTime` bleibt strikt und akzeptiert nur `YYYY-MM-DDTHH:mm:ssZ` mit literalem `Z` am Ende (UTC). Offsets wie `+01:00` sind ungültig.

---

### 3. Deprecations

#### ngx-translate: Deprecated `TranslateService.currentLang` ersetzt – Nutzung von `getCurrentLang()` statt direktem Property-Zugriff.
#### Angular Tests: Deprecated `BrowserDynamicTestingModule` / `platformBrowserDynamicTesting()` durch `BrowserTestingModule` und `platformBrowserTesting()` ersetzt.

---

### 4. Fixes

#### form-wrapper: Klassenname-Fehler im Template behoben.
#### Styling: Eingabefelder wieder korrekt auf volle Breite (`w-full`) gestylt.
#### PrimeNG: `severity`-Binding typensicher gemacht – es werden nur gültige Severity-Werte übergeben, sonst `undefined`.

---

### 5. Interne Anpassungen

#### Unit-Tests: 
##### ng-mocks ist unter Angular 21 nicht mehr kompatibel.
##### Tests wurden von ng-mocks / MockComponents(...) auf eigene Standalone-Stubs und overrideComponent(...) umgestellt.
##### provideZoneChangeDetection() im Test-Modul ergänzt (stabileres Verhalten unter Angular 21).
##### Modernisierung des Test-Setups: Wechsel von „dynamic testing“-APIs auf BrowserTestingModule / platformBrowserTesting().

#### PrimeNG: Attribut-Notation vereinheitlicht (z. B. ariaLabel).

#### form-wrapper:
##### Reihenfolge der validationMessages-Keys priorisiert (statt der zuvor impliziten Reihenfolge aus control.errors).
##### Fehlertextgröße reduziert.

#### Template:
##### Template-Bindings von String-Interpolation (attr="{{ … }}") auf Property Binding ([attr]="…" inkl. Pipes) umgestellt.
##### Unnötige Property Bindings mit konstanten Strings ([...]= '...') durch direkte Attribute ersetzt.

---

### 6. Änderungen in **_isy-angular-widgets_** (Bibliothek)

#### Paketkonfiguration (`index.ts`)
```ts
addPackageToPackageJson(tree, '@angular/common', '^21.1.4');
addPackageToPackageJson(tree, '@angular/core', '^21.1.4');
addPackageToPackageJson(tree, 'primeng', '^21.1.1');
addPackageToPackageJson(tree, '@primeuix/themes', '^2.0.3');
```

---

### 7. Aktualisierte Abhängigkeiten

#### Demo-App (`package.json`)
```json
{
    "dependencies": {
    "@angular/animations": "^21.1.4",
		"@angular/cdk": "^21.1.4",
		"@angular/common": "^21.1.4",
		"@angular/compiler": "^21.1.4",
		"@angular/core": "^21.1.4",
		"@angular/forms": "^21.1.4",
		"@angular/platform-browser": "^21.1.4",
		"@angular/platform-browser-dynamic": "^21.1.4",
		"@angular/router": "^21.1.4",
		"@primeuix/themes": "^2.0.3",
		"chart.js": "^4.5.1",
		"primeng": "^21.1.1",
		"zone.js": "~0.16.0"
    },
    "devDependencies": {
    "@angular-devkit/build-angular": "^21.1.4",
		"@angular-eslint/builder": "21.2.0",
		"@angular-eslint/eslint-plugin": "21.2.0",
		"@angular-eslint/eslint-plugin-template": "^21.2.0",
		"@angular-eslint/schematics": "21.2.0",
		"@angular-eslint/template-parser": "21.2.0",
		"@angular/cli": "~21.1.4",
		"@angular/compiler-cli": "^21.1.4",
		"@compodoc/compodoc": "^1.2.1",
		"@ngneat/spectator": "^22.1.0",
		"@types/jasmine": "~6.0.0",
		"@types/node": "^25.2.3",
		"@typescript-eslint/eslint-plugin": "^88.55.0",
		"@typescript-eslint/parser": "^8.56.0",
		"eslint": "^9.39.2",
		"eslint-plugin-jsdoc": "^62.5.5",
		"jasmine-core": "~6.0.1",
		"karma-jasmine-html-reporter": "~2.2.0",
		"ng-packagr": "^21.1.0",
		"prettier": "^3.8.1",
		"typescript": "~5.9.3"
    }
}
```

#### Bibliothek (`package.json`)
```json
{
  "peerDependencies": {
    "@angular/common": "^21.1.4",
    "@angular/core": "^21.1.4",
    "primeng": "^21.1.1",
    "@primeuix/themes": "^2.0.3"
  },
}
```

---

### 8. Codequalität geprüft
- **ESLint:** `npm run lint` → keine Fehler
- **Prettier:** `npm run prettier:check` → bestanden

---

### 9. Tests durchgeführt
- **Unit- & Integrationstests:** `npm run test` → alle Tests bestanden
- **Manuelle Tests:** 
  - UI geprüft
  - Hauptfunktionalitäten erfolgreich validiert
  - Keine kritischen Fehler festgestellt

---

## Zusammenfassung

### Breaking Changes:
- Tests: `ng-mocks` raus (Angular 21) → Stubs/`overrideComponent()`. Test-Platform modernisiert + provideZoneChangeDetection() → ggf. Timing/async Tests anpassen.
- PrimeNG: Animationen jetzt CSS-basiert; show/hideTransitionOptions ohne Wirkung.
- form-wrapper: Fehlermeldungs-Priorität bei mehreren Errors kann sich ändern; `validationMessages` ist nicht mehr optional.

### Weitere Änderungen:
- Migration auf Angular 21 & PrimeNG 21: Erfolgreich durchgeführt.
- Veraltete Komponenten ersetzt, neue Features integriert.
- Abhängigkeiten, Tests & Qualitätssicherung auf aktuellem Stand: Alle aktualisiert.
- Alle Breaking Changes dokumentiert: Vollständige Dokumentation für Migration.

---

# Update Log - 08.08.2025

## Migration auf Angular v20 & PrimeNG v20

### 1. Aktualisierte Frameworks & Tools
- Angular: v19 → **v20.1.1**
- PrimeNG: v19 → **v20.0.0**
- Core-Pakete & CLI aktualisiert
- Migrationshinweise von [update.angular.io](https://update.angular.io) und [PrimeNG Migration Guide](https://primeng.org/migration/v20) umgesetzt

---

### 2. **Breaking Changes**

#### Umstellung auf Flat Config-Format (ESLint)
- Das isy-eslint-plugin nutzt nun das Flat Config-Format, was eine Umstellung der Projektkonfiguration auf eslint.config.js erfordert
- Die Nutzung von .eslintrc.js oder .eslintrc.json ist nicht mehr möglich
- Die Konfiguration muss auf eslint.config.js umgestellt werden und ist im [Migration Guide](https://eslint.style/guide/migration) nachzulesen

#### Umstellung auf inject()
- Einführung von inject() statt der traditionellen DI im Konstruktor in Angular
- Anpassungen an bestehenden Komponenten oder Services sind möglicherweise erforderlich
- Falls die Umstellung auf [inject()](https://angular.dev/reference/migrations/inject-function) nicht gewünscht ist, kann dies durch die Regel @angular-eslint/no-inject-in-constructor: 'off' in der ESLint-Konfiguration deaktiviert werden 

####  Ersetzung von @primeng/themes durch @primeuix/themes
- Das Ersetzen von @primeng/themes durch @primeuix/themes erfordert Anpassungen an Imports, Styles und Konfigurationen
- Paketname, API, Struktur und Build-Konfiguration ändern sich. Möglicherweise müssen auch andere Abhängigkeiten aktualisiert werden
- Imports und Konfigurationen auf das neue Paket anpassen

#### Upgrade von ngx-translate von v16 auf v17
- Das Upgrade auf Version 17 könnte API-Änderungen oder neue Konfigurationen beinhalten
- Es könnten Anpassungen erforderlich sein
- Details und spezifische Breaking Changes sind im [Migration Guide](https://ngx-translate.org/getting-started/migration-guide/) nachzulesen

#### Upgrade von Spectator von v19.6.2 auf v21.0.1
- Das Upgrade könnte API-Änderungen oder neue Funktionen beinhalten
- Möglicherweise sind Anpassungen erforderlich
- Weitere Details und spezifische Breaking Changes sind im [Changelog](https://github.com/ngneat/spectator/blob/master/CHANGELOG.md) nachzulesen

---

### 3. Änderungen in **_isy-angular-widgets_** (Bibliothek)

#### Paketkonfiguration (`index.ts`)
```ts
addPackageToPackageJson(tree, '@angular/common', '^20.1.6');
addPackageToPackageJson(tree, '@angular/core', '^20.1.6');
addPackageToPackageJson(tree, 'primeng', '^20.0.1');
addPackageToPackageJson(tree, '@primeuix/themes', '^1.2.3');
```

---

### 4. Aktualisierte Abhängigkeiten

#### Demo-App (`package.json`)
```json
{
    "dependencies": {
        "@angular/animations": "^20.1.6",
        "@angular/cdk": "^20.1.5",
        "@angular/common": "^20.1.6",
        "@angular/compiler": "^20.1.6",
        "@angular/core": "^20.1.6",
        "@angular/forms": "^20.1.6",
        "@angular/platform-browser": "^20.1.6",
        "@angular/platform-browser-dynamic": "^20.1.6",
        "@angular/router": "^20.1.6",
        "@ngx-translate/core": "^17.0.0",
        "@ngx-translate/http-loader": "^17.0.0",
        "@primeuix/themes": "^1.2.3",
        "chart.js": "^4.5.0",
        "flag-icons": "^7.5.0",
        "primeflex": "^4.0.0",
        "primeng": "^20.0.1",
    },
    "devDependencies": {
        "@angular-devkit/build-angular": "^20.1.5",
        "@angular-eslint/builder": "20.1.1",
        "@angular-eslint/eslint-plugin": "20.1.1",
        "@angular-eslint/eslint-plugin-template": "^20.1.1",
        "@angular-eslint/schematics": "20.1.1",
        "@angular-eslint/template-parser": "20.1.1",
        "@angular/cli": "~20.1.5",
        "@angular/compiler-cli": "^20.1.6",
        "@isyfact/eslint-plugin": "4.0.0",
        "@ngneat/spectator": "^21.0.1",
        "@stylistic/eslint-plugin": "^5.2.3",
        "@types/jasmine": "~5.1.8",
        "@types/node": "^24.2.1",
        "@typescript-eslint/eslint-plugin": "^8.39.0",
        "@typescript-eslint/parser": "^8.39.0",
        "eslint": "^9.33.0",
        "eslint-plugin-editorconfig": "^4.0.3",
        "eslint-plugin-jsdoc": "^52.0.4",
        "jasmine-core": "~5.9.0",
        "karma": "^6.4.4",
        "ng-mocks": "^14.13.5",
        "ng-packagr": "^20.1.0",
        "prettier": "^3.6.2",
    }
}
```

#### Bibliothek (`package.json`)
```json
{
  "peerDependencies": {
    "@angular/common": "^20.1.6",
    "@angular/core": "^20.1.6",
    "primeng": "^20.0.1",
    "@primeuix/themes": "^1.2.3"
  },
}
```

---

### 5. CI/CD
- GitHub Actions Workflow aktualisiert:
  - `actions/checkout@v4` und `actions/setup-node@v4`
  - Node.js Version auf `20.x` angehoben

---

### 6. Codequalität geprüft
- **ESLint:** `npm run lint` → keine Fehler
- **Prettier:** `npm run prettier:check` → bestanden

---

### 7. Tests durchgeführt
- **Unit- & Integrationstests:** `npm run test` → alle Tests bestanden
- **Manuelle Tests:** 
  - UI geprüft
  - Hauptfunktionalitäten erfolgreich validiert
  - Keine kritischen Fehler festgestellt

---

## Zusammenfassung

### Breaking Changes:
- Flat Config-Format: Umstellung auf eslint.config.js, .eslintrc.js und .eslintrc.json nicht mehr unterstützt.
- inject(): Umstellung auf inject() in Angular, kann mit @angular-eslint/no-inject-in-constructor: 'off' deaktiviert werden.
- @primeng/themes → @primeuix/themes: Anpassungen an Imports, Styles und Konfiguration erforderlich.
- ngx-translate Update: API-Änderungen in Version 17, Migration Guide prüfen.
- Spectator Update: API-Änderungen in Version 21, Changelog prüfen.

### Weitere Änderungen:
- Migration auf Angular 20 & PrimeNG 20: Erfolgreich durchgeführt.
- Veraltete Komponenten ersetzt, neue Features integriert.
- GitHub Actions Workflow aktualisiert
- Abhängigkeiten, Tests & Qualitätssicherung auf aktuellem Stand: Alle aktualisiert.
- Alle Breaking Changes dokumentiert: Vollständige Dokumentation für Migration.

---

# Update Log - 09.05.2025

## Migration auf Angular v19 & PrimeNG v19

### 1. Aktualisierte Frameworks & Tools
- Angular: v18 → **v19.2.9**
- PrimeNG: v17 → **v19.1.2**
- Core-Pakete & CLI aktualisiert
- Migrationshinweise von [update.angular.io](https://update.angular.io) und [PrimeNG Migration Guide](https://primeng.org/migration/v19) umgesetzt

---

### 2. Änderungen in **_isy-angular-widgets_** (Bibliothek)

#### Paketkonfiguration (`index.ts`)
```ts
addPackageToPackageJson(tree, '@angular/common', '^19.2.9');
addPackageToPackageJson(tree, '@angular/core', '^19.2.9');
addPackageToPackageJson(tree, 'primeng', '^19.1.2');
addPackageToPackageJson(tree, '@primeng/themes', '^19.1.2');
```

#### Überarbeitete Dateien (Auswahl)
- Komponenten: `form-wrapper`, `hauptfenster`, `input-char`, `incomplete-date`, `multi-select-button`, `wizard`, `interactive-elements`
- Direktiven & Services: `input-char.directive`, `security-directive`, `security-guard`, `widgets-config.service`
- Tests: Alle zugehörigen .spec.ts-Dateien aktualisiert
- Übersetzungen: `de.json`, `en.json`
- **Gelöschte Module** (durch Umstieg auf Standalone): `hauptfenster.module.ts`, `wizard.module.ts`, `incomplete-date.module.ts`, `security.module.ts`

#### Neue Komponenten & Funktionen
- Neues IsyFact-Theme via `provideIsyFactTheme()`
- Alte Themes (`theme.css`, `FluentUI`) entfernt
- Neue Design-Variablen für das IsyFact-Styling
- `form-wrapper`: Unterstützung für Label-ID
- `skip-links`-Komponente zur barrierefreien Navigation
- `isy-wizard`: Neue Eigenschaft `allowFreeNavigation` für freie Schritt-Navigation
- Aktiver Zustand in der Links-Navigation farblich hervorgehoben
- Styling des `isy-input-char`-Dialogs überarbeitet
- Styling von schreibgeschützten Eingabefeldern angepasst  

---

### 3. Änderungen in **_isy-angular-widgets-demo_** (Demo-App)

#### Überarbeitete Dateien (Auswahl)
- Komponenten: `dashboard-*`, `isy-angular-components`, `objekt-*`, `primeng-*`
- Services: `date.service.ts`, `menu-translation.service.ts`, `page-title.service.ts`
- Übersetzungen: `de.json`, `en.json`
- Modulstruktur & Imports angepasst

---

### 4. PrimeNG-Komponenten ersetzt/aktualisiert

**Umbenannte Komponenten**

| Alt             | Neu               |
|-----------------|-------------------|
| `Calendar`      | `DatePicker`      |
| `Dropdown`      | `Select`          |
| `InputSwitch`   | `ToggleSwitch`    |
| `OverlayPanel`  | `Popover`         |
| `Sidebar`       | `Drawer`          |

**Ersetzte/veraltete Komponenten:**

| Alt              | Neu                                        |
|------------------|--------------------------------------------|
| `Chips`          | `AutoComplete` (multiple, ohne Typeahead)  |
| `TabMenu`        | `Tabs` (ohne Panels)                       |
| `Steps`          | `Stepper` (ohne Panels)                    |
| `InlineMessage`  | `Message`-Komponente                       |
| `TabView`        | `Tabs`-Komponenten                         |
| `Accordion`      | `AccordionPanel` + `Header` + `Content`    |
| `Messages`       | `Message`-Komponente                       |

---

### 5. Technische Anpassungen

#### Angular v19
- `TranslateModule.forChild()` für Lazy-Loaded Modules
- Konstante Werte mit readonly
- Migration auf standalone: true/false für Komponenten

#### PrimeNG v19
- Konfiguration jetzt via `providePrimeNG()` über `provideIsyFactTheme`
- `TriStateCheckbox` durch `p-checkbox` mit `indeterminate` ersetzt
- Checkbox-Label via `<label>` statt label-Property
- Chips `p-chips` ersetzt durch AutoComplete `p-autoComplete` (`multiple`, `typeahead=false`)
- `pInputTextarea` → `pTextarea`
- `severity="warning"` → `severity="warn"`
- `size` → `badgeSize`
- `Message` → `ToastMessageOptions` (wegen Namenskonflikt)

---

### 6. Aktualisierte Abhängigkeiten

#### Demo-App (`package.json`)
```json
{
    "dependencies": {
        "@angular/animations": "^19.2.9",
        "@angular/cdk": "^19.2.14",
        "@angular/common": "^19.2.9",
        "@angular/compiler": "^19.2.9",
        "@angular/core": "^19.2.9",
        "@angular/forms": "^19.2.9",
        "@angular/platform-browser": "^19.2.9",
        "@angular/platform-browser-dynamic": "^19.2.9",
        "@angular/router": "^19.2.9",
        "@ngx-translate/core": "^16.0.4",
        "@ngx-translate/http-loader": "^16.0.1",
        "@primeng/themes": "^19.1.2",
        "chart.js": "^4.4.9",
        "flag-icons": "^7.3.2",
        "primeflex": "^4.0.0",
        "primeng": "^19.1.2",
        "quill": "^2.0.3",
        "rxjs": "^7.8.2",
        "tslib": "^2.8.1",
        "zone.js": "~0.15.0"
    },
    "devDependencies": {
        "@angular-devkit/build-angular": "^19.2.10",
        "@angular-eslint/builder": "19.3.0",
        "@angular-eslint/eslint-plugin": "19.3.0",
        "@angular-eslint/eslint-plugin-template": "^19.3.0",
        "@angular-eslint/schematics": "19.3.0",
        "@angular-eslint/template-parser": "19.3.0",
        "@angular/cli": "~19.2.10",
        "@angular/compiler-cli": "^19.2.9",
        "@compodoc/compodoc": "^1.1.26",
        "@isyfact/eslint-plugin": "3.0.1",
        "@ngneat/spectator": "^19.5.0",
        "@stylistic/eslint-plugin-ts": "^3.1.0",
        "@types/jasmine": "~5.1.8",
        "@types/node": "^18.19.96",
        "@typescript-eslint/eslint-plugin": "^8.32.0",
        "@typescript-eslint/parser": "^8.32.0",
        "eslint": "^9.26.0",
        "eslint-plugin-jsdoc": "^50.6.11",
        "jasmine-core": "~5.7.1",
        "ng-mocks": "^14.13.4",
        "ng-packagr": "^19.2.2",
        "prettier": "^3.5.3",
        "typescript": "~5.8.3"
    }
}
```

#### Bibliothek (`package.json`)
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

### 7. **Behandelte GitHub-Issues**

| ID    | Titel                                                                     |
|-------|---------------------------------------------------------------------------|
| #254  | Missing option in p-steps for jumping between steps                       |
| #249  | P-Multiselect loses focus by using keyboard                               |
| #247  | Style of readonly Inputs                                                  |
| #241  | Charpicker loses Focus                                                    |
| #239  | Provide a skip link in isy-hauptfenster                                   |
| #238  | Allow Form Field Wrapper label id to be specified                         |
| #237  | multi-select-button.component.scss overrides global styles of p-accordion |

---

### 8. Codequalität geprüft
- **ESLint:** `npm run lint` → keine Fehler
- **Prettier:** `npm run prettier:check` → bestanden

---

### 9. Tests durchgeführt
- **Unit- & Integrationstests:** `npm run test` → alle Tests bestanden
- **Manuelle Tests:** 
  - UI geprüft
  - Hauptfunktionalitäten erfolgreich validiert
  - Keine kritischen Fehler festgestellt

---

### **Breaking Changes**

#### Angular v19
- Module entfernt (→ Umstellung auf standalone)
- Lazy-Loaded Translations benötigen `TranslateModule.forChild()`
- `readonly` für konstante Variablen empfohlen

#### PrimeNG v19
- Diverse Komponenten ersetzt (siehe oben)
- API-Änderungen: Properties & Komponentenverhalten angepasst
- Konfiguration über `provideIsyFactTheme()` statt `PrimeNGConfig`

#### isy-angular-widgets v19
- **Validierungsfehler-Objekte umbenannt** (vorher als TODO markiert):

| Alt                       | Neu                             |
|---------------------------|---------------------------------|
| FUTURE                    | INVALIDFUTUREDATE               |
| PAST                      | INVALIDPASTDATE                 |
| UNSPECIFIEDDATE           | INVALIDUNSPECIFIEDDATE          |
| UNSPECIFIEDISODATE        | INVALIDUNSPECIFIEDISODATE       |
| CREDITCARDEXPIRATIONDATE  | INVALIDCREDITCARDEXPIRATIONDATE |
| CREDITCARD                | INVALIDCREDITCARDNUMBER         |
| DATE                      | INVALIDISODATE                  |
| TIME                      | INVALIDISOTIME                  |
| DATETIME                  | INVALIDISODATETIME              |

- **@deprecated:**
  - Der Output `stepperIndexChange` wurde in `indexChange` umbenannt und in der Demo-Anwendung angepasst.

---

## Zusammenfassung
- Migration auf Angular 19 & PrimeNG 19 erfolgreich durchgeführt
- Veraltete Komponenten ersetzt, neue Features integriert
- Theming modernisiert & Standalone-Ansatz umgesetzt
- Abhängigkeiten, Tests & Qualitätssicherung auf aktuellem Stand
- Alle Breaking Changes dokumentiert

---

# Update Log - 03.09.2024

## Update von Angular v17 auf v18

### Aktualisierungsschritte

1. **Aktualisierung der Angular CLI und Core-Pakete**

2. **Überprüfung der Migrationshinweise auf https://update.angular.io/**

3. **Code-Anpassungen in der _isy-angular-widgets_ Bibliothek:**

    Anpassungen in `index.ts` vorgenommen:
    ```typescript
    addPackageToPackageJson(tree, '@angular/common', '^18.1.4');
    addPackageToPackageJson(tree, '@angular/core', '^18.1.4');
    addPackageToPackageJson(tree, 'primeicons', '^7.0.0');
    addPackageToPackageJson(tree, 'primeng', '^17.18.8');
    addPackageToPackageJson(tree, 'moment', '^2.30.1');
    ```

    Anpassungen vorgenommen in:
    - `correlation-id-http-interceptor.spec.ts`
    - `zipkin-open-tracing-http-interceptor.spec.ts`
    - `wizard.component.spec.ts`

    Veraltete Module:
    - `HttpClientModule` durch `provideHttpClient()` ersetzt
    - `HttpClientTestingModule` durch `provideHttpClientTesting()` ersetzt
    - `RouterTestingModule`  durch `provideRouter()` ersetzt

4. **Code-Anpassungen in der _isy-angular-widgets-demo_ (Demo-Anwendung):**

    Anpassungen vorgenommen in:
    - `app.module.ts`
    - `objekt-suchen.component.spec.ts`
    - `objekt-anzeigen.component.spec.ts`

    Veraltete Module:
    - `HttpClientModule` durch `provideHttpClient()` ersetzt
    - `RouterTestingModule`  durch `provideRouter()` ersetzt

    Anpassung in der `tsconfig.json` vorgenommen:
    Der Eintrag `resolveJsonModule` wurde hinzugefügt und aktiviert, um den Import von Modulen mit der Erweiterung `.json` zu ermöglichen, da TypeScript standardmäßig keine JSON-Dateien auflöst. Die Datei `sonderzeichenliste.json` wird in den folgenden Dateien verwendet:
    - `character.service.ts`
    - `multi-select-button.component.spec.ts`
    - `input-char-preview.component.spec.ts`
    - `input-char-dialog.component.spec.ts`

5. **Abhängigkeiten aktualisiert:**
    - `package.json` überprüft und folgende Abhängigkeiten aktualisiert:
        ```json
        {
            "dependencies": {
                "@angular/animations": "^18.1.4",
                "@angular/cdk": "^18.1.4",
                "@angular/common": "^18.1.4",
                "@angular/compiler": "^18.1.4",
                "@angular/core": "^18.1.4",
                "@angular/forms": "^18.1.4",
                "@angular/platform-browser": "^18.1.4",
                "@angular/platform-browser-dynamic": "^18.1.4",
                "@angular/router": "^18.1.4",
                "chart.js": "^4.4.3",
                "flag-icons": "^7.2.3",
                "primeicons": "^7.0.0",
                "primeng": "^17.18.8",
                "tslib": "^2.6.3",
                "zone.js": "~0.14.10"
            },
            "devDependencies": {
                "@angular-devkit/build-angular": "^18.1.4",
                "@angular-eslint/builder": "18.2.0",
                "@angular-eslint/eslint-plugin": "18.2.0",
                "@angular-eslint/eslint-plugin-template": "^18.2.0",
                "@angular-eslint/schematics": "18.2.0",
                "@angular-eslint/template-parser": "18.2.0",
                "@angular/cli": "~18.1.4",
                "@angular/compiler-cli": "^18.1.4",
                "@compodoc/compodoc": "^1.1.25",
                "@isyfact/eslint-plugin": "2.0.0",
                "@ngneat/spectator": "^19.0.0",
                "@stylistic/eslint-plugin-ts": "^2.6.2",
                "@types/node": "^22.2.0",
                "@typescript-eslint/eslint-plugin": "^8.0.1",
                "@typescript-eslint/parser": "^8.0.1",
                "eslint": "^9.9.0",
                "eslint-plugin-jsdoc": "^50.0.1",
                "jasmine-core": "~5.2.0",
                "karma": "^6.4.4",
                "moment": "^2.30.1",
                "ng-mocks": "^14.13.0",
                "ng-packagr": "^18.1.0",
                "prettier": "^3.3.3",
                "typescript": "~5.5.4"
            }
        }
        ```

    - `package.json` in der _isy-angular-widgets_ Bibliothek überprüft und folgende Abhängigkeiten aktualisiert:
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
6. **ESlint- und Prettier-Überprüfung durchgeführt:**
    - **ESlint:** Mit `npm run lint` ausgeführt.
    - **Prettier:** Mit `npm run prettier:check` ausgeführt.

7. **Tests durchgeführt:**
    - **Unit- und Integrations-Tests:** Mit `npm run test` ausgeführt, um sicherzustellen, dass alle Tests bestehen.

8. **Manuelle Überprüfung:**
   - Manuelle Tests der Hauptfunktionalitäten der Anwendung durchgeführt.
   - Überprüfung der Benutzeroberfläche auf Darstellungsfehler.
   - Sicherstellung, dass alle kritischen Pfade in der Anwendung wie erwartet funktionieren.

### Zusammenfassung der Änderungen
   - Angular von Version v17 auf v18 aktualisiert.
   - Veraltete Module durch aktuelle ersetzt.
   - Abhängigkeiten in `package.json` aktualisiert.
   - ESlint- und Prettier-Überprüfung erfolgreich durchgeführt und bestanden.
   - Tests erfolgreich durchgeführt und bestanden.
