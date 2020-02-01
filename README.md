# LocalForage NativeScript FileSystem driver


This project adds a NativeScript FileSystem driver to localForage
https://docs.nativescript.org/ns-framework-modules/file-system
## Usage

```
      import * as localforage from 'localforage';
      import tnsFilesystemDriver from "../../../custom_builds/localforage-tns-filesystem-driver/src"
      
      localforage.defineDriver(tnsFilesystemDriver).then(() =>{
        console.log('defineDriver done');
          localforage.setDriver('tns-filesystem').then(() =>{
            console.log('setDriver done too......');
          }).catch(e=>console.log('Error with setDriver()',e))
      });
```
