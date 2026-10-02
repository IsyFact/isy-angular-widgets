import '@analogjs/vitest-angular/setup-zone';
import {setupTestBed} from '@analogjs/vitest-angular/setup-testbed';
import {vi} from 'vitest';

type AnyFunction = (...args: any[]) => any;

if (typeof HTMLElement !== 'undefined') {
  const innerTextDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'innerText');

  if (!innerTextDescriptor) {
    Object.defineProperty(HTMLElement.prototype, 'innerText', {
      configurable: true,
      get() {
        return this.textContent ?? '';
      },
      set(value: string) {
        this.textContent = value;
      }
    });
  }

  if (typeof HTMLElement.prototype.scrollIntoView !== 'function') {
    HTMLElement.prototype.scrollIntoView = () => undefined;
  }
}

if (typeof globalThis.matchMedia !== 'function') {
  globalThis.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false
  })) as typeof globalThis.matchMedia;
}

globalThis.ResizeObserver ??= class ResizeObserver {
  observe(): void {
    return undefined;
  }
  unobserve(): void {
    return undefined;
  }
  disconnect(): void {
    return undefined;
  }
} as typeof ResizeObserver;

function spyOnCompat<T extends object, K extends keyof T & string>(object: T, methodName: K) {
  return vi.spyOn(object as Record<string, AnyFunction>, methodName);
}

function spyOnPropertyCompat<T extends object, K extends keyof T & string>(
  object: T,
  propertyName: K,
  accessType: 'get' | 'set' = 'get'
) {
  return vi.spyOn(object as Record<string, unknown>, propertyName, accessType as 'get');
}

Object.assign(globalThis, {
  spyOn: spyOnCompat,
  spyOnProperty: spyOnPropertyCompat
});

setupTestBed({zoneless: false});
