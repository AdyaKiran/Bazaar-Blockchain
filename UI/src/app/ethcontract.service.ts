import { Injectable } from '@angular/core';
// import * as Web3 from 'web3';
import * as TruffleContract from 'truffle-contract';
import { reject } from 'q';
const Web3 = require('web3');

declare let require:any;
declare let window:any;

let tokenAbi = require('../../../build/contracts/BazaarContract.json');

@Injectable({
  providedIn: 'root'
})
export class EthcontractService {
  private web3Provider: null;
  private contracts: {}

  constructor() { 
    if (typeof window.web3 !== 'undefined') {
      this.web3Provider = window.web3.currentProvider;
    } else {
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7542');
    }
    window.web3 = new Web3(this.web3Provider);
  }

  getAccountInfo() {
    console.log('Testing');
    return new Promise((resolve, reject) => {
      window.web3.eth.getCoinbase(function(err, account){
        if (err==null){
          window.web3.eth.getBalance(account, function(err, balance){
            if (err==null){
              return resolve({fromAccount: account, balance:(window.web3.fromWei(balance,'ether')).toNumber()});
            }
            else {
              return reject({fromAccount: "error", balance:0});
            }
          })
        }
      })
    })
  }

  addOffer(_address, _offerID, _offerOSType, _offerRAM, _offerPrice){
    let that = this;
    console.log('Adding Offer' + _offerID);
    return new Promise((resolve, reject) => {
      let servContract = TruffleContract(tokenAbi);
      servContract.setProvider(that.web3Provider);

      servContract.deployed().then(function(instance) {
        return instance.addOffer(_offerID, _offerPrice, window.web3.fromAscii(_offerRAM), window.web3.fromAscii(_offerOSType), { from: _address, gas: 4698712, gasPrice: "120000000000"});
      }).then(function (status) {
        if (status){
          return resolve({status:true});
        }
      }).catch(function(error){
        console.log(error);
        return reject("Error in adding new Offer");
      });
    });
  }

  setOffer(_address, _offerID, _offerState, _offerOSType, _offerRAM, _offerPrice) {
    let that = this;
    console.log('Negotiating Offer' + _offerID);
    return new Promise((resolve, reject) => {
      let servContract = TruffleContract(tokenAbi);
      servContract.setProvider(that.web3Provider);

      servContract.deployed().then(function(instance) {
        return instance.setOffer(_offerID, _offerState, _offerPrice, window.web3.fromAscii(_offerRAM), window.web3.fromAscii(_offerOSType), { from: _address, gas: 4698712, gasPrice: "120000000000"});
      }).then(function (status) {
        if (status){
          return resolve({status:true});
        }
      }).catch(function(error){
        console.log(error);
        return reject("Error in negotiating Offer");
      });
    });
  }
}
