/* eslint-disable @typescript-eslint/no-unused-vars */
// I'd like the interface implementations to use the exact same method signatures,
// even though some arguments will be ignored by some implementations

/**
 * A [Rust](https://doc.rust-lang.org/std/result/enum.Result.html) inspired type for error handling
 *
 * `Result` is a type that represents either success (`Ok`) or failure (`Err`).
 */
export type Result<T, E> = (OkData<T> | ErrData<E>) & ResultMethods<T, E>;

/**
 * The data i.e. properties stored in an {@link Ok `Ok`}
 *
 * The fields `is_ok` and `is_err` enable typescript's type narrowing
 * to provide direct access to the `ok` property:
 *
 * ```ts
 * if (result.is_ok) {
 *     console.log(result.ok); // `ok` can be accessed inside this if block
 * }
 * ```
 */
export interface OkData<T> {
    ok: T;
    is_ok: true;
    is_err: false;
}

/**
 * The data i.e. properties stored in an {@link Err `Err`}
 *
 * The fields `is_ok` and `is_err` enable typescript's type narrowing
 * to provide direct access to the `err` property.
 *
 * ```ts
 * if (result.is_err) {
 *     console.log(result.err); // `err` can be accessed inside this if block
 * }
 * ```
 */
export interface ErrData<E> {
    err: E;
    is_ok: false;
    is_err: true;
}

/**
 * All methods a {@link Result} provides regardless of its variant.
 */
export interface ResultMethods<T, E> {
    /**
     * Calls `func` if the result is `Ok`, otherwise returns the `Err` value of `this`.
     *
     * This function can be used for control flow based on `Result` values.
     *
     * @param func function to process the `OK` value
     */
    and_then<U>(func: (ok: T) => Result<U, E>): Result<U, E>;

    /**
     * Maps a `Result<T, E>` to `Result<U, E>` by applying a function to a contained `Ok` value, leaving an `Err` value untouched.
     *
     * This function can be used to compose the results of two functions.
     *
     * @param func
     */
    map<U>(func: (ok: T) => U): Result<U, E>;

    /**
     * Maps a `Result<T, E>` to `Result<T, F>` by applying a function to a contained `Err` value, leaving an `Ok` value untouched.
     *
     * This function can be used to pass through a successful result while handling an error.
     *
     * @param func
     */
    map_err<F>(func: (err: E) => F): Result<T, F>;

    match<R>(ifOk: (ok: T) => R, ifErr: (err: E) => R): R;

    /**
     * Returns the contained `Ok` value, consuming the `this` value.
     *
     * Because this method may panic, its use is generally discouraged.
     * Instead, prefer to use pattern matching and handle the Err case explicitly,
     * or call `unwrap_or` or `unwrap_or_else`.
     *
     * ## Throws
     * Throws an error if the value is an `Err`, with a panic message provided by the `Err`’s `toString()` implementation.
     */
    unwrap(): T;

    /**
     * Returns the contained `Ok` value or a provided `default_`.
     *
     * Arguments passed to `unwrap_or` are eagerly evaluated; if you are passing the result of a function call,
     * it is recommended to use unwrap_or_else, which is lazily evaluated.
     *
     * @param default_
     */
    unwrap_or(default_: T): T;

    /**
     * Returns the contained `Ok` value or computes it from a closure.
     *
     * @param default_
     */
    unwrap_or_else(default_: () => T): T;
}

export class Ok<T, E> implements OkData<T>, ResultMethods<T, E> {
    ok: T;
    constructor(ok: T) {
        this.ok = ok;
    }

    get is_ok(): true {
        return true;
    }

    get is_err(): false {
        return false;
    }

    match<R>(ifOk: (ok: T) => R, ifErr: (err: E) => R): R {
        return ifOk(this.ok);
    }

    and_then<U>(func: (ok: T) => Result<U, E>): Result<U, E> {
        return func(this.ok);
    }

    map<U>(func: (ok: T) => U): Result<U, E> {
        return new Ok(func(this.ok));
    }

    map_err<F>(func: (err: E) => F): Result<T, F> {
        return new Ok(this.ok);
    }

    unwrap(): T {
        return this.ok;
    }

    unwrap_or(default_: T): T {
        return this.ok;
    }

    unwrap_or_else(default_: () => T): T {
        return this.ok;
    }
}

export class Err<T, E> implements ErrData<E>, ResultMethods<T, E> {
    err: E;
    constructor(err: E) {
        this.err = err;
    }

    get is_ok(): false {
        return false;
    }

    get is_err(): true {
        return true;
    }

    and_then<U>(func: (ok: T) => Result<U, E>): Result<U, E> {
        return new Err(this.err);
    }

    map<U>(func: (ok: T) => U): Result<U, E> {
        return new Err(this.err);
    }

    map_err<F>(func: (err: E) => F): Result<T, F> {
        return new Err(func(this.err));
    }

    match<R>(ifOk: (ok: T) => R, ifErr: (err: E) => R): R {
        return ifErr(this.err);
    }

    unwrap(): T {
        throw `Unwrap was called on an Err: ${this.err}`;
    }

    unwrap_or(default_: T): T {
        return default_;
    }

    unwrap_or_else(default_: () => T): T {
        return default_();
    }
}
