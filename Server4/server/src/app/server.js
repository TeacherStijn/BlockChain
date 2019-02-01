"use strict";

// LAATSTE UPDATE:
// 331 - 333:
//let node = new Node({
//	node: HOST
//});

var db = require('./db');


/* Express web server instellen */
const express = require('express');
const server = express();


/* Body-parser instellen */
const bodyParser = require('body-parser');
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


/* Zorg voor CORS? We moeten vanaf onze Angular server, bij de Node.js Express server kunnen als we andere 'server' gebruiken: */
const cors = require('cors');
server.use(cors());
server.options('*', cors());	// voor nu even helemaal open zetten
/*
var whitelist = ['http://localhost:8001/', 'http://localhost:8003/'];
var corsOpties = {
  origin: function (origin, callback) {
	  console.log(origin + " " + whitelist.indexOf(origin));
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
*/

/* Lokale stuff instellen */
const LOCAL_IP = "http://localhost"; //require("ip").address(); // let op npm install!
const LOCAL_PORT = "8004";
const HOST = LOCAL_IP + ':' + LOCAL_PORT + '/';


/* Classes Block en BlockChain importeren */
var Block = require("./block.js");
var BlockChain = require("./blockchain.js");
/* ES6 notatie, werkt nog niet in Node zonder hacks: import { Block } from ''; */

var BlockChainModel = require('./blockchain_db_model');
var TransactieModel = require('./transactie_db_model');
var NodeModel = require('./node_db_model');

/* vars van de server */
var resultaat;
var selectedChain;



/* GET root */
server.get(['/','/index.html'], function(request, response) {
    console.log('Get of /');
	
	response.sendFile(__dirname + '/index.html');
});


/* ANGULAR (FRONT-END) REQUESTS OPVANGEN */
server.get('/inline.bundle.js', function(request, response) {
    console.log('Get of /inline.bundle.js');
	
	response.sendFile(__dirname + '/inline.bundle.js');
});

server.get('/main.bundle.js', function(request, response) {
    console.log('Get of /main.bundle.js');
	
	response.sendFile(__dirname + '/main.bundle.js');
});

server.get('/polyfills.bundle.js', function(request, response) {
    console.log('Get of /polyfills.bundle.js');
	
	response.sendFile(__dirname + '/polyfills.bundle.js');
});

server.get('/styles.bundle.js', function(request, response) {
    console.log('Get of /styles.bundle.js');
	
	response.sendFile(__dirname + '/styles.bundle.js');
});

server.get('/vendor.bundle.js', function(request, response) {
    console.log('Get of /vendor.bundle.js');
	
	response.sendFile(__dirname + '/vendor.bundle.js');
});


/* GET hele CHAIN */
server.get('/chain', function(request, response) {
	console.log('Get of /chain/ op: ' + LOCAL_PORT);
	
	BlockChainModel.find({}).sort( { index: 1 } ).then(function(chain){	
		
		BlockChainModel.count({}).then(function(aantalBlocks){
			console.log('Aantal gevonden blocks: ' + aantalBlocks);
			if (aantalBlocks==0){
				chain = '';
			} else {
				console.log('Chain: ' + JSON.stringify(chain));
				console.log('Hash van genesis block herberekend: ' + chain[0].hash);
			}		
		
			response.send(chain);
		}, function(err){
			console.log('Ophalen hoeveelheid blocks in chain niet gelukt');
		});
	}, function(err){
		console.log('Ophalen chain uit DB niet gelukt');
	});
});


