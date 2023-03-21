// MQTT broker
var mosca = require('mosca')
var settings = {port: 1234}
var broker = new mosca.Server(settings)





// MySQL 
var mysql = require('mysql')
var db = mysql.createConnection({
    host: 'localhost',
    user: 'johnny',
    password: '12345',
    database: 'mqttjs',
    useConnectionPooling: true,
    insecureAuth : true
})

db.connect(function(err){
    console.log('Database connected!')
    console.log(err.code);
    console.log(err.fatal);
})
broker.on('ready', ()=>{
    console.log('Broker is ready!')
})


broker.on('published', (packet)=>{
    message = packet.payload.toString()
    console.log(message)

    if(message.slice(0,1) != '{' && message.slice(0,4) != 'mqtt'){
        var dbStat = 'insert into mqttjs set ?'//寫入db的指令
        var data = {
            message: message
        }//寫入的資料
        db.query(dbStat, data, (error, output)=>{
            if(error){
                console.log(error)
            } else {
                console.log(output)
                console.log('Data saved to database!')
            }
        })
    }
    db.end();
})


