import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsyAngularComponentsComponent } from './isy-angular-components.component';

describe('IsyAngularComponentsComponent', () => {
  let component: IsyAngularComponentsComponent;
  let fixture: ComponentFixture<IsyAngularComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IsyAngularComponentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IsyAngularComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
