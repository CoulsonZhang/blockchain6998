// =============================================================================
//                                  Config
// =============================================================================

let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

// Constant we use later
var GENESIS = '0x0000000000000000000000000000000000000000000000000000000000000000';

// This is the ABI for your contract (get it from Remix, in the 'Compile' tab)
// ============================================================
var abi = []; // FIXME: fill this in with your contract's ABI 

// ============================================================
abiDecoder.addABI(abi);
// call abiDecoder.decodeMethod to use this - see 'getAllFunctionCalls' for more

var contractAddress = '0x0000000000000000000000000000000000000000'; // FIXME: fill this in with your contract's address/hash
var ContractGuard = new web3.eth.Contract(abi, contractAddress);

// TODO: add an IOU ('I owe you') to the system
// The person you owe money is passed as 'creditor'
// The amount you owe them is passed as 'amount'
async function add_Contract(user1add, user2add, name1, name2, credit, content) {

	await ContractGuard.methods.AddContract(user1add, user2add, name1, name2, credit, content).send(
		{from: web3.eth.defaultAccount, gas: 3000000}
	)

}

// UI
// This runs the 'add_IOU' function when you click the button
// It passes the values from the two inputs above
$("#addcontract").click(function() {
	// web3.eth.defaultAccount = $("#myaccount").val(); //sets the default account
    add_Contract($("#creditor").val(), $("#amount").val()).then((response)=>{
		window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
	})
});
