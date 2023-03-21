// MQTT publisher
var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://localhost:1234')
var topic = 'LINTANGtest123'
var message = 'Hello World!'
let num = 0
client.on('connect', ()=>{
    setInterval(()=>{
        client.publish(topic, message + (++num))
        console.log('Message sent!', message+ (++num))
    }, 2000)
})