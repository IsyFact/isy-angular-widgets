import type {MockInstance} from 'vitest';

// Globals installed by vitest.setup.ts for concise spies in specs.
declare global {
  function spyOn<T extends object, K extends keyof T & string>(
    object: T,
    methodName: K
  ): T[K] extends (...args: infer A) => infer R ? MockInstance<(...args: A) => R> : MockInstance;

  function spyOnProperty<T extends object, K extends keyof T & string>(
    object: T,
    propertyName: K,
    accessType?: 'get' | 'set'
  ): MockInstance<() => T[K]>;
}

export {};
