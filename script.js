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

var contractAddress = '0xCABEdb1CaFAe0f6f1c31Feb111bf5e6f03372EFc'; // FIXME: fill this in with your contract's address/hash
var ContractGuard = new web3.eth.Contract(abi, contractAddress);

// TODO: add an contract to the system
web3.eth.getAccounts().then((response)=> {
	web3.eth.defaultAccount = response[0];
});

async function add_Contract(user1add, user2add, name1, name2, credit, content) {

	await ContractGuard.methods.addContract(user1add, user2add, name1, name2, credit, content).send(
		{from: user1add, gas: 3000000}
	)

}

async function verify(id, content) {

	result = await ContractGuard.methods.verify(id, content).call(
		{from: web3.eth.defaultAccount, gas: 3000000}
	)
	return result;
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
		// console.log('args')
		// console.log(args);
        // (name: name of the user, address: address of the user)
        nodeSet.add({name: args[2], address: args[0]});
        nodeSet.add({name: args[3], address: args[1]});
        // (source: the address of user1, target: the address of user2, value: the credit)
        links.push({source: args[2], target: args[3], value: args[4]});
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

// console.log(getAllContractData());

// UI
// This runs the 'add_Contract' function when you click the button
// It passes the values from the inputs above
$("#addcontract").click(function() {
	// web3.eth.defaultAccount = $("#myaccount").val(); //sets the default account
    add_Contract($("#user1add").val(), $("#user2add").val(), $("#username1").val(), $("#username2").val(), $("#credit").val(), $("#contentSummary").val()).then((response)=>{
        console.log(response);
        window.location.reload(true); // refreshes the page after add_Contract returns and the promise is unwrapped
        $("#id").html(response)
	})
});

// This gets id of contract
getId().then((response)=>{
        $("#id").html(response)
	});

// This runs "verify" function when you click the button
// It passes the values from inputs
$("#verifyContract").click(function() {
	// web3.eth.defaultAccount = $("#myaccount").val(); //sets the default account
    let result = verify($("#contractid").val(), $("#verifyContent").val()).then((response)=>{
        console.log(response);
        // window.location.reload(true); // refreshes the page after add_Contract returns and the promise is unwrapped
        $("#id").html(response)
	})
	console.log(result)
});


window.onload = async function() {
	const contractData = await getAllContractData();
	console.log(contractData);

	// const addressToIndexMap = new Map();
    // contractData.nodes.forEach((node, index) => {
    //     addressToIndexMap.set(node.address, index);
    // });

    // Create nodes array with the required format
    const cnodes = contractData.nodes.map((node, index) => ({
        name: node.name,
        group: index, // Assign a default group or calculate based on your needs
        id: node.address // The index of the node in the array
    }));

    // Create links array with the required format
    // Replace the source and target addresses with their respective node indexes
    const clinks = contractData.links.map(link => ({
        source: link.source,
        target: link.target,
        value: parseInt(link.value, 10) // Convert the string value to an integer
    }));

	// console.log(cnodes);
	console.log(clinks);

	const nodes = cnodes;
	const links = clinks;

	// const nodes = [
	// 	{ "name": "Myriel",             "group":  1 , id: 0},
	// 	{ "name": "Napoleon",           "group":  2 , id: 1},
	// 	{ "name": "Mlle.Baptistine",    "group":  3 , id: 2},
	// 	{ "name": "Mme.Magloire",       "group":  4 , id: 3},
	// 	{ "name": "CountessdeLo",       "group":  5 , id: 4},
	// 	{ "name": "Geborand",           "group":  6 , id: 5},
	// 	{ "name": "Champtercier",       "group":  7 , id: 6},
	// 	{ "name": "Cravatte",           "group":  8 , id: 7},
	// 	{ "name": "Count",              "group":  9 , id: 8}
	// ];

	// 	const links = [
	// 	{ "source":  1,  "target":  0,  "value":  1 }
	// ];


		var fisheye = d3.fisheye.circular()
					.radius(100)
					.distortion(5);

		const svg = d3.select("svg");
		const width = +svg.attr("width");
		const height = +svg.attr("height");

		// The simulation now uses the name property to link nodes
		const simulation = d3.forceSimulation(nodes)
		.force("link", d3.forceLink(links).id(d => d.name))
		.force("charge", d3.forceManyBody().strength(-30))
		.force("center", d3.forceCenter(width / 2, height / 2));

		// Create the links between nodes
		const link = svg.append("g")
		.attr("stroke", "#999")
		.attr("stroke-opacity", 0.6)
		.selectAll("line")
		.data(links)
		.enter().append("line")
		.attr("stroke-width", d => Math.sqrt(d.value));

		// Create the nodes
		const node = svg.append("g")
		.attr("stroke", "#fff")
		.attr("stroke-width", 1.5)
		.selectAll("circle")
		.data(nodes)
		.enter().append("circle")
		.attr("r", 5)
		.attr("fill", colorByGroup)
		.call(d3.drag()
			.on("start", dragstarted)
			.on("drag", dragged)
			.on("end", dragended));

		// Create the labels for nodes
		const label = svg.append("g")
		.selectAll("text")
		.data(nodes)
		.enter().append("text")
		.attr("dx", 15)
		.attr("dy", ".35em")
		.text(d => d.name)
		.style("fill", "grey");

		// Define a color scale for the nodes
		function colorByGroup(d) {
			// Set the domain to cover all groups from 1 to 2 (adjust if you have more groups)
			const scale = d3.scaleOrdinal(d3.schemeCategory10).domain([0, 1, 2,3,4,5,6,7,8,9,10]);
			console.log('Group:', d.group, 'Color:', scale(d.group)); // Debug statement
			return scale(d.group);
		}

		// Update simulation on each tick
		simulation.on("tick", () => {
		link
			.attr("x1", d => d.source.x)
			.attr("y1", d => d.source.y)
			.attr("x2", d => d.target.x)
			.attr("y2", d => d.target.y);

		node
			.attr("cx", d => d.x)
			.attr("cy", d => d.y);

		label
			.attr("x", d => d.x)
			.attr("y", d => d.y);
		});

		// Functions to handle drag events
		function dragstarted(d) {
		if (!d3.event.active) simulation.alphaTarget(0.3).restart();
		d.fx = d.x;
		d.fy = d.y;
		}

		function dragged(d) {
		d.fx = d3.event.x;
		d.fy = d3.event.y;
		}

		function dragended(d) {
		if (!d3.event.active) simulation.alphaTarget(0);
		d.fx = null;
		d.fy = null;
		}

		svg.on("mousemove", function() {
			fisheye.focus(d3.mouse(this));
			

			node.each(function(d) { d.fisheye = fisheye(d); })
				.attr("cx", function(d) { return d.fisheye.x; })
				.attr("cy", function(d) { return d.fisheye.y; })
				.attr("r", function(d) { return d.fisheye.z * 4.5; });

			link.attr("x1", function(d) { return d.source.fisheye.x; })
				.attr("y1", function(d) { return d.source.fisheye.y; })
				.attr("x2", function(d) { return d.target.fisheye.x; })
				.attr("y2", function(d) { return d.target.fisheye.y; });
			label.each(function(d) { d.fisheye = fisheye(d); })
				.attr("x", d => d.fisheye.x + (d.fisheye.z * 5)) 
				.attr("y", d => d.fisheye.y)
				.style("font-size", d => `${d.fisheye.z * 10}px`);
		});
	}

