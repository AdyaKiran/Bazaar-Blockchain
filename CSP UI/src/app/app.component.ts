import { Component } from '@angular/core';
import { EthcontractService} from './ethcontract.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Service Provider Portal';

  accounts:any;
  transferFrom: '0x0';
  balance = '0 ETH';
  discussions = [];

  constructor( private ethcontractService: EthcontractService ){
    console.log('TEST');
    this.initAndDisplayAccount();
    this.getNumberofDiscussions();
  }

  initAndDisplayAccount = () => {
    let that = this;
    this.ethcontractService.getAccountInfo().then(function(acctInfo : any){
      console.log(acctInfo);
      that.transferFrom = acctInfo.fromAccount;
      that.balance = acctInfo.balance;
    }).catch(function(error){
      console.log(error);
    });
  };
   
  getDiscussions(_id) {
    let that = this;
    this.ethcontractService.getDiscussions(this.transferFrom, _id).then(function(offer: any){
      console.log(offer);
      var state;
      if (offer[1].c[0] == 0)
        state = "Advisory";
      else if (offer[1].c[0] == 1)
        state = "Solicited";
      else if (offer[1].c[0] == 2)
        state = "Acceptable";
      else if (offer[1].c[0] == 3)
        state = "Rejected";
      
      var jsn = {
        'service': window.web3.toAscii(offer[0]),
        'state': state,
        'price': offer[2].c[0],
        'ram': window.web3.toAscii(offer[3]),
        'os': window.web3.toAscii(offer[4]),
        'isCSP': offer[5],
        'id':offer[6].c[0]
      };
      console.log(jsn.ram);
      that.discussions.push(jsn);
      // return offer;
    }).catch(function(error){
      console.log(error);
    });
  }

  getNumberofDiscussions() {
    let that = this;
    this.ethcontractService.getNumberOfDiscussions(this.transferFrom).then(function(numDisc: any){
      console.log(numDisc.c[0]);
      var discs = numDisc.c[0];
      for(var i = 0; i  < discs; i++){
        that.getDiscussions(i);
      }
    }).catch(function(error){
      console.log(error);
    });
  };

  updateDiscussion(_serviceID, _serviceStatus, _serviceOSType, _serviceRAM, _servicePrice) {
    let that = this;
    console.log("Updating negotiation Discussion for " + _serviceID + _serviceStatus + _serviceOSType + _serviceRAM + _servicePrice);
    var x = _servicePrice;
    console.log(Number(x).toString());
    this.ethcontractService.updateNegotiation(this.transferFrom, parseInt(_serviceID, 10), _serviceStatus, parseInt(_servicePrice, 10), _serviceRAM, _serviceOSType).then(function () {
      console.log("Successfully Updated Discussion for Negotation");
    }).catch(function (error) {
      console.log(error);
    });
  }

  // fillFields(id, price, ram, os) {
  //   console.log('Inside fill fields function');
  //   let that = this;
  //   document.getElementById("sRAM").value = ram;
  //   document.getElementById("sOS").value = os;
  //   document.getElementById("sPrice").value = price;
  //   document.getElementById("sID").value = id;
  // }
}