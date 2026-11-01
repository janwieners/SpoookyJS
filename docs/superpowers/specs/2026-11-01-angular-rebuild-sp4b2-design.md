# SpoookyJS — Angular-Neubau: SP4b2 (Schach)

**Datum:** 2026-11-01
**Autor:** Jan Wieners (mit Claude)
**Status:** Entwurf zur Freigabe
**Baut auf:** SP1–SP4a (gemergt) + SP4b (Zug-UI-Fundament + Dame, PR #49, gemergt) + #50 (Highlight-Feinschliff, gemergt). SP4b2 zweigt von `master` ab.

---

## 1. Kontext

SP4b hat das wiederverwendbare Zug-UI (Feld-Highlighting via `cellClass`, Brettmuster via `baseClass`,
Statuszeile, per-Spiel-Memory) gebaut und Dame umgesetzt. SP4b2 ergänzt **Schach** als nächstes Zug-Spiel —
ein geradliniger Port nach demselben Muster, **ohne neue UI-Mechanik**. Vom Autor gewählt: **schlanker
Port** (Engine erzwingt Schach/Matt, keine eigene „Schach!"-Anzeige).

### Engine-Fakten (Engine bleibt unangetastet)
- Schach läuft im `MOVING`-Modus über denselben `clickCell`-Fluss wie Dame (Figur wählen → Engine markiert
  legale Ziele via `cellClass`; Zielfeld klicken → Zug). Kein neuer Klick-Code.
- **Regeln als Daten-Blueprint:** `src/js/blueprints/chess.js` (3418 Z., `Spoooky.Blueprints = { CHESS: {…} }`)
  definiert alle Figurentypen (Bauer/Turm/Springer/Läufer/Dame/König, je schwarz/weiß) mit Zugmustern,
  `postMoveCheck` („Entity Is Attackable After Move" → verhindert Züge, die den eigenen König im Schach
  lassen), Schlag-Zielen und Konsequenzen. Interpretiert von der (gelifteten) Engine.
- **Umwandlung:** automatisch zur Dame — Blueprint-Konsequenz („Transformiere Bauer in Koenigin" /
  „Transform Entity If Row Reached" → Queen) beim Erreichen der letzten Reihe. **Keine Auswahl-UI.**
- **Rochade:** engine-seitig; in `chess/game.js` über `extendBlueprint(<rook>, { entityName: "… Rook Left/Right" })`
  aktiviert. Die Rochade erscheint als König-Zugziel in der bestehenden Highlight-UI.
- **Schachmatt/Patt:** eigene Regel-Atome (`chess/game.js`): „Checkmate (Player 1/2)" + „Player Has No
  Movable Entities" → `Stop Game` + `Set Winner`. Die Engine meldet Matt und beendet das Spiel.
- Figuren-Assets: `src/games/chess/assets/{black,white}_{pawn,rook,knight,bishop,queen,king}.png` (12 PNGs).
  Memory `src/games/chess/agentmemory_1.json` (3-Agenten-Ensemble, ~1766 gelernte Zustände — nicht leer).

### Bewusste Anpassung ggü. `chess/game.js`
Die mitgelieferte `chess/game.js` ist auf **Mensch-gegen-Mensch** (beide `HUMAN`) und `setPlayer(player2)`
(Schwarz beginnt) eingestellt — eine Test-/Entwicklungskonfiguration. Die Angular-Factory stellt wie die
anderen Spiele **Mensch gegen KI** her: **Mensch = Weiß = player1 (beginnt)**, **KI = Schwarz = player2**.

### Strategie: Blueprint verbatim liften (wie SP1/SP4b)
`chess.js` wird verbatim als `@ts-nocheck`-TS-Modul kopiert (nur Export-Wrapper + Textur-Pfade angepasst),
nicht von Hand portiert.

### Ehrlicher Hinweis (KI-Stärke)
Die generische MCTS-KI ist bei Schach wegen des sehr großen Verzweigungsgrades **schwach** und zieht
oberflächlich — eine bekannte Grenze des Ansatzes, **kein Fehler**. Steuerbar nur über das Zeitbudget
(Schwierigkeits-Regler). Wird dokumentiert; keine Engine-Änderung, um die Spielstärke zu „reparieren".

---

## 2. Ziele von SP4b2

1. **Schach spielbar** als Registry-Spiel „Schach": geliftetes Blueprint + Factory + Assets; Mensch (Weiß)
   gegen KI (Schwarz), mit Ziehen, Schlagen, Rochade, Auto-Umwandlung zur Dame; Matt beendet das Spiel.
2. Registry-Eintrag mit per-Spiel-Memory (gebündeltes `agentmemory_1.json`).
3. **Wiederverwendung** des SP4b-Zug-UI (Highlights, Statuszeile, Brettmuster, per-Spiel-Memory) — keine
   Facade-/Service-/Board-Änderungen.
4. Engine **und** geliftetes Blueprint unangetastet; nur neue App-Dateien (Blueprint-Lift, Factory, Assets,
   Registry-Eintrag).

### Nicht-Ziele (später)
- Schachvariante + Amazons (eigene spätere Scheiben); Mühle, Backgammon (SP4c).
- „Schach!"-Anzeige / König-im-Schach-Hervorhebung (bewusst ausgelassen).
- Umwandlungs-Auswahl (Unterverwandlung) — Auto-Dame genügt; Zug-Notation/Historie; Zugwiederholung/50-Züge-Remis.

---

## 3. Architektur

### 3.1 Blueprint-Lift (`games/blueprints/chess.blueprint.ts`)
`src/js/blueprints/chess.js` verbatim als `@ts-nocheck`-ES-Modul, das `CHESS_BLUEPRINT` exportiert
(das `CHESS`-Objekt: `entities` + `consequences.whitePlayer`/`blackPlayer`). Minimal-Edits wie beim
Dame-Lift: `Spoooky.Blueprints = { … CHESS : {` → `export const CHESS_BLUEPRINT = {`, eine äußere
schließende Klammer entfernen; die 12 Textur-Strings `assets/<figur>.png` → `assets/chess/<figur>.png`.
Keine Logik-/Zugdaten ändern. Assets (12 PNGs) → `src/assets/chess/`.

### 3.2 Schach-Factory (`games/chess.game.ts`)
Übersetzt `src/games/chess/game.js` → TS-Factory (wie `checkers.game.ts`), mit `CHESS_BLUEPRINT`:
`MOVING`, `setupGridWorld(8,8, <gridCellBlack/White-Muster>)`, Spieler (Mensch=Weiß=player1,
KI=Schwarz=player2), `addBlueprint` aller 12 Figurentypen, `extendBlueprint`-Aufrufe für die vier Türme
(Rochade), `connectConsequences(whitePlayer/blackPlayer)`, Standardaufstellung via `addEntitiesToGameBoard`,
`setPlayer(player1)` (Weiß/Mensch beginnt), Matt-/Patt-Regeln (deutsche Meldungen). `createChess(): SpooookyGame`.
Der abschließende `Spoooky.AngularWrapper(...)`-Aufruf entfällt (→ `new SpooookyGame(game)`).

### 3.3 Registry
Eintrag `{ id: 'chess', name: 'Schach', factory: createChess, columns: 8, rows: 8, memory: mem('chess') }`;
gebündeltes `src/assets/chess/agentmemory_1.json` (aus `src/games/chess/`).

### 3.4 Wiederverwendung (keine Änderung)
Highlight-Rendering (`board`: `sq-dark/sq-light`, `sel/target/capture` + Marker), Statuszeile
(`statusText`), per-Spiel-Memory (`setActiveMemory`, Namespacing), `whenMemoryReady`/Preload — alles aus
SP4b/SP4a. Das Schach-Brett ist 8×8 kariert (`gridCellBlack`/`gridCellWhite`) → nutzt das vorhandene
Brettmuster.

---

## 4. Datenfluss
1. „Schach" wählen → `selectGame('chess')` → Factory baut das Spiel (geliftetes Blueprint) → 8×8 kariert,
   32 Figuren.
2. Eigene Figur klicken → Engine markiert legale Ziele (inkl. Rochade als König-Ziel) → Board zeigt
   Auswahl/Ziele/Schlag-Ziele.
3. Zielfeld klicken → Zug/Schlag/Rochade/Umwandlung (Auto-Dame) über die Engine → KI (Schwarz) zieht → …
4. Matt/Patt → Engine beendet das Spiel („… ist schachmatt." / Patt-Meldung).

## 5. Fehlerbehandlung
- Illegale Züge (die den König im Schach ließen) → Engine verhindert sie (kein Zielfeld markiert); keine
  App-Logik nötig.
- Fehlendes/kaputtes Memory-Asset → Standard-Agenten (bestehender Fallback).
- Per-Spiel-Memory/Preload/Namespacing wie SP4a.

## 6. Teststrategie (Vitest/jsdom, Sync-Worker)
- **Blueprint-Lift:** `CHESS_BLUEPRINT` importierbar; `.entities` (u. a. white_king/black_king, white_pawn,
  white_rook, …) + `.consequences.whitePlayer`/`.blackPlayer` vorhanden.
- **Schach-Factory:** 8×8, `MOVING`, 32 Figuren in Standardaufstellung (16 je Spieler), Weiß/Mensch beginnt
  (`getCurrentPlayerType()==='HUMAN'`), kariertes `baseClass`-Muster; die vier Türme wurden per
  `extendBlueprint` um `entityName` erweitert (Rochade-Voraussetzung).
- **Registry:** „Schach"-Eintrag baut; Brettgröße/Memory-Ziel stimmen; IDs eindeutig.
- **Browser:** Schach spielbar — Figuren rendern, Auswahl zeigt legale Züge (inkl. Rochade), Ziehen/Schlagen
  funktionieren, ein Bauer wandelt automatisch zur Dame um, Matt beendet das Spiel; Dame/Gomoku/TicTacToe
  unverändert; per-Spiel-Memory getrennt; Prod-Build mit Worker-Chunk.

## 7. Definition of Done (SP4b2)
- [ ] `chess.blueprint.ts` (verbatim Lift) + 12 Assets + Memory-Asset.
- [ ] `createChess`-Factory (Mensch=Weiß vs KI=Schwarz, Rochade/Auto-Dame/Matt engine-seitig) + Registry-Eintrag „Schach".
- [ ] Zug-UI (Highlights/Status/Memory) wiederverwendet; keine Facade-/Service-/Board-Änderung.
- [ ] core + app Tests grün (Sync-Modus, deterministisch); Prod-Build + Worker-Chunk ok; andere Spiele unverändert.
- [ ] Browser-Verifikation: Schach mit Highlighting spielbar (Zug/Schlag/Rochade/Umwandlung/Matt); dokumentierter
      Hinweis zur schwachen MCTS-Spielstärke.

## 8. Branch/Integration
Branch `angular-rebuild/sp4b2-chess`, abgezweigt von `master`. PR gegen `master`. Nächste Zug-Spiel-Scheibe
nach Dame.

## 9. Risiken
| Risiko | Gegenmaßnahme |
| --- | --- |
| Verbatim-Lift von `chess.js` (3418 Z.) bricht beim Export/`@ts-nocheck` | Exakt wie beim Dame-Lift (nur Wrapper + Texturen); Import-Test; die Factory-Tests fangen Struktur-Fehler. |
| Rochade/Umwandlung werden in der Factory nicht korrekt verdrahtet | `extendBlueprint`- und Setup-Aufrufe 1:1 aus `game.js` übernehmen; im Browser Rochade + Umwandlung gezielt prüfen. |
| Falsche Start-/Farbkonfiguration (Weiß/Mensch beginnt) | Factory-Test prüft `HUMAN` am Zug + 32 Figuren; Browser-Verifikation. |
| MCTS-KI bei Schach sehr schwach | Bekannte Grenze; dokumentieren; Zeitbudget am Regler; keine Engine-Änderung. |
| Großer Zustandsbaum/Serialisierung im Worker (Schach) | Nur beim KI-Zug; im Browser bei „schwer" gegenprüfen (ggf. Hinweis). |

🤖 Generated with [Claude Code](https://claude.com/claude-code)
