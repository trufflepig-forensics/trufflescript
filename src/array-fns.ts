/**
 * Compare two arrays for equality
 * @param a First array
 * @param b Second array
 * @param equals Function to compare the array's items. Defaults to `===`
 */
export function equals<T>(
    a: Array<T>,
    b: Array<T>,
    equals?: (a: T, b: T) => boolean
): boolean {
    if (a.length !== b.length) return false;

    if (equals === undefined) {
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
    } else {
        for (let i = 0; i < a.length; i++) {
            if (!equals(a[i], b[i])) return false;
        }
    }

    return true;
}

/**
 * Compare two arrays for inequality
 * @param a First array
 * @param b Second array
 * @param equals Function to compare the array's items. Defaults to `===`
 */
export function notEquals<T>(
    a: Array<T>,
    b: Array<T>,
    equals?: (a: T, b: T) => boolean
): boolean {
    if (a.length !== b.length) return true;

    if (equals === undefined) {
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return true;
        }
    } else {
        for (let i = 0; i < a.length; i++) {
            if (!equals(a[i], b[i])) return true;
        }
    }

    return false;
}
