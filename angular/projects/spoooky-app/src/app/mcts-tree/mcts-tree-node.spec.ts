import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MctsTreeNode } from './mcts-tree-node';
import { TreeNode } from '../mcts-tree-adapter';

function n(label: string, visits: number, children: TreeNode[] = []): TreeNode {
  return { label, visits, winRate: 0.5, terminal: false, children };
}

describe('MctsTreeNode', () => {
  let fixture: ComponentFixture<MctsTreeNode>;
  beforeEach(async () => { await TestBed.configureTestingModule({ imports: [MctsTreeNode] }).compileComponents(); });

  it('rendert Label + Besuche, Kinder erst nach dem Aufklappen', async () => {
    fixture = TestBed.createComponent(MctsTreeNode);
    fixture.componentRef.setInput('node', n('Entscheidung', 100, [n('c1', 80), n('a2', 20)]));
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Entscheidung');
    expect(el.textContent).toContain('100');
    expect(el.querySelectorAll('app-mcts-tree-node').length).toBe(0); // nicht aufgeklappt
    (el.querySelector('.label') as HTMLElement).click();
    await fixture.whenStable();
    expect(el.querySelectorAll('app-mcts-tree-node').length).toBe(2); // Top-N Kinder
  });

  it('zeigt nur Top-N und einen "+N weitere"-Button bei mehr Kindern', async () => {
    fixture = TestBed.createComponent(MctsTreeNode);
    const kids = [n('a',9),n('b',8),n('c',7),n('d',6),n('e',5),n('f',4)];
    fixture.componentRef.setInput('node', n('Entscheidung', 100, kids));
    await fixture.whenStable();
    (fixture.nativeElement.querySelector('.label') as HTMLElement).click();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll(':scope app-mcts-tree-node').length).toBe(4);
    expect((fixture.nativeElement.textContent || '')).toContain('+2 weitere');
  });
});
