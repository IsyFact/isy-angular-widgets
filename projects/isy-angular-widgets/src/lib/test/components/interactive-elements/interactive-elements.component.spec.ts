import {provideHttpClient} from '@angular/common/http';
import {TestComponentComponent} from './interactive-elements.component';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {provideIsyFactTheme} from '../../../core/providers';

describe('TestComponentComponent', () => {
  let spectator: Spectator<TestComponentComponent>;
  const createComponent = createComponentFactory({
    component: TestComponentComponent,
    providers: [provideHttpClient(), provideIsyFactTheme()],
    shallow: true
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  const elements = [
    {selector: '#button-icon button', description: 'Buttons'},
    {selector: '#permissions-dropdown .p-select-dropdown', description: 'Dropdowns'},
    {selector: '.p-ripple.p-tab.p-component', description: 'Tabview-Link'},
    {selector: 'isy-input-char button', description: 'Input-Char-Button'},
    {selector: 'p-fileupload .p-fileupload-choose-button', description: 'Fileupload-Button'},
    {selector: '.p-button', description: 'Buttons'},
    {selector: 'p-panelmenu .p-panelmenu-header-link', description: 'Panelmenu-Items'}
  ];

  elements.forEach(({selector, description}) => {
    it(`should have a minimum size of 44x44 pixels for ${description}`, () => {
      const element = spectator.query(selector) as HTMLElement;
      const {width, height} = element.getBoundingClientRect();
      const computedStyle = getComputedStyle(element);
      const paddingTop = parseFloat(computedStyle.paddingTop);
      const paddingRight = parseFloat(computedStyle.paddingRight);
      const paddingBottom = parseFloat(computedStyle.paddingBottom);
      const paddingLeft = parseFloat(computedStyle.paddingLeft);
      const widthWithPadding = width + paddingLeft + paddingRight;
      const heightWithPadding = height + paddingTop + paddingBottom;

      expect(widthWithPadding).toBeGreaterThanOrEqual(44);
      if (description === 'Dropdowns') {
        expect(heightWithPadding).toBeGreaterThanOrEqual(42);
      } else {
        expect(heightWithPadding).toBeGreaterThanOrEqual(44);
      }
    });
  });

  it('should render error text with font-size > 18.666666666666664px (14pt)', () => {
    const errorMessage = spectator.query('.p-error .p-message-text') as HTMLElement;
    const fontSize = window.getComputedStyle(errorMessage).fontSize;
    const fontSizePx = parseFloat(fontSize);
    expect(fontSizePx).toBeGreaterThan(18.666666666666664);
  });
});
