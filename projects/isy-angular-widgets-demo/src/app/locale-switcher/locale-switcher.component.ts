import { Component, Inject, LOCALE_ID } from '@angular/core';

@Component({
  selector: 'demo-locale-switcher',
  templateUrl: './locale-switcher.component.html',
})
export class LocaleSwitcherComponent {
  locales = [
    { code: 'de', name: 'Deutsch' },
    { code: 'en', name: 'Englisch' },
  ];

  constructor(
    @Inject(LOCALE_ID) public activeLocale: string
  ) {}

  onChange() {
    window.location.href = `/${this.activeLocale}`;
  }

}