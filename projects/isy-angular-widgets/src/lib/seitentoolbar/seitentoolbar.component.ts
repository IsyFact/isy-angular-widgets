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
  templateUrl: './seitentoolbar.component.html',
  styleUrls: ['./seitentoolbar.component.scss']
})
export class SeitentoolbarComponent {
  /**
   * Determines whether to show or hide the Seitentoolbar, a sticky toolbar at the top of the screen.
   */
  @Input() showSidebar: boolean = false;

  /**
   * Label for the home button.
   */
  @Input() sidebarHomeButtonLabel?: string;

  /**
   * AriaLabel for the home button.
   */
  @Input() sidebarHomeButtonAriaLabel?: string;

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
