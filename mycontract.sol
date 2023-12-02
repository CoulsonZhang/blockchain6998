// Please paste your contract's solidity code here
// Note that writing a contract here WILL NOT deploy it and allow you to access it from your client
// You should write and develop your contract in Remix and then, before submitting, copy and paste it here

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract ContractGuard {
    struct Contract {
        address user1;
        address user2;
        bytes32 name1;
        bytes32 name2;
        uint credit;
        bytes32 contentHash;
    }
    mapping(uint => Contract) public contracts;
    uint public count;

    event AddContract(uint id, address user1, address user2, bytes32 contentHash);
    function addContract(address user1, address user2, bytes32 name1, bytes32 name2, uint credit,  bytes32 content) external returns (uint){
        bytes32 contentHash = keccak256(abi.encodePacked(content));
        count += 1;
        uint id = count;
        contracts[id] = Contract(user1,user2,name1,name2,credit,contentHash);
        emit AddContract(id, user1, user2, contentHash);
        return id;
    }
    function verify(uint id, bytes32 content) external view returns (bool){
        bytes32 contentHash = keccak256(abi.encodePacked(content));
        return contentHash == contracts[id].contentHash;
    }
}