let events=require('events');
let emitter=new events.EventEmitter();

var owen={
  name: 'owen',
  age: 30,
}
emitter.on('event',(a,b)=>{
  console.log('something happened',a,b);
 
})

emitter.emit('event',owen,89)



