import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InputCharDialogButtonSelectionSideComponent} from './input-char-dialog-button-selection-side.component';

describe('InputCharDialogButtonSelectionSideComponent', () => {
  let component: InputCharDialogButtonSelectionSideComponent;
  let fixture: ComponentFixture<InputCharDialogButtonSelectionSideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputCharDialogButtonSelectionSideComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(InputCharDialogButtonSelectionSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
