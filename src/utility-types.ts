/**
 * Constructs a type which is the constructor of `Type`.
 * I.e. it is the type of the class named by `Type`.
 *
 * Usage example:
 * ```ts
 * const variable: SomeClass = new SomeClass();
 * const type: Class<SomeClass> = SomeClass;
 * if (variable instanceof type) {
 *     ...
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Class<Type> = { new (...args: any[]): Type };

/**
 * Any type which provides a `toString` method i.e. most builtins
 */
export type ToString = { toString(): string };
