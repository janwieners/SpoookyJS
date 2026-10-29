# SpoookyJS — Angular-Neubau: SP3c (Agentenerinnerung: Laden + Lernen/Export)

**Datum:** 2026-10-29
**Autor:** Jan Wieners (mit Claude)
**Status:** Entwurf zur Freigabe
**Baut auf:** SP1 (#37) + SP2 (#38) + SP3a (#39) + SP3b (#40), Branch gestapelt auf `angular-rebuild/sp3b-tree`

---

## 1. Kontext

Letzte Scheibe von SP3: die **Agentenerinnerung** — gelernte KI laden (stärker spielen) und den
Lern-Zyklus schließen (lernen + exportieren). Vom Autor gewählt: **beides**, Export via **localStorage +
Export-Button**.

### Engine-Fakten (Engine bleibt unangetastet)
- **Laden:** `MetaAgent.assembleAgents()` (aufgerufen in `Game.js:682` bei `createPlayer`, also beim
  Spiel-Setup) lädt `agentmemory_<ID>.json` per globalem `$.ajax({async:false})`. Erfolg → setzt
  `QLearner.reward`/`.gameStates` und baut über `assembleAgent(...)` das **gelernte Ensemble**
  (`bestAgentEnsemble`: Agenten mit role/focus/fitness/uctConstant/thinkingTime/maximumSteps). Fehler →
  Standard-Agenten (SP1-Stub). Datei-Struktur: `{game, metaAgentID, bestAgentEnsemble:[...],
  learnModule:{rewards, gameStates}}`. Für TicTacToe liegen `agentmemory_0.json`/`agentmemory_1.json` vor.
- **Lernen:** `MetaAgent.enableLearning()` setzt `learningEnabled`. Bei aktivem Lernen akkumuliert die
  Engine den Q-Learner (der Worker liefert `QLearner` je Entscheidung; `updateQLearner` akkumuliert).
- **Export:** `MetaAgent.gameHasEnded()` (am Spielende) ruft bei aktivem Lernen `QLearner.learn(10000)`,
  serialisiert `{game, metaAgentID, bestAgentEnsemble, learnModule}` und ruft global
  `saveAs(blob, "agentmemory_<ID>.json")`.

### Ehrlicher Hinweis (nach Engine-Verifikation)
Beim Umsetzen am Engine-Code verifiziert (die Spec-Annahmen waren teils optimistischer):

- **Geladenes Q-Wissen beeinflusst die Zugwahl nicht.** Der Zug wird allein über die MCTS-Besuchszahlen
  gewählt (`MetaAgent.getBestMove`); der `QLearner.getBestAction`-Pfad ist im Engine-Code auskommentiert
  (`MetaAgent.js:1698-1702`), und `Spoooky.AI.UCT` legt pro Aufruf einen frischen `QLearner` an
  (`AI.js:418`), der nur Rewards akkumuliert.
- **Die mitgelieferte `agentmemory_1.json` enthält 0 gelernte Spielzustände** — sie ist reine
  Ensemble-Definition (3 Agenten, alle „ALL MOVES", uct 1.0 / 0.5 / 0).
- **Darum der sichtbare Effekt des Ladens:** die Ensemble-Zusammensetzung **plus** die per-Agent-uctConstant.
  Vom Autor gewählt („Laden sinnvoll machen"): bei aktiver Erinnerung respektiert der Worker-Boundary die
  uctConstant jedes geladenen Agenten (statt sie wie in SP3a global zu überschreiben) → das geladene
  3-Agenten-Ensemble mit uct 1.0 / 0.5 / 0 explorationstechnisch vielfältig, sichtbar anders als das
  standardmäßig auf einen Regler-uct vereinheitlichte Ensemble. Das **Zeitbudget** (maxTime) bleibt aber am
  SP3a-Regler, weil die 5000 ms/Agent der Datei einen Zug ~15 s dauern ließen.
- **Der Lern-/Export-Zyklus ist echt und demonstrierbar:** mit aktivem Lern-Modus akkumuliert ein
  gespieltes Spiel echte `gameStates`, die als wiederladbare, nicht-leere Datei exportiert werden.
- **Hinweis zur Vorrang-Regel:** Lernen bei *ausgeschalteter* Erinnerung exportiert eine
  localStorage-Erinnerung (Standard-Ensemble + echte `gameStates`), die beim nächsten Laden Vorrang vor dem
  mitgelieferten Asset hat. „Auf Standard zurücksetzen" stellt das Asset wieder her.

---

## 2. Ziele von SP3c

1. **Laden gelernter Erinnerung:** gebündelte `agentmemory_<ID>.json` werden vor Spielstart vorgeladen
   und dem synchronen `$.ajax` der Engine aus einem Cache bedient → `assembleAgents` lädt das gelernte
   Ensemble. Schalter „Gelernte KI verwenden" (aus → Standard-Agenten).
2. **Lernen:** Schalter „Lern-Modus" → `enableLearning()` auf dem KI-Spieler; die Engine akkumuliert +
   trainiert am Spielende.
3. **Sichern/Export:** `saveAs`-Shim legt die aktualisierte Erinnerung in `localStorage` ab (persistiert,
   hat beim nächsten Start Vorrang vor dem Asset). **Export-Button** lädt sie als Datei herunter;
   **Reset-Button** löscht die localStorage-Version.
4. **Status-UI:** kurze Anzeige („N gelernte Spielzustände geladen" / Quelle Asset vs. localStorage).
5. Engine unangetastet; nur App-seitige Shims/Signals/UI.

### Nicht-Ziele (SP4/später)
- Server-seitiges Speichern; automatisiertes Self-Play-Batch-Training; weitere Spiele (SP4).
- Garantie, dass der Q-Learner die Suche messbar verstärkt (siehe Risiko).

---

## 3. Architektur

### 3.1 Memory-Loader + $.ajax-Cache
- Die `agentmemory_<ID>.json` werden als App-Assets gebündelt (`assets/tictactoe/`).
- Ein `agent-memory.ts`-Modul: `preloadMemory(urls: string[]): Promise<void>` holt die Dateien (fetch),
  legt sie in einen Cache `Map<url, any>`; `setMemoryEnabled(on)` steuert, ob der Cache aktiv ist; eine
  localStorage-Version (`spoooky.agentmemory.<ID>`) hat Vorrang vor dem Asset.
- Der `$`-Shim (`engine-runtime.ts`) wird erweitert: `ajax(opts)` → wenn Memory aktiv und für `opts.url`
  ein Eintrag existiert: `opts.success(data); opts.complete();` (synchron). Sonst `opts.error(); opts.complete();`
  (wie bisher → Standard-Agenten).
- **Ordering:** `preloadMemory` läuft beim App-Start; der erste `newGame` wartet darauf (oder nutzt sonst
  Standard-Agenten). Der `GameEngineService` koordiniert das.

### 3.2 Lern-Modus
- `createTicTacToe` bekommt optionale Flags (oder der Service setzt sie vor dem Spiel): wenn Lern-Modus an,
  `aiPlayer.enableLearning()` nach `createPlayer`. Signal `learnMode` (persistiert).

### 3.3 Export/Reset (saveAs-Shim)
- `engine-runtime.ts` installiert `globalThis.saveAs = (blob, filename) => { … }`: liest den Blob-Text und
  legt ihn unter `spoooky.agentmemory.<ID>` (aus `filename`) in `localStorage` ab (statt Download) und meldet
  es dem Service (Callback), damit der Export-Button aktiv wird.
- `exportMemory(id)`: lädt die localStorage-Version als echte Datei herunter (Blob + Anchor-Download).
- `resetMemory(id)`: löscht die localStorage-Version (nächstes Laden nimmt wieder das Asset).

### 3.4 UI
- Im Config-Panel: Schalter „Gelernte KI verwenden" + „Lern-Modus"; Buttons „Erinnerung exportieren" und
  „Auf Standard zurücksetzen" (aktiv, wenn eine localStorage-Version existiert); Status-Zeile.

---

## 4. Datenfluss
1. App-Start → `preloadMemory(["agentmemory_1.json", ...])` (async) → Cache (localStorage-Version bevorzugt).
2. „Gelernte KI verwenden" an + Spielstart → Engine `assembleAgents` → `$.ajax` (sync) → Cache liefert die
   Erinnerung → gelerntes Ensemble + Q-Learner geladen (Status-Zeile).
3. „Lern-Modus" an → `enableLearning()` → Engine akkumuliert; am Spielende `gameHasEnded` → trainiert →
   `saveAs`-Shim → localStorage + „Export verfügbar".
4. Export-Button → Download der localStorage-Erinnerung als `agentmemory_<ID>.json`. Reset-Button → löschen.

---

## 5. Fehlerbehandlung
- Fehlender/kaputter Memory-Eintrag → `$.ajax`-`error` → Standard-Agenten (kein Absturz).
- `preloadMemory`-Fehler (Datei fehlt) → leiser Fallback (Standard-Agenten), Status zeigt „keine Erinnerung".
- `localStorage`/Blob-Zugriffe in try/catch.
- Ordering: ist beim ersten Spiel die Erinnerung noch nicht geladen → Standard-Agenten (Hinweis), nächstes Spiel geladen.

---

## 6. Teststrategie
- **agent-memory (Unit):** Cache füllen; localStorage-Vorrang vor Asset; `setMemoryEnabled` steuert Treffer;
  defensive Fälle.
- **$.ajax-Shim:** liefert gecachte Daten synchron an `success` (Memory an), sonst `error` (aus/kein Eintrag).
- **saveAs-Shim:** legt die Erinnerung in localStorage ab + meldet „Export verfügbar"; `exportMemory`/`resetMemory`.
- **Service:** `useMemory`/`learnMode` persistiert; `preloadMemory`-Koordination; Lern-Modus setzt `enableLearning`.
  (Mit gemockter Memory-Nutzlast + Sync-Worker.)
- **Browser:** gelernte KI geladen (Status + sichtbar anderes/stärkeres Spiel als Standard); Lern-Modus → am
  Spielende wird Erinnerung aktualisiert; Export lädt eine valide JSON; Reset stellt Standard wieder her.

---

## 7. Definition of Done (SP3c)
- [ ] `agentmemory_<ID>.json` als Assets gebündelt; `preloadMemory` + Cache; `$.ajax`-Shim liefert synchron.
- [ ] Schalter „Gelernte KI verwenden" → gelerntes Ensemble wird geladen (Status „N Spielzustände geladen").
- [ ] Schalter „Lern-Modus" → `enableLearning`; Engine akkumuliert + trainiert am Spielende.
- [ ] `saveAs`-Shim → localStorage (Vorrang beim Laden); Export-Button (Datei-Download) + Reset-Button.
- [ ] Tests grün (core + app, Sync-Modus); Prod-Build + Worker-Chunk ok.
- [ ] Browser-Verifikation: Laden/Lernen/Export/Reset funktionieren; dokumentierter Befund zum tatsächlichen
      Spielstärke-Effekt (Ensemble vs. Q-Learner).

---

## 8. Branch/Integration
Branch `angular-rebuild/sp3c-memory`, abgezweigt vom SP3b-Tip. PR gestapelt auf SP3b
(Basis `angular-rebuild/sp3b-tree`), Basis später auf `master` nachziehen. Schließt SP3 ab.

---

## 9. Risiken
| Risiko | Gegenmaßnahme |
| --- | --- |
| Q-Learner beeinflusst die Worker-Suche evtl. nicht (frischer QLearner je UCT) | Ensemble ist der Haupteffekt; Lern-/Export-Pfad alt-workflow-getreu; Effekt im Browser messen + dokumentieren. |
| Sync `$.ajax` vor Spiel-Setup: Erinnerung muss vorab gecached sein | `preloadMemory` beim App-Start; erster `newGame` wartet darauf bzw. Fallback Standard-Agenten. |
| `saveAs` ist ein globaler Engine-Aufruf | `globalThis.saveAs`-Shim installieren (wie `$`/`Worker`). |
| Große `gameStates`/`learnModule` in localStorage | TicTacToe-Erinnerung ist klein; bei Überschreitung Hinweis + nur Datei-Export. |
