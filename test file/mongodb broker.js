// MQTT broker
var mosca = require('mosca')
var settings = {port: 1234}
var broker = new mosca.Server(settings)


// MongoDB
var mongo = require('mongodb')
var mongc = mongo.MongoClient
var url = "mongodb://localhost:27017/"

broker.on('ready', ()=>{
    console.log('Broker is ready!')
})


broker.on('published', (packet)=>{
    message = packet.payload.toString()//buffer to string
    
    if(message.slice(0,1)=="{"){
        var obj = JSON.parse(message)
        console.log(obj.from)
    }// string to object
     console.log(packet)
    console.log(message)
    if( message.slice(0,1)=='{' && message.slice(0,4) != 'mqtt'){
        mongc.connect(url, (error, client)=>{
            var myCol = client.db('mqttjs').collection('mqttjs')
            myCol.insertMany([
               {
                   from : obj.from,
                   to: obj.to,
                   value: obj.value,
                   blocknumber:obj.blocknumber
               }
            ]
            , ()=>{
                console.log('Data is saved to MongoDB')
                client.close()
            })
        })
    }
})
