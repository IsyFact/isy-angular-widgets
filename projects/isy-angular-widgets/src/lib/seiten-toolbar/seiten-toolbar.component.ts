import {Component, Input} from '@angular/core';
import {ToolbarModule} from 'primeng/toolbar';
import {ButtonModule} from 'primeng/button';
import {Router, RouterModule} from '@angular/router';

/**
 * Represents a toolbar component that can be used to insert a toolbar at the top of the page.
 */
@Component({
  selector: 'isy-seiten-toolbar',
  standalone: true,
  imports: [ToolbarModule, ButtonModule, RouterModule],
  templateUrl: './seiten-toolbar.component.html',
  styleUrls: ['./seiten-toolbar.component.scss']
})
export class SeitenToolbarComponent {
  /**
   * Label for the home button.
   */
  @Input() sidebarHomeButtonLabel?: string = 'Zurück zur Startseite';

  /**
   * Route for the home button.
   */
  @Input() sidebarHomeRoute?: string = '/';

  constructor(private router: Router) {}

  /**
   * Method to navigate to the homeRoute.
   * @returns A promise that resolves when the navigation is complete.
   */
  async navigateHome(): Promise<void> {
    await this.router.navigate([this.sidebarHomeRoute]);
  }
}
