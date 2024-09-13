import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PrimengFormComponent} from './primeng-form.component';

describe('PrimengFormComponent', () => {
  let component: PrimengFormComponent;
  let fixture: ComponentFixture<PrimengFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimengFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PrimengFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
