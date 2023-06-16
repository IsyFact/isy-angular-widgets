import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocaleSwitcherComponent } from './locale-switcher.component';

describe('LocalSwitcherComponent', () => {
  let component: LocaleSwitcherComponent;
  let fixture: ComponentFixture<LocaleSwitcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocaleSwitcherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocaleSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
