# SpoookyJS — Angular-Neubau: SP4a (Spiel-Auswahl + Setzen-Spiele: Gomoku)

**Datum:** 2026-10-29
**Autor:** Jan Wieners (mit Claude)
**Status:** Entwurf zur Freigabe
**Baut auf:** SP1 (#37) + SP2 (#38) + SP3a (#39) + SP3b (#40) + SP3c (#41), Branch gestapelt auf `angular-rebuild/sp3c-memory`

---

## 1. Kontext

SP1–SP3 haben die Engine behavior-preserving geliftet und TicTacToe als vertikale Scheibe
umgesetzt (Brett, KI-Worker, Bewertungs-Heatmap, konfigurierbare KI, MCTS-Baum, Agentenerinnerung).
SP4 bringt die verbleibenden 8 Spiele. Weil sie sich nach **Interaktionsmodell** stark unterscheiden
und das die UI-Arbeit bestimmt, ist SP4 in drei Scheiben geteilt (vom Autor gewählt):

- **SP4a (diese Spec):** Spiel-Auswahl + die **Setzen-Spiele** Gomoku 9×9 und 15×15 — sie nutzen die
  bestehende „Ein-Klick-aufs-freie-Feld"-Interaktion von TicTacToe direkt.
- **SP4b (später):** Zug-Spiele (Dame, Schach, Schachvariante, Amazons) + Rendern der von der Engine
  markierten Felder (Figur/legale Ziele).
- **SP4c (später):** Spezial (Mühle; Backgammon mit Würfeln und benannten „Areas").

### Engine-Fakten (Engine bleibt unangetastet)
- Gomoku: `setGameMode("PLACING")`, Brett `setupGridWorld(9,9)` bzw. `(15,15)`, Gewinn =
  **5 gleiche Entitäten** in Reihe/Spalte/Diagonale (Regel-Atome „Player Has Number Of Entities In
  Row/Column/Diagonally", `number: 5`). player1 = Mensch „Jan" (schwarz, beginnt), player2 = KI
  „Scully" (weiß). Die KI ist **metaAgentID 1** → lädt `agentmemory_1.json` (wie TicTacToe).
- Die Interaktion ist identisch zu TicTacToe: `game.loop(false, x, y)` setzt auf ein freies Feld
  (`showFieldsToPlaceEntity` markiert freie Felder). Die SP1-Facade `clickCell(x,y)` genügt also.
- Der KI-Worker, die Bewertungs-/Baum-/Config-/Memory-Pfade aus SP2/SP3 sind spielunabhängig und
  funktionieren für Gomoku unverändert.

### Vorgefundener Blocker (muss SP4a beheben)
Die Board-Komponente (`board.ts`) hat `columns = 3` **fest verdrahtet**. Das betrifft nicht nur das
CSS-Grid, sondern auch die **Klick-Koordinaten** (`x = index % columns`, `y = floor(index/columns)`)
und das Mapping der Bewertungs-Zellen (`y*columns + x`). Für 9×9/15×15 wäre das falsch. SP4a macht die
Spaltenzahl dynamisch (aus der Engine) — Voraussetzung dafür, dass Gomoku überhaupt korrekt spielbar ist.

---

## 2. Ziele von SP4a

1. **Spiel-Registry** als einzige Wahrheitsquelle für wählbare Spiele (Name, Factory, Brettgröße,
   Memory-Asset).
2. **Gomoku 9×9 und 15×15** als Angular-Factories + Blueprint + Assets, regelgetreu zur alten `game.js`.
3. **Schlichtes Auswahl-Menü** (konsistent mit der aktuellen UI), das zwischen den Registry-Spielen
   umschaltet; zuletzt gewähltes Spiel wird persistiert.
4. **Dynamische Brettgröße:** die Board-Komponente leitet Spalten/Zeilen aus der Engine ab und rendert
   auch 15×15 (225 Felder) responsiv und korrekt (Klicks, Heatmap-Mapping).
5. **Agentenerinnerung pro Spiel verallgemeinern:** die in SP3c auf TicTacToe fest verdrahteten
   Konstanten werden durch Werte des aktiven Spiels ersetzt; localStorage-Keys pro Spiel-ID
   genamespaced, sodass sich Spiele nicht überschreiben.
6. Engine unangetastet; nur App-seitige Dateien + Facade (keine Engine-Edits).

### Nicht-Ziele (später)
- Zug-Spiele / Feld-Highlighting (SP4b); Mühle, Backgammon, Würfel, Areas (SP4c).
- Gestaltete Kachel-/Vorschau-Auswahl (kommt, wenn alle 9 Spiele existieren).
- Neue KI-Fähigkeiten; die generische MCTS-KI spielt Gomoku bereits.

---

## 3. Architektur

### 3.1 Spiel-Registry (`games/registry.ts`)
- `interface GameDescriptor { id: string; name: string; factory: () => SpooookyGame; columns: number;
  rows: number; memory?: { id: string; key: string; asset: string }; }`
- `GAMES: GameDescriptor[]` mit TicTacToe (3×3), Gomoku 9×9, Gomoku 15×15.
  - `memory` je Spiel: `{ id: '1', key: 'agentmemory_1.json', asset: '/assets/<id>/agentmemory_1.json' }`.
    (Die Engine fragt immer `agentmemory_1.json` an; der Service lädt pro Spiel das passende Asset unter
    diesem Cache-Key — siehe 3.4.)
- `DEFAULT_GAME_ID = 'tictactoe'`. Helfer `gameById(id): GameDescriptor` (Fallback auf Default).

### 3.2 Gomoku-Factory + Blueprint
- `games/gomoku.blueprint.ts` — Entitäten schwarz/weiß (analog `tictactoe.blueprint.ts`), Views zeigen
  auf die Gomoku-Assets.
- `games/gomoku.game.ts` — `createGomoku(size: 9 | 15): SpooookyGame`, plus dünne Wrapper
  `createGomoku9x9 = () => createGomoku(9)` und `createGomoku15x15 = () => createGomoku(15)`. Spiegelt die
  alte `game.js`: PLACING, `setupGridWorld(size,size, …)`, Mensch=player1 (schwarz, beginnt),
  KI=player2 (weiß), je 6 Regel-Atome (5-in-Reihe/Spalte/Diagonale pro Spieler) + Konsequenzen
  („Stop Game" / Siegmeldung / „Set Winner"). Kein Unentschieden-Sonderfall nötig (volles Brett = selten,
  Engine endet dann ohne Sieger — wie in der alten `game.js`).
- Assets `black.png`/`white.png` nach `public/assets/gomoku/`. Gebündelte `agentmemory_1.json` je Spiel
  nach `public/assets/gomoku9x9/` und `public/assets/gomoku15x15/` (aus `src/games/gomoku*/`).

### 3.3 Auswahl-Menü (`game-picker/game-picker.ts`)
- Standalone-Komponente: ein `<select>` (oder Segmented-Buttons) aus `GAMES`, gebunden an das aktive
  Spiel; `change` → `engine.selectGame(id)`. Platzierung im Kopfbereich neben „Neues Spiel".

### 3.4 Service: aktives Spiel + Memory pro Spiel (`game-engine.service.ts`)
- Neues Signal `activeGameId` (persistiert `spoooky.activeGame`, Default `DEFAULT_GAME_ID`).
- `selectGame(id)`: setzt `activeGameId`, aktualisiert das Memory-Ziel aus dem Descriptor und startet ein
  neues Spiel (`newGame(descriptor.factory)` nach `whenMemoryReady()`).
- Die SP3c-Konstanten `MEMORY_ID/KEY/ASSET` entfallen; stattdessen `activeMemory()` aus dem Descriptor
  (oder `null`, wenn das Spiel kein `memory` hat → Memory-UI aus). `preloadMemory`/`getMemory`/
  `gameStatesCount`/`export`/`reset` arbeiten gegen das aktive Memory-Ziel.
- **localStorage-Namespacing:** Speicher-Key wird `spoooky.agentmemory.<gameId>.1` (statt
  `spoooky.agentmemory.1`), damit Gomoku und TicTacToe getrennte gelernte Erinnerungen haben. Der
  `saveAs`-Shim bekommt die Spiel-ID über das aktive Memory-Ziel (die Engine liefert nur
  `agentmemory_1.json`; der Service kennt das aktive Spiel). `agent-memory.ts` wird um einen
  Spiel-ID-Parameter / ein gesetztes aktives Ziel erweitert.
- `whenMemoryReady()` / Preload-vor-Spielaufbau bleiben wie in SP3c (die Startup-Race ist dort gelöst);
  bei `selectGame` wird analog erst das Memory des neuen Spiels vorgeladen, dann gebaut.
- **Achtung Cache-Kollision:** Alle Spiele fragen denselben Cache-Key `agentmemory_1.json` an, und das
  SP3c-`preloaded`-Flag würde ein erneutes Laden kurzschließen. Daher muss der Preload-Zustand **pro Spiel**
  gelten (z. B. `preloadedGameId` statt bool, oder beim `selectGame` `preloaded=false` setzen und den
  Cache-Eintrag des Keys mit dem Asset des neuen Spiels überschreiben), damit ein Spielwechsel die
  Erinnerung des neuen Spiels wirklich lädt.

### 3.5 Board (`board.ts` / `board.html` / `board.scss`)
- `columns`/`rows` kommen aus der Engine: der Service exponiert `columns`/`rows`-Signale (aus
  `game.getColumns()/getRows()` beim `newGame`/`sync`), die Board-Komponente liest sie statt `= 3`.
- `grid-template-columns: repeat(var(--cols), 1fr)` o. ä.; Zellen skalieren responsiv (kleinere Zellen bei
  15×15), Brett bleibt quadratisch und ohne horizontales Scrollen bei Telefonbreite.
- Klick-Koordinaten und Heatmap-Mapping nutzen die dynamische Spaltenzahl.

### 3.6 App-Shell (`app.ts`)
- Statt fest `createTicTacToe`: beim Start `engine.selectGame(engine.activeGameId())` (nach
  `whenMemoryReady`). Das Picker-Menü wird in die Oberfläche eingehängt.

---

## 4. Datenfluss
1. Start → Service liest `activeGameId` → `selectGame` setzt Memory-Ziel + Preload → `newGame(factory)`.
2. Spielwechsel im Menü → `selectGame(id)` → Memory-Ziel wechselt → Preload → neues Spiel, Brett rendert
   N×N.
3. Mensch setzt Stein (`clickCell`) → KI zieht (Worker) → Gewinn bei 5-in-Reihe → „… gewinnt".
4. Lern-Modus/Export/Reset arbeiten gegen das aktive, pro Spiel genamespacte Memory.

## 5. Fehlerbehandlung
- Unbekannte/fehlende Spiel-ID in localStorage → Fallback `DEFAULT_GAME_ID`.
- Fehlendes/kaputtes Memory-Asset → `$.ajax`-`error` → Standard-Agenten (bestehender SP3c-Fallback).
- Spiel ohne `memory`-Eintrag → Memory-Schalter ausgeblendet, kein Preload.
- Großes Brett (15×15) → spürbar, aber über das Zeitbudget (Schwierigkeits-Regler) beherrschbar.
- localStorage-Zugriffe in try/catch (wie bestehend).

## 6. Teststrategie (Vitest/jsdom, Sync-Worker)
- **Registry:** IDs eindeutig; jeder Descriptor baut ohne Fehler ein `SpooookyGame`; `columns/rows`
  stimmen mit `getColumns()/getRows()` überein; `gameById` Fallback.
- **Gomoku-Factory:** 9×9 und 15×15 Brettgröße; PLACING; eine Folge von 5 gesetzten Steinen in einer
  Reihe beendet das Spiel mit Sieger (Regel greift); Mensch beginnt.
- **Per-Spiel-Memory:** `selectGame('gomoku9x9')` setzt das Memory-Ziel auf den Gomoku-Key; gespeicherte
  Erinnerung landet unter `spoooky.agentmemory.gomoku9x9.1` und überschreibt TicTacToe nicht; Spiel ohne
  `memory` → `activeMemory()` null, Memory-UI aus.
- **Board:** Spaltenzahl folgt der Engine (3/9/15); Klick-Index→(x,y) korrekt bei 9×9 (z. B. index 10 →
  (1,1)); Heatmap-Mapping nutzt dieselbe Spaltenzahl.
- **Picker:** listet alle `GAMES`; Auswahl ruft `selectGame(id)`; aktives Spiel ist markiert.
- **Browser:** jedes Spiel wählen und spielen; 15×15 rendert/klick-korrekt; Sieg bei 5; Erinnerung pro
  Spiel getrennt (ein Gomoku-Lernspiel schreibt den Gomoku-Key, TicTacToe-Erinnerung bleibt unberührt);
  Prod-Build mit erhaltenem Worker-Chunk.

## 7. Definition of Done (SP4a)
- [ ] Registry mit TicTacToe + Gomoku 9×9/15×15; `GameDescriptor` inkl. Brettgröße + Memory-Ziel.
- [ ] Gomoku-Factory + Blueprint + Assets; regelgetreu (5-in-Reihe), Mensch beginnt.
- [ ] Auswahl-Menü schaltet Spiele um; aktives Spiel persistiert.
- [ ] Board leitet Spalten/Zeilen aus der Engine ab; 9×9 und 15×15 korrekt spielbar (Klicks + Heatmap).
- [ ] Agentenerinnerung pro Spiel (Descriptor-Ziel + localStorage-Namespacing); TicTacToe-Verhalten
      unverändert; Memory-UI nur bei Spielen mit `memory`.
- [ ] core + app Tests grün (Sync-Modus); Prod-Build + Worker-Chunk ok.
- [ ] Browser-Verifikation: Auswahl, beide Gomoku-Größen spielbar, Sieg bei 5, Memory pro Spiel getrennt.

## 8. Branch/Integration
Branch `angular-rebuild/sp4a-games`, abgezweigt vom SP3c-Tip. PR gestapelt auf SP3c
(Basis `angular-rebuild/sp3c-memory`), Basis später auf `master` nachziehen.

## 9. Risiken
| Risiko | Gegenmaßnahme |
| --- | --- |
| Board-`columns=3` fest verdrahtet → falsche Klicks/Heatmap bei N≠3 | Spalten/Zeilen aus der Engine ableiten; Test für Index→(x,y) bei 9×9. |
| 15×15 = 225 Felder, Render-/MCTS-Last | Responsives CSS-Grid; KI über Zeitbudget beherrschbar; im Browser prüfen. |
| Memory-Namespacing berührt den SP3c-Code (saveAs-Shim kennt nur `agentmemory_1.json`) | Aktives Memory-Ziel im Service halten; `agent-memory` um Spiel-ID erweitern; TicTacToe-Verhalten per Test absichern. |
| Gomoku-Blueprint/Assets weichen vom Alt-Format ab | Views wie `tictactoe.blueprint.ts` aufbauen; Assets aus `src/games/gomoku*/assets/` übernehmen. |

🤖 Generated with [Claude Code](https://claude.com/claude-code)
