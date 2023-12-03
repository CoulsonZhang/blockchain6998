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

var contractAddress = '0x07506C4EBb8d9594ae9E1cA83a9c4eA8932C6Dcf'; // FIXME: fill this in with your contract's address/hash
var ContractGuard = new web3.eth.Contract(abi, contractAddress);

// TODO: add an IOU ('I owe you') to the system
// The person you owe money is passed as 'creditor'
// The amount you owe them is passed as 'amount'
async function add_Contract(user1add, user2add, name1, name2, credit, content) {

	await ContractGuard.methods.addContract(user1add, user2add, name1, name2, credit, content).send(
		{from: user1add, gas: 3000000}
	)

}

async function getId(){
    id = await ContractGuard.methods.count().call();
    return id;
}

async function getAllContractData(){
    var function_calls = await getAllFunctionCalls(contractAddress, 'addContract');
    var nodes = [];
    var links = [];

    //get all nodes
    var nodeSet = new Set();
    for (var i = 0; i < function_calls.length; i++) {
        var args = function_calls[i].args;
        // (name: name of the user, address: address of the user)
        nodeSet.add({name: args[2], address: args[0]});
        nodeSet.add({name: args[3], address: args[1]});
        // (source: the address of user1, target: the address of user2, value: the credit)
        links.push({source: args[0], target: args[1], value: args[4]});
    }
    //convert set to array
    nodes = Array.from(nodeSet);
    //return nodes and links
    return {nodes: nodes, links: links};

}


async function getAllFunctionCalls(addressOfContract, functionName) {

	var curBlock = await web3.eth.getBlockNumber();
	var function_calls = [];

	while (curBlock !== GENESIS) {
	  var b = await web3.eth.getBlock(curBlock, true);
	  var txns = b.transactions;
	  for (var j = 0; j < txns.length; j++) {
	  	var txn = txns[j];

	  	// check that destination of txn is our contract
			if(txn.to == null){continue;}
	  	if (txn.to.toLowerCase() === addressOfContract.toLowerCase()) {
	  		var func_call = abiDecoder.decodeMethod(txn.input);
				//todo: check that the tx is successful
				// check that the function getting called in this txn is 'functionName'
				if (func_call && func_call.name === functionName) {
					var time = await web3.eth.getBlock(curBlock);
	  			var args = func_call.params.map(function (x) {return x.value});
	  			function_calls.push({
	  				from: txn.from.toLowerCase(),
	  				args: args,
						t: time.timestamp
	  			})
	  		}
	  	}
	  }
	  curBlock = b.parentHash;
	}
	return function_calls;
}

console.log(getAllContractData());

// UI
// This runs the 'add_IOU' function when you click the button
// It passes the values from the two inputs above
$("#addcontract").click(function() {
	// web3.eth.defaultAccount = $("#myaccount").val(); //sets the default account
    add_Contract($("#user1add").val(), $("#user2add").val(), $("#username1").val(), $("#username2").val(), $("#credit").val(), $("#contentSummary").val()).then((response)=>{
        console.log(response);
        window.location.reload(true); // refreshes the page after add_Contract returns and the promise is unwrapped
        $("#id").html(response)
	})
});

getId().then((response)=>{
        $("#id").html(response)
    })
;

