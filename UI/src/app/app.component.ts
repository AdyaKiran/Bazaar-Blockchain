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
  accounts:any;
  transferFrom: '0x0';
  balance = '0 ETH';

  constructor( private ethcontractService: EthcontractService ){
    console.log('TEST');
    this.initAndDisplayAccount();
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

  addNegotiation(_serviceStatus, _serviceOSType, _serviceRAM, _servicePrice) {
    let that = this;
    console.log("Adding negotiation Discussion for "+that.plan+_serviceStatus + _serviceOSType + _serviceRAM + _servicePrice);
    var x = _servicePrice;
    console.log(Number(x).toString());
    this.ethcontractService.addDiscussion(this.transferFrom, that.plan, _serviceStatus, parseInt(_servicePrice,10), _serviceRAM, _serviceOSType).then(function() {
      console.log("Successfully added Discussion for plan");
    }).catch(function(error){
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
    document.getElementById("sRAM").value = document.getElementById(plan + "-RAM").innerHTML;
    document.getElementById("sOS").value = document.getElementById(plan + "-OS").innerHTML;
    document.getElementById("sPrice").value = document.getElementById(plan + "-price").innerHTML;
  }
}