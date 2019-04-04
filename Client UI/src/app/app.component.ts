import { Component } from '@angular/core';
import { EthcontractService} from './ethcontract.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Service Provider Portal';

  plan: '';
  serviceOSType1;
  serviceRAM1;
  servicePrice1;
  ID1;

  serviceStatus3;
  serviceOSType3;
  serviceRAM3;
  servicePrice3;
  ID3;

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
        'id': offer[6].c[0],
        'customer': offer[7];
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

  addNegotiation(_serviceStatus, _serviceOSType, _serviceRAM, _servicePrice) {
    if (_serviceStatus == 4) {
      alert("Cannot Reject when negotiation hasn't begun !!");
    }
    let that = this;
    console.log("Adding negotiation Discussion for "+that.plan+_serviceStatus + _serviceOSType + _serviceRAM + _servicePrice + that.transferFrom);
    var x = _servicePrice;
    console.log(Number(x).toString());
    this.ethcontractService.addDiscussion(this.transferFrom, that.plan, _serviceStatus, parseInt(_servicePrice,10), _serviceRAM, _serviceOSType, that.transferFrom).then(function() {
      console.log("Successfully added Discussion for plan");
    }).catch(function(error){
      console.log(error);
    });
  }

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

  fillFields(plan) {
    let that = this;
    this.plan = plan;
    console.log(plan);
    console.log(document.getElementById(plan + "-RAM").innerHTML);
    console.log(document.getElementById(plan + "-OS").innerHTML);
    console.log(document.getElementById(plan + "-price").innerHTML);
    var x = document.getElementById(plan + "-RAM").innerHTML.toString();
    this.serviceRAM1 = x;
    x = document.getElementById(plan + "-OS").innerHTML;
    this.serviceOSType1 = x;
    x = document.getElementById(plan + "-price").innerHTML;
    this.servicePrice1 = x;
  }

  fillFields2(a,b,c,d,e) {
    let that = this;
    console.log("Fill F 2 : ", a)
    this.ID3 = a;
    this.serviceRAM3 = c;
    this.serviceOSType3 = d;
    this.servicePrice3 = b;
  }
}