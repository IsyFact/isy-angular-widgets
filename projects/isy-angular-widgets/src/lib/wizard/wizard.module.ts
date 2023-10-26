import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StepsModule} from 'primeng/steps';
import {WizardComponent} from './wizard.component';
import {StepperComponent} from './components/stepper/stepper.component';
import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';
import {WizardDirective} from './wizard.directive';

@NgModule({
  declarations: [WizardComponent, StepperComponent, WizardDirective],
  exports: [WizardComponent, WizardDirective],
  imports: [CommonModule, StepsModule, DialogModule, ButtonModule]
})
export class WizardModule {}
