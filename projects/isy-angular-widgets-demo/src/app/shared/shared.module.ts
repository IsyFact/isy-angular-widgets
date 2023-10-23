import {NgModule} from '@angular/core';
import {PersonenService} from './services/personen.service';
import {PageNotFoundComponent} from './errors/page-not-found/page-not-found.component';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [RouterModule],
  providers: [PersonenService],
  declarations: [PageNotFoundComponent]
})
export class SharedModule {}
