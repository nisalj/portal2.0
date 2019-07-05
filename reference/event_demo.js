const EventEmitter = require('events');

//create emitter 
class MyEmitter extends EventEmitter{};

//Init object
const myemitter = new MyEmitter(); 

//create listner 
myemitter.on('event', () => console.log('event fired'));

//Init event 
myemitter.emit('event');
myemitter.emit('event');
myemitter.emit('event');
myemitter.emit('event');