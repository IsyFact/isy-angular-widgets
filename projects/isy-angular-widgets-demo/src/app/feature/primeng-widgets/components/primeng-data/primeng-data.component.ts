import {AfterViewInit, Component, DestroyRef, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ViewportScroller} from '@angular/common';
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
    TableModule
  ]
})
export class PrimengDataComponent implements AfterViewInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly viewportScroller = inject(ViewportScroller);

  organization: TreeNode[] = organizationData;
  countries: Country[] = countryData;
  products: Product[] = productData;
  selectedProduct: Product = {};
  deliveryStatus: DeliveryStatus[] = deliveryData;
  files: FileOption[] = fileOptionData;
  itSolutions: ItSolution[] = itSolutionData;

  ngAfterViewInit(): void {
    this.activatedRoute.fragment.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((fragment) => {
      if (fragment) {
        this.viewportScroller.scrollToAnchor(fragment);
      }
    });
  }

  scrollToWidget(event: MouseEvent, anchor: string): void {
    event.preventDefault();
    this.viewportScroller.scrollToAnchor(anchor);
    window.history.replaceState(
      window.history.state,
      '',
      `${window.location.pathname}${window.location.search}#${anchor}`
    );
  }
}
