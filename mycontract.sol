// Please paste your contract's solidity code here
// Note that writing a contract here WILL NOT deploy it and allow you to access it from your client
// You should write and develop your contract in Remix and then, before submitting, copy and paste it here

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract ContractGuard {
    struct Contract {
        address user1;
        address user2;
        string name1;
        string name2;
        uint credit;
        bytes32 contentHash;
    }
    mapping(uint => Contract) public contracts;
    uint public count;

    event AddContract(uint id, address user1, address user2, bytes32 contentHash);
    function addContract(address user1, address user2, string memory name1, string memory name2, uint credit,  string memory content) external returns (uint){
        bytes32 contentHash = keccak256(abi.encodePacked(content));
        count += 1;
        uint id = count;
        contracts[id] = Contract(user1,user2,name1,name2,credit,contentHash);
        emit AddContract(id, user1, user2, contentHash);
        return id;
    }
    event EditContract(uint id, bytes32 contentHash);
    function editContract(uint id, string memory content) external {
        Contract storage c = contracts[id];
        require(msg.sender == c.user1 || msg.sender == c.user2);
        bytes32 contentHash = keccak256(abi.encodePacked(content));
        c.contentHash = contentHash;
        emit EditContract(id, contentHash);
    }
    function verify(uint id, string memory content) external view returns (bool){
        bytes32 contentHash = keccak256(abi.encodePacked(content));
        return contentHash == contracts[id].contentHash;
    }
}