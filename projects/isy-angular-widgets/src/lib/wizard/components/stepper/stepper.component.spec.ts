import {StepperComponent} from './stepper.component';
import {Steps} from 'primeng/steps';
import {MenuItem} from 'primeng/api';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {MockComponent} from 'ng-mocks';

const stepperItems: MenuItem[] = [
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

let spectator: Spectator<StepperComponent>;

describe('Unit Tests: StepperComponent', () => {
  const createdComponent = createComponentFactory({
    component: StepperComponent,
    declarations: [MockComponent(Steps)]
  });

  beforeEach(() => {
    spectator = createdComponent();
    spectator.component.items = stepperItems;
    spectator.component.index = startIndex;
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it(`should starts with index: ${startIndex}`, () => {
    expect(spectator.component.index).toEqual(startIndex);
  });

  it(`should have ${stepsNumber} steps`, () => {
    expect(spectator.component.items.length).toEqual(stepsNumber);
  });

  it(`should have index ${startIndex + 1} after forward movement`, () => {
    expect(spectator.component.index).toEqual(startIndex);
    spectator.component.move(true);
    expect(spectator.component.index).toEqual(startIndex + 1);
  });

  it(`should have index ${startIndex} after forward and backward movement`, () => {
    expect(spectator.component.index).toEqual(startIndex);
    spectator.component.move(true);
    expect(spectator.component.index).toEqual(startIndex + 1);
    spectator.component.move(false);
    expect(spectator.component.index).toEqual(startIndex);
  });

  it('should not go out of bound while forwarding', () => {
    expect(spectator.component.index).toEqual(startIndex);
    for (let i = 0; i < stepsNumber + 1; i++) {
      spectator.component.move(true);
    }
    expect(spectator.component.index).toEqual(stepsNumber);
  });

  it('should not go out of bound while backwarding', () => {
    expect(spectator.component.index).toEqual(startIndex);
    spectator.component.move(false);
    expect(spectator.component.index).toEqual(startIndex);
  });

  it(`should correctly reset index to ${startIndex}`, () => {
    expect(spectator.component.index).toEqual(startIndex);
    spectator.component.move(true);
    expect(spectator.component.index).toEqual(startIndex + 1);
    spectator.component.reset();
    expect(spectator.component.index).toEqual(startIndex);
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should have the correct stepper items titles', () => {
    for (let i = 0; i < spectator.component.items.length; i++) {
      expect(spectator.component.items[i]).toEqual(stepperItems[i]);
    }
  });
});
