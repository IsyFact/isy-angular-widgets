# Beitragen zu isy-angular-widgets

Vielen Dank für dein Interesse an *isy-angular-widgets*. Dieses Dokument beschreibt, wie Beiträge zu diesem Repository eingebracht werden und welche Konventionen dabei einzuhalten sind.

Beiträge sind willkommen – von Fehlermeldungen über Verbesserungsvorschläge bis hin zu Pull Requests.

## Inhalt

- [Wie kann ich beitragen?](#wie-kann-ich-beitragen)
- [Branch-Modell](#branch-modell)
- [Branch-Namenskonvention](#branch-namenskonvention)
- [Commit-Konventionen](#commit-konventionen)
- [Pull Requests](#pull-requests)
- [Lokale Entwicklung und Qualitätssicherung](#lokale-entwicklung-und-qualitätssicherung)
- [Dokumentation pflegen](#dokumentation-pflegen)
- [Release-Prozess](#release-prozess)
- [Sprachregelung](#sprachregelung)
- [Lizenz](#lizenz)

---

## Wie kann ich beitragen?

### Sicherheitslücken melden

> **Sicherheitslücken bitte nicht über ein öffentliches GitHub-Issue melden.**

Vermutete Schwachstellen werden vertraulich gemeldet – entweder über die [Security Advisories](https://github.com/IsyFact/isy-angular-widgets/security/advisories/new) des Repositories oder per E-Mail an <isyfact@bva.bund.de>. Nach der Behebung erfolgt eine koordinierte Veröffentlichung.

### Fehler melden und Features vorschlagen

Externe Beitragende melden Fehler und Feature-Wünsche über [GitHub Issues](https://github.com/IsyFact/isy-angular-widgets/issues).

Der weitere Ablauf:

1. Das IsyFact-Team sichtet eingehende Issues.
2. Das Issue wird entweder zur Umsetzung eingeplant oder mit Begründung abgelehnt.
3. Die eigentliche Entwicklungsverfolgung erfolgt **nicht** im GitHub-Issue, sondern in einem internen Ticketsystem des IsyFact-Teams.

> **Hinweis:** Ein GitHub-Issue bildet den Umsetzungsfortschritt daher nicht vollständig ab. Das Issue bleibt jedoch der Ort für Rückfragen und wird nach Abschluss geschlossen.

Ein gutes Issue enthält:

- eine klare Beschreibung des Problems oder des gewünschten Verhaltens,
- die verwendeten Versionen von *isy-angular-widgets*, Angular und PrimeNG,
- bei Fehlern: eine Schritt-für-Schritt-Anleitung zur Reproduktion sowie erwartetes und tatsächliches Verhalten,
- nach Möglichkeit ein minimales Reproduktionsbeispiel.

### Quellcode beitragen

Eigene Quellcode-Änderungen können jederzeit als Pull Request eingebracht werden. Voraussetzung ist ein passendes Issue, das die Änderung beschreibt – die daraus resultierende Issue-ID wird in Branch-Namen und Commit-Nachrichten referenziert.

Das IsyFact-Team reviewt eingehende Pull Requests und integriert sie entsprechend.

### Issue-ID

Die Issue-ID ist je nach Herkunft des Beitrags:

| Herkunft | Issue-ID | Beispiel |
|---|---|---|
| IsyFact-Team / Kundenprojekt | interne Jira-Ticketnummer | `IFS-5725` |
| Community-Beitrag | Nummer des GitHub-Issues | `123` |

Die Issue-ID wird ohne zusätzliche Sonderzeichen angegeben – also `123` und nicht `#123`.

---

## Branch-Modell

Es werden immer die **letzten beiden Angular-Major-Versionen** unterstützt. Daraus ergeben sich pro unterstützter Version je ein Entwicklungs- und ein Stabilitätsbranch.

| Branch | Zweck |
|---|---|
| `develop` | Aktueller Entwicklungsstand der **neuesten** unterstützten Version |
| `develop-<major>` | Aktueller Entwicklungsstand der **älteren** unterstützten Version, z. B. `develop-21` |
| `main` | Stabiler Code-Stand der **neuesten** unterstützten Version |
| `support/<major>` | Stabiler Code-Stand der **älteren** unterstützten Version, z. B. `support/21` |

Schematisch:

```text
neueste Version   ──  develop        ──►  main
ältere Version    ──  develop-<major> ──►  support/<major>
```

### Zielbranch für Beiträge

> **Beitragende erstellen ihre Pull Requests ausschließlich gegen den passenden `develop`-Branch.**

- Änderung betrifft die neueste unterstützte Version → Zielbranch `develop`
- Änderung betrifft die ältere unterstützte Version → Zielbranch `develop-<major>`, z. B. `develop-21`

Pull Requests gegen `main` oder `support/<major>` werden nicht angenommen. Die Überführung stabiler Stände in diese Branches übernimmt das IsyFact-Team im Rahmen des Release-Prozesses.

Betrifft eine Änderung beide unterstützten Versionen, wird sie zunächst gegen `develop` eingereicht. Das IsyFact-Team entscheidet anschließend über eine Übernahme in die ältere Linie.

---

## Branch-Namenskonvention

Branch-Namen sind **auf Englisch** zu schreiben und folgen diesem Schema:

```text
<typ>/<issue-id>-<description>
```

| Präfix | Verwendung |
|---|---|
| `feature/` | Neue Funktionalität |
| `fix/` | Fehlerbehebung |
| `release/` | Vorbereitung eines Releases (nur IsyFact-Team) |

Beispiele:

```text
feature/IFS-5725-rework-documentation-structure
fix/IFS-5714-fallback-text-for-invalid-input
feature/123-add-tooltip-to-wizard-steps
release/22.0.0-next.1
```

Für Release-Branches wird anstelle von Issue-ID und Beschreibung die **geplante Version** verwendet: `release/<planned-version>`.

> **Hinweis:** Das Branch-Präfix lautet `feature/`, der zugehörige Commit-Typ nach Conventional Commits dagegen `feat`. Diese Abweichung ist beabsichtigt.

Empfehlungen für den beschreibenden Teil:

- Kleinbuchstaben, Wörter mit Bindestrich getrennt,
- kurz und aussagekräftig,
- keine Umlaute oder Sonderzeichen.

Die Issue-ID selbst wird in der Schreibweise des jeweiligen Ticketsystems übernommen, also zum Beispiel `IFS-5725`.

---

## Commit-Konventionen

Für Commit-Nachrichten gilt der Standard [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/). Commit-Nachrichten sind **auf Englisch** zu schreiben.

### Format

```text
<typ>[optionaler scope]: <issue-id> <description>

[optionaler body]

[optionaler footer]
```

Die **Issue-ID wird immer referenziert** und steht direkt nach dem Doppelpunkt.

### Erlaubte Typen

| Typ | Bedeutung |
|---|---|
| `feat` | Neue Funktionalität |
| `fix` | Fehlerbehebung |
| `docs` | Ausschließlich Dokumentationsänderungen |
| `refactor` | Umbau ohne Verhaltensänderung |
| `perf` | Performance-Verbesserung |
| `test` | Ergänzen oder Korrigieren von Tests |
| `build` | Build-System oder Abhängigkeiten |
| `ci` | CI-Konfiguration und -Skripte |
| `chore` | Sonstige Wartungsaufgaben ohne Auswirkung auf den Produktivcode |
| `revert` | Zurücknehmen eines vorherigen Commits |

### Beispiele

```text
feat: IFS-5695 add disabled step support to isy-wizard
fix: IFS-5714 allow consumers to override the invalid input fallback text
docs: IFS-5725 migrate update log into a structured migration guide
ci: IFS-5735 publish demo and docs for the v21 line alongside v22
feat: 123 add tooltip to wizard steps
```

### Breaking Changes

Breaking Changes werden gemäß Conventional Commits gekennzeichnet – entweder durch ein `!` nach Typ bzw. Scope oder durch einen `BREAKING CHANGE:`-Footer:

```text
feat!: IFS-5476 replace PrimeFlex utilities with Tailwind CSS

BREAKING CHANGE: PrimeFlex-Utilities werden nicht mehr ausgeliefert.
Bestehende Anwendungen müssen betroffene Klassen auf Tailwind CSS umstellen.
```

Jeder Breaking Change muss zusätzlich in der [MIGRATION.md](projects/isy-angular-widgets/MIGRATION.md) dokumentiert werden – siehe [Dokumentation pflegen](#dokumentation-pflegen).

---

## Pull Requests

### Voraussetzungen

1. Es existiert ein passendes Issue, das die Änderung beschreibt.
2. Der Zielbranch ist der passende `develop`-Branch (siehe [Zielbranch für Beiträge](#zielbranch-für-beiträge)).
3. Branch-Name und Commit-Nachrichten entsprechen den obigen Konventionen.
4. **Alle CI-Checks des Repositories sind erfüllt.**

> **Wichtig:** Pull Requests, die die CI-Checks nicht erfüllen, werden ungesichtet abgelehnt. Bitte prüfe den Status der Checks, bevor du den Pull Request zum Review freigibst.

Die CI-Checks laufen für beide unterstützten Linien identisch – ein Pull Request gegen `develop-<major>` durchläuft dieselben Prüfungen wie einer gegen `develop`.

### Checkliste vor dem Öffnen eines Pull Requests

- [ ] Änderung ist durch ein Issue abgedeckt und die Issue-ID wird referenziert
- [ ] Zielbranch ist der passende `develop`-Branch
- [ ] `npm run prettier:check` läuft fehlerfrei
- [ ] `npm run lint` läuft fehlerfrei
- [ ] `npm test` läuft fehlerfrei
- [ ] Neue oder geänderte Funktionalität ist durch Tests abgedeckt
- [ ] `CHANGELOG.md` wurde ergänzt
- [ ] Bei Breaking Changes: `MIGRATION.md` wurde ergänzt
- [ ] Betroffene Dokumentation (README) wurde aktualisiert

### Ablauf

1. Repository forken bzw. Branch anlegen.
2. Änderungen umsetzen und committen.
3. Pull Request gegen den passenden `develop`-Branch öffnen.
4. Beschreibung ausfüllen: Was wurde geändert, warum, und welches Issue wird adressiert.
5. CI-Checks abwarten und gegebenenfalls nachbessern.
6. Review durch das IsyFact-Team; Rückfragen werden im Pull Request geklärt.
7. Nach erfolgreichem Review integriert das IsyFact-Team die Änderung.

### Merge-Strategie

Pull Requests werden standardmäßig per **Squash and Merge** zusammengeführt. Der gesamte Beitrag landet damit als ein einzelner Commit im Zielbranch.

Daraus folgt:

- Die Commit-Historie innerhalb des Pull Requests darf Zwischenstände enthalten; sie wird beim Merge zusammengefasst.
- Maßgeblich ist die Nachricht des Squash-Commits – sie muss den [Commit-Konventionen](#commit-konventionen) inklusive Issue-Referenz entsprechen.
- Ein aussagekräftiger Pull-Request-Titel im Format einer Conventional-Commit-Nachricht erleichtert diesen Schritt.

---

## Lokale Entwicklung und Qualitätssicherung

Eine ausführliche Anleitung zum Aufsetzen der Entwicklungsumgebung steht in der [README.md](README.md).

### Voraussetzungen

Das Projekt setzt die in der `package.json` unter `engines` definierte Node.js-Version voraus. Die CI baut und testet mit Node.js 24.

```shell
npm ci
```

### Prüfungen vor dem Commit

Die folgenden Befehle entsprechen den zentralen Schritten der CI-Pipeline und sollten lokal fehlerfrei durchlaufen:

```shell
npm run prettier:check     # Codeformatierung
npm run lint               # Linting von Bibliothek und Demo-Anwendung
npm test                   # Unit- und Integrationstests
npm run build:widgets_lib  # Build der Bibliothek
npm run build:widgets_demo # Build der Demo-Anwendung
```

Formatierungsfehler lassen sich automatisch beheben:

```shell
npm run prettier:fix
```

Zusätzlich führt die CI einen SonarCloud-Scan sowie einen Compodoc-Build (`npm run compodoc:build`) aus.

---

## Dokumentation pflegen

Zu einer vollständigen Änderung gehört die passende Dokumentation.

| Datei | Wann anzupassen |
|---|---|
| [`CHANGELOG.md`](CHANGELOG.md) | Bei jeder fachlich relevanten Änderung – Eintrag im obersten, noch unveröffentlichten Versionsabschnitt mit Issue-ID |
| [`projects/isy-angular-widgets/MIGRATION.md`](projects/isy-angular-widgets/MIGRATION.md) | Bei jedem Breaking Change – Beschreibung nach dem Muster *Änderung → Auswirkung → Migration* |
| [`projects/isy-angular-widgets/README.md`](projects/isy-angular-widgets/README.md) | Bei Änderungen an der öffentlichen API oder Einbindung der Bibliothek |
| [`README.md`](README.md) | Bei Änderungen am Entwicklungs-Setup oder an den npm-Skripten |

Format der CHANGELOG-Einträge:

```markdown
## Features
- IFS-5725: Kurzbeschreibung der Änderung
```

---

## Release-Prozess

> Dieser Abschnitt richtet sich an das IsyFact-Team. Externe Beitragende sind hiervon nicht betroffen.

Releases werden über einen Branch nach dem Schema `release/<planned-version>` vorbereitet, zum Beispiel `release/22.0.0-next.1`.

Die CI prüft auf Release-Branches zusätzlich, ob der oberste Eintrag in der `CHANGELOG.md` die im Branch-Namen genannte Version beschreibt. Der `CHANGELOG.md`-Eintrag muss daher vor dem Push angepasst werden.

Weitere Details zum Vorgehen stehen im Abschnitt *Erstellen von Releases* der [README.md](README.md).

---

## Sprachregelung

| Artefakt | Sprache |
|---|---|
| Branch-Namen | Englisch |
| Commit-Nachrichten | Englisch |
| Quellcode, Bezeichner und Code-Kommentare | Englisch |
| Dokumentation in Markdown-Dateien | **Deutsch** |

---

## Lizenz

Mit dem Einreichen eines Beitrags erklärst du dich damit einverstanden, dass dieser unter der [Apache-2.0-Lizenz](LICENSE) des Projekts veröffentlicht wird.
