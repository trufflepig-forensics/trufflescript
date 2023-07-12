import { Class } from "./utility-types";
import { Err, Ok, Result } from "./result";

/**
 * Wrap a function which returns `T` and may throw `E` resulting in a new function which returns `Result<T, E>` and won't throw `E`
 *
 * @param func the function to wrap
 * @param errorType the error type to catch. <br/>
 *                  This parameter is required because **any error which isn't of type `E` will continue to be thrown**.
 *                  I.e. any caught error will be checked using `instanceof` against `errorType` and rethrown if it doesn't match.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function wrapThrowingFunction<T, E extends Error, Args extends any[]>(func: (...args: Args) => T, errorType: Class<E>): (...args: Args) => Result<T, E>  {
    return function (...args: Args): Result<T, E> {
        try {
            return new Ok(func(...args));
        } catch (err) {
            if (err instanceof errorType) return new Err(err);
            else throw err;
        }
    };
}