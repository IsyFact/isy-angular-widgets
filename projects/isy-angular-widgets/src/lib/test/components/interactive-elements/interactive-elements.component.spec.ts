import {TestComponentComponent} from './interactive-elements.component';
import {createComponentFactory, Spectator} from '@ngneat/spectator';

describe('TestComponentComponent', () => {
  let spectator: Spectator<TestComponentComponent>;
  const createComponent = createComponentFactory({
    component: TestComponentComponent,
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
    {selector: '#permissions-dropdown .p-dropdown-trigger', description: 'Dropdowns'},
    {selector: 'p-megamenu .p-menuitem-link', description: 'Megamenu-Items'},
    {selector: '.isy-hauptfenster-linksnavigation .p-menuitem-link', description: 'Panelmenu-Items'},
    {selector: '#tab-view .p-tabview-nav-link', description: 'Tabview-Link'},
    {selector: 'isy-input-char button', description: 'Input-Char-Button'},
    {selector: 'p-fileupload .p-fileupload-choose', description: 'Fileupload-Button'}
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
      expect(heightWithPadding).toBeGreaterThanOrEqual(44);
    });
  });
});
