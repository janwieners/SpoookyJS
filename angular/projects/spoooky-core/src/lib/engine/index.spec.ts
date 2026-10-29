import { Spoooky } from './index';

describe('engine namespace', () => {
  it('stellt den Game-Konstruktor bereit', () => {
    expect(typeof Spoooky.Game).toBe('function');
    const g: any = new Spoooky.Game();
    g.initialize('Smoke');
    expect(typeof g.loop).toBe('function');
  });
});
