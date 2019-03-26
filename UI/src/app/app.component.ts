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

  addNewService(serviceID, serviceOSType, serviceRAM, servicePrice) {
    console.log('Adding New Service');
    let that = this;
    this.ethcontractService.addOffer(this.transferFrom, serviceID, serviceOSType, serviceRAM, servicePrice).then(function() {
      console.log("Successfully added offer");
    }).catch(function(error){
      console.log(error);
    });
  }
}