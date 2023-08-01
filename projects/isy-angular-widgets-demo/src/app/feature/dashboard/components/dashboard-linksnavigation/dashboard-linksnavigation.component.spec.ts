import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLinksnavigationComponent } from './dashboard-linksnavigation.component';

describe('DashboardLinksnavigationComponent', () => {
  let component: DashboardLinksnavigationComponent;
  let fixture: ComponentFixture<DashboardLinksnavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardLinksnavigationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardLinksnavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
