import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharPickerComponent } from './char-picker.component';

describe('CharPickerComponent', () => {
  let component: CharPickerComponent;
  let fixture: ComponentFixture<CharPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CharPickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
