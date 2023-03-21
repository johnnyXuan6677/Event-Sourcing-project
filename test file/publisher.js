// MQTT publisher
var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://localhost:1234')
var topic = 'LINTANGtest123'
// var message ={
//     name:'johnnyowen',
//     value: 33
// }
var message ="hello and goodbye"
client.on('connect', ()=>{
    setInterval(()=>{
        client.publish(topic, JSON.stringify(message) )
        console.log('Message sent!',message )
    }, 2000)
})