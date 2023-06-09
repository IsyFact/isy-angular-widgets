import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InputCharDialogComponent} from './input-char-dialog.component';
import {DialogModule} from 'primeng/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('InputCharDialogComponent', () => {
  let component: InputCharDialogComponent;
  let fixture: ComponentFixture<InputCharDialogComponent>;

  const dialogDefaultWidth = 775;
  const dialogDefaultHeight = 460;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [InputCharDialogComponent],
      imports: [
        DialogModule,
        BrowserAnimationsModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(InputCharDialogComponent);
    component = fixture.componentInstance;
    component.display = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check the default size', () => {
    expect(component.width).toEqual(dialogDefaultWidth);
    expect(component.height).toEqual(dialogDefaultHeight);
  });

  it('should check the closing functionality', () => {
    const onCloseSpy = spyOn(component.displayChange, 'emit');
    expect(component.display).toEqual(true);

    const closeDialog = true;
    component.onClose(closeDialog);
    expect(onCloseSpy).toHaveBeenCalledWith(closeDialog);
  });
});
