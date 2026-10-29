# SpoookyJS — Angular-Neubau: SP4b (Zug-UI-Fundament + Dame)

**Datum:** 2026-10-29
**Autor:** Jan Wieners (mit Claude)
**Status:** Entwurf zur Freigabe
**Baut auf:** SP1–SP4a (gemergt in `master`, PRs #37–#42). SP4b zweigt direkt von `master` ab.

---

## 1. Kontext

SP4a brachte die Mehr-Spiel-App mit den Setzen-Spielen (TicTacToe, Gomoku). SP4b beginnt die
**Zug-Spiele** und baut die dafür nötige, wiederverwendbare UI: das **Sichtbarmachen der von der Engine
markierten Felder** (wählbare Figur + legale/Schlag-Ziele). Vom Autor gewählt: der schlankste Vertical-Slice
— das **Highlight-Fundament + Dame (Checkers)**. Schach, Schachvariante und Amazons (inkl. Pfeil-3.-Klick)
folgen in SP4b2+; Mühle und Backgammon in SP4c.

### Engine-Fakten (Engine bleibt unangetastet)
- Zug-Interaktion läuft über denselben `clickCell(x,y)` wie beim Setzen: im `MOVING`-Modus ruft
  `game.loop(false, x, y)` entweder `showEntityMoves` (Klick auf eigene Figur → markiert) oder
  `executeJobsForThisMove` (Klick auf ein bereits markiertes Zielfeld → Zug ausführen). Die Engine verwaltet
  die Auswahl intern; es ist **kein neuer Klick-Code** nötig.
- **Markierung:** `showEntityMoves` setzt pro Zelle `cellClass` über `gameWorld.setCellClass` —
  `"clickedEntity"` für die gewählte Figur, `"move_standard"` für normale Zielfelder, `"move_goal"` für
  Ziel-/Schlagfelder (bei Dame sind Schläge Diagonalsprünge als `move_goal`). `models.MoveTable` hält die
  legalen Züge; `models.HighlightTable` die markierten `{x,y}`. Nach Zugausführung räumt `resetMoves` die
  `cellClass`-Werte wieder auf.
- **Zell-Struktur:** jede GameGrid-Zelle hat `{ contains, position:{x,y}, view:{ baseClass, cellClass }, … }`.
  `baseClass` kommt aus dem `setupGridWorld`-Muster (bei Dame `gridCellBlack`/`gridCellWhite` → kariertes
  Brett); `cellClass` ist das Highlight (Default `""`).
- **Dame-Regeln liegen als Daten-Blueprint vor:** `src/js/blueprints/checkers.js` (729 Z.) definiert Figuren,
  Zugmuster, Schlag-Ziele und die Umwandlungs-Konsequenzen („Transform Entity Into King Entity" in der
  letzten Reihe). Diese werden von der (bereits gelifteten) Engine interpretiert.

### Strategie-Entscheidung: Blueprints verbatim liften (nicht neu schreiben)
Die Spielregeln stecken in großen, research-validierten Daten-Blueprints (Schach allein 3418 Z.). Wie die
Engine in SP1 werden sie **verbatim** als `@ts-nocheck`-TS-Module ins Angular-Projekt kopiert
(behavior-preserving), statt sie von Hand zu portieren. SP4b liftet `checkers.js`.

### Repository (geplanter Finalisierungs-Schritt, nicht SP4b)
Der Neubau bleibt im bestehenden Repo (eine durchgehende Historie ist Teil der Doktorarbeit; die alte `src/`
dient bis SP4-Ende als Lift-Referenz). Nach Abschluss aller Spiele: ein eigener Finalisierungs-Schritt (SP5)
zieht den Angular-Workspace nach `/`, entfernt/archiviert den alten AngularJS-Stand und passt README/CI an.
Betrifft SP4b nicht.

---

## 2. Ziele von SP4b

1. **Zug-UI-Fundament (wiederverwendbar):** das Brett zeigt das **Brettquadrat-Muster** (hell/dunkel) und die
   **Engine-Highlights** — gewählte Figur, normale Zielfelder, Schlag-Zielfelder — und räumt sie nach dem
   Zug wieder ab. Der Klick-Fluss (`clickCell`) bleibt unverändert.
2. **Dame (Checkers)** als erstes Zug-Spiel: geliftetes Blueprint + Factory + Assets; spielbar mit Ziehen,
   Schlagen und Damen-Umwandlung; Sieg, wenn der Gegner nicht mehr ziehen kann.
3. Registry-Eintrag mit per-Spiel-Memory (wie SP4a).
4. Kleine Status-Anzeige „Du bist am Zug" / „KI denkt …".
5. Engine **und** geliftetes Blueprint unangetastet; nur App-seitige Factory/Facade/Service/Board + Registry.

### Nicht-Ziele (später)
- Schach, Schachvariante, Amazons (inkl. Pfeil-Phase) → SP4b2+. Mühle, Backgammon → SP4c.
- Drag&Drop (wir bleiben bei Klick-zum-Wählen → Klick-zum-Ziehen).
- Erzwungene Schlagpflicht/Multi-Capture über das Engine-Verhalten hinaus (was die Engine/Blueprint macht,
  gilt; keine zusätzliche App-Logik).
- Zug-Historie, Notation, Anzeige geschlagener Figuren.

---

## 3. Architektur

### 3.1 Blueprint-Lift (`games/blueprints/checkers.blueprint.ts`)
`src/js/blueprints/checkers.js` wird **verbatim** als `@ts-nocheck`-ES-Modul kopiert, das `CHECKERS_BLUEPRINT`
exportiert (das `Spoooky.Blueprints.CHECKERS`-Objekt: `entities` mit Zugmustern/Schlag-Zielen + `consequences`
für Schlagen/Umwandlung). Minimal-invasive Anpassungen nur wie beim Engine-Lift (ES-Export statt globalem
`Spoooky.Blueprints = …`; keine Logik-Änderung). Texturen zeigen auf `assets/checkers/*.png`; Assets
(`black_01/02`, `white_01/02`) → `src/assets/checkers/`.

### 3.2 Dame-Factory (`games/checkers.game.ts`)
Übersetzt `src/games/checkers/game.js` → TS-Factory (wie `gomoku.game.ts`, nur komplexer): `MOVING`-Modus,
`setupGridWorld(8, 8, <gridCellBlack/White-Muster>)`, Mensch/KI-Spieler, `addBlueprint` der Standard- +
King-Figuren aus `CHECKERS_BLUEPRINT`, `connectConsequences(CHECKERS_BLUEPRINT.consequences.topPlayer/…)`,
Sieg-Regeln (Stop Game, wenn ein Spieler nicht mehr ziehen kann). `createCheckers(): SpooookyGame`.

### 3.3 Highlight-Rendering (das Fundament)
- **Facade** (`facade.ts`): ein Zell-Zugriff, der neben dem Figurenbild auch die View-Klassen liefert, z. B.
  `cellView(cell): { image: string|null; baseClass: string; cellClass: string }` (baut auf dem bestehenden
  `getEntityAt` auf; liest `cell.view.baseClass`/`cell.view.cellClass`).
- **Service** (`game-engine.service.ts`): das `board`-Signal trägt pro Zelle `{ image, baseClass, cellClass }`
  (statt nur `{ image }`); in `sync()` aus dem GameGrid gelesen. Nach jedem Zug/`resetMoves` aktualisiert das
  nächste `sync()` die Werte (die KI-Antwort löst ohnehin ein `refreshView → sync` aus).
- **Board** (`board.ts/html/scss`): rendert
  - das **Brettquadrat** über `baseClass` (dunkel/hell — für Dame nötig; bei TicTacToe/Gomoku bleibt es wie
    bisher, da deren baseClass das vorhandene Weiß ist),
  - die **Highlights** über `cellClass`: `clickedEntity` → Auswahl-Rahmen; `move_standard` → Ziel-Punkt;
    `move_goal` → auffälligerer Schlag-/Ziel-Marker (Ring/andere Farbe).
  Der Highlight-Stil ist über die SP2-Design-Tokens gestaltet und wird in der Browser-Prüfung feinjustiert.
  Die SP2-Bewertungs-Heatmap bleibt davon unberührt (eigener Layer).

### 3.4 Status-Anzeige
Kleine Zeile, abgeleitet aus den bestehenden Signalen (`currentPlayerType`, `aiThinking`, `gameState`):
„Du bist am Zug." / „KI denkt …" / „Spiel beendet." Platzierung im Board-Bereich oder Kopf.

### 3.5 Registry
Dame-Descriptor in `registry.ts`: `{ id:'checkers', name:'Dame', factory: createCheckers, columns:8, rows:8,
memory: mem('checkers') }`; gebündeltes Memory-Asset `src/assets/checkers/agentmemory_1.json` (aus
`src/games/checkers/`).

---

## 4. Datenfluss
1. „Dame" wählen → `selectGame('checkers')` → Factory baut das Spiel (geliftetes Blueprint) → Board rendert
   8×8 kariert.
2. Eigene Figur klicken → Engine `showEntityMoves` setzt `cellClass` (Auswahl + Ziele) → `sync` → Board zeigt
   Auswahl-Rahmen + Ziel-/Schlag-Marker.
3. Markiertes Ziel klicken → `executeJobsForThisMove` → Zug/Schlag/Umwandlung über Engine-Konsequenzen →
   `resetMoves` → KI zieht → `sync` → Highlights weg, Brett aktualisiert.
4. Kein Zug mehr möglich → Sieg-Regel → „… gewinnt".

## 5. Fehlerbehandlung
- Klick auf fremde/leere Figur oder nicht-markiertes Feld → Engine ignoriert (kein Zug); keine Highlights →
  Board zeigt nur Figuren + Muster.
- Fehlendes/kaputtes Memory-Asset → Standard-Agenten (SP3c-Fallback).
- `cellClass`/`baseClass` defensiv: unbekannte Klasse → kein Highlight (nur bekannte Klassen werden gestylt).
- localStorage/Preload wie SP4a (per-Spiel-Namespacing, `whenMemoryReady` vor Spielaufbau).

## 6. Teststrategie (Vitest/jsdom, Sync-Worker)
- **Blueprint-Lift:** `CHECKERS_BLUEPRINT` importierbar; hat `entities` + `consequences`.
- **Dame-Factory:** 8×8, `MOVING`-Modus, Figuren korrekt platziert (Start-Aufstellung), Mensch beginnt.
- **Highlight-Exposure (Kern):** nach `clickCell` auf eine eigene Figur tragen die Board-Zellen des Service
  die erwarteten `cellClass`-Werte (eine `clickedEntity`-Zelle + ≥1 `move_standard`/`move_goal`-Zelle); nach
  einem ausgeführten Zug sind die Highlights wieder leer. `baseClass`-Muster alterniert.
- **Board:** rendert Zellen mit baseClass-Muster-Klasse und cellClass-Highlight-Klasse (DOM-Klassen/Attribute
  prüfen).
- **Registry:** Dame-Eintrag baut, Brettgröße/Memory-Ziel stimmen.
- **Browser:** Dame spielen — Auswahl zeigt Highlights, Ziehen + Schlagen + Damen-Umwandlung funktionieren,
  Sieg wird erkannt; Highlight-Stil lesbar (hell/dunkel, Auswahl/Ziel/Schlag unterscheidbar); per-Spiel-Memory
  getrennt; Prod-Build mit Worker-Chunk.

## 7. Definition of Done (SP4b)
- [ ] `checkers.blueprint.ts` (verbatim Lift) + Assets; `createCheckers`-Factory (geliftetes Blueprint).
- [ ] Facade/Service liefern pro Zelle `{ image, baseClass, cellClass }`.
- [ ] Board rendert Brettquadrat-Muster + Highlights (Auswahl/Ziel/Schlag); räumt nach Zug auf.
- [ ] Registry-Eintrag „Dame" (8×8, per-Spiel-Memory); Status-Anzeige „am Zug / KI denkt".
- [ ] core + app Tests grün (Sync-Modus); Prod-Build + Worker-Chunk ok; TicTacToe/Gomoku unverändert spielbar.
- [ ] Browser-Verifikation: Dame mit sichtbarem Highlighting spielbar (Ziehen/Schlagen/Umwandlung/Sieg),
      Highlights lesbar, Memory pro Spiel getrennt.

## 8. Branch/Integration
Branch `angular-rebuild/sp4b-checkers`, abgezweigt von `master`. PR gegen `master` (die Stapel-Phase ist
vorbei — SP1–SP4a sind gemergt). Erste Zug-Spiel-Scheibe von SP4.

## 9. Risiken
| Risiko | Gegenmaßnahme |
| --- | --- |
| Verbatim-Lift von `checkers.js` bricht beim ES-Export/`@ts-nocheck` | Exakt wie beim Engine-Lift vorgehen (nur `Spoooky.Blueprints = …` → Export; keine Logik anfassen); Import-Test. |
| `cellClass`/`baseClass` erreichen das Board nicht korrekt (View-Objekt vs. Zelle) | Zugriff über die Facade zentralisieren; Highlight-Exposure im Service-Test gegen eine echte Sync-Partie prüfen. |
| Dame-Brettmuster/Interaktion im Browser ungewohnt (Schlag vs. Zug nicht unterscheidbar) | Distinkte Marker für `move_standard` vs. `move_goal`; im Browser feinjustieren. |
| Highlight-Logik könnte spätere Spiele (Amazons-Pfeil) nicht abdecken | SP4b rendert generisch nach `cellClass`; Amazons-spezifische Klassen kommen in SP4b2, ohne das Fundament zu ändern. |

🤖 Generated with [Claude Code](https://claude.com/claude-code)
