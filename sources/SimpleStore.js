/**
 * Класс-обёртка над IndexedDB, упрощающая работу с ней. Без индексов.
 * @class EOREQ/Utils/SimpleStore
 *
 * @param {String} database Имя базы данных. Если база с таким именем не найдена, будет создана новая.
 * @param {String} store Имя хранилища
 * @param {String} [key='id'] Первичный ключ. Автоинкремент не используется.
 *
 * @example
 * <caption>Инициализация хранилища</caption>
 * <pre>
 *    const cache = new SimpleStore('MyCache', 'Users', 'id');
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
 * @author Лыткин И. А.
 */
function SimpleStore(database, store, key) {
   var indexedDB =
      window.indexedDB ||
      window.mozIndexedDB ||
      window.webkitIndexedDB ||
      window.msIndexedDB ||
      window.shimIndexedDB;

   if (!indexedDB) {
      throw new Error('indexedDB is not available');
   }

   var primaryKey = (typeof key === 'string') ? key : 'id';
   var dbVersion;

   Object.defineProperties(this, {
      database: { get: function() { return database; } },
      store: { get: function() { return store; } },
      key: { get: function() { return primaryKey; } },

      version: {
         get: function() { return dbVersion; },

         /**
          * Установка версии.
          * Нужно менять версию, если структура базы изменилась.
          * @param {Number} value Натуральное число
          * @returns {Promise}
          */
         set: function(value) {
            if (
               !isFinite(value) || // eslint-disable-line no-restricted-globals
               value !== Math.floor(value) ||
               value <= 0
            ) {
               throw new TypeError();
            }

            dbVersion = value;
         }
      },
   });

   // Методы

   /**
    * Открытие базы данных
    * @returns {Promise}
    */
   this.open = function() {
      var self = this;

      return new Promise(function(resolve, reject) {
         var open;

         // IE + EDGE не принимает undefined в качестве аргумента
         if (self.version) {
            open = indexedDB.open(self.database, parseInt(self.version, 10) );
         } else {
            open = indexedDB.open(self.database);
         }

         open.onupgradeneeded = self.upgrade.bind(self);
         open.onsuccess = function(event) { resolve(event.target.result); };
         open.onerror = function(event) { reject(event) };
         open.onblocked = function(event) { reject(event) };

      });
   };

   /**
    * Создание или обновление схемы БД
    */
   this.upgrade = function(event) {
      var db = event.target.result;

      // Удаление старого хранилища.
      if (db.objectStoreNames.contains(this.store)) {
         db.deleteObjectStore(this.store);
      }

      db.createObjectStore(this.store, {
         keyPath: this.key,

         // Нужно явно указать для IE/Edge иначе бросит InvalidAccessError
         autoIncrement: false,
      });
   };

   this.getStore = function(readWriteMode) {
      var self = this;

      var mode = readWriteMode === true ? 'readwrite' : 'readonly';

      return new Promise(function(resolve, reject) {
         self.open().then(function(db) {
            try {
               var dbStore = db
                  .transaction(self.store, mode)
                  .objectStore(self.store);

               resolve(dbStore);
            } catch (error) {
               reject(error);
            }
         }, reject);
      });
   };


   /**
    * Чтение.
    * @param {Number|any} key
    * @returns {Promise}
    */
   this.get = function(key) {
      var self = this;

      return new Promise(function(resolve, reject) {
         self.getStore().then(function(dbStore) {
            var request = dbStore.get(key);

            request.onsuccess = function(event) {
               if (
                  event.target.result instanceof Array &&
                  event.target.result.length < 2
               ) {
                  // Возвратит единственный элемент, либо ничего (если массив пуст).
                  resolve(event.target.result[0]);
                  return;
               }

               request.transaction.db.close();
               resolve(event.target.result);
            };

            request.onerror = function() {
               reject(request.error);
            };

         }, reject);
      });
   };

   /**
    * Запись
    * @param {Any} data
    * @returns {Promise}
    */
   this.set = function(object) {
      var self = this;

      return new Promise(function(resolve, reject) {
         if (!(self.key in object)) {
            reject();
            throw new TypeError();
         }

         self.getStore(true).then(function(dbStore) {

            var request = dbStore.put(object);

            request.onsuccess = function(event) {
               request.transaction.db.close();
               resolve(event.target.result);
            };

            request.onerror = function() {
               reject(request.error);
            };

         }, reject);
      });
   };

   /**
    * Удаление
    * @param {Any} data
    * @returns {Promise}
    */
   this.delete = function(key) {
      var self = this;

      // TODO: массовое удаление по фильтру

      return new Promise(function(resolve, reject) {
         self.getStore(true).then(function(dbStore) {
            var request = dbStore.delete(key);

            request.onsuccess = function() {
               resolve();
            };

            request.onerror = function() {
               reject(request.error);
            };

            request.oncomplete = function() {
               request.transaction.db.close();
            };

         }, reject);
      });
   };

};
