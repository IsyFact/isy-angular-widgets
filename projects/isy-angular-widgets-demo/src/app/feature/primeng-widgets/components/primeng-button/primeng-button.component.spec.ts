import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimengButtonComponent } from './primeng-button.component';

describe('PrimengButtonComponent', () => {
  let component: PrimengButtonComponent;
  let fixture: ComponentFixture<PrimengButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimengButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimengButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
