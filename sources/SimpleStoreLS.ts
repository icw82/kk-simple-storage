/**
 * Фоллбек (fallback) для {@link EOREQ/Utils/SimpleStore }
 * @class EOREQ/Utils/SimpleStoreLS
 *
 * @param {String} database Имя базы данных. Если база с таким именем не найдена, будет создана новая.
 * @param {String} store Имя хранилища
 * @param {String} [key='id'] Первичный ключ. Автоинкремент не используется.
 *
 * @author icw82
 */
class SimpleStoreLS extends SimpleStore {

    /**
     * Чтение.
     * @param {Number|any} key
     * @returns {Promise}
     */
    public get(key: number | any): Promise<any> {
        return new Promise((resolve, reject) => {
            // this.getStore().then(store => {

            //     const request = store.get(key);

            //     const resultPromise = new Promise<IDBRequest>((rs, rj) => {
            //         request.onsuccess = () => rs(request.result);
            //         request.onerror = () => rj(request.error);
            //     });

            //     resultPromise.then(result => {
            //         request.transaction.db.close();

            //         if (result instanceof Array && result.length < 2) {
            //             resolve(result[0]);
            //             return;
            //         }

            //         resolve(result);
            //     }, reject);
            // }, reject);
        });
    }

    /**
     * Запись
     * @param {Any} data
     * @returns {Promise<void>}
     */
    public set(object: any): Promise<void> {
        if (!object.hasOwnProperty(this.key)) {
            throw new TypeError();
        }

        return new Promise((resolve, reject) => {
            // this.getStore(true).then(store => {
            //     const request = store.put(object);

            //     const resultPromise = new Promise<void>((rs, rj) => {
            //         request.onsuccess = () => rs(true);
            //         request.onerror = () => rj(request.error);
            //     });

            //     resultPromise.then(result => {
            //         request.transaction.db.close();
            //         resolve(result);
            //     }, reject);

            // }, reject);
        });
    }

    /**
     * Удаление.
     * @param {Number|any} key
     * @returns {Promise<void>}
     */
    public delete(key: number | any): Promise<void> {
        // TODO: массовое удаление по фильтру
        return new Promise((resolve, reject) => {
            // this.getStore(true).then(store => {
            //     const request = store.delete(key);

            //     const resultPromise = new Promise<void>((rs, rj) => {
            //         request.onsuccess = () => rs(true);
            //         request.onerror = () => rj(request.error);
            //     });

            //     resultPromise.then(result => {
            //         request.transaction.db.close();
            //         resolve(result);
            //     }, reject);

            // });
        });
    }

    /**
     * Удаление хранилища (не всей базы данных)
     * @returns {Promise<void>}
     */
    public clear(): Promise<void> {
        return new Promise((resolve, reject) => {
            // this.getStore(true).then(store => {
            //     const request = store.clear();

            //     const resultPromise = new Promise<boolean>((rs, rj) => {
            //         request.onsuccess = () => resolve(true);
            //         request.onerror = () => reject(request.error);
            //     });

            //     resultPromise.then(result => {
            //         request.transaction.db.close();
            //         resolve(result);
            //     }, reject);

            // });
        });
    }
}
