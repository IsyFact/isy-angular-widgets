import {NgTemplateOutlet} from '@angular/common';
import {BreakpointObserver} from '@angular/cdk/layout';
import {AfterViewInit, Component, DestroyRef, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {map} from 'rxjs';
import {AccordionModule} from 'primeng/accordion';
import {MenuItem} from 'primeng/api';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {DatePickerModule} from 'primeng/datepicker';
import {DividerModule} from 'primeng/divider';
import {FieldsetModule} from 'primeng/fieldset';
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';
import {InputNumberModule} from 'primeng/inputnumber';
import {InputTextModule} from 'primeng/inputtext';
import {PanelModule} from 'primeng/panel';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {SplitButtonModule} from 'primeng/splitbutton';
import {SplitterModule} from 'primeng/splitter';
import {StepperModule} from 'primeng/stepper';
import {TabsModule} from 'primeng/tabs';
import {ToolbarModule} from 'primeng/toolbar';
import {optionData} from '../../data/file-option';
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
    NgTemplateOutlet,
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
  private static readonly VERTICAL_STEPPER_MEDIA_QUERY = '(max-width: 320px)';
  private static readonly STEPPER_STEP_ONE = 1;
  private static readonly STEPPER_STEP_TWO = 2;
  private static readonly STEPPER_STEP_THREE = 3;
  private readonly destroyRef = inject(DestroyRef);
  private readonly anchorNav = inject(AnchorNavigationService);
  private readonly breakpointObserver = inject(BreakpointObserver);

  protected readonly isVerticalStepper = toSignal(
    this.breakpointObserver
      .observe(PrimengPanelComponent.VERTICAL_STEPPER_MEDIA_QUERY)
      .pipe(map(({matches}) => matches)),
    {
      initialValue: this.breakpointObserver.isMatched(PrimengPanelComponent.VERTICAL_STEPPER_MEDIA_QUERY)
    }
  );

  option: MenuItem[] = optionData;
  fieldsetRequiredInput = '';
  fieldsetNumberInput: number | null = null;
  fieldsetDateInput: Date | null = null;
  stepperValue: number | undefined = PrimengPanelComponent.STEPPER_STEP_ONE;

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

  goToStepperStep(
    step:
      | typeof PrimengPanelComponent.STEPPER_STEP_ONE
      | typeof PrimengPanelComponent.STEPPER_STEP_TWO
      | typeof PrimengPanelComponent.STEPPER_STEP_THREE
  ): void {
    this.stepperValue = step;
  }
}
