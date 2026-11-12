import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {MessageService} from 'primeng/api';
import {ButtonModule} from 'primeng/button';
import {MessageModule} from 'primeng/message';
import {ToastModule} from 'primeng/toast';
import {provideIsyFactTheme} from './providers';

const messages = [
  {severity: 'info', button: 'info', palette: 'sky'},
  {severity: 'success', button: 'success', palette: 'green'},
  {severity: 'warn', button: 'warn', palette: 'orange'},
  {severity: 'error', button: 'danger', palette: 'red'}
] as const;

@Component({
  standalone: true,
  selector: 'isy-message-theme-test',
  imports: [ButtonModule, MessageModule, ToastModule],
  template: `
    @for (message of messages; track message.severity) {
      <p-message [severity]="message.severity" [closable]="true">{{ message.severity }}</p-message>
      <p-button [severity]="message.button" [label]="message.severity" />
    }
    <p-toast key="contrast-test" />
  `
})
class MessageThemeTestComponent {
  readonly messages = messages;
}

/**
 * Calculates WCAG relative luminance for a browser-resolved opaque RGB color.
 * @param color The computed CSS color
 * @returns The relative luminance
 */
function luminance(color: string): number {
  const values = color.match(/[\d.]+/g)?.map(Number);
  if (!color.startsWith('rgb') || !values || values.length < 3 || (values.length === 4 && values[3] !== 1)) {
    throw new Error(`Expected an opaque RGB color, received: ${color}`);
  }
  const channels = values.slice(0, 3).map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

/**
 * Calculates WCAG contrast from actual computed browser colors.
 * @param foreground The foreground color
 * @param background The background color
 * @returns The contrast ratio
 */
function contrast(foreground: string, background: string): number {
  const values = [luminance(foreground), luminance(background)];
  return (Math.max(...values) + 0.05) / (Math.min(...values) + 0.05);
}

describe('rendered message theme contrast', () => {
  let fixture: ComponentFixture<MessageThemeTestComponent>;
  let host: HTMLElement;

  /**
   * Finds a required element in the rendered test host.
   * @param selector The CSS selector
   * @returns The rendered element
   */
  function element(selector: string): HTMLElement {
    const result = host.querySelector<HTMLElement>(selector);
    if (!result) throw new Error(`Missing rendered element: ${selector}`);
    return result;
  }

  /**
   * Resolves a real theme custom property through the browser CSS cascade.
   * @param token The CSS custom property
   * @returns The computed color
   */
  function tokenColor(token: string): string {
    const probe = document.createElement('span');
    probe.style.backgroundColor = `var(${token})`;
    host.append(probe);
    const color = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return color;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageThemeTestComponent],
      providers: [provideIsyFactTheme(), provideNoopAnimations(), MessageService]
    }).compileComponents();
    fixture = TestBed.createComponent(MessageThemeTestComponent);
    host = fixture.nativeElement;
    fixture.detectChanges();
    TestBed.inject(MessageService).addAll(
      messages.map(({severity}) => ({
        key: 'contrast-test',
        severity,
        summary: severity,
        detail: 'Details',
        sticky: true
      }))
    );
    fixture.detectChanges();
    await fixture.whenStable();
  });

  for (const component of ['message', 'toast']) {
    for (const {severity, button, palette} of messages) {
      const selector = component === 'toast' ? `.p-toast-message-${severity}` : `.p-message-${severity}`;
      const textSelector = component === 'toast' ? '.p-toast-summary' : '.p-message-text';

      it(`should render ${component} ${severity} in the light ${palette} button palette`, () => {
        expect(getComputedStyle(element(selector)).backgroundColor).toBe(tokenColor(`--p-${palette}-100`));
        expect(getComputedStyle(element(`.p-button-${button}`)).backgroundColor).toBe(tokenColor(`--p-${palette}-600`));
      });

      it(`should give ${component} ${severity} text at least 4.5:1 contrast`, () => {
        expect(
          contrast(
            getComputedStyle(element(`${selector} ${textSelector}`)).color,
            getComputedStyle(element(selector)).backgroundColor
          )
        ).toBeGreaterThanOrEqual(4.5);
      });

      it(`should keep the ${component} ${severity} close icon readable on hover`, () => {
        const close = element(`${selector} .p-${component}-close-button`);
        expect(
          contrast(
            getComputedStyle(close).color,
            tokenColor(`--p-${component}-${severity}-close-button-hover-background`)
          )
        ).toBeGreaterThanOrEqual(3);
      });

      it(`should keep the ${component} ${severity} focus ring visible`, () => {
        expect(
          contrast(
            tokenColor(`--p-${component}-${severity}-close-button-focus-ring-color`),
            getComputedStyle(element(selector)).backgroundColor
          )
        ).toBeGreaterThanOrEqual(3);
      });
    }
  }

  for (const {severity} of messages) {
    it(`should give toast ${severity} details at least 4.5:1 contrast`, () => {
      const toast = `.p-toast-message-${severity}`;
      expect(
        contrast(
          getComputedStyle(element(`${toast} .p-toast-detail`)).color,
          getComputedStyle(element(toast)).backgroundColor
        )
      ).toBeGreaterThanOrEqual(4.5);
    });
  }
});
