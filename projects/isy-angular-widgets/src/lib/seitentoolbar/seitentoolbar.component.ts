import {Component, inject, Input} from '@angular/core';
import {ToolbarModule} from 'primeng/toolbar';
import {ButtonModule} from 'primeng/button';
import {Router, RouterModule} from '@angular/router';

/**
 * Represents a toolbar component that can be used to insert a toolbar at the top of the page.
 */
@Component({
  standalone: true,
  selector: 'isy-seiten-toolbar',
  templateUrl: './seitentoolbar.component.html',
  styleUrls: ['./seitentoolbar.component.scss'],
  imports: [ToolbarModule, ButtonModule, RouterModule]
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

  private readonly router = inject(Router);

  /**
   * Method to navigate to the homeRoute.
   * @returns A promise that resolves when the navigation is complete.
   */
  async navigateHome(): Promise<void> {
    await this.router.navigate([this.sidebarHomeRoute]);
  }
}
