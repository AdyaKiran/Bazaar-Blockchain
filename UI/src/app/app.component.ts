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

  negotiateService(serviceID, serviceStatus, serviceOSType, serviceRAM, servicePrice) {
    console.log('Negotiating service' + serviceID);
    let that = this;
    this.ethcontractService.setOffer(this.transferFrom, serviceID, serviceStatus, serviceOSType, serviceRAM, servicePrice).then(function() {
      console.log("Successfully logged negotiation on offer");
    }).catch(function(error){
      console.log(error);
    });
  }
}