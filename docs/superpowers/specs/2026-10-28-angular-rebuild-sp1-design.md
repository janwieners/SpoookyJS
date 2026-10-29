# SpoookyJS — Angular-Neubau: SP1 (Fundament & vertikaler Durchstich)

**Datum:** 2026-10-28
**Autor:** Jan Wieners (mit Claude)
**Status:** Entwurf zur Freigabe

---

## 1. Kontext

SpoookyJS ist ein multiagentenbasiertes Framework für browserbasierte Brettspiele mit
spielübergreifender KI (Monte-Carlo-Tree-Search), entstanden als Teil einer Dissertation.
Der aktuelle Stand (`src/`) basiert auf AngularJS 1.7.9 (End-of-Life) und wird mit gulp 3.9.1
gebaut. Ziel ist ein Neubau mit modernem Angular — **nicht** als 1:1-Portierung, sondern um
die Anwendung zu modernisieren und gezielt auszubauen.

**Ausbau-Richtung (vom Autor gewählt):** bessere KI-Visualisierung und stärkere/konfigurierbare
KI. Beides bleibt Frontend-/Engine-nah — **kein Backend**. Daraus folgt der didaktische Fokus:
der Entscheidungsprozess der KI soll sichtbar und einstellbar werden.

**UI-Richtung:** echtes Redesign mit der KI-Visualisierung als zentralem Element (nicht pixelgenaue
Kopie des alten Bootstrap-3-Looks).

### Zentraler Befund aus der Codebase

