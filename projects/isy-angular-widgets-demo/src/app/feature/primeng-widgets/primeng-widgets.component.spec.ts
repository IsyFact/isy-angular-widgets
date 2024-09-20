import {ComponentFixture, TestBed} from '@angular/core/testing';
import {PrimengWidgetsComponent} from './primeng-widgets.component';
import {FormsModule} from '@angular/forms';

describe('PrimengWidgetsComponent', () => {
  let component: PrimengWidgetsComponent;
  let fixture: ComponentFixture<PrimengWidgetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrimengWidgetsComponent],
      imports: [FormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimengWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
