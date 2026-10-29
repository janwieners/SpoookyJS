# SpoookyJS — Angular-Neubau: SP2 (KI-Visualisierung + Redesign)

**Datum:** 2026-10-28
**Autor:** Jan Wieners (mit Claude)
**Status:** Entwurf zur Freigabe
**Baut auf:** SP1 (Branch `angular-rebuild/sp1-foundation`, PR #37)

---

## 1. Kontext

SP1 hat das Angular-22-Fundament gelegt: die Engine als `spoooky-core`-Library, TicTacToe
gegen die KI spielbar, mit bewusst **schlichter** Oberfläche. SP2 ist der didaktische Kern des
Neubaus: den **Entscheidungsprozess der Monte-Carlo-KI sichtbar machen** und die Oberfläche
**echt neu gestalten** (beides vom Autor in der SP1-Planung gewählt).

### Vom Autor gewählte Weichenstellungen für SP2
- **Visualisierungs-Kern:** Zug-Bewertungen direkt auf dem Spielbrett (nicht der MCTS-Baum).
- **Interaktion:** ein dauerhaft umschaltbares Overlay.
- **Vorschau-Umfang:** In SP2 zeigt der Schalter die Bewertungen der **letzten echten
  KI-Entscheidung** (keine zusätzliche Berechnung). Die aktive On-demand-Analyse bei eigenen
  Zügen kommt in **SP3** zusammen mit dem echten Off-Thread-Worker (dann ohne UI-Einfrieren).
- Der per-Runden-Simulationsverlauf (altes `StatisticsCtrl`-Chart) ist **optionaler Stretch**,
  kein Pflichtziel.

### Engine-Unterstützung (bereits vorhanden, Engine bleibt unangetastet)
- Nach jedem KI-Zug ruft die Engine `MetaAgent` → `refreshGraphView(mctsData, metaAgentID)`
  und `refreshStatsView(agentID)`, die ihrerseits `graphScope.updateGraphs(mctsData, metaAgentID)`
  bzw. `statsScope.update(agentID)` aufrufen (`spoooky.Game.ts` `connectGraphView`/`connectStatsView`).
  **Diese Nähte sind in SP1 als No-op gestubbt** (`engine-runtime.ts` `connectNoopViews`) — SP2
  ersetzt sie durch echte Handler.
- `mctsData` enthält pro Kandidatenzug (`spoooky.AI.ts`, `allResults`): `wins`, `visits`,
  `target` (Feld-Label wie `"c1"`), `moveIndex`, `simulationSteps`; dazu stehen `simCount`/`simSteps`
  (Simulationen der Entscheidung) und der gewählte Zug (`bestMove.target`) bereit.
- `target`-Labels folgen dem Schema `Spaltenbuchstabe + (Zeilenanzahl − targetY)` (z. B. 3×3:
  `"a3"` = Spalte 0, oberste Zeile). Daraus lässt sich (x, y) rückrechnen.

---

## 2. Ziele von SP2

1. Nach jedem KI-Zug werden die **Zug-Bewertungen** der KI erfasst und als Angular-State bereitgestellt.
2. Ein **umschaltbares Board-Overlay** zeigt für jeden von der KI geprüften Zug Besuche und
   Gewinnrate (Heatmap + Zahlen), der gewählte Zug ist hervorgehoben.
3. Ein **Entscheidungs-Panel** fasst die letzte KI-Entscheidung lesbar zusammen (geprüfte Züge,
   Simulationen, gewählter Zug + Gewinnrate) inkl. Heatmap-Legende.
4. **Echtes Redesign**: ein durchdachtes, responsives Layout (hell/dunkel) mit der Visualisierung
   als Mittelpunkt, erweiterte Design-Tokens.
5. Die Engine bleibt **unangetastet** (nur die App-seitigen View-Handler ändern sich).

### Nicht-Ziele (SP3/SP4 oder später)
- MCTS-Suchbaum-Ansicht.
- Aktive On-demand-Analyse bei eigenen Zügen (braucht den echten Worker → SP3).
- Live-Streaming des Suchprozesses, echter Off-Thread-Worker (SP3).
- Agentenerinnerungs-Laden / konfigurierbare KI (SP3).
- Weitere Spiele außer TicTacToe (SP4).
- Per-Runden-Simulations-Chart ist optional (Stretch), nicht Pflicht.

---

## 3. Architektur

### 3.1 Datenanbindung (ersetzt die SP1-No-op-Stubs)
In `engine-runtime.ts` wird `connectNoopViews(raw)` ersetzt (bzw. ergänzt) durch View-Handler,
die Daten an Callbacks weiterreichen, die der `GameEngineService` registriert:
- `connectGraphView({ updateGraphs: (mctsData, metaAgentID) => onDecision(mctsData) })`
- `connectStatsView({ update: (agentID) => onStats(agentID) })`
Der Service bleibt die einzige Stelle, die Engine-Daten in Signals übersetzt (wie in SP1).

### 3.2 Adapter (reine Funktion, gut testbar)
Ein Modul `evaluation-adapter.ts` wandelt die rohe `mctsData` in ein UI-Modell:
- Für jeden Kandidaten: `target`-Label → `(x, y)` via Brettmaße (`cols`, `rows`); `winRate = wins / visits`.
- Markiert den gewählten Zug (höchste `visits`, bzw. `bestMove.target`, falls verfügbar).
- Liefert `{ cells: Array<{x, y, visits, wins, winRate, chosen}>, stats: {candidates, simulations, steps, chosen, chosenWinRate} }`.
- Robust gegen fehlende Felder (defensive: ignoriert Kandidaten ohne parsebares Label).

### 3.3 Service-Signals (neu in `GameEngineService`)
- `evaluation = signal<EvalCell[] | null>(null)` — pro geprüftem Zug `{x,y,visits,winRate,chosen}`.
- `decisionStats = signal<DecisionStats | null>(null)`.
- `showEvaluation = signal<boolean>(…)` — Default true, aus `localStorage` gelesen (try/catch),
  Änderungen dorthin zurückgeschrieben.
- Beide Daten-Signals werden bei `newGame` auf `null` zurückgesetzt und bei jeder KI-Entscheidung
  aktualisiert.

### 3.4 Komponenten
- **BoardComponent (erweitert):** rendert zusätzlich das Overlay, wenn `showEvaluation()` an ist und
  `evaluation()` vorliegt. Pro Kandidatenzelle: Heatmap-Tönung nach `winRate` (zugängliche Skala,
  hell/dunkel), kleine Zahlen (Besuche, `winRate` %), gewählte Zelle deutlich markiert. Leere
  Nicht-Kandidaten bleiben neutral. Rein Angular + CSS/SVG (kein d3).
- **EvaluationToggle (klein):** „KI-Bewertungen anzeigen" (Checkbox/Switch), an `showEvaluation` gebunden.
- **DecisionPanel (neu):** Zusammenfassung der letzten Entscheidung + Heatmap-Legende; leer/Hinweis,
  solange noch keine KI-Entscheidung vorliegt.
- **AppComponent / Layout (Redesign):** Kopfbereich, Brett als Zentrum mit Overlay, Entscheidungs-Panel
  und Log daneben (Desktop) bzw. darunter (Phone). Erweiterte Tokens (Akzent, Heatmap-Skala,
  Fokus/Hover), responsive, hell/dunkel.

### 3.5 Design-Tokens (erweitert)
`styles/tokens.scss` wird um eine **zugängliche, divergierende Heatmap-Skala** (niedrige→hohe
Gewinnrate) für hell und dunkel ergänzt, plus Akzent-, Fokus- und Erfolg-/Warnfarben. Kontrast
der Zahlen über den getönten Zellen muss in beiden Themes lesbar bleiben.

---

## 4. Datenfluss

1. Mensch zieht → Engine spielt KI-Zug (synchron, ~300 ms) → `MetaAgent` ruft `refreshGraphView(mctsData,…)`
   und `refreshStatsView(…)`.
2. Die neuen View-Handler leiten `mctsData` an den `GameEngineService` (`onDecision`).
3. Der Service ruft den Adapter → setzt `evaluation` und `decisionStats`.
4. BoardComponent (Overlay) und DecisionPanel re-rendern via Signals.
5. Der Schalter `showEvaluation` blendet das Overlay nur ein/aus — **keine** neue Berechnung.
6. `newGame` setzt `evaluation`/`decisionStats` auf `null` zurück.

---

## 5. Fehlerbehandlung
- Der Adapter ist defensiv: unerwartete/teilweise `mctsData` führt nie zum Absturz, sondern zu
  „keine Bewertung verfügbar" (Signals bleiben `null` bzw. Kandidat wird ausgelassen).
- `localStorage`-Zugriffe für den Schalter in try/catch (Privatmodus/geblockt).
- Der bestehende SP1-Fehlerzustand (`error`-Signal) bleibt erhalten.

---

## 6. Teststrategie
- **Adapter (Unit):** `target`-Label → (x,y) für 3×3 (`a3`,`b2`,`c1` …); `winRate`-Berechnung;
  Markierung des gewählten Zugs; defensive Behandlung fehlender Felder. Reine Funktion, deterministisch.
- **Service (Unit):** aus einer **gemockten `mctsData`-Nutzlast** werden `evaluation`/`decisionStats`
  korrekt gesetzt; `showEvaluation` wird aus `localStorage` gelesen/geschrieben; `newGame` setzt zurück.
- **BoardComponent:** Overlay erscheint nur bei `showEvaluation()` an + vorhandener Bewertung; gewählte
  Zelle markiert; korrekte Zellenzuordnung (x/y).
- **DecisionPanel:** rendert die Zusammenfassung aus `decisionStats`; Leerzustand ohne Entscheidung.
- Angular 22 / Vitest(jsdom)-Konventionen wie SP1 (Vitest-Matcher, `whenStable`, Core vor App bauen).

---

## 7. Definition of Done (SP2)
- [ ] Die KI-Entscheidungsdaten erreichen die App über echte `connectGraphView`/`connectStatsView`-Handler
      (No-op-Stubs ersetzt); Engine unverändert.
- [ ] Adapter mappt `mctsData` → UI-Modell (Label→x/y, Gewinnrate, gewählter Zug), mit Tests.
- [ ] Umschaltbares Board-Overlay zeigt Besuche + Gewinnrate je geprüftem Zug, gewählter Zug hervorgehoben;
      Schalterzustand bleibt erhalten.
- [ ] Entscheidungs-Panel fasst die letzte KI-Entscheidung lesbar zusammen (inkl. Legende).
- [ ] Redesigntes, responsives Layout (hell/dunkel), Visualisierung als Mittelpunkt.
- [ ] Reset bei „Neues Spiel"; Tests grün (core + app); Produktions-Build ok.
- [ ] Im Browser verifiziert: nach einem KI-Zug sind die Bewertungen plausibel (gewählter Zug = höchste
      Besuche), Schalter blendet korrekt ein/aus.

---

## 8. Branch/Integration
SP2 baut auf SP1-Code, der noch nicht in `master` ist. Arbeit auf einem eigenen Branch
`angular-rebuild/sp2-visualization`, abgezweigt vom SP1-Branch-Tip. Der SP2-PR richtet sich nach
`master`, sobald SP1 gemergt ist, oder als gestapelter PR gegen den SP1-Branch — das entscheidet
der Autor beim Abschluss.

---

## 9. Nachtrag (Planungsphase): präzisierte Datenquelle

Bei der Planung zeigte sich, dass `refreshGraphView(mctsData, …)` NUR `{agentID, mctsGraph, uctConstant}`
überträgt — die eigentlichen Zug-Bewertungen (`results`: wins/visits/target) stecken NICHT darin.
Sie liefert `Spoooky.AI.UCT` und werden bereits vom app-eigenen `SyncWorker` (`engine-runtime.ts`,
`res.results`) berechnet. Statt über `connectGraphView` (§3.1) holen wir die Daten daher sauber über
einen **Decision-Sink am `SyncWorker`**: der Shim meldet pro Agent `{agentID, results, simCount,
simSteps, uctConstant}`; der `GameEngineService` puffert diese und wertet sie nach jedem KI-Zug via
Adapter aus (Aggregation über Ensemble-Agenten). Engine bleibt weiterhin unangetastet; `connectNoopViews`
bleibt bestehen. Ziel, Scope und DoD ändern sich dadurch nicht.
