import { TestBed } from '@angular/core/testing';
import { EvaluationToggle } from './evaluation-toggle';
import { GameEngineService } from '../game-engine.service';

describe('EvaluationToggle', () => {
  it('spiegelt showEvaluation und schaltet es um', async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({ imports: [EvaluationToggle] }).compileComponents();
    const svc = TestBed.inject(GameEngineService);
    const fixture = TestBed.createComponent(EvaluationToggle);
    await fixture.whenStable();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(input.checked).toBe(svc.showEvaluation());
    input.checked = !input.checked;
    input.dispatchEvent(new Event('change'));
    expect(svc.showEvaluation()).toBe(input.checked);
    localStorage.clear();
  });
});
