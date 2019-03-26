pragma solidity ^0.5.0;

contract BazaarContract {

  address public offerSender; //Address of the party that sends the negotiation
  enum state {Advisory, Solicited, Acceptable, Rejected} //Possible states of the negotiation offer as per WS Agreement Standards
  
  //Structure to describe the service provided
  struct service{
    bytes32 RAM;
    bytes32 OSType;
  }

  //Structure to describe the negotiation offer details
  struct negotiationOffer{
    state offerState;
    uint offerPrice;
    service offerService;
  }

  //Array that stores the negotiations for the party
  mapping(uint => negotiationOffer) offersNeg;
  mapping(uint => negotiationOffer) originalOffers;

  negotiationOffer currentOffer; 
  negotiationOffer temp; 
  
  constructor() public {
    offerSender = msg.sender;
  }

  function addOffer(uint _offerID, uint _offerPrice, bytes32 _offerRAM, bytes32 _offerOSType) public returns (bool success){
    temp.offerState = state.Advisory;
    temp.offerPrice = _offerPrice;
    temp.offerService.RAM = _offerRAM;
    temp.offerService.OSType = _offerOSType;
    originalOffers[_offerID] = temp;
    offersNeg[_offerID] = temp;
    return true;
  }

  function setOffer(uint _offerID, uint _offerState, uint _offerPrice, bytes32 _offerRAM, bytes32 _offerOSType) public returns (bool success){
    if (_offerState == 1){
      currentOffer.offerState = state.Advisory;
    }
    else if (_offerState == 2){
      currentOffer.offerState = state.Solicited;
    }
    else if (_offerState == 3){
      currentOffer.offerState = state.Acceptable;
    }
    else if (_offerState == 4){
      currentOffer.offerState = state.Rejected;
    }
    else if (_offerState > 4 ) {
      return false;
    }
    currentOffer.offerPrice = _offerPrice;
    currentOffer.offerService.RAM = _offerRAM;
    currentOffer.offerService.OSType = _offerOSType;
    offersNeg[_offerID] = currentOffer;
    return true;
  }

  // function sendOffer() public payable returns (bool success){
  //   offersHistory.push(currentOffer);
  //   return true;
  // }
}