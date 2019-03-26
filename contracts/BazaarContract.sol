pragma solidity ^0.5.0;

contract BazaarContract {

  address public offerSender; //Address of the party that sends the negotiation
  enum state {Advisory, Solicited, Acceptable, Rejected} //Possible states of the negotiation offer as per WS Agreement Standards
  uint current_discussions = 0;

  //Structure to describe the service provided
  struct service{
    bytes32 RAM;
    bytes32 OSType;
  }

  //Structure to describe the negotiation offer details
  struct negotiationOffer{
    uint planID;
    state offerState;
    uint offerPrice;
    service offerService;
    bool isCSP;
  }

  //Array that stores the negotiations for the party
  mapping(uint => negotiationOffer) offersNeg;
  uint[] negIDs;
  
  constructor() public {
    offerSender = msg.sender;
  }

  function getNumberOfDiscussions() public view returns (uint discNo) {
    return current_discussions;
  }

  function getDiscussionFromID(uint _id) public view returns (uint _planID, uint _offerState, uint _offerPrice, bytes32 _offerRAM, bytes32 _offerOSType, bool _isCSP){
    negotiationOffer memory temp = offersNeg[_id];
    return (temp.planID, uint(temp.offerState), temp.offerPrice, temp.offerService.RAM, temp.offerService.OSType, temp.isCSP);
  }

  function addDiscussion(uint _planID, uint _offerState, uint _offerPrice, bytes32 _offerRAM, bytes32 _offerOSType) public returns (bool success){
    negotiationOffer memory newDiscussion;
    if (_offerState == 1){
      newDiscussion.offerState = state.Advisory;
    }
    else if (_offerState == 2){
      newDiscussion.offerState = state.Solicited;
    }
    else if (_offerState == 3){
      newDiscussion.offerState = state.Acceptable;
    }
    newDiscussion.planID = _planID;
    newDiscussion.offerPrice = _offerPrice;
    newDiscussion.offerService.RAM = _offerRAM;
    newDiscussion.offerService.OSType = _offerOSType;
    newDiscussion.isCSP = false;

    offersNeg[current_discussions] = newDiscussion;
    current_discussions++;
    
    return true;
  }

  function updateDiscussion(uint _id, uint _offerState, uint _offerPrice, bytes32 _offerRAM, bytes32 _offerOSType, bool _isCSP) public returns (bool success){
    negotiationOffer memory currentOffer = offersNeg[_id];
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
    currentOffer.isCSP = _isCSP;

    offersNeg[_id] = currentOffer;

    return true;
  }
}