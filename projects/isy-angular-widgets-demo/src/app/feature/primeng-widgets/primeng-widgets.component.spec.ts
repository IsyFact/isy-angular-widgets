import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PrimengWidgetsComponent} from './primeng-widgets.component';

describe('PrimengWidgetsComponent', () => {
  let component: PrimengWidgetsComponent;
  let fixture: ComponentFixture<PrimengWidgetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimengWidgetsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PrimengWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
