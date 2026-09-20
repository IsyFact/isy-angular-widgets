import {Component} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {buildVitestReferenceLabel} from './vitest-reference';
import {describe, expect, it} from 'vitest';

@Component({
  standalone: true,
  template: '<span data-testid="vitest-reference">{{ label }}</span>'
})
class VitestReferenceComponent {
  readonly label = buildVitestReferenceLabel();
}

describe('Vitest reference test', () => {
  it('renders a standalone Angular component', async () => {
    await TestBed.configureTestingModule({
      imports: [VitestReferenceComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(VitestReferenceComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-testid="vitest-reference"]')?.textContent).toBe('Vitest läuft');
  });
});
