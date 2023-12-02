// =============================================================================
//                                  Config
// =============================================================================

let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

// Constant we use later
var GENESIS = '0x0000000000000000000000000000000000000000000000000000000000000000';

// This is the ABI for your contract (get it from Remix, in the 'Compile' tab)
// ============================================================
var abi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "user1",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "user2",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "contentHash",
				"type": "bytes32"
			}
		],
		"name": "AddContract",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user1",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "user2",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "name1",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "name2",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "credit",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "content",
				"type": "string"
			}
		],
		"name": "addContract",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "contracts",
		"outputs": [
			{
				"internalType": "address",
				"name": "user1",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "user2",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "name1",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "name2",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "credit",
				"type": "uint256"
			},
			{
				"internalType": "bytes32",
				"name": "contentHash",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "count",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "content",
				"type": "string"
			}
		],
		"name": "verify",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]; // FIXME: fill this in with your contract's ABI 

// ============================================================
abiDecoder.addABI(abi);
// call abiDecoder.decodeMethod to use this - see 'getAllFunctionCalls' for more

var contractAddress = '0xAA3AD474AcedbAF70286FDc4411dbcFfEc59ceCD'; // FIXME: fill this in with your contract's address/hash
var ContractGuard = new web3.eth.Contract(abi, contractAddress);

// TODO: add an IOU ('I owe you') to the system
// The person you owe money is passed as 'creditor'
// The amount you owe them is passed as 'amount'
async function add_Contract(user1add, user2add, name1, name2, credit, content) {

	await ContractGuard.methods.addContract(user1add, user2add, name1, name2, credit, content).send(
		{from: user1add, gas: 3000000}
	)

}

// UI
// This runs the 'add_IOU' function when you click the button
// It passes the values from the two inputs above
$("#addcontract").click(function() {
	// web3.eth.defaultAccount = $("#myaccount").val(); //sets the default account
    add_Contract($("#user1add").val(), $("#user2add").val(), $("#username1").val(), $("#username2").val(), $("#credit").val(), $("#contentSummary").val()).then((response)=>{
		window.location.reload(true); // refreshes the page after add_Contract returns and the promise is unwrapped
	})
});
