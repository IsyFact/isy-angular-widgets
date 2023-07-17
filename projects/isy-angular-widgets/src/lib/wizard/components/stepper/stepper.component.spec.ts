import {ComponentFixture, TestBed} from '@angular/core/testing';
import {StepperComponent} from './stepper.component';
import {StepsModule} from 'primeng/steps';
import {MenuItem} from 'primeng/api';
import {RouterTestingModule} from '@angular/router/testing';

describe('StepperComponent', () => {
  let component: StepperComponent;
  let fixture: ComponentFixture<StepperComponent>;

  const stepperItems: MenuItem [] = [
    {
      label: 'Auswahl 1'
    },
    {
      label: 'Auswahl 1'
    },
    {
      label: 'Auswahl 1'
    }
  ];
  const stepsNumber: number = stepperItems.length;
  const startIndex: number = 0;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [
        StepperComponent
      ],
      imports: [
        StepsModule,
        RouterTestingModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepperComponent);
    component = fixture.componentInstance;
    component.items = stepperItems;
    component.index = startIndex;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have ${stepsNumber} steps`, () => {
    expect(component.items.length).toEqual(stepsNumber);
  });

  it('should have the correct stepper items titles', () => {
    for (let i = 0; i < component.items.length; i++) {
      expect(component.items[i]).toEqual(stepperItems[i]);
    }
  });

  it(`should have start index ${startIndex}`, () => {
    expect(component.index).toEqual(startIndex);
  });

  it(`should have index ${startIndex + 1} after forward movement`, () => {
    expect(component.index).toEqual(startIndex);
    component.move(true);
    expect(component.index).toEqual(startIndex + 1);
  });

  it(`should have index ${startIndex} after forward and backward movement`, () => {
    expect(component.index).toEqual(startIndex);
    component.move(true);
    expect(component.index).toEqual(startIndex + 1);
    component.move(false);
    expect(component.index).toEqual(startIndex);
  });

  it('should not go out of bound while forwarding', () => {
    expect(component.index).toEqual(startIndex);
    for (let i = 0; i < stepsNumber + 1; i++) {
      component.move(true);
    }
    expect(component.index).toEqual(stepsNumber);
  });

  it('should not go out of bound while backwarding', () => {
    expect(component.index).toEqual(startIndex);
    component.move(false);
    expect(component.index).toEqual(startIndex);
  });

  it(`should correctly reset index to ${startIndex}`, () => {
    expect(component.index).toEqual(startIndex);
    component.move(true);
    expect(component.index).toEqual(startIndex + 1);
    component.reset();
    expect(component.index).toEqual(startIndex);
  });
});
