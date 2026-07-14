import {Component, ChangeDetectionStrategy} from '@angular/core';
import {RouterModule} from '@angular/router';

@Component({
  standalone: true,
  selector: 'demo-page-not-found',
  templateUrl: './page-not-found.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterModule]
})
export class PageNotFoundComponent {}
