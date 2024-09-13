import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimengMiscComponent } from './primeng-misc.component';

describe('PrimengMiscComponent', () => {
  let component: PrimengMiscComponent;
  let fixture: ComponentFixture<PrimengMiscComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimengMiscComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimengMiscComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
