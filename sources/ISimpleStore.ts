/**
 * Key value type of SimpleStore item object.
 * @typedef { number | string } keyValue
 */
type keyValue = number | string;

/**
 * @callback filterFunction
 * @param {object} item
 * @returns {boolean}
 */
type filterFunction = (item: object) => boolean;

interface ISimpleStore {
    readonly database: string;
    readonly store: string;
    readonly key: string;
    version: number;

    set(object: any): Promise<void>;
    get(key: keyValue): Promise<object>;
    count(): Promise<number>;
    delete(key: keyValue | filterFunction): Promise<void>;
    clear(): Promise<void>;
}


export {
    ISimpleStore as default,
    filterFunction,
    keyValue,
};
