/**
 * Compare two objects for equality
 * @param a First object
 * @param b Second object
 * @param equals Function to compare the object's values. Defaults to `===`
 */
export function equals<T>(
    a: Record<string, T>,
    b: Record<string, T>,
    equals?: (a: T, b: T) => boolean
): boolean {
    let lenA = 0;
    if (equals === undefined) {
        for (const key in a) {
            if (!Object.hasOwn(a, key)) continue;
            lenA += 1;
            if (!Object.hasOwn(b, key)) return false;
            if (a[key] !== b[key]) return false;
        }
    } else {
        for (const key in a) {
            if (!Object.hasOwn(a, key)) continue;
            lenA += 1;
            if (!Object.hasOwn(b, key)) return false;
            if (!equals(a[key], b[key])) return false;
        }
    }
    return lenA === length(b);
}

/**
 * Compare two objects for inequality
 * @param a First object
 * @param b Second object
 * @param equals Function to compare the object's values. Defaults to `===`
 */
export function notEquals<T>(
    a: Record<string, T>,
    b: Record<string, T>,
    equals?: (a: T, b: T) => boolean
): boolean {
    let lenA = 0;
    if (equals === undefined) {
        for (const key in a) {
            if (!Object.hasOwn(a, key)) continue;
            lenA += 1;
            if (!Object.hasOwn(b, key)) return true;
            if (a[key] !== b[key]) return true;
        }
    } else {
        for (const key in a) {
            if (!Object.hasOwn(a, key)) continue;
            lenA += 1;
            if (!Object.hasOwn(b, key)) return true;
            if (!equals(a[key], b[key])) return true;
        }
    }
    return lenA !== length(b);
}

/**
 * Access an object's field and populate it, if it isn't set yet.
 *
 * This is useful when the field's value is something like an array or object
 * which is passed by reference and can be modified in place.
 *
 * @param obj the object to access
 * @param key the key of the field to access
 * @param insert the value to insert if the key isn't set yet or a function to produce the value lazily
 */
export function getOrInsert<T>(obj: Record<string, T>, key: string, insert: T | (() => T)): T {
    let value = obj[key];
    if (value === undefined) {
        if (insert instanceof Function) value = insert();
        else value = insert;
        obj[key] = value
    }
    return value;
}

/**
 * Check if an object is empty
 * @param obj Object to check
 */
export function isEmpty(obj: object): boolean {
    for (const key in obj) {
        if (Object.hasOwn(obj, key)) return false;
    }
    return true;
}

/**
 * Count the number of key value pairs in an object
 * @param obj Object to count
 */
export function length(obj: object): number {
    let length = 0;
    for (const key in obj) {
        if (Object.hasOwn(obj, key)) length += 1;
    }
    return length;
}
