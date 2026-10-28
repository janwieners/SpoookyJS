import { Spoooky } from './engine';

describe('view seam', () => {
  it('refreshView ruft den registrierten Listener statt $apply', () => {
    const g: any = new Spoooky.Game();
    g.initialize('Seam');
    let calls = 0;
    g.connectView(() => calls++);
    g.models.playVirtual = false;
    g.refreshView();
    expect(calls).toBe(1);
  });

  it('refreshView ist No-op während playVirtual', () => {
    const g: any = new Spoooky.Game();
    g.initialize('Seam');
    let calls = 0;
    g.connectView(() => calls++);
    g.models.playVirtual = true;
    g.refreshView();
    expect(calls).toBe(0);
  });
});
