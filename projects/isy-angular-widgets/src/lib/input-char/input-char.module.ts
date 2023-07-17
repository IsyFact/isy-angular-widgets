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
import {InputCharSelectButtonComponent} from './components/input-char-select-button/input-char-select-button.component';
import {InputCharDialogComponent} from './components/input-char-dialog/input-char-dialog.component';
import {InputCharDialogDirective} from './directives/input-char-dialog.directive';
import {
  InputCharAllCharsButtonComponent
} from './components/input-char-all-chars-button/input-char-all-chars-button.component';
import {
  InputCharPreviewCharListComponent
} from './components/input-char-preview-char-list/input-char-preview-char-list.component';
import {InputCharDirective} from './directives/input-char.directive';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [
    InputCharComponent,
    InputCharPreviewComponent,
    InputCharSelectButtonComponent,
    InputCharDialogComponent,
    InputCharDialogDirective,
    InputCharAllCharsButtonComponent,
    InputCharPreviewCharListComponent,
    InputCharDirective
  ],
  exports: [
    InputCharComponent,
    InputCharDirective
  ],
  imports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    AccordionModule,
    DialogModule,
    SelectButtonModule,
    TranslateModule
  ]
})
export class InputCharModule { }
