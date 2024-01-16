import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InputCharComponent} from './components/input-char/input-char.component';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {AccordionModule} from 'primeng/accordion';
import {DialogModule} from 'primeng/dialog';
import {SelectButtonModule} from 'primeng/selectbutton';
import {InputCharPreviewComponent} from './components/input-char-preview/input-char-preview.component';
import {InputCharDialogComponent} from './components/input-char-dialog/input-char-dialog.component';
import {InputCharDirective} from './directives/input-char.directive';
import {InputCharDialogButtonSelectionSideComponent} from './components/input-char-dialog-button-selection-side/input-char-dialog-button-selection-side.component';

@NgModule({
  declarations: [
    InputCharComponent,
    InputCharPreviewComponent,
    InputCharDialogComponent,
    InputCharDialogButtonSelectionSideComponent,
    InputCharDirective
  ],
  exports: [InputCharComponent, InputCharDirective],
  imports: [CommonModule, InputTextModule, ButtonModule, FormsModule, AccordionModule, DialogModule, SelectButtonModule]
})
export class InputCharModule {}
