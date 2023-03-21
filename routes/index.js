const express = require('express');
const router = express.Router();
const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');
const contract = require('../contract/Bank.json');
const MongoClient = require('mongodb').MongoClient;//eventstore to mongodb
const url = "mongodb://localhost:27017/";//eventstore to mongodb
let events =require('events');//event listener
let Emitter = new events.EventEmitter();//event listener
var eventresult= null;

/* GET home page. */
router.get('/', async function (req, res, next) {
  res.render('index')
});

//get accounts
router.get('/accounts', async function (req, res, next) {
  let accounts = await web3.eth.getAccounts()
  res.send(accounts)
});

//login
router.get('/balance', async function (req, res, next) {
  let ethBalance = await web3.eth.getBalance(req.query.account)
  res.send({
    ethBalance: web3.utils.fromWei(ethBalance, 'ether')
  })
});

//balance
router.get('/allBalance', async function (req, res, next) {
  let bank = new web3.eth.Contract(contract.abi);
  bank.options.address = req.query.address;//bankaddress
  let ethBalance = await web3.eth.getBalance(req.query.account)
  let bankBalance = await bank.methods.getBankBalance().call({ from: req.query.account })
  let coinBalance = await bank.methods.getCoinBalance().call({ from: req.query.account })
  res.send({
    ethBalance: web3.utils.fromWei(ethBalance, 'ether'),
    bankBalance: web3.utils.fromWei(bankBalance, 'ether'),
    coinBalance: web3.utils.fromWei(coinBalance, 'ether')
  })
});

//contract
router.get('/contract', function (req, res, next) {
  let bank = new web3.eth.Contract(contract.abi);
  bank.options.address = req.query.address;
  res.send({
    bank: bank
  })
});

//unlock account
router.post('/unlock', function (req, res, next) {
  web3.eth.personal.unlockAccount(req.body.account, req.body.password, 60)
    .then(function (result) {
      res.send('true')
    })
    .catch(function (err) {
      res.send('false')
    })
});

//deploy bank contract
router.post('/deploy', function (req, res, next) {
  let bank = new web3.eth.Contract(contract.abi);
  bank.deploy({
    data: contract.bytecode
  })
    .send({
      from: req.body.account,
      gas: 3400000
    })
    .on('receipt', function (receipt) {
      res.send(receipt);
    })
    .on('error', function (error) {
      res.send(error.toString());
    })
});

//deposit ether
router.post('/deposit', function (req, res, next) {
  let bank = new web3.eth.Contract(contract.abi);
  bank.options.address = req.body.address;
  bank.methods.deposit().send({
    from: req.body.account,
    gas: 3400000,
    value: web3.utils.toWei(req.body.value, 'ether')
  })
    .on('receipt', function (receipt) {
      eventstate = 1 ;
      eventresult = receipt;
      res.send(receipt);
      Emitter.emit('depositevent',eventresult);
    })
    .on('error', function (error) {
      res.send(error.toString());
    })
   
  });


//withdraw ether
router.post('/withdraw', function (req, res, next) {
  let bank = new web3.eth.Contract(contract.abi);
  bank.options.address = req.body.address;
  bank.methods.withdraw(req.body.value).send({
    from: req.body.account,
    gas: 3400000
  })
    .on('receipt', function (receipt) {
      res.send(receipt);
    })
    .on('error', function (error) {
      res.send(error.toString());
    })
});

//transfer ether
router.post('/transfer', function (req, res, next) {
  let bank = new web3.eth.Contract(contract.abi);
  bank.options.address = req.body.address;
  bank.methods.transfer(req.body.to, req.body.value).send({
    from: req.body.account,
    gas: 3400000
  })
    .on('receipt', function (receipt) {
      res.send(receipt);
      eventstate  = 2;
      eventresult = receipt;
    })
    .on('error', function (error) {
      res.send(error.toString());
    })
});

//kill contract
router.post('/kill', function (req, res, next) {
  let bank = new web3.eth.Contract(contract.abi);
  bank.options.address = req.body.address;
  bank.methods.kill(bank.options.address).send({
    from: req.body.account,
    gas: 3400000
  })
    .on('receipt', function (receipt) {
      res.send(receipt);
    })
    .on('error', function (error) {
      res.send(error.toString());
    })
});

//owner
router.get('/owner', async function (req, res, next) {
  // TODO
  // ...
  let bank = new web3.eth.Contract(contract.abi);
  bank.options.address = req.query.address;
  let checkOwner = await bank.methods.getOwner().call({ from: req.query.account })
  res.send(checkOwner);
});

//mint Coin
router.post('/mintCoin', function (req, res, next) {
  // TODO
  // ...
  let bank = new web3.eth.Contract(contract.abi);
  bank.options.address = req.body.address;
  bank.methods.mint(req.body.mintValue).send({
    from: req.body.account,
    gas: 3400000
  })
      .on('receipt', function (receipt) {
        res.send(receipt);
      })
      .on('error', function (error) {
        res.send(error.toString());
      })
});

