import * as chai from 'chai';
import SimpleStorageOriginal from './SimpleStorage';
import SimpleStorageLS from './SimpleStorageLS';
// import  ISimpleStorage from './ISimpleStorage';

import {
    getRandObject,
    rand,
} from './utils';


const runs = [
    SimpleStorageOriginal,
    SimpleStorageLS,
];

const getFunctionName = (f: () => any): string => {
    if (typeof f.name === 'string') {
        return f.name;
    } else {
        // IE
        const string = f.toString();
        const match = string.match(/^function\s*([^\s(]+)/);

        if (match) {
            return match[1];
        }

        throw new Error('Function name is not found');

    }
};

runs.forEach((SimpleStorage: any) => {

    const name = getFunctionName(SimpleStorage);

    const database = 'MyCache';
    const store = 'Users';
    const key = 'id';

    const cache = new SimpleStorage(database, store, key);
    const count = 5;

    describe(name, () => {

        describe('DB version and invalidation', () => {

            it('Should change version', () => {
                const value = 1;
                cache.version = value;

                chai.expect(cache.version).to.equal(value);
            });

            it('Should clear DB on change version', async () => {
                const reference = getRandObject();
                cache.set(reference);

                const value = 2;
                cache.version = value;

                const result: any = await cache.get(reference.id);
                chai.expect(result).to.be.undefined;
            });

        });

        describe('Clear', () => {

            it('Should clear store and count', async () => {
                await cache.clear();
                const result = await cache.count();
                chai.expect(result).to.equal(0);
            });

        });

        const objects = Array.from({length: count}, () => getRandObject());

        describe('Adding items', () => {

            it('Should add object with the key', async () => {
                let result: any;

                try {
                    result = await Promise.all(
                        objects.map(item => cache.set(item)),
                    );
                    result = true;
                } catch (error) {
                    console.error(error);
                    result = false;
                }

                chai.expect(result).to.be.ok;
            });

            it('Should count all objects in the store', async () => {
                const result = await cache.count();

                chai.expect(result).to.equal(objects.length);
            });

            it('Should reject new item without key', async () => {
                let result;

                try {
                    result = await cache.set({test: 0});
                } catch (error) {
                    result = error;
                }

                chai.expect(result).to.be.an('error');
            });

        });

        describe('Reading items', () => {

            it('Should get object by key', async () => {
                const reference = rand(objects);
                const result: any = await cache.get(reference.id);

                chai.expect(result.id).to.equal(reference.id);
                chai.expect(result.name).to.equal(reference.name);
            });

        });

        describe('Deleting items', () => {

            it('Should delete record by key', async () => {
                const reference = rand(objects);

                let result: any;

                try {
                    result = await cache.delete(reference.id);
                    result = true;
                } catch (error) {
                    console.error(error);
                    result = false;
                }

                chai.expect(result).to.be.ok;

                result = await cache.get(reference.id);
                chai.expect(result).to.be.undefined;
            });

            it('Should delete records by filter', async () => {
                const items = [
                    {id: '2004-12-30'}, // —
                    {id: '2004-12-31'}, // —
                    {id: '2005-01-01'}, // 1
                    {id: '2005-01-02'}, // 2
                    {id: '2005-01-03'}, // 3
                    {id: '2005-01-04'}, // 4
                ];

                const filterFunction = (item: any) => item.id[3] < 5;

                await cache.clear();
                await Promise.all(items.map(item => cache.set(item)));
                await cache.delete(filterFunction);

                const result = await cache.count();
                chai.expect(result).to.equal(4);
            });

        });

    });

});