/* GET minen BLOCK */
server.get('/minen', function(request, response) {
	
    console.log('Get of /minen');
	
	selectedChain.resolveConflict(LOCAL_PORT);
	
	// In praktijk mogelijk een Stream met fork en dan join (Node library)	
	setTimeout(function(){
			
		/* Eerst checken op of er wel transacties zijn: */
		if (selectedChain.currentTransactions.length!=0){
			let nieuwBlock;		
							
			console.log("Verbonden aan cloud cluster");				
				
			BlockChainModel.find({}).sort( { index: 1 } ).then(function(result){
				console.log('Onze huidige ingeladen chain is: ' + selectedChain.chain);
				selectedChain.chain = result;
				
				// Instance v/h model maken:
				let transactie = new TransactieModel({
					zender: 0,
					ontvanger: LOCAL_IP + ':' + LOCAL_PORT,
					amount: 1
				});
				
				// Gaat dit nog goed?
				TransactieModel.create(selectedChain.newTransactie(transactie)).then(function(result2){
					console.log('Toevoegen nieuwe transactie voor miner gelukt: ' + selectedChain.currentTransactions[selectedChain.currentTransactions.length-1]);
					
					let lastBlock = selectedChain.getLatestBlock();							
					let lastPow = lastBlock.pow;			
					
					console.log('Mining gaat beginnen...');
					let pow = selectedChain.newPow(lastPow);

					/* HIER ZIT EEN VERSCHIL !! Tussen de opgeslagen Hash en de nu te berekenen hash! */
					console.log('Hash van het vorige block is: ' + lastBlock.hash);				
					let previousHash = BlockChain.hash(lastBlock);
					console.log('De previousHash als oplossing v/d BlockChain.hash methode is: ' + previousHash);	
					nieuwBlock = selectedChain.newBlock(pow, previousHash);				
					
					/**********************************************/
					/* Simultane actie van onderstaande(n) maken! */
					/**********************************************/
					
					/* Openstaande transacties verwijderen */
					TransactieModel.remove({}).then(function(result3){
						
						selectedChain.currentTransactions = []; // zijn nu allen in blok gezet
						
						/* Nieuw block toevoegen aan de chain */
						BlockChainModel.create(nieuwBlock).then(function(result4){
							/* Ook in lokale selectedChain plaatsen */
							selectedChain.chain.push(nieuwBlock);
							console.log("Block gemined en toegevoegd: " + selectedChain.chain[selectedChain.chain.length-1]);
							//response.send(nieuwBlock);
						}, function(err){
							console.log('Toevoegen nieuw block in DB niet gelukt');
						});
					}, function(err){
						console.log('Verwijderen transacties uit DB niet gelukt');
					});
				}, function(err){
					console.log('Aanmaken nieuwe transactie (voor de miner) op DB niet gelukt');
				});
			}, function(err){
				console.log('Opzoeken chain uit DB niet gelukt');
			});
		} else {
			console.log("Er zijn geen openstaande transacties");
			//response.send({ "error": "Er zijn geen openstaande transacties"});
		}		
			
		console.log("42!");	
		
	}, 5000, 'Stick hands out of sand');
	
});


/* GET openstaande TRANSACTIES */
server.get('/transacties', function(request, response) {
	console.log('Get of /transacties/');
	
	TransactieModel.find({}).then(function(result){
		console.log("Collectie opgehaald");
		resultaat = result;
		console.log("Transacties: " + JSON.stringify(resultaat));		
		response.status(201).send(resultaat);
	}, function(err){
		console.log('Ophalen transacties niet gelukt');
	});
});


/* POST nieuwe TRANSACTIE */
server.post('/transacties/nieuw', function(request, response) {
	
	console.log('POST van /transacties/nieuw');
	let transactie = new TransactieModel({ 
		zender: request.body.zender,
		ontvanger: request.body.ontvanger,
		amount: request.body.amount
	});
	
	TransactieModel.create(selectedChain.newTransactie(transactie)).then(function(result){
		let latestTransactie = selectedChain.currentTransactions[selectedChain.currentTransactions.length-1];
		console.log("Transactie toegevoegd met waarden: " + JSON.stringify(latestTransactie));
		//response.status(201).send(latestTransactie);		
	}, function(err){
		console.log('Transactie toevoegen niet gelukt');
	});
});


