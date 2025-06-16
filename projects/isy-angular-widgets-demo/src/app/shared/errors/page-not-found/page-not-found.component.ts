import {Component} from '@angular/core';
import {RouterModule} from '@angular/router';

@Component({
  standalone: true,
  selector: 'demo-page-not-found',
  templateUrl: './page-not-found.component.html',
  imports: [RouterModule]
})
export class PageNotFoundComponent {}
