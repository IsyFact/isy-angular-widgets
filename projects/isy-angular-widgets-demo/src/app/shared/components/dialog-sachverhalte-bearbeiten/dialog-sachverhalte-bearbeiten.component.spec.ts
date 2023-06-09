import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogSachverhalteBearbeitenComponent } from './dialog-sachverhalte-bearbeiten.component';
import {TableModule} from 'primeng/table';

describe('DialogSachverhalteBearbeitenComponent', () => {
  let component: DialogSachverhalteBearbeitenComponent;
  let fixture: ComponentFixture<DialogSachverhalteBearbeitenComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [
        DialogSachverhalteBearbeitenComponent
      ],
      imports: [
        TableModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSachverhalteBearbeitenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check the saveSachverhalte function to have been called', () => {
    const ngOnChangeSpy = spyOn(component, 'ngOnChanges') .and. callThrough();
    component.ngOnChanges();
    expect(ngOnChangeSpy).toHaveBeenCalled();
  });

  it('should check the saveSachverhalte function to have been called', () => {
    const saveSachverhalteSpy = spyOn(component, 'saveSachverhalte') .and. callThrough();
    component.saveSachverhalte();
    expect(saveSachverhalteSpy).toHaveBeenCalled();
  });

  it('should check the createSachverhalt function to have been called', () => {
    const spy = spyOn(component, 'createSachverhalt') .and. callThrough();
    component.createSachverhalt('createSachverhalt');
    expect(spy).toHaveBeenCalled();
  });

  it('should check the deleteSachverhalt function to have been called', () => {
    const spy = spyOn(component, 'deleteSachverhalt') .and. callThrough();
    component.deleteSachverhalt('deleteSachverhalt');
    expect(spy).toHaveBeenCalled();
  });

  it('should check the closeDialog function to have been called', () => {
    const spy = spyOn(component, 'closeDialog') .and. callThrough();
    component.closeDialog();
    expect(spy).toHaveBeenCalled();
  });

});
