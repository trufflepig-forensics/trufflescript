/**
 * Compare two objects for equality
 * @param a First object
 * @param b Second object
 * @param equals Function to compare the object's values. Defaults to `===`
 */
export declare function equals<T>(a: Record<string, T>, b: Record<string, T>, equals?: (a: T, b: T) => boolean): boolean;
/**
 * Compare two objects for inequality
 * @param a First object
 * @param b Second object
 * @param equals Function to compare the object's values. Defaults to `===`
 */
export declare function notEquals<T>(a: Record<string, T>, b: Record<string, T>, equals?: (a: T, b: T) => boolean): boolean;
/**
 * Check if an object is empty
 * @param obj Object to check
 */
export declare function isEmpty(obj: object): boolean;
/**
 * Count the number of key value pairs in an object
 * @param obj Object to count
 */
export declare function length(obj: object): number;
