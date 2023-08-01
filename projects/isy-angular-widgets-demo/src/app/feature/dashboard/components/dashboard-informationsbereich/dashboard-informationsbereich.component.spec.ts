import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DashboardInformationsbereichComponent} from './dashboard-informationsbereich.component';

describe('DashboardInformationsbereichComponent', () => {
  let component: DashboardInformationsbereichComponent;
  let fixture: ComponentFixture<DashboardInformationsbereichComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [DashboardInformationsbereichComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DashboardInformationsbereichComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
