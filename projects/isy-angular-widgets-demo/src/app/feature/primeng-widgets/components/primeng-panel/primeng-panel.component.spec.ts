import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimengPanelComponent } from './primeng-panel.component';

describe('PrimengPanelComponent', () => {
  let component: PrimengPanelComponent;
  let fixture: ComponentFixture<PrimengPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimengPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimengPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