//buy Coin
router.post('/buyCoin', function (req, res, next) {
  // TODO
  // ...
  let bank = new web3.eth.Contract(contract.abi);
  bank.options.address = req.body.address;
  console.log(req.body.value)
  bank.methods.buy(req.body.value).send({
    from: req.body.account,
    gas: 3400000
  })
      .on('receipt', function (receipt) {
        res.send(receipt);
      })
      .on('error', function (error) {
        res.send(error.toString());
      })

});

//transfer Coin
router.post('/transferCoin', function (req, res, next) {
  // TODO
  // ...
  let bank = new web3.eth.Contract(contract.abi);
  bank.options.address = req.body.address;
  bank.methods.transferCoin(req.body.to, req.body.value).send({
    from: req.body.account,
    gas: 3400000
  })
      .on('receipt', function (receipt) {
        res.send(receipt);
      })
      .on('error', function (error) {

        res.send(error.toString());
      })
});

//transfer Owner
router.post('/transferOwner', function (req, res, next) {
  // TODO
  // ...
  let bank = new web3.eth.Contract(contract.abi);
  bank.options.address = req.body.address;
  bank.methods.transferOwner(req.body.to).send({
    from: req.body.account,
    gas: 3400000
  })
      .on('receipt', function (receipt) {
        res.send(receipt);
      })
      .on('error', function (error) {
        res.send(error.toString());
      })
});

//transfer ether to other address
router.post('/transferTo', async function (req, res, next) {
  // TODO
  // ...
});



//event store to mongoDB
// router.post('/eventstore', async function(req, res,next){
//   const MongoClient = require('mongodb').MongoClient;
// const url = "mongodb://localhost:27017/";
 
// MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
//     var dbo = db.db("runoob");
//     if(eventstate==1){
//     var myobj =  [
//         {   from: eventresult.from ,
//             to: eventresult.to,
//            value: eventresult.events.DepositEvent.returnValues.value,
//            blocknumber: eventresult.blockNumber,
//            state:'deposit' }
//        ];
//     dbo.collection("site").insertMany(myobj, function(err, res) {
//     });}
//     if(eventstate==2){
//       var myobj =  [
//           { from: eventresult.from ,
//             to:eventresult.to ,
//              value: eventresult.events.TransferEvent.returnValues.value,
//              blocknumber: eventresult.blockNumber,
//              state:'transfer' }
//          ];
//       dbo.collection("site").insertMany(myobj, function(err, res) {
//       });}
// })
//   res.send("回傳");
// });



//event listener
Emitter.on('depositevent',(eventresult)=>{
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    var dbo = db.db("runoob");
    var myobj =  [
        {   from: eventresult.from ,
            to: eventresult.to,
           value:parseInt(eventresult.events.DepositEvent.returnValues.value,10)/1000000000000000000,
           blocknumber: eventresult.blockNumber,
           timestamp: eventresult.events.DepositEvent.returnValues.timestamp,
           state:'deposit'}
       ];
    dbo.collection("site").insertMany(myobj, function(err, res) {
    });
})
console.log('event saved succeeful!',myobj);
  res.send("回傳");
})

//snapshot


//MQTT
// router.post('/MQTTbroadcast', function (req, res, next) {
// var mqtt = require('mqtt')
// var client = mqtt.connect('mqtt://localhost:1234')
// var topic = 'LINTANGtest123'
// if(eventstate==1){
// var message ={
//   from:eventresult.from,
//   to: eventresult.to,
//   value: eventresult.events.DepositEvent.returnValues.value,
//   blocknumber: eventresult.blockNumber
// }//desposit
// }
// if(eventstate==2){
//   var message ={
//     from:eventresult.from,
//     to: eventresult.to,
//     value: eventresult.events.TransferEvent.returnValues.value,
//     blocknumber: eventresult.blockNumber
// }}//transfer
// client.on('connect', ()=>{
//       client.publish(topic, JSON.stringify(message) )
//       console.log('Message sent!', message )
// })
// eventstate=null;
// res.send("message saved in DB")
// });


// router.post('/blocksearch',function(req, res, next){
//   const MongoClient = require('mongodb').MongoClient;
//   const url = "mongodb://localhost:27017/";
  
//   MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
   
//     var dbo = db.db("mqttjs");
//     var query = { blocknumber: 2 };
//     dbo.collection("mqttjs").find(query).toArray(function(err, result) {
//     var resultstring = result.toString()
//     var resultobj = JSON.parse(resultstring);
//     queryresult == resultobj;
//     }); 
//     });
//     res.send('block 中',queryresult);
//     });

module.exports = router;
