import './vitest.setup';

if (typeof MutationObserver !== 'undefined') {
  const NativeMutationObserver = MutationObserver;

  class SafeMutationObserver extends NativeMutationObserver {
    override observe(target: Node, options: MutationObserverInit): void {
      if (!target || typeof target.nodeType !== 'number') {
        return;
      }

      super.observe(target, options);
    }
  }

  globalThis.MutationObserver = SafeMutationObserver;
}

// chart.js requires a 2D canvas context; jsdom does not implement one, so a no-op stub is provided.
if (typeof HTMLCanvasElement !== 'undefined') {
  const createContext2d = (canvas: HTMLCanvasElement): CanvasRenderingContext2D => {
    const state: Record<string | symbol, unknown> = {
      canvas,
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '10px sans-serif',
      textAlign: 'start',
      textBaseline: 'alphabetic',
      globalAlpha: 1,
      measureText: (text: string) => ({width: String(text).length * 6}),
      createLinearGradient: () => ({addColorStop: () => undefined}),
      createRadialGradient: () => ({addColorStop: () => undefined}),
      createPattern: () => null,
      getImageData: () => ({data: new Uint8ClampedArray(4)}),
      getLineDash: () => []
    };

    return new Proxy(state, {
      get: (target, property) => (property in target ? target[property] : () => undefined),
      set: (target, property, value) => {
        target[property] = value;
        return true;
      }
    }) as unknown as CanvasRenderingContext2D;
  };

  HTMLCanvasElement.prototype.getContext = function getContext(this: HTMLCanvasElement, contextId: string) {
    return contextId === '2d' ? createContext2d(this) : null;
  } as HTMLCanvasElement['getContext'];
}

// Without layout, PrimeNG computes values such as `calc(NaN% - 0px)`, which makes the jsdom CSS parser throw.
if (typeof CSSStyleDeclaration !== 'undefined') {
  const containsNaN = (value: unknown): boolean => typeof value === 'string' && value.includes('NaN');
  const prototype = CSSStyleDeclaration.prototype;

  const setProperty = prototype.setProperty;
  prototype.setProperty = function (property, value, priority) {
    if (containsNaN(value)) {
      return;
    }
    setProperty.call(this, property, value, priority);
  };

  for (const [name, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(prototype))) {
    if (typeof descriptor.set !== 'function') {
      continue;
    }

    const originalSetter = descriptor.set;
    Object.defineProperty(prototype, name, {
      ...descriptor,
      set(value: unknown) {
        if (containsNaN(value)) {
          return;
        }
        originalSetter.call(this, value);
      }
    });
  }
}
