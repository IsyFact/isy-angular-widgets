import {NgModule} from '@angular/core';
import {SecurityDirective} from './security-directive';
import {SecurityService} from './security-service';

@NgModule({
  declarations: [
    SecurityDirective
  ],
  imports: [],
  exports: [
    SecurityDirective
  ],
  providers: [
    SecurityService
  ]
})
export class SecurityModule { }
