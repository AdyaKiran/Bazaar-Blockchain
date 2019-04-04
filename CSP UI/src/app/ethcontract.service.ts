import { Injectable, ɵConsole } from '@angular/core';
//import * as Web3 from 'web3';
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
    // window.web3.personal.unlockAccount(window.web3.eth.defaultAccount, (error,result) => (console.log(result)));
  }

  getAccountInfo() {
    console.log('Testing');
    return new Promise((resolve, reject) => {
      window.web3.eth.getCoinbase(function (err, account) {
        if (err == null) {
          window.web3.personal.unlockAccount(account, (error, result) => (console.log(result)));

          window.web3.eth.getBalance(account, function (err, balance) {
            if (err == null) {
              return resolve({ fromAccount: account, balance: (window.web3.fromWei(balance, 'ether')).toNumber() });
            }
            else {
              return reject({ fromAccount: "error", balance: 0 });
            }
          })
        }
      })
    })
  }

  updateNegotiation(_address, _offerID, _offerState, _offerPrice, _offerRAM, _offerOSType) {
    let that = this;
    console.log('Negotiating Offer' + _offerID);
    return new Promise((resolve, reject) => {
      let servContract = TruffleContract(tokenAbi);
      servContract.setProvider(that.web3Provider);
      console.log("hello");
      servContract.deployed().then(function (instance) { //line below, check how to send boolean values
        return instance.updateDiscussion(_offerID, _offerState, _offerPrice, window.web3.fromAscii(_offerRAM), window.web3.fromAscii(_offerOSType), true, { from: _address, gas: 4698712, gasPrice: "120000000000" });
      }).then(function (status) {
        if (status) {
          return resolve({ status: true });
        }
      }).catch(function (error) {
        console.log(error);
        return reject("Error in negotiating Offer");
      });
    });
  }

  async getDiscussions(_address, _id) {
    let that = this;
    console.log('Getting Discussions');
    return new Promise((resolve, reject) => {
      console.log('inside promise');
      var servContract = window.web3.eth.contract(tokenAbi.abi).at("0x3AD2168F2197E5e3669eB6E0713F8a6eF5B70c06");
      servContract.getDiscussionFromID(_id, { from: _address, gas: 4698712, gasPrice: "120000000000" }, function (error, result) {
        if (!error) {
          console.log('inethcontractservice');
          return resolve(result);
        } else {
          console.log(error);
          return reject('error');
        }
      })
    })
  }

  async getNumberOfDiscussions(_address) {
    let that = this;
    console.log('Getting Number of Discussions');
    return new Promise((resolve, reject) => {
      console.log('inside promise');
      var servContract = window.web3.eth.contract(tokenAbi.abi).at("0x3AD2168F2197E5e3669eB6E0713F8a6eF5B70c06");
      servContract.getNumberOfDiscussions({ from: _address, gas: 4698712, gasPrice: "120000000000" }, function (error, result) {
        if (!error) {
          return resolve(result);
        } else {
          console.log(error);
          return reject('error');
        }
      })
    })
  }
}