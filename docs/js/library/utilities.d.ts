import { JSX } from 'preact/jsx-runtime';
export declare function sleep(milliseconds: number): Promise<void>;
/**
 * Combine JSX element class attributes
 *
 * JSX Example:
 * 	<div class={weave('button', isPrimary && 'button--primary')}>
 */
export declare function removeNonStringsAndTrim(...strings: (string | boolean | undefined)[]): string;
/**
 * Generate a number within a number range
 */
export declare function getRandomNumberBetween(from: number, to: number): number;
export declare function assertUnreachable(value: never): never;
export declare function JSONStringify(object: Object): string;
export declare function JSONParse(jsonString: string): any;
/**
 * Checks if a search string can be found within the source string
 */
export declare function stringIncludes(source: string, search: string, caseSensitive?: boolean): boolean;
export declare function preventFocus(e: JSX.TargetedEvent<HTMLElement>): void;
/**
 * Match string equality
 */
export declare function areEqualStrings(a: string, b: string, caseSensitive?: true): boolean;
//# sourceMappingURL=utilities.d.ts.map