import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimengDataComponent } from './primeng-data.component';

describe('PrimengDataComponent', () => {
  let component: PrimengDataComponent;
  let fixture: ComponentFixture<PrimengDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimengDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimengDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
