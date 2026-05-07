import {AfterViewInit, Component, DestroyRef, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ViewportScroller} from '@angular/common';
import {AutoCompleteCompleteEvent, AutoCompleteModule} from 'primeng/autocomplete';

import {Country} from '../../model/country';
import {countryCityMapping, countryData} from '../../data/country';
import {FileOption} from '../../model/file-option';
import {fileOptionData} from '../../data/file-option';
import {InputMaskModule} from 'primeng/inputmask';
import {IconFieldModule} from 'primeng/iconfield';
import {InputGroupAddonModule} from 'primeng/inputgroupaddon';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputIconModule} from 'primeng/inputicon';
import {PasswordModule} from 'primeng/password';
import {DatePickerModule} from 'primeng/datepicker';
import {FormsModule} from '@angular/forms';
import {InputNumberModule} from 'primeng/inputnumber';
import {CascadeSelectModule} from 'primeng/cascadeselect';
import {SelectModule} from 'primeng/select';
import {MultiSelectModule} from 'primeng/multiselect';
import {TreeSelectModule} from 'primeng/treeselect';
import {InputOtpModule} from 'primeng/inputotp';
import {DividerModule} from 'primeng/divider';
import {CheckboxModule} from 'primeng/checkbox';
import {KnobModule} from 'primeng/knob';
import {RatingModule} from 'primeng/rating';
import {ToggleSwitchModule} from 'primeng/toggleswitch';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {SelectButtonModule} from 'primeng/selectbutton';
import {ListboxModule} from 'primeng/listbox';
import {InputTextModule} from 'primeng/inputtext';
import {RadioButtonModule} from 'primeng/radiobutton';
import {TextareaModule} from 'primeng/textarea';
import {KeyFilterModule} from 'primeng/keyfilter';
import {SliderModule} from 'primeng/slider';
import {ColorPickerModule} from 'primeng/colorpicker';
import {EditorModule} from 'primeng/editor';

@Component({
  standalone: true,
  selector: 'demo-primeng-form',
  templateUrl: './primeng-form.component.html',
  styles: [
    `
      .section-heading {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }

      .section-anchor {
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        text-decoration: none;
      }

      .section-heading:hover .section-anchor,
      .section-heading:focus-within .section-anchor {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
      }
    `
  ],
  imports: [
    InputTextModule,
    InputMaskModule,
    AutoCompleteModule,
    IconFieldModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputIconModule,
    PasswordModule,
    DatePickerModule,
    FormsModule,
    InputNumberModule,
    CascadeSelectModule,
    SelectModule,
    MultiSelectModule,
    TreeSelectModule,
    InputOtpModule,
    DividerModule,
    CheckboxModule,
    RadioButtonModule,
    KnobModule,
    RatingModule,
    ToggleSwitchModule,
    ToggleButtonModule,
    SelectButtonModule,
    ListboxModule,
    TextareaModule,
    KeyFilterModule,
    SliderModule,
    ColorPickerModule,
    EditorModule
  ]
})
export class PrimengFormComponent implements AfterViewInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly viewportScroller = inject(ViewportScroller);

  countries: Country[] = countryData;
  filteredCountries: Country[] = [];
  files: FileOption[] = fileOptionData;

  color: string = '#0055B9';
  password: string = '';
  ingredient: string = '';

  stateOptions: string[] = ['Off', 'On'];
  slider: number = 0;

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  cities: any[] = countryCityMapping;

  // Variable to hold the text entered in the editor
  text: string = '';

  ngAfterViewInit(): void {
    this.activatedRoute.fragment.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(fragment => {
      if (fragment) {
        this.viewportScroller.scrollToAnchor(fragment);
      }
    });
  }

  scrollToWidget(event: MouseEvent, anchor: string): void {
    event.preventDefault();
    this.viewportScroller.scrollToAnchor(anchor);
    window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}#${anchor}`);
  }

  filterCountry(event: AutoCompleteCompleteEvent): void {
    const filtered: Country[] = [];
    const query = event.query;

    for (const country of this.countries) {
      if (country.name.toLowerCase().startsWith(query.toLowerCase())) {
        filtered.push(country);
      }
    }

    this.filteredCountries = filtered;
  }
}
