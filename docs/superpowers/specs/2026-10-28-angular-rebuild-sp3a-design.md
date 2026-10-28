# SpoookyJS — Angular-Neubau: SP3a (Echter Web-Worker + konfigurierbare KI)

**Datum:** 2026-10-28
**Autor:** Jan Wieners (mit Claude)
**Status:** Entwurf zur Freigabe
**Baut auf:** SP1 (PR #37) + SP2 (PR #38), Branch gestapelt auf `angular-rebuild/sp2-visualization`

---

## 1. Kontext

SP1 brachte das Angular-Fundament + spielbares TicTacToe gegen die KI; SP2 die Visualisierung der
Zug-Bewertungen. Das ursprünglich als „SP3" skizzierte Paket (echter Worker, konfigurierbare KI,
On-demand-Analyse, MCTS-Baum, Agentenerinnerung, TS-Typisierung) ist zu groß und wurde zerlegt:

- **SP3a** *(diese Spec)*: echter Off-Thread-Web-Worker + konfigurierbare KI + On-demand-Analyse bei
  eigenen Zügen + TS-Typisierung der berührten KI-Pfade.
- **SP3b**: MCTS-Baum-Ansicht (nutzt den vorhandenen `mctsGraph`).
- **SP3c**: Agentenerinnerung + Lernen (echtes Laden/Speichern, stärkere KI).

### Engine-Fakten (SP3a baut darauf, Engine bleibt unangetastet)
- Die Engine spawnt den KI-Worker in `Agent.createBrain`: `new Worker("../../js/spoooky.Worker.min.js")`.
  Der Agent sendet `{command: "monte carlo tree search with uct", agentID, agentRole, agentFocus,
  maxSteps, maxTime, learn, uctConstant, gameModel, generateMctsGraph}`. **`gameModel` ist bereits ein
  String** (`Spoooky.AI.game.stringifyModels()`) — strukturklon-sicher über die Worker-Grenze.
- Der Worker antwortet mit `{type: "decision"|"random", …, results, simCount, simSteps, mctsGraph}`,
  die Engine verarbeitet das über `player.coordinateAgentDecisions(event.data)`.
- Das **Zeitbudget** ist `agent.thinkingTime` (= `maxTime`); der SP1-Shim ignorierte das und verdrahtete
  300 ms. Die **UCT-Konstante** ist `agent.uctConstant` (Default 0.9, `spoooky.Agent.js:73`).
- In SP1 ist `globalThis.Worker` bereits durch einen synchronen In-Thread-Shim (`engine-runtime.ts`)
  ersetzt; SP3a ersetzt diesen durch einen echten Worker.

---

## 2. Ziele von SP3a

1. **Echter Off-Thread-Worker:** die KI rechnet nebenläufig; die UI friert nicht mehr ein. Das
   „KI denkt"-Overlay wird echt (nicht nur optische Überbrückung).
2. **Konfigurierbare KI:** Schwierigkeits-Slider (leicht/mittel/schwer) + aufklappbarer Experten-Bereich
   (Zeitbudget ms, UCT-Konstante); wirkt echt auf die Berechnung; in `localStorage` gemerkt.
