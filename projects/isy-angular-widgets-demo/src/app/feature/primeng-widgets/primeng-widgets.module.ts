import {NgModule} from '@angular/core';
import {PrimengFormComponent} from './components/primeng-form/primeng-form.component';
import {PrimengButtonComponent} from './components/primeng-button/primeng-button.component';
import {PrimengDataComponent} from './components/primeng-data/primeng-data.component';
import {PrimengPanelComponent} from './components/primeng-panel/primeng-panel.component';
import {PrimengOverlayComponent} from './components/primeng-overlay/primeng-overlay.component';
import {PrimengFileComponent} from './components/primeng-file/primeng-file.component';
import {PrimengMenuComponent} from './components/primeng-menu/primeng-menu.component';
import {PrimengMessagesComponent} from './components/primeng-messages/primeng-messages.component';
import {PrimengMiscComponent} from './components/primeng-misc/primeng-misc.component';
import {PrimengChartComponent} from './components/primeng-chart/primeng-chart.component';

import {TabViewModule} from 'primeng/tabview';
import {CheckboxModule} from 'primeng/checkbox';
import {ColorPickerModule} from 'primeng/colorpicker';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputGroupAddonModule} from 'primeng/inputgroupaddon';
import {InputMaskModule} from 'primeng/inputmask';
import {InputNumberModule} from 'primeng/inputnumber';
import {InputOtpModule} from 'primeng/inputotp';
import {InputTextModule} from 'primeng/inputtext';
import {Textarea} from 'primeng/inputtextarea';
import {KnobModule} from 'primeng/knob';
import {KeyFilterModule} from 'primeng/keyfilter';
import {PasswordModule} from 'primeng/password';
import {RadioButtonModule} from 'primeng/radiobutton';
import {RatingModule} from 'primeng/rating';
import {SliderModule} from 'primeng/slider';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {CascadeSelectModule} from 'primeng/cascadeselect';
import {ListboxModule} from 'primeng/listbox';
import {MultiSelectModule} from 'primeng/multiselect';
import {SelectButtonModule} from 'primeng/selectbutton';
import {TreeSelectModule} from 'primeng/treeselect';
import {ButtonModule} from 'primeng/button';
import {SplitButtonModule} from 'primeng/splitbutton';
import {SpeedDialModule} from 'primeng/speeddial';
import {OrganizationChartModule} from 'primeng/organizationchart';
import {PaginatorModule} from 'primeng/paginator';
import {ScrollerModule} from 'primeng/scroller';
import {TableModule} from 'primeng/table';
import {CurrencyPipe, NgOptimizedImage} from '@angular/common';
import {TimelineModule} from 'primeng/timeline';
import {TreeModule} from 'primeng/tree';
import {TreeTableModule} from 'primeng/treetable';
import {AccordionModule} from 'primeng/accordion';
import {CardModule} from 'primeng/card';
import {DividerModule} from 'primeng/divider';
import {FieldsetModule} from 'primeng/fieldset';
import {PanelModule} from 'primeng/panel';
import {SplitterModule} from 'primeng/splitter';
import {StepperModule} from 'primeng/stepper';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {ToolbarModule} from 'primeng/toolbar';
import {ToastModule} from 'primeng/toast';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import {DialogModule} from 'primeng/dialog';
import {TooltipModule} from 'primeng/tooltip';
import {FileUploadModule} from 'primeng/fileupload';
import {DrawerModule} from 'primeng/drawer';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {ContextMenuModule} from 'primeng/contextmenu';
import {MenuModule} from 'primeng/menu';
import {MenubarModule} from 'primeng/menubar';
import {MegaMenuModule} from 'primeng/megamenu';
import {PanelMenuModule} from 'primeng/panelmenu';
import {StepsModule} from 'primeng/steps';
import {TabMenuModule} from 'primeng/tabmenu';
import {TieredMenuModule} from 'primeng/tieredmenu';
import {MessagesModule} from 'primeng/messages';
import {AvatarModule} from 'primeng/avatar';
import {BadgeModule} from 'primeng/badge';
import {BlockUIModule} from 'primeng/blockui';
import {InplaceModule} from 'primeng/inplace';
import {MeterGroupModule} from 'primeng/metergroup';
import {ScrollTopModule} from 'primeng/scrolltop';
import {SkeletonModule} from 'primeng/skeleton';
import {ProgressBarModule} from 'primeng/progressbar';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {TagModule} from 'primeng/tag';
import {TerminalModule} from 'primeng/terminal';
import {EditorModule} from 'primeng/editor';
import {ChartModule} from 'primeng/chart';
import {DatePickerModule} from 'primeng/datepicker';
import {SelectModule} from 'primeng/select';
import {ToggleSwitchModule} from 'primeng/toggleswitch';
import {PopoverModule} from 'primeng/popover';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PrimengFormComponent,
    PrimengButtonComponent,
    PrimengDataComponent,
    PrimengPanelComponent,
    PrimengOverlayComponent,
    PrimengFileComponent,
    PrimengMenuComponent,
    PrimengMessagesComponent,
    PrimengMiscComponent,
    PrimengChartComponent
  ],
  imports: [
    TabViewModule,
    CheckboxModule,
    ColorPickerModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputMaskModule,
    InputNumberModule,
    InputOtpModule,
    InputTextModule,
    Textarea,
    KnobModule,
    KeyFilterModule,
    PasswordModule,
    RadioButtonModule,
    RatingModule,
    SliderModule,
    ToggleButtonModule,
    IconFieldModule,
    InputIconModule,
    AutoCompleteModule,
    CascadeSelectModule,
    ListboxModule,
    MultiSelectModule,
    SelectButtonModule,
    TreeSelectModule,
    ButtonModule,
    SplitButtonModule,
    SpeedDialModule,
    OrganizationChartModule,
    PaginatorModule,
    ScrollerModule,
    TableModule,
    CurrencyPipe,
    TimelineModule,
    TreeModule,
    TreeTableModule,
    AccordionModule,
    CardModule,
    DividerModule,
    FieldsetModule,
    PanelModule,
    SplitterModule,
    StepperModule,
    ScrollPanelModule,
    ToolbarModule,
    ToastModule,
    ConfirmDialogModule,
    ConfirmPopupModule,
    DialogModule,
    TooltipModule,
    FileUploadModule,
    BreadcrumbModule,
    ContextMenuModule,
    MenuModule,
    MenubarModule,
    MegaMenuModule,
    PanelMenuModule,
    StepsModule,
    TabMenuModule,
    TieredMenuModule,
    MessagesModule,
    AvatarModule,
    BadgeModule,
    BlockUIModule,
    InplaceModule,
    MeterGroupModule,
    ScrollTopModule,
    SkeletonModule,
    ProgressBarModule,
    ProgressSpinnerModule,
    TagModule,
    TerminalModule,
    NgOptimizedImage,
    EditorModule,
    ChartModule,
    DatePickerModule,
    SelectModule,
    ToggleSwitchModule,
    PopoverModule,
    DrawerModule,
    FormsModule 
  ]
})
export class PrimengWidgetsModule {}
