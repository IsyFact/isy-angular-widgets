import {booleanAttribute, Component, inject, Input} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {ToolbarModule} from 'primeng/toolbar';
import {WidgetsConfigService} from '../i18n/widgets-config.service';

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
   * Determines whether responsive behavior is enabled.
   */
  @Input({transform: booleanAttribute}) responsive: boolean = false;

  /**
   * Label for the home button.
   */
  @Input() sidebarHomeButtonLabel?: string;

  /**
   * Accessible label for the home button.
   */
  @Input() sidebarHomeButtonAriaLabel?: string;

  /**
   * Route for the home button.
   */
  @Input() sidebarHomeRoute: string = '/';

  private readonly router = inject(Router);

  /**
   * A service used to translate labels within the widgets library.
   */
  protected readonly configService = inject(WidgetsConfigService);

  /**
   * Returns the accessible label for the home button.
   * @returns The effective accessible label for the home button.
   */
  get effectiveSidebarHomeButtonAriaLabel(): string {
    return (
      this.sidebarHomeButtonAriaLabel ??
      this.sidebarHomeButtonLabel ??
      this.configService.getTranslation('seitentoolbar.back')
    );
  }

  /**
   * Method to navigate to the homeRoute.
   * @returns A promise that resolves when the navigation is complete.
   */
  async navigateHome(): Promise<void> {
    await this.router.navigate([this.sidebarHomeRoute]);
  }
}
