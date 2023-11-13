// Please paste your contract's solidity code here
// Note that writing a contract here WILL NOT deploy it and allow you to access it from your client
// You should write and develop your contract in Remix and then, before submitting, copy and paste it here

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract ContractGuard {
    struct Contract {
        address[] stakeholders;
        bytes32 contentHash;
    }
    mapping(uint => Contract) public contracts;
    uint public count;
    
    function addContract(address[] calldata stakeholders, bytes32[] calldata content) external returns (uint){
        bytes32 contentHash = keccak256(abi.encodePacked(content));
        count += 1;
        uint id = count;
        contracts[id] = Contract(stakeholders, contentHash);
        return id;
    }
    function verify(uint id, bytes32[] calldata content) external view returns (bool){
        bytes32 contentHash = keccak256(abi.encodePacked(content));
        return contentHash == contracts[id].contentHash;
    }
}