/* Nieuwe NODE registreren */
server.post('/nodes/registreer', function(request, response) {
	
	console.log('POST van /nodes/registreer');
	console.log('De request body: ' + request.body.node);
	
	if (request.body.node=='' || request.body.node==null){
		console.log('Geef een valide lijst met nodes door');
		//response.status(200).send({ "status": "Geef een valide lijst met nodes door"});
	} else {
		// Toekomstig: meerdere nodes via lijst die binnenkomt registreren
		selectedChain.registreerNode(request.body.node);
		NodeModel.create(request.body).then(function(result){
			console.log('Node geregistreerd: ' + selectedChain.nodes[selectedChain.nodes.length-1]);
			//response.status(201).send({ "status": "Node geregistreerd: " + selectedChain.nodes[selectedChain.nodes.length-1]});			
		}, function(err){
			console.log('Registratie nieuwe node niet gelukt');
		});		
	}	
});


/* Structureren van de NODES */
server.get('/nodes/structure', function(request, response){
	selectedChain.resolveConflict(LOCAL_PORT);
});


/* NODES uitlezen */
server.get('/nodes', function(request, response){
	if (selectedChain) {
		response.send(selectedChain.nodes);
	}
});





/* Webserver starten */
server.listen(LOCAL_PORT, function() {
    console.log('Server started!');
	
	/* GENESIS BLOCK MAKEN */
	console.log("Verbonden aan cloud cluster");
	
	selectedChain = new BlockChain();
	console.log("Lokaal chain variabele gemaakt");	
	
	console.log("Check of Genesis gemaakt moet worden...");
				
	BlockChainModel.count({}).then(function(aantalBlocks) {
		
		console.log('Records in chain: ' + aantalBlocks);
		if (aantalBlocks==0){
			selectedChain.chain[0] = selectedChain.createGenesisBlock();
			console.log("Lokale chain variabele uitgebreid met genesis block");
	
			let blockChainModel;
			blockChainModel = new BlockChainModel(selectedChain.chain[0]);
			console.log("Lokale chain voor in db klaargemaakt");
			
			blockChainModel.save().then(function(chain){
					console.log('Chain met genesis block in database opgeslagen');
			}, function(err){
				console.log('Opslaan genesis block in db niet gelukt');
			});
		} else {
			/* CHAIN VARIABELE VULLEN */
			BlockChainModel.find({}).sort( { index: 1 } ).then(function(chain){	
				selectedChain.chain = chain;
				console.log('Chain: ' + JSON.stringify(selectedChain.chain));
			}, function(err){
				console.log('DB chain in lokale chain opslaan niet gelukt');
			});

			TransactieModel.find({}).then(function(transacties){	
					selectedChain.currentTransactions = transacties;
					console.log('Transacties: ' + JSON.stringify(selectedChain.currentTransactions));
			}, function(err){
				console.log('DB Transacties in lokale transacties opslaan niet gelukt');
			});
		
			NodeModel.find({}).then(function(nodes){
				console.log('Eerste keer nodes ophalen...');
				
				NodeModel.count({}).then(function(aantalNodes){
					console.log('Aantal gevonden nodes: ' + aantalNodes);
					if (aantalNodes==0){
						let node = {
							node: HOST
						};
						
						NodeModel.create(node).then(function(nodeResult){							
							console.log('Eigen node gemaakt en opgeslagen');
						});
					}
		
					selectedChain.nodes = nodes;
					console.log('DB nodes opgeslagen in lokale nodelijst');
					
					if (selectedChain.nodes.length!=undefined || selectedChain.nodes.length > 0)
					{
						console.log('Opgeslagen nodes:');
						for (let i=0; i<selectedChain.nodes.length; i++){
							console.log(selectedChain.nodes[i].node);			
						}
					}
				}, function(err){
					console.log('Tellen aantal nodes uit DB niet gelukt');
				});
			}, function(err){
				console.log('Ophalen nodes uit DB niet gelukt');
			});
		}
	}, function(err){
		console.log('Tellen aantal blocks mislukt: ' + err);
	});
});