3. **On-demand-Analyse bei eigenen Zügen:** bei aktivem Schalter + Mensch am Zug läuft im Hintergrund
   eine UCT-Analyse der aktuellen Stellung aus Sicht des Menschen; Ergebnis speist die SP2-Overlay/
   Panel-Darstellung („bester Zug für Dich"), ohne einen Zug auszuführen.
4. **TS-Typisierung** der von SP3a berührten KI-Ränder (AiConfig, Worker-Protokoll, Analyse-Schnittstelle).
5. Engine-Interna bleiben unangetastet (`@ts-nocheck`); nur App-seitige Ränder ändern sich.

### Nicht-Ziele (SP3b/SP3c/SP4)
- MCTS-Baum-Ansicht (SP3b). Agentenerinnerung/Lernen (SP3c). Weitere Spiele (SP4).
- Vollständige TS-Typisierung der Engine-Interna.

---

## 3. Architektur

### 3.1 Echter Web-Worker (ersetzt den SP1-Shim)
- Ein gebündelter Angular-Web-Worker `ai.worker.ts` importiert `spoooky-core`, lauscht auf die Nachricht
  `"monte carlo tree search with uct"`, parst `gameModel` (String → Objekt), baut das Modell
  (`new Spoooky.Game().clone(parsed)`), ruft `Spoooky.AI.UCT(model, agentFocus, maxSteps, maxTime,
  learn, uctConstant, generateMctsGraph)` und postet `{type:"decision", …}` zurück — dasselbe Protokoll
  wie `spoooky.Worker.js`.
- Der globale `Worker`-Override in `engine-runtime.ts` wird so geändert, dass er den Legacy-Pfad ignoriert
  und stattdessen den gebündelten Worker startet (`new Worker(new URL('./ai.worker', import.meta.url),
  {type:'module'})`) und Nachrichten in beide Richtungen durchreicht. Die Engine ruft weiterhin
  `new Worker(path)` / `postMessage` / `addEventListener` — unverändert.
- Der echte Worker **respektiert `maxTime`** (anders als der Shim). Ein synchroner Fake-Worker bleibt für
  Tests erhalten (jsdom kann keine echten Module-Worker nebenläufig ausführen).

### 3.2 AiConfig
- Modell `AiConfig = { difficulty: 'easy'|'medium'|'hard'; thinkingTimeMs: number; uctConstant: number }`.
  Presets mappen difficulty → thinkingTimeMs (+ ggf. maxSteps). Der Experten-Bereich überschreibt
  thinkingTimeMs/uctConstant direkt.
- Ein `AiConfigService` (oder Erweiterung des `GameEngineService`) hält die Config als Signal, liest/
  schreibt `localStorage`. Vor jedem KI-Zug werden `thinkingTime`/`uctConstant` auf die ARTIFICIAL-Agenten
  gesetzt (Injektionspunkt an der Agenten-/Spieler-Erstellung bzw. vor Zugbeginn).
- UI: `AiConfigPanel` (Slider + aufklappbare Experten-Felder), im Redesign-Layout untergebracht.

### 3.3 On-demand-Analyse
- Eine `analyzeCurrentPosition()`-Methode serialisiert das aktuelle Spielmodell und lässt den Worker UCT
  für den aktuellen (menschlichen) Spieler rechnen — ohne Zug auszuführen. Das Ergebnis (`results`) läuft
  durch den SP2-`evaluation-adapter` in dieselben `evaluation`/`decisionStats`-Signals; das Overlay zeigt
  so die „beste-Zug-für-Dich"-Hinweise. Gated durch einen Analyse-Schalter; nur bei Mensch am Zug.
- Weil der Worker nicht blockiert, läuft die Analyse im Hintergrund; das Overlay aktualisiert sich, wenn
  das Ergebnis eintrifft. Eine laufende Analyse wird bei einem tatsächlichen Zug verworfen/abgebrochen.

### 3.4 TS-Typisierung (gezielt)
- Typen für: `AiConfig`, `AiWorkerRequest`/`AiWorkerDecision` (Worker-Protokoll), die Analyse-Schnittstelle,
  die Worker-Facade. Keine Umschreibung der Engine-Interna.

---

## 4. Datenfluss

**Normaler KI-Zug (jetzt off-thread):**
1. Mensch zieht → Engine startet KI-Zug → Agent `postMessage(request)` an den (überschriebenen) Worker.
2. Der Override leitet an den echten Worker; dieser rechnet UCT **off-thread** (UI bleibt flüssig,
   Overlay „KI denkt" sichtbar) und postet die Decision zurück.
3. Der Override reicht die Decision an die Engine (`coordinateAgentDecisions`); die Engine führt den Zug
   aus und ruft `refreshView` → Service `sync()` + SP2-Bewertungen (Decision-Sink wie SP2).

**On-demand-Analyse (Mensch am Zug, Schalter an):**
1. Service ruft `analyzeCurrentPosition()` → Worker UCT für den menschlichen Spieler.
2. Ergebnis → `evaluation-adapter` → `evaluation`-Signal → Overlay zeigt die Hinweise; kein Zug.

---

## 5. Fehlerbehandlung
- Worker-Fehler (Abbruch, Exception) werden abgefangen → sichtbarer Fehlerzustand (SP1-`error`-Signal) +
  Fallback (kein Overlay-Update bzw. Standard-Zug), ohne die UI zu sperren.
- Ungültige/teilweise Decision-Nachrichten werden defensiv ignoriert (wie SP2-Adapter).
- `localStorage`-Zugriffe für AiConfig in try/catch.
- Veraltete Analyse-Ergebnisse (Stellung hat sich geändert) werden verworfen.

---

## 6. Teststrategie
- **Worker-Protokoll (Unit/Integration):** mit einem synchronen Fake-Worker (wie SP1-Shim, jetzt
  `maxTime`-respektierend) wird Request→Decision geprüft; der echte Module-Worker wird in jsdom NICHT
  nebenläufig getestet.
- **AiConfig:** Presets → Parameter; `localStorage` lesen/schreiben; Setzen von `thinkingTime`/`uctConstant`
  auf die Agenten.
- **Analyse-Pfad:** `analyzeCurrentPosition()` liefert eine Bewertung, ohne das Spiel voranzutreiben
  (Zustand/aktueller Spieler unverändert).
- **Config-UI:** Slider/Experten-Felder spiegeln und ändern die Config.
- **Nebenläufigkeit** (UI friert nicht ein) wird **im Browser** verifiziert (Controller), nicht per Unit-Test.
- Angular 22 / Vitest(jsdom)-Konventionen wie SP1/SP2.

---

## 7. Definition of Done (SP3a)
- [ ] KI rechnet in einem echten Angular-Web-Worker; die UI bleibt während des KI-Zugs bedienbar
      (im Browser verifiziert). Engine unverändert.
- [ ] AiConfig (Schwierigkeit + Experten-Parameter) wirkt echt (Zeitbudget/UCT), UI vorhanden, in
      `localStorage` gemerkt.
- [ ] On-demand-Analyse: bei Mensch am Zug + Schalter an erscheinen die KI-Bewertungen für die aktuelle
      Stellung (SP2-Overlay/Panel), ohne einen Zug auszuführen.
- [ ] TS-Typen für AiConfig + Worker-Protokoll + Analyse-Schnittstelle.
- [ ] Tests grün (core + app, mit Fake-Worker); Produktions-Build ok (inkl. gebündeltem Worker).
- [ ] Browser-Verifikation: KI off-thread (keine UI-Blockade), Schwierigkeit wirkt spürbar, Analyse zeigt
      plausible Hinweise.

---

## 8. Branch/Integration
SP3a baut auf SP1+SP2 (noch nicht in `master`). Branch `angular-rebuild/sp3a-worker-config`, abgezweigt
vom SP2-Branch-Tip. PR gestapelt auf SP2 (Basis `angular-rebuild/sp2-visualization`), später auf `master`
umstellbar, sobald SP1/SP2 gemergt sind.

---

## 9. Risiken
| Risiko | Gegenmaßnahme |
| --- | --- |
| Gebündelter Module-Worker + Engine-Import schlägt im Angular-Build fehl | Früh ein Worker-Smoke-Test/Build; der Worker importiert nur `spoooky-core` (bereits als Library gebaut). |
| Modell-Roundtrip (stringify/clone) über die Worker-Grenze | Engine serialisiert bereits via `stringifyModels()`; der Worker nutzt denselben `clone`-Pfad wie der SP1-Shim. |
| Nebenläufigkeit nicht unit-testbar | Fake-Worker in Tests; echte Nebenläufigkeit im Browser verifizieren. |
| Config-Injektion in die (intern erzeugten) Agenten | Injektionspunkt an Spieler-/Agenten-Erstellung bzw. vor Zugbeginn; im Plan exakt festlegen. |
