import { Couchbase } from 'nativescript-couchbase-plugin';

export function createDriver(name, property) {

  const driver = {
    clear() {},
    get() {},
    remove() {},
    set() {},
  };
  const clear = driver.clear.bind(driver);
  const get = driver.get.bind(driver);
  const remove = driver.remove.bind(driver);
  const set = driver.set.bind(driver);

  const databaseName = "mtp-localstorage-v006.db";
  const database = new Couchbase(databaseName);



  return {
    _driver: name,
    _support: true,
    _initStorage() {
      let promise = new Promise((resolve, reject) => {
        resolve(true);
      });

      return promise;
    },

    async setItem(key, value, callback) {
      return new Promise((resolve, reject) => {
        this.getItem(key).then(response=>{
          //console.log('setItem() ',key,value);
          value = {value: JSON.stringify(value)};
          if(response){
            database.updateDocument(key, value);
            resolve(value);
          }else{
            database.createDocument(value,key);
            resolve(value);
          }
        });

      });
    },

    async getItem(key, callback) {
      return new Promise((resolve, reject) => {
        let result = database.getDocument(key);
        if(result && result.value){
          try {
            result = JSON.parse(result.value);
          }catch(e){
            console.log('Couchbase GetItem JSON Parser Exception:',e);
            resolve(undefined);
          }
          //console.log('getItem: ',key,result, typeof result);
          resolve(result);
          if(callback) callback();
        }

        resolve();
      });
    },

    async exists(key, callback) {
      return new Promise((resolve, reject) => {
        this.getItem(key).then(results=>{
          resolve(!!results[0].value);
          if(callback) callback();
        })
      });
    },

    async clear(callback) {
      return new Promise((resolve, reject) => {
        console.log('clear()');
        database.destroyDatabase();
        resolve();
      });
    },

    async iterate(iterator, callback) {

    },

    async key(n, callback) {

    },

    async keys(callback) {

    },

    async length(callback) {

    },

    async removeItem(key, callback) {
      return new Promise((resolve, reject) => {
        console.log('removeItem()',key);
        database.deleteDocument(key);
      });
    }
  };
}
