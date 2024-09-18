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

  it('should show dialog', () => {
    component.showDialog();
    expect(component.visibleDialog).toBeTrue();
  });

  it('should close dialog', () => {
    component.visibleDialog = true;
    component.closeDialog();
    expect(component.visibleDialog).toBeFalse();
  });

  it('should show sidebar', () => {
    component.showSidebar();
    expect(component.visibleSidebar).toBeTrue();
  });

  it('should block content', () => {
    component.blockContent();
    expect(component.blockedContent).toBeTrue();
  });

  it('should unblock content', () => {
    component.blockedContent = true;
    component.unblockContent();
    expect(component.blockedContent).toBeFalse();
  });
});
