import {
    default as ISimpleStorage,
    filterFunction,
    keyValue,
} from './ISimpleStorage';


/**
 * Класс-обёртка над IndexedDB, упрощающая работу с ней. Без индексов.
 * @class SimpleStorage
 *
 * @param {String} database Имя базы данных. Если база с таким именем не найдена, будет создана новая.
 * @param {String} store Имя хранилища
 * @param {String} [key='id'] Первичный ключ. Автоинкремент не используется.
 *
 * @example
 * <caption>Инициализация хранилища</caption>
 * <pre>
 *    const cache = new SimpleStorage('MyCache', 'Users', 'id');
 * </pre>
 *
 * <caption>Создание или обновление записи</caption>
 * <pre>
 *    cache.set({ id: 82, name: 'Alexander', url: 'example.org' });
 * </pre>
 *
 * <caption>Чтение записи</caption>
 * <pre>
 *    cache.get(82).then(data => console.log(data));
 *    // {id: 82, name: "Alexander", url: "example.org"}
 * </pre>
 *
 * @author icw82
 */
class SimpleStorage implements ISimpleStorage {

    /**
     * @returns {number}
     */
    get version(): number {
        return this.dbVersion;
    }

    /**
     * Установка версии.
     * Нужно менять версию, если структура базы изменилась.
     * @param {Number} value Натуральное число
     */
    set version(value: number) {
        if (!isFinite(value) || // eslint-disable-line no-restricted-globals
            value !== Math.floor(value) ||
            value <= 0) {
            throw new TypeError();
        }

        this.dbVersion = value;
    }

    public static deleteItemFromStoreByKey(
        store: IDBObjectStore,
        key: keyValue,
        closeDatabaseAfter: boolean = false,
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = store.delete(key);
            const db = store.transaction.db;

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                if (closeDatabaseAfter) {
                    db.close();
                }

                resolve();
            };
        });
    }

    public static deleteItemsFromStoreByFilter<T>(
        store: IDBObjectStore,
        filter: (value: T) => any,
        closeDatabaseAfter: boolean = false,
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = store.openCursor();
            const db = store.transaction.db;
            let continueCursor = true;

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const cursor = request.result;

                if (!cursor) {
                    if (closeDatabaseAfter) {
                        db.close();
                    }

                    resolve();
                    return;
                }

                if (filter(cursor.value)) {
                    SimpleStorage.deleteCursor(cursor).catch(
                        (...args) => {
                            continueCursor = false;
                            reject(...args);
                        },
                    );
                }

                if (continueCursor) {
                    cursor.continue();
                }

            };
        });
    }

    public static deleteCursor(
        cursor: IDBCursor,
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = cursor.delete();

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    protected dbVersion: number;

    constructor(
        public readonly database: string,
        public readonly store: string,
        public readonly key: string = 'id',
    ) {
        this.database = database;
        this.store = store;
        this.key = key;
        this.dbVersion = 1;
    }

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

            this.getStore(true).then(store => {
                const request = store.put(object);
                const db = store.transaction.db;

                const resultPromise = new Promise<void>((rs, rj) => {
                    request.onsuccess = () => rs();
                    request.onerror = () => rj(request.error);
                });

                resultPromise.then(() => {
                    db.close();
                    resolve();
                }, reject);

            }, reject);
        });
    }

    /**
     * Чтение.
     * @param {keyValue} key
     * @returns {Promise<object>}
     */
    public get(key: keyValue): Promise<object> {
        return new Promise((resolve, reject) => {
            this.getStore().then(store => {
                const request = store.get(key);
                const db = store.transaction.db;

                const resultPromise = new Promise<IDBRequest>((rs, rj) => {
                    request.onsuccess = () => rs(request.result);
                    request.onerror = () => rj(request.error);
                });

                resultPromise.then(result => {
                    db.close();
                    resolve(result);
                }, reject);
            }, reject);
        });
    }

    /**
     * Подсчёт элементов.
     * @returns {Promise<number>}
     */
    public count(): Promise<number> {
        return new Promise((resolve, reject) => {
            this.getStore().then(store => {
                const request = store.count();
                const db = store.transaction.db;

                const resultPromise = new Promise<number>((rs, rj) => {
                    request.onsuccess = () => rs(request.result);
                    request.onerror = () => rj(request.error);
                });

                resultPromise.then(result => {
                    db.close();
                    resolve(result);
                }, reject);
            }, reject);
        });
    }

    /**
     * Удаление.
     * @param {keyValue | filterFunction} key
     * @returns {Promise<void>}
     */
    public delete(key: keyValue | filterFunction): Promise<void> {
        return new Promise((resolve, reject) => {
            this.getStore(true).then(store => {

                if (key instanceof Function) {
                    const filter = key;

                    SimpleStorage
                        .deleteItemsFromStoreByFilter(store, filter, false)
                        .then(resolve, reject);

                } else {

                    SimpleStorage
                        .deleteItemFromStoreByKey(store, key, false)
                        .then(resolve, reject);

                }

            });
        });
    }

    /**
     * Удаление хранилища (не всей базы данных)
     * @returns {Promise<void>}
     */
    public clear(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.getStore(true).then(store => {
                const request = store.clear();
                const db = store.transaction.db;

                const resultPromise = new Promise<void>((rs, rj) => {
                    request.onsuccess = () => rs();
                    request.onerror = () => rj(request.error);
                });

                resultPromise.then(() => {
                    db.close();
                    resolve();
                }, reject);

            });
        });
    }

    /**
     * Открытие базы данных
     * @returns {Promise<IDBDatabase>}
     * @private
     */
    private open(): Promise<IDBDatabase> {
        const self = this;

        return new Promise<IDBDatabase>((resolve, reject) => {
            // IE + EDGE не принимает undefined в качестве аргумента
            const open = typeof self.version === 'number' ?
                indexedDB.open(self.database, self.version) :
                indexedDB.open(self.database);

            open.onupgradeneeded = () => {
                const db = open.result;

                // Удаление старого хранилища.
                if (db.objectStoreNames.contains(this.store)) {
                    db.deleteObjectStore(this.store);
                }

                db.createObjectStore(this.store, {
                    // autoIncrement нужно явно указать для IE/Edge иначе бросит InvalidAccessError
                    autoIncrement: false,
                    keyPath: this.key,
                });
            };

            const result = new Promise<IDBDatabase>((rs, rj) => {
                open.onsuccess = () => rs(open.result);
                open.onerror = () => rj(open.error);
                open.onblocked = () => rj(open.error);
            });

            result.then(resolve, reject);

        });
    }

    /**
     * @param { boolean } readWriteMode
     * @returns {Promise<IDBObjectStore>}
     * @private
     */
    private getStore(readWriteMode: boolean = false): Promise<IDBObjectStore> {
        return new Promise((resolve, reject) => {
            this.open().then(db => {
                const tx = db.transaction(
                    this.store,
                    readWriteMode ? 'readwrite' : 'readonly',
                );

                const store = tx.objectStore(this.store);

                resolve(store);
            }, reject);
        });
    }
}


export default SimpleStorage;
