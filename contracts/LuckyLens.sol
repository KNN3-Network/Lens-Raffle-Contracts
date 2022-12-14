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
mapping(uint => uint) public requestIdToRaffleId;
Raffle[] public Raffles;


constructor(uint64 id, address _lensHubProxy) VRFv2Consumer(id) {
    LensHubProxy = _lensHubProxy;
}


/* 
the actual publication link can contain the requirements. we'll have a couple defaults on the verifier: must follow poster & comment. or must comment, but having the
requirements in the publication will be necessary to communicate to your audience how to enter the raffle anyway, and this leaves interesting options open for verification,
for example, "you must follow these 3 users and donate 3 hubbabubba coins in order to qualify"
*/
function postRaffle(uint profileId, uint pubId, uint time) public { 
    Raffles.push(Raffle(msg.sender, profileId, pubId, time, 0));
    uint raffleId = Raffles.length - 1;

    emit PostRaffle(raffleId, profileId, pubId, time, msg.sender);
}

// the actual calculation of who the winners are will be done off-chain
function chooseRandomWinner(uint raffleId) public  {
    require(Raffles[raffleId].owner != address(0), 'there is no raffle at this index / id');
    require(msg.sender == Raffles[raffleId].owner, "only the owner can raffle"); // maybe remove in the future... is there really a need for this?
    require(Raffles[raffleId].randomNum == 0, "a winner has already been selected");

    uint requestId = super.requestRandomWords(raffleId);
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

        emit RequestFulfilled(raffleId, _requestId, _randomWords[0]);
    }



}