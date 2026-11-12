import {NgTemplateOutlet} from '@angular/common';
import {BreakpointObserver} from '@angular/cdk/layout';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  ViewChild,
  ChangeDetectionStrategy
} from '@angular/core';
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
import {MenuModule} from 'primeng/menu';
import {PanelModule} from 'primeng/panel';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {SplitButtonModule} from 'primeng/splitbutton';
import {SplitterModule} from 'primeng/splitter';
import {StepperModule} from 'primeng/stepper';
import {TabsModule} from 'primeng/tabs';
import {ToolbarModule} from 'primeng/toolbar';
import {TooltipModule} from 'primeng/tooltip';
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

/** A single icon-only action rendered inside a field group toolbar. */
interface FieldGroupToolbarAction {
  key: string;
  icon: string;
  labelKey: string;
  /** Unavailable actions are rendered disabled instead of being hidden. */
  disabled: boolean;
}

/** A sub field group (`p-fieldset`) with its own toolbar. */
interface AddressFieldGroup {
  id: string;
  legendKey: string;
  toolbarLabelKey: string;
  actions: FieldGroupToolbarAction[];
}

@Component({
  standalone: true,
  selector: 'demo-primeng-panel',
  templateUrl: './primeng-panel.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
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
    MenuModule,
    TooltipModule,
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

  @ViewChild('addressesOverflowButton', {read: ElementRef})
  private readonly addressesOverflowButton?: ElementRef<HTMLElement>;

  /** Toggle state of the "Adressen" toolbar toggle button, mirrored via `aria-pressed`. */
  addressesHighlighted = false;

  /** Translation keys of the last executed action, announced via an aria-live region. */
  lastToolbarActionKey: string | null = null;
  lastToolbarGroupKey: string | null = null;

  addressGroups: AddressFieldGroup[] = [
    {
      id: 'meldeadresse',
      legendKey: 'isyAngularWidgetsDemo.labels.panelFieldsetToolbarRegisteredAddress',
      toolbarLabelKey: 'isyAngularWidgetsDemo.labels.panelFieldsetToolbarRegisteredAddressToolbar',
      actions: [
        {
          key: 'edit',
          icon: 'pi pi-pencil',
          labelKey: 'isyAngularWidgetsDemo.labels.panelFieldsetToolbarEdit',
          disabled: false
        },
        {
          key: 'print',
          icon: 'pi pi-print',
          labelKey: 'isyAngularWidgetsDemo.labels.panelFieldsetToolbarPrint',
          disabled: false
        },
        {
          key: 'delete',
          icon: 'pi pi-trash',
          labelKey: 'isyAngularWidgetsDemo.labels.panelFieldsetToolbarDelete',
          disabled: false
        }
      ]
    },
    {
      id: 'postanschrift',
      legendKey: 'isyAngularWidgetsDemo.labels.panelFieldsetToolbarPostalAddress',
      toolbarLabelKey: 'isyAngularWidgetsDemo.labels.panelFieldsetToolbarPostalAddressToolbar',
      actions: [
        {
          key: 'edit',
          icon: 'pi pi-pencil',
          labelKey: 'isyAngularWidgetsDemo.labels.panelFieldsetToolbarEdit',
          disabled: false
        },
        {
          key: 'print',
          icon: 'pi pi-print',
          labelKey: 'isyAngularWidgetsDemo.labels.panelFieldsetToolbarPrint',
          disabled: true
        },
        {
          key: 'delete',
          icon: 'pi pi-trash',
          labelKey: 'isyAngularWidgetsDemo.labels.panelFieldsetToolbarDelete',
          disabled: true
        }
      ]
    }
  ];

  addressesOverflowItems: MenuItem[] = [
    {
      label: 'isyAngularWidgetsDemo.labels.panelFieldsetToolbarExport',
      icon: 'pi pi-download',
      command: () => this.runOverflowAction('isyAngularWidgetsDemo.labels.panelFieldsetToolbarExport')
    },
    {
      label: 'isyAngularWidgetsDemo.labels.panelFieldsetToolbarHistory',
      icon: 'pi pi-history',
      command: () => this.runOverflowAction('isyAngularWidgetsDemo.labels.panelFieldsetToolbarHistory')
    },
    {
      label: 'isyAngularWidgetsDemo.labels.panelFieldsetToolbarArchive',
      icon: 'pi pi-box',
      disabled: true
    }
  ];

  ngAfterViewInit(): void {
    this.anchorNav.initFragmentScroll(this.destroyRef);
  }

  scrollToWidget(event: MouseEvent, anchor: string): void {
    this.anchorNav.scrollToAnchor(event, anchor);
  }

  /**
   * Executes a field group toolbar action and returns the focus to the triggering button.
   * @param event The originating click event
   * @param actionLabelKey Translation key of the executed action
   * @param groupLabelKey Translation key of the field group the action belongs to
   */
  runFieldGroupAction(event: Event, actionLabelKey: string, groupLabelKey: string): void {
    this.lastToolbarActionKey = actionLabelKey;
    this.lastToolbarGroupKey = groupLabelKey;
    this.restoreFocus(event.currentTarget as HTMLElement | null);
  }

  /**
   * Toggles the highlight state of the "Adressen" group and returns the focus to the toggle button.
   * @param event The originating click event
   */
  toggleAddressesHighlight(event: Event): void {
    this.addressesHighlighted = !this.addressesHighlighted;
    this.runFieldGroupAction(
      event,
      'isyAngularWidgetsDemo.labels.panelFieldsetToolbarHighlight',
      'isyAngularWidgetsDemo.labels.panelFieldsetToolbarAddresses'
    );
  }

  private runOverflowAction(actionLabelKey: string): void {
    this.lastToolbarActionKey = actionLabelKey;
    this.lastToolbarGroupKey = 'isyAngularWidgetsDemo.labels.panelFieldsetToolbarAddresses';
    this.restoreFocus(this.addressesOverflowButton?.nativeElement.querySelector('button') ?? null);
  }

  private restoreFocus(target: HTMLElement | null): void {
    if (!target) {
      return;
    }
    setTimeout(() => target.focus());
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