Die Kopplung an AngularJS steckt fast vollständig in **einer** Datei, `src/js/spoooky.Modules.js`
(der „AngularWrapper": definiert das `SpoookyGame`-Modul, alle Controller und Directives). Die
~10.000 Zeilen Engine (`spoooky.AI.js`, `spoooky.MetaAgent.js`, `spoooky.Entity.js`,
`spoooky.Game.js`, `spoooky.GridWelt.js`, `spoooky.GameEvents.js`, …) sind framework-unabhängiges
Plain-JS. Die **einzige** harte AngularJS-Abhängigkeit innerhalb der Engine ist:

- `spoooky.Game.js:2641` — `refreshView()` ruft `self_Game.viewScope.$apply()`.
- `spoooky.Game.js:60` — `connectGridWeltView(scope)` speichert den View-Scope.

Alles Weitere in `Game.js` ist framework-neutral (zwei verbleibende Angular-Referenzen sind nur
Kommentare). `Modules.js` wird im Neubau komplett verworfen.

Die Spiel-Definition ist eine schöne deklarative DSL (Beispiel `src/games/tictactoe/game.js`):
`game.initialize()`, `createPlayer()`, `setupGridWorld()`, `addBlueprint()`, `addGameRuleAtom()`,
`assembleGameRule()`, `connectGameRuleConsequences()`. Diese DSL bleibt erhalten.

Der Zufall der Engine läuft vollständig über Underscores `_.random` (11 Stellen in `AI.js`,
`DiceBox.js`, `Game.js`). Das macht eine zentrale, seedbare RNG-Ersetzung einfach.

---

## 2. Gesamt-Roadmap (Kontext für SP1)

Der Neubau ist in vier Teilprojekte zerlegt, jedes mit eigener Spec → Plan → Implementierung:

- **SP1 — Fundament & vertikaler Durchstich** *(diese Spec)*: Angular-Workspace, Engine
  verhaltenserhaltend als Library, Entkopplung von AngularJS, TicTacToe spielbar, Tests, Deploy.
- **SP2 — KI-Visualisierung:** beobachtbarer „Decision-Trace" aus der Engine, moderne Darstellung
  des MCTS-Prozesses (Suchbaum, Bewertungen, Zugwahl), neues Layout.
- **SP3 — Konfigurierbare KI:** `AiConfig` im UI (Parameter, Strategien), Web-Worker für flüssige
  Berechnung, gezielte TypeScript-Typisierung der KI-Pfade (der „B"-Teil der Strategie).
- **SP4 — Restliche 8 Spiele** auf der dann stabilen Architektur.

**Strategie (bestätigt): A→B-Kombi.** Engine zuerst verhaltenserhaltend übernehmen (SP1), dann
gezielt dort in sauberes TypeScript überführen, wo die Ziele hinzeigen (SP2/SP3). Ein kompletter
Neuschrieb der forschungsvalidierten Engine ist ausgeschlossen.

---

## 3. Ziele von SP1

1. Lauffähiger, deploybarer Angular-Workspace, der gulp/AngularJS ablöst.
2. Die Engine liegt als Angular-Library `spoooky-core` vor, **verhaltenserhaltend** übernommen,
   hinter einer typisierten Fassade, ohne AngularJS-Abhängigkeit.
3. **TicTacToe** ist im Browser vollständig gegen die KI spielbar.
4. **Charakterisierungs-Tests** sichern das Engine-Verhalten für die spätere Typisierung ab.
5. Fundament für das Redesign (Design-Tokens, Styling-Basis) ist gelegt.

### Nicht-Ziele (bewusst außerhalb SP1)

- KI-Graph/MCTS-Visualisierung (→ SP2), Statistik-Charts (→ SP2).
- Einstellbare KI-Parameter / Settings-Modal / Web-Worker (→ SP3).
- Weitere Spiele außer TicTacToe (→ SP4).
- Vollständige TypeScript-Typisierung der Engine-Interna (schrittweise ab SP3).
- Entfernen oder Umschreiben des alten `src/`-Standes — er bleibt parallel bestehen.

---

## 4. Architektur

### 4.1 Workspace

Angular-CLI-Workspace (neueste stabile Angular-Version), Standalone-Components, Signals, strict
TypeScript (für neuen App-Code; die übernommene Engine darf anfangs `allowJs` nutzen). Zwei Projekte:

- **`projects/spoooky-core`** (Library): die Engine + typisierte Fassade + neutraler Change-Mechanismus.
- **`projects/spoooky-app`** (Application): die UI.

Build: `ng build` (statisches Bundle). Dev: `ng serve`. gulp entfällt.

> **Hinweis zum Dev-Workflow:** Die Library wird per TypeScript-Pfad auf ihren Build-Output gemappt.
> Änderungen an `spoooky-core` erfordern einen Rebuild der Library (`ng build spoooky-core`), damit
> sie in der App sichtbar werden. Dies wird im Plan/README festgehalten.

### 4.2 `spoooky-core` — Engine-Übernahme

- Die Engine-Dateien werden verhaltenserhaltend übernommen (zunächst als JS/leicht-TS innerhalb der
  Library). Globale `Spoooky.*`-Namespaces werden auf ES-Module-Exporte umgestellt, sodass Spiele per
  `import` statt globalem Objekt angebunden werden.
- **Typisierte Fassade** `SpoookyGame`: kapselt die Spiel-DSL und die Laufzeit-Schnittstelle
  (`startGame`, `applyHumanMove(x, y)`, Zugriff auf Board-/Zustandsmodell) mit TypeScript-Signaturen.
  Die Interna bleiben zunächst unverändert dahinter.
- **Change-Mechanismus statt `$apply`:** `connectGridWeltView`/`refreshView` werden durch ein
  framework-neutrales Observer-Interface ersetzt — die Engine ruft bei Modelländerungen einen
  registrierten Listener (Callback bzw. kleiner Emitter). Kein Angular-Import in der Engine.
- **Seedbarer Zufall:** ein zentrales RNG-Modul (`rng.int(min, max)`) ersetzt die 11 `_.random`-
  Aufrufe. Default-Seed aus Entropie (Verhalten wie bisher), für Tests fester Seed. Gleiche
  Verteilung wie `_.random` (inklusive-inklusive Ganzzahl), damit das Verhalten erhalten bleibt.
  `Date.now()`-basierte Knoten-IDs (`AI.js:39`) werden für Tests über eine injizierbare Quelle
  deterministisch gemacht; Outcome-Relevanz ist gering und wird im Plan verifiziert.

### 4.3 `spoooky-app` — Angular-Schicht (minimal)

- **`GameEngineService`** (Angular-Service): erzeugt/hält die `SpoooykyGame`-Instanz, registriert sich
  als Change-Listener der Engine und spiegelt den Engine-Zustand in Signals:
  `board`, `currentPlayer`, `gameState`, `log`, `aiThinking`. Methoden: `startGame()`,
  `cellClicked(x, y)`.
- **`BoardComponent`**: rendert das Grid-Modell (`GameGrid`) als Zellen-Raster, Klick auf freie Zelle
  → `GameEngineService.cellClicked(x, y)` (nur wenn aktueller Spieler HUMAN). Ersetzt `GridWeltCtrl` +
  `gridwelt.htm`.
- **`GameLogComponent`**: schlichter Spielverlauf/Meldungen (ersetzt `GameProcessCtrl` minimal).
- **„KI denkt"-Indikator**: Overlay/Badge, solange `aiThinking` gesetzt ist.
- **Navigationsschutz:** `window.onbeforeunload` während eines laufenden KI-Zugs (aus dem Altsystem
  übernommen), damit der synchrone KI-Lauf nicht unterbrochen wird.
- **Styling-Fundament:** Design-Tokens (Farben, Abstände, Typo) als CSS-Variablen, hell/dunkel-fähig,
  als Basis für das Redesign in SP2. Kein Bootstrap 3.

---

## 5. Datenfluss

1. Mensch klickt eine freie Zelle → `BoardComponent` → `GameEngineService.cellClicked(x, y)`.
2. Service ruft `SpoooykyGame.applyHumanMove(x, y)` → Engine `game.loop(false, x, y)`.
3. Engine wertet Spielregeln/Consequences aus (Sieg/Unentschieden/Weiter).
4. Ist der nächste Spieler ARTIFICIAL, läuft `artificialTurn()` (MCTS) **synchron** im Main-Thread;
   der Service setzt vorher `aiThinking = true`.
5. Die Engine ruft nach Modelländerungen ihren Change-Listener → `GameEngineService` liest das
   aktualisierte Modell und schreibt die Signals neu → Angular rendert.
6. `aiThinking = false`, Zug des Menschen wieder möglich.

Der synchrone KI-Lauf blockiert in SP1 den UI-Thread kurz; das Overlay signalisiert das. Die
Auslagerung in einen Web-Worker ist explizit SP3.

---

## 6. Fehlerbehandlung

- `GameEngineService` fängt Engine-Ausnahmen ab und überführt sie in einen sichtbaren Fehlerzustand
  (kein weißer Bildschirm, kurze Meldung + Möglichkeit, das Spiel neu zu starten).
- Ungültige Klicks (belegte/deaktivierte Zelle, nicht am Zug) werden früh verworfen, bevor die Engine
  gerufen wird.
- Der `onbeforeunload`-Schutz verhindert Navigationsverlust während eines KI-Zugs.

---

## 7. Teststrategie

**Charakterisierungs-Tests der Engine (Kernwert von SP1).** Mit festem RNG-Seed werden deterministische
Szenarien durchgespielt und Board-Endzustand/Gewinner gegen erwartete Werte geprüft. Diese Tests sind
das Sicherheitsnetz für die Typisierung in SP2/SP3.

- **Primär (deterministisch):** TicTacToe-Partien mit festem Seed → fixe Zugfolgen und Ergebnisse;
  Regel-Auswertung (Reihe/Spalte/Diagonale/Unentschieden) direkt gegen konstruierte Board-Zustände.
- **Fallback-Invarianten (falls volle Determinismus-Reproduktion an einer Stelle scheitert):** die KI
  liefert stets einen **gültigen** Zug, stürzt nicht ab, terminiert, und schlägt in klaren Stellungen
  (Gewinnzug / Blockzug in TicTacToe) nicht offensichtlich daneben.

**Unit-Tests der Angular-Schicht.** `GameEngineService` (korrektes State-Mapping Engine→Signals,
Blockieren von Zügen während `aiThinking`) und `BoardComponent` (Rendern des Grids, Klick-Routing).

**Manuelle Abnahme.** TicTacToe im Browser: gewinnen, verlieren, Unentschieden — jeweils korrekt
erkannt und angezeigt.

---

## 8. Build & Deployment

- `ng build` erzeugt ein statisches Bundle (Ablösung von `gulp build`).
- Deployment wie bisher statisch nach spoookyjs.de (konkreter Mechanismus im Plan festzuhalten).
- Der alte Stand in `src/` + gulp bleibt unangetastet im Repo, bis der Neubau mindestens SP1-reif ist
  (kein Big-Bang-Austausch).

---

## 9. Risiken & Gegenmaßnahmen

| Risiko | Gegenmaßnahme |
| --- | --- |
| Verhaltensänderung beim Übernehmen der Engine | Verhaltenserhaltend übernehmen; Charakterisierungs-Tests zuerst; keine Interna umschreiben. |
| KI nicht vollständig deterministisch reproduzierbar | Zentraler seedbarer RNG; Fallback-Invarianten-Tests (Abschnitt 7). |
| Globale `Spoooky.*`-Namespaces ↔ ES-Module | Schrittweise Umstellung auf Exporte; eine Datei nach der anderen, Tests dazwischen. |
| Synchroner KI-Lauf friert UI ein | In SP1 akzeptiert + Overlay; echte Lösung (Web-Worker) in SP3. |
| Library-Pfad/Rebuild-Stolperfalle | Im README/Plan dokumentieren: Core-Änderung → `ng build spoooky-core`. |

---

## 10. Definition of Done (SP1)

- [ ] Angular-Workspace mit `spoooky-core` (Library) und `spoooky-app` (Application) baut mit `ng build`.
- [ ] Engine in `spoooky-core` übernommen, ohne AngularJS-Abhängigkeit; `$apply` durch neutralen
      Change-Listener ersetzt.
- [ ] TicTacToe im Browser vollständig gegen die KI spielbar; Sieg/Niederlage/Unentschieden korrekt.
- [ ] Charakterisierungs-Tests der Engine grün (deterministisch oder per Invarianten laut Abschnitt 7).
- [ ] Unit-Tests für `GameEngineService` und `BoardComponent` grün.
- [ ] Deploybares statisches Build vorhanden; Dev-Server `ng serve` läuft.
- [ ] Alter `src/`/gulp-Stand unverändert und weiterhin baubar.
