import {NgModule} from '@angular/core';
import {SecurityDirective} from './security-directive';

@NgModule({
  declarations: [
    SecurityDirective
  ],
  exports: [
    SecurityDirective
  ]
})
export class SecurityModule { }
