import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpoookyCore } from './spoooky-core';

describe('SpoookyCore', () => {
  let component: SpoookyCore;
  let fixture: ComponentFixture<SpoookyCore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpoookyCore],
    }).compileComponents();

    fixture = TestBed.createComponent(SpoookyCore);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
