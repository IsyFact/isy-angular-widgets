import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IsySchluesselverzeichnisDropdownComponent} from './isy-schluesselverzeichnis-dropdown.component';

describe('IsySchluesselverzeichnisDropdownComponent', () => {
  let component: IsySchluesselverzeichnisDropdownComponent;
  let fixture: ComponentFixture<IsySchluesselverzeichnisDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IsySchluesselverzeichnisDropdownComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(IsySchluesselverzeichnisDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
