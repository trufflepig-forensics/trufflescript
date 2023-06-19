/**
 * Compare two arrays for equality
 * @param a First array
 * @param b Second array
 * @param equals Function to compare the array's items. Defaults to `===`
 */
export declare function equals<T>(a: Array<T>, b: Array<T>, equals?: (a: T, b: T) => boolean): boolean;
/**
 * Compare two arrays for inequality
 * @param a First array
 * @param b Second array
 * @param equals Function to compare the array's items. Defaults to `===`
 */
export declare function notEquals<T>(a: Array<T>, b: Array<T>, equals?: (a: T, b: T) => boolean): boolean;
