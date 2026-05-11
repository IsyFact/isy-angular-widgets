import {AfterViewInit, Component, DestroyRef, inject} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {optionData} from '../../data/file-option';
import {AccordionModule} from 'primeng/accordion';
import {PanelModule} from 'primeng/panel';
import {TabsModule} from 'primeng/tabs';
import {DividerModule} from 'primeng/divider';
import {CardModule} from 'primeng/card';
import {FieldsetModule} from 'primeng/fieldset';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {SplitterModule} from 'primeng/splitter';
import {ToolbarModule} from 'primeng/toolbar';
import {ButtonModule} from 'primeng/button';
import {SplitButtonModule} from 'primeng/splitbutton';
import {StepperModule} from 'primeng/stepper';
import {InputIconModule} from 'primeng/inputicon';
import {InputTextModule} from 'primeng/inputtext';
import {IconFieldModule} from 'primeng/iconfield';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {InputNumberModule} from 'primeng/inputnumber';
import {DatePickerModule} from 'primeng/datepicker';
import {AnchorNavigationService} from '../../../../shared/services/anchor-navigation.service';
import {SectionHeadingComponent} from '../../../../shared/components/section-heading/section-heading.component';

interface StandardTabDefinition {
  value: string;
  iconClass: string;
  labelKey: string;
  contentKey: string;
}

interface ScrollableTabDefinition {
  value: string;
  index: number;
}

@Component({
  standalone: true,
  selector: 'demo-primeng-panel',
  templateUrl: './primeng-panel.component.html',
  imports: [
    AccordionModule,
    PanelModule,
    TabsModule,
    DividerModule,
    CardModule,
    FieldsetModule,
    ScrollPanelModule,
    SplitterModule,
    ToolbarModule,
    ButtonModule,
    SplitButtonModule,
    StepperModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    DatePickerModule,
    IconFieldModule,
    InputIconModule,
    TranslateModule,
    SectionHeadingComponent
  ]
})
export class PrimengPanelComponent implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly anchorNav = inject(AnchorNavigationService);

  option: MenuItem[] = optionData;
  fieldsetRequiredInput = '';
  fieldsetNumberInput: number | null = null;
  fieldsetDateInput: Date | null = null;

  standardTabs: StandardTabDefinition[] = [
    {
      value: 'overview',
      iconClass: 'pi pi-home mr-2',
      labelKey: 'isyAngularWidgetsDemo.labels.panelTabOverview',
      contentKey: 'isyAngularWidgetsDemo.messages.panelTabOverviewContent'
    },
    {
      value: 'analytics',
      iconClass: 'pi pi-chart-bar mr-2',
      labelKey: 'isyAngularWidgetsDemo.labels.panelTabAnalytics',
      contentKey: 'isyAngularWidgetsDemo.messages.panelTabAnalyticsContent'
    },
    {
      value: 'settings',
      iconClass: 'pi pi-cog mr-2',
      labelKey: 'isyAngularWidgetsDemo.labels.panelTabSettings',
      contentKey: 'isyAngularWidgetsDemo.messages.panelTabSettingsContent'
    }
  ];

  scrollableTabs: ScrollableTabDefinition[] = Array.from({length: 30}, (_, index) => ({
    value: `tab-${index + 1}`,
    index: index + 1
  }));

  ngAfterViewInit(): void {
    this.anchorNav.initFragmentScroll(this.destroyRef);
  }

  scrollToWidget(event: MouseEvent, anchor: string): void {
    this.anchorNav.scrollToAnchor(event, anchor);
  }
}
