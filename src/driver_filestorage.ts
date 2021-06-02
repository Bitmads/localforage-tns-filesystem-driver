import { knownFolders, Folder, File } from "@nativescript/core";
import * as path from "path";

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
  const databaseFileName = "mtp-app-localstorage.db";
  let documentsFolder: Folder = <Folder>knownFolders.documents();
  const AppFolder = knownFolders.currentApp();
  const filePath: string = path.join(documentsFolder.path, databaseFileName);
  const file: File = File.fromPath(filePath);

  let data:any = {};
  let setItemDebounceTimer:any;
  let removeItemDebounceTimer:any;

  let syncFile = ()=>{
    return new Promise((resolve,reject) => {
      file.writeText(JSON.stringify(data)).then(()=>
      {
        resolve();
      });
    });
  };

  return {
    _driver: name,
    _support: true,
    _initStorage() {
      let promise = new Promise((resolve, reject) => {




        new Promise( (fileResolver) => {

          const timeout = setInterval(()=> {
            if (!file.isLocked) {
              clearInterval(timeout);
              fileResolver(true);
            }else{
              console.log('ERROR: DB FILE IS LOCKED!               waiting... ')
            }
          }, 300);

        }).then(()=>{
          //Check if database file exists and read it or create it
          if(File.exists(filePath)){
            file.readText()
              .then((res) => {
                try {
                  data = JSON.parse(res);
                  //console.log('Storage has been loaded with data',data);
                  resolve();
                }catch (e) {
                  console.log('JSON data is corrupted in the storage database file',e);
                  data = {};
                  file.writeText('{}').then(()=>resolve());
                }
              }).catch((err) => {
              console.log(err.stack);
            });
          }else{
            data = {};
            file.writeText('{}').then(()=>resolve());
          }
        });



      });

      return promise;
    },

    async setItem(key, value, callback) {
      return new Promise((resolve, reject) => {
        //console.log('setItem()',key, value);
        data[key] = value;

        clearTimeout(setItemDebounceTimer);
        setItemDebounceTimer = setTimeout( syncFile,500);

      });
    },

    async getItem(key, callback) {
      return new Promise((resolve, reject) => {
        resolve(data[key]);
        //console.log('getItem() response:',key,data[key]);
        if(callback) callback();
      });
    },

    async clear(callback) {
      return new Promise((resolve, reject) => {
        console.log('clear()');
        data = {};
        file.writeText(JSON.stringify(data)).then(()=>{
          resolve();
          if(callback) callback();
        });
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
        delete data[key];

        clearTimeout(setItemDebounceTimer);
        setItemDebounceTimer = setTimeout( syncFile,500);

      });
    }
  };
}
