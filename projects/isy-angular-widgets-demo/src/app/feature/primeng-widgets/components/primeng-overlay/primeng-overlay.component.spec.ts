import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PrimengOverlayComponent} from './primeng-overlay.component';

describe('PrimengOverlayComponent', () => {
  let component: PrimengOverlayComponent;
  let fixture: ComponentFixture<PrimengOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimengOverlayComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PrimengOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
