import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PrimengMenuComponent} from './primeng-menu.component';

describe('PrimengMenuComponent', () => {
  let component: PrimengMenuComponent;
  let fixture: ComponentFixture<PrimengMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimengMenuComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PrimengMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
