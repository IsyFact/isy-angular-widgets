import {AfterViewInit, Component, DestroyRef, inject} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {optionData} from '../../data/file-option';
import {ButtonModule} from 'primeng/button';
import {DividerModule} from 'primeng/divider';
import {SplitButtonModule} from 'primeng/splitbutton';
import {SpeedDialModule} from 'primeng/speeddial';
import {AnchorNavigationService} from '../../../../shared/services/anchor-navigation.service';
import {SectionHeadingComponent} from '../../../../shared/components/section-heading/section-heading.component';

@Component({
  standalone: true,
  selector: 'demo-primeng-button',
  templateUrl: './primeng-button.component.html',
  imports: [ButtonModule, DividerModule, SplitButtonModule, SpeedDialModule, SectionHeadingComponent]
})
export class PrimengButtonComponent implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly anchorNav = inject(AnchorNavigationService);

  options: MenuItem[] = optionData;

  ngAfterViewInit(): void {
    this.anchorNav.initFragmentScroll(this.destroyRef);
  }

  scrollToWidget(event: MouseEvent, anchor: string): void {
    this.anchorNav.scrollToAnchor(event, anchor);
  }
}
