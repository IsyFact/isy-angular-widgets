import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PrimengChartComponent} from './primeng-chart.component';

describe('PrimengChartComponent', () => {
  let component: PrimengChartComponent;
  let fixture: ComponentFixture<PrimengChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimengChartComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PrimengChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
