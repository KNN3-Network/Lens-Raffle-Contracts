// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

contract LuckyLens {

event PostRaffle(uint indexed profileId, uint indexed pubId, uint indexed time, address owner); // owner is msg.sender so easy to not index it


struct Raffle {
    address owner;
    uint profileId;
    uint pubId;
    uint time;
    uint randomNum;
}


address immutable LensHubProxy;
// mapping(bytes32 => uint) encodedRaffleToRandomNumber;
mapping(bytes32 => Raffle) public encodedRaffleToRaffle;


constructor(address _lensHubProxy) {
    LensHubProxy = _lensHubProxy;
}


function _encodeRaffle(address owner, uint profileId, uint pubId, uint time) internal pure returns(bytes32) {
    return(keccak256(abi.encode(owner, profileId, pubId, time)));
}

function getRaffle(address owner, uint profileId, uint pubId, uint time) public view returns(Raffle memory) {
    return encodedRaffleToRaffle[_encodeRaffle(owner, profileId, pubId, time)];
}

function postRaffle(uint profileId, uint pubId, uint time) public {

    bytes32 encodedRaffle = _encodeRaffle(msg.sender, profileId, pubId, time);

    require(encodedRaffleToRaffle[encodedRaffle].owner == address(0), "Raffle already exists at that profile, post, and time");

    encodedRaffleToRaffle[encodedRaffle] = Raffle(msg.sender,  profileId, pubId, time, 0);

    emit PostRaffle(profileId, pubId, time, msg.sender);

}




}