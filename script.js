// =============================================================================
//                                  Config
// =============================================================================

let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

// Constant we use later
var GENESIS = '0x0000000000000000000000000000000000000000000000000000000000000000';

// This is the ABI for your contract (get it from Remix, in the 'Compile' tab)
// ============================================================
var abi = []; // FIXME: fill this in with your contract's ABI //Be sure to only have one array, not two

// ============================================================
abiDecoder.addABI(abi);
// call abiDecoder.decodeMethod to use this - see 'getAllFunctionCalls' for more

var contractAddress = ''; // FIXME: fill this in with your contract's address/hash
var ContractGuard = new web3.eth.Contract(abi, contractAddress);

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