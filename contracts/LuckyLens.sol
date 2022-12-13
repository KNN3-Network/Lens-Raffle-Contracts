// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import './VRFv2Consumer.sol';

contract LuckyLens is VRFv2Consumer {

event PostRaffle(uint indexed raffleId, uint indexed profileId, uint indexed pubId, uint time, address owner); // owner is msg.sender so easy to not index it


struct Raffle {
    address owner;
    uint profileId;
    uint pubId;
    uint time;
    uint randomNum;
}


address immutable LensHubProxy;
// mapping(bytes32 => uint) encodedRaffleToRandomNumber;
// mapping(bytes32 => Raffle) public encodedRaffleToRaffle;
mapping(uint => uint) requestIdToRaffleId;
Raffle[] public Raffles;


constructor(uint64 id, address _lensHubProxy) VRFv2Consumer(id) {
    LensHubProxy = _lensHubProxy;
}


function _encodeRaffle(address owner, uint profileId, uint pubId, uint time) internal pure returns(bytes32) {
    return(keccak256(abi.encode(owner, profileId, pubId, time)));
}


// function getRaffle(address owner, uint profileId, uint pubId, uint time) public view returns(Raffle memory) {
//     return encodedRaffleToRaffle[_encodeRaffle(owner, profileId, pubId, time)];
// }


function postRaffle(uint profileId, uint pubId, uint time) public {

    Raffles.push(Raffle(msg.sender, profileId, pubId, time, 0));
    uint raffleId = Raffles.length - 1;

    emit PostRaffle(raffleId, profileId, pubId, time, msg.sender);
}

// the actual calculation of who the winners are will be done off-chain
function chooseRandomWinner(uint raffleId) public  {
    require(msg.sender == Raffles[raffleId].owner, "only the owner can raffle");
    require(Raffles[raffleId].randomNum == 0, "a winner has already been selected");

    uint requestId = super.requestRandomWords();
    requestIdToRaffleId[requestId] = raffleId;
}





// CALLBACK FUNC, SHOULD FULFILL RANDOMNESS IN THIS FUNC
function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        require(s_requests[_requestId].exists, "request not found");
        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;

        uint raffleId = requestIdToRaffleId[_requestId];
        Raffles[raffleId].randomNum = _randomWords[0];

        emit RequestFulfilled(_requestId, _randomWords);
    }



}