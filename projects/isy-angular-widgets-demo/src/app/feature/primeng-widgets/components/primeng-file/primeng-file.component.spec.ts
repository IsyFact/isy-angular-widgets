import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PrimengFileComponent} from './primeng-file.component';

describe('PrimengFileComponent', () => {
  let component: PrimengFileComponent;
  let fixture: ComponentFixture<PrimengFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimengFileComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PrimengFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
