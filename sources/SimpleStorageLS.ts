import {
    filterFunction,
    keyValue,
} from './ISimpleStorage';
import SimpleStorage from './SimpleStorage';


/**
 * Фоллбек (fallback) для {@link SimpleStorage }
 * @class SimpleStorageLS
 *
 * @param {String} database Имя базы данных. Если база с таким именем не найдена, будет создана новая.
 * @param {String} store Имя хранилища
 * @param {String} [key='id'] Первичный ключ. Автоинкремент не используется.
 *
 * @author icw82
 */

class SimpleStorageLS extends SimpleStorage {

    private storeNameLSCache: string = '';
    private storeNameLSCacheVersion: number = 0;

    /**
     * Запись
     * @param {Any} data
     * @returns {Promise<void>}
     */
    public set(object: any): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!object.hasOwnProperty(this.key)) {
                reject(new TypeError());
                return;
            }

            const store = this.getStoreLS();

            const key = object[this.key];
            const existingItem = store.find(item => item[this.key] === key);

            if (existingItem) {
                const index = store.indexOf(existingItem);
                store[index] = object;
            } else {
                store.push(object);
            }

            localStorage.setItem(this.storeNameLS, JSON.stringify(store));

            resolve();
        });
    }

    /**
     * Чтение.
     * @param {keyValue} key
     * @returns {Promise<object>}
     */
    public get(key: keyValue): Promise<object> {
        return new Promise(resolve => {
            const store = this.getStoreLS();
            const existingItem = store.find(item => item[this.key] === key);

            if (existingItem) {
                resolve(existingItem);
            } else {
                resolve();
            }
        });
    }

    /**
     * Подсчёт элементов.
     * @returns {Promise<number>}
     */
    public count(): Promise<number> {
        return new Promise(resolve => {
            resolve(this.getStoreLS().length);
        });
    }

    /**
     * Удаление.
     * @param {keyValue | filterFunction} key
     * @returns {Promise<void>}
     */
    public delete(key: keyValue | filterFunction): Promise<void> {
        return new Promise(resolve => {
            const store = this.getStoreLS();

            if (key instanceof Function) {
                const filterFunction = key;
                const filteredStore = store.filter(item => !filterFunction(item));
                localStorage.setItem(this.storeNameLS, JSON.stringify(filteredStore));
                resolve();
                return;
            }

            const existingItem = store.find(item => item[this.key] === key);

            if (existingItem) {
                const index = store.indexOf(existingItem);
                store.splice(index, 1);
                localStorage.setItem(this.storeNameLS, JSON.stringify(store));
                resolve();
                return;
            }
        });
    }

    /**
     * Удаление хранилища (не всей базы данных)
     * @returns {Promise<void>}
     */
    public clear(): Promise<void> {
        return new Promise(resolve => {
            localStorage.setItem(this.storeNameLS, '[]');
            resolve();
        });
    }

    /**
     * Название ключа хранилища в LocalStorage
     * @readonly
     * @private
     * @type {string}
     */
    private get storeNameLS(): string {
        if (this.version !== this.storeNameLSCacheVersion) {
            this.storeNameLSCacheVersion = this.version;
            this.storeNameLSCache =
                `${ this.database }_${ this.store }_v${ this.storeNameLSCacheVersion }`;
        }

        return this.storeNameLSCache;
    }

    /**
     * @returns {any[]}
     * @private
     */
    private getStoreLS(): any[] {
        const store = localStorage.getItem(this.storeNameLS);

        if (store === null) {
            localStorage.setItem(this.storeNameLS, '[]');
            return [];
        }

        return JSON.parse(store);
    }
}

export default SimpleStorageLS;
