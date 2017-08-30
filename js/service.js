import {USER, PASS} from './constants';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
require("babel-core/register");
require("babel-polyfill");

// const PROXY = "https://cors-anywhere.herokuapp.com/";
const PROXY = "";
let services = {
  getInventoryList: (url) => {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: PROXY + urlValidator(url),
        headers: {
        'Authorization' : 'Basic dXNlcjpwYXNz'
        } 
      })
      .done((res) => {
        resolve(res);
      })
      .fail((err) => {
        console.log(err);
        reject(err);
      });
    });
  },
  downloadAllInventories: async (inventories, dispatcher) => {
    var zip = new JSZip();
    for(let i=0; i<inventories.length; i++) {
      let item = inventories[i];
      dispatcher({type: 'downloaded_inventory', data: item.name});
      let res = await downloadInventory(item.url);
      zip.file(item.name, res);
    }
    zip.generateAsync({type:"blob"})
    .then(function(content) {
        FileSaver.saveAs(content, "inventories.zip");
    });
  }
};

const downloadInventory = (url) => {
  return new Promise((resolve, reject) => {
      $.ajax({
        url: PROXY + url,
        headers: {
        'Authorization' : 'Basic dXNlcjpwYXNz'
        }
      })
      .done((res) => {
        resolve(res);
      })
      .fail((err) =>{
        console.log(err);
        reject(err);
      });
    });
};

const urlValidator = (url) => {
  let validatedUrl = "";
  if(url.endsWith('/')) {
    url = url.substring(0,url.length-1);
  }
  if(url.indexOf('http://') === 0) {
    validatedUrl = `//${url.substring(7)}/inventory/filesrecord.txt`;
  } else {
    validatedUrl = `//${url.substring(0)}/inventory/filesrecord.txt`;
  }
  return validatedUrl;
};

services.urlValidator = urlValidator;

export default services;
