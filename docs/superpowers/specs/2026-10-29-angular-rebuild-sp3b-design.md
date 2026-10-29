# SpoookyJS — Angular-Neubau: SP3b (MCTS-Baum-Ansicht)

**Datum:** 2026-10-29
**Autor:** Jan Wieners (mit Claude)
**Status:** Entwurf zur Freigabe
**Baut auf:** SP1 (#37) + SP2 (#38) + SP3a (#39), Branch gestapelt auf `angular-rebuild/sp3a-worker-config`

---

## 1. Kontext

SP2 visualisiert die Zug-Bewertungen der KI auf dem Brett; SP3a brachte den echten Worker +
konfigurierbare KI + On-demand-Analyse. SP3b ergänzt die **zweite Hälfte der KI-Visualisierung**:
den **Monte-Carlo-Suchbaum** sichtbar machen — wie die KI den Entscheidungsraum exploriert.

**Gewählte Form (vom Autor):** interaktiv aufklappbar, **Top-N** je Ebene (nicht der volle d3-Baum,
nicht nur die Hauptvariante) — skaliert auf jede Baumgröße und bleibt lesbar.

### Engine-Fakten (Engine bleibt unangetastet)
- `Spoooky.AI.UCT(..., generateMctsGraph)` liefert einen `mctsGraph`, **aber nur wenn
  `generateMctsGraph` wahr ist** (opt-in, teuer). Der SP3a-Worker reicht `mctsGraph` bereits in der
  `decision`-Nachricht zurück (`AiWorkerDecision.mctsGraph`).
- Struktur (`createMCTSGraph`/`preProcessChildNodes`/`createTree`): Wurzel
  `{ ID:"Root", value:<visits>, name, children:[] }`; jeder Knoten
  `{ ID, value:<visits>, parent, name, terminal, children? }`. Das `name`-Feld ist ein lesbarer String,
  z. B. `"c1 (Spieler ID 2, 0.240 / 862)"` bzw. `"b2 (Terminalknoten - Spieler ID 1 gewinnt. 0.800 / 15)"`.
  Zug-Label und Gewinnrate stehen also im `name`-String; `visits` ist `value`, `terminal` ein Flag.
- Der Baum ist der **vollständige** Suchbaum (die Tiefenbegrenzung im Alt-Code griff nicht) → bei vielen
  Simulationen potenziell sehr groß. `mctsData` ist pro Ensemble-Agent ein `{agentID, mctsGraph, uctConstant}`.
- `generateMctsGraph` wird im Alt-Code über `localStorage["#mctsgraph"]` freigeschaltet; in SP3b
  steuern wir es sauber über den Worker-Boundary (wie die SP3a-Config).

---

## 2. Ziele von SP3b

1. Ein **umschaltbarer** MCTS-Baum zur letzten KI-Entscheidung: Wurzel + je Ebene die **Top-N**
   meistbesuchten Kinder, per Klick tiefer aufklappbar.
2. Knoten zeigen **Zug-Label, Besuche und Gewinnrate** (Farbe wie die SP2-Heatmap), Terminalknoten markiert.
3. Nur aufgeklappte Äste werden gerendert → auch große Bäume bleiben flüssig.
4. `generateMctsGraph` nur aktiv, wenn die Baum-Ansicht an ist (Kosten vermeiden).
5. Engine unangetastet; nur App-seitige Ränder + ein neues Service-Signal.

### Nicht-Ziele (später/SP3c/SP4)
- Volle d3-Zoom/Pan-Ansicht des kompletten Baums.
- Auswahl zwischen mehreren Ensemble-Agenten (SP3b zeigt den primären Agenten).
- Baum für die On-demand-Analyse eigener Züge (zunächst nur für den KI-Zug; später erweiterbar).
- Agentenerinnerung/Lernen (SP3c), weitere Spiele (SP4).

---

## 3. Architektur

### 3.1 Daten (Worker-Boundary + Service)
- Neues Signal `showTree` (Toggle, `localStorage` `spoooky.showTree`, Default false). Wenn an, setzt der
  Worker-Override `generateMctsGraph: true` in `withConfig(...)` (sonst false) — so entstehen Bäume nur
  bei Bedarf.
- Der Decision-Sink (SP2/SP3a) wird um `mctsGraph` erweitert (oder ein zweiter Sink), sodass der
  `GameEngineService` den `mctsGraph` des primären Agenten erfasst und in ein Signal
  `mctsTree: Signal<TreeNode | null>` legt (nach Aufbereitung). Reset bei `newGame`.

### 3.2 Aufbereitung (reine Funktion)
`mcts-tree-adapter.ts`: `toTreeNode(rawRoot): TreeNode | null`.
- Pro Knoten: `visits = value`; `terminal` aus Flag; aus `name` per Regex Zug-Label + `winRate` (die
  Zahl vor `/`) extrahieren (defensiv: wenn nicht parsebar, Label = ganzer `name`, winRate = null).
- Kinder absteigend nach `visits` sortieren.
- Typ: `TreeNode { label: string; visits: number; winRate: number | null; terminal: boolean; children: TreeNode[] }`.
- Defensiv gegen fehlende/leere/zu komplexe Graphen (Engine liefert dann `children:[]`): Rückgabe `null`
  bzw. ein Wurzelknoten ohne Kinder (die UI zeigt dann einen Hinweis).

### 3.3 Rendering (rekursiv, kein d3)
- `MctsTreeNode`-Komponente (rekursiv, Standalone): zeigt einen Knoten (Label, Besuche, Gewinnrate als
  Heatmap-Farbe, Terminal-Markierung) und — wenn aufgeklappt — seine **Top-N** Kinder (N als Konstante,
  z. B. 4), jedes wieder als `MctsTreeNode`. Ein „+N weitere"-Element klappt zusätzliche Kinder auf.
  Aufklapp-Zustand lokal je Knoten (Signal). Nur sichtbare Knoten werden gerendert.
- `MctsTree`-Container: liest `GameEngineService.mctsTree()`; zeigt den Baum oder einen Leer-/Hinweistext
  („Kein Suchbaum verfügbar" / „Baum zu komplex").

### 3.4 UI
- Schalter „MCTS-Baum anzeigen" im Config-Panel (neben den SP3a-Schaltern).
- Der Baum erscheint in einem eigenen aufklappbaren Bereich (Seitenpanel oder unter dem Brett).

---

## 4. Datenfluss
1. Baum-Ansicht an → `showTree=true` → Worker-Override setzt `generateMctsGraph=true`.
2. KI-Zug → Worker liefert `decision` inkl. `mctsGraph` → Service erfasst den `mctsGraph` des primären
   Agenten → `mcts-tree-adapter` → `mctsTree`-Signal.
3. `MctsTree` rendert Wurzel + Top-N; Klicks klappen tiefer/mehr auf.
4. `newGame` setzt `mctsTree` auf `null`.

---

## 5. Fehlerbehandlung
- Fehlender/leerer/„zu komplexer" `mctsGraph` (Engine liefert `children:[]`): UI zeigt einen Hinweis,
  kein Absturz.
- Adapter defensiv gegen unerwartete Knotenformen (nicht parsebarer `name`, fehlende Felder).
- Toggle-`localStorage` in try/catch.

---

## 6. Teststrategie
- **Adapter (Unit):** `name`-Parsing (Label + winRate aus „c1 (… 0.240 / 862)"), Terminal-Erkennung,
  Sortierung nach Besuchen, defensive Fälle (nicht parsebar, leere Kinder). Reine Funktion.
- **Service (Unit):** aus einer gemockten `mctsGraph`-Nutzlast wird `mctsTree` gesetzt; Reset bei `newGame`;
  `showTree` persistiert; bei `showTree` an wird `generateMctsGraph` am Boundary gesetzt.
- **MctsTreeNode/MctsTree (Component):** rendert Wurzel + Top-N; Aufklappen zeigt weitere/tiefere Kinder;
  Leerzustand ohne Baum.
- Angular 22 / Vitest(jsdom), Sync-Worker-Modus. Große Bäume/Serialisierung im Browser gegenprüfen.

---

## 7. Definition of Done (SP3b)
- [ ] Umschaltbarer MCTS-Baum zur letzten KI-Entscheidung; `generateMctsGraph` nur aktiv, wenn an.
- [ ] Baum zeigt Wurzel + Top-N je Ebene, interaktiv aufklappbar; Knoten mit Label/Besuchen/Gewinnrate,
      Terminalknoten markiert.
- [ ] Adapter (mctsGraph → TreeNode) mit Tests; Service-Signal `mctsTree` + Reset.
- [ ] UI-Schalter + eigener Bereich; Leer-/Hinweistext bei fehlendem/zu komplexem Baum.
- [ ] Tests grün (core + app, Sync-Modus); Prod-Build ok (Worker-Chunk bleibt).
- [ ] Browser-Verifikation: nach einem KI-Zug (Baum an) erscheint ein plausibler Baum (Wurzel = Entscheidung,
      meistbesuchte Kinder = starke Züge); Aufklappen funktioniert; auch bei „schwer" (großer Baum) flüssig.

---

## 8. Branch/Integration
SP3b baut auf SP3a. Branch `angular-rebuild/sp3b-tree`, abgezweigt vom SP3a-Tip. PR gestapelt auf SP3a
(Basis `angular-rebuild/sp3a-worker-config`), Basis später auf `master` nachziehen.

---

## 9. Risiken
| Risiko | Gegenmaßnahme |
| --- | --- |
| Großer `mctsGraph` → Serialisierung/Transfer vom Worker teuer | Nur generieren, wenn Baum-Ansicht an; im Browser bei „schwer" gegenprüfen; ggf. später eine Tiefen-/Knotengrenze im Worker. |
| Baum zu groß zum Rendern | App-seitig nur Top-N + aufgeklappte Äste rendern (nicht den ganzen Baum). |
| `name`-Parsing bricht bei anderen Spieltypen | Defensiv: Fallback Label = ganzer `name`, winRate = null (für SP3b genügt TicTacToe). |
