import {AfterViewInit, Component, DestroyRef, inject} from '@angular/core';
import {TreeNode} from 'primeng/api';
import {organizationData} from '../../data/organization';
import {countryData} from '../../data/country';
import {Country} from '../../model/country';
import {deliveryData, itSolutionData, productData} from '../../data/product';
import {DeliveryStatus, ItSolution, Product} from '../../model/product';
import {fileOptionData} from '../../data/file-option';
import {FileOption} from '../../model/file-option';
import {OrganizationChartModule} from 'primeng/organizationchart';
import {TimelineModule} from 'primeng/timeline';
import {ScrollerModule} from 'primeng/scroller';
import {TreeModule} from 'primeng/tree';
import {DividerModule} from 'primeng/divider';
import {PaginatorModule} from 'primeng/paginator';
import {TableModule} from 'primeng/table';
import {CommonModule} from '@angular/common';
import {TreeTableModule} from 'primeng/treetable';
import {AnchorNavigationService} from '../../../../shared/services/anchor-navigation.service';
import {SectionHeadingComponent} from '../../../../shared/components/section-heading/section-heading.component';

@Component({
  standalone: true,
  selector: 'demo-primeng-data',
  templateUrl: './primeng-data.component.html',
  imports: [
    CommonModule,
    OrganizationChartModule,
    TimelineModule,
    ScrollerModule,
    TreeModule,
    TreeTableModule,
    DividerModule,
    PaginatorModule,
    TableModule,
    SectionHeadingComponent
  ]
})
export class PrimengDataComponent implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly anchorNav = inject(AnchorNavigationService);

  organization: TreeNode[] = organizationData;
  countries: Country[] = countryData;
  products: Product[] = productData;
  selectedProduct: Product = {};
  deliveryStatus: DeliveryStatus[] = deliveryData;
  files: FileOption[] = fileOptionData;
  itSolutions: ItSolution[] = itSolutionData;

  ngAfterViewInit(): void {
    this.anchorNav.initFragmentScroll(this.destroyRef);
  }

  scrollToWidget(event: MouseEvent, anchor: string): void {
    this.anchorNav.scrollToAnchor(event, anchor);
  }
}
