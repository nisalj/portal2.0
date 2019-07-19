const https = require('https'); 
let io = require('socket.io');
const path = require('path');
const ui = require('nouislider');
const fs  = require('fs'); 
const express = require('express'); 
var bodyParser = require('body-parser');
let fastcsv = require('fast-csv'); 
const app = express(); 
let plan; 
var lat; 
var long; 
let missionNo = 1; 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('.'));

fs.mkdir(`./mission${missionNo}`, { recursive: true }, (err) => {
    if (err) throw err;
});







let latlonghead = [{Time: "Time", Latitude: "Latitude", Longitude: "Longitude"}];
const ws = fs.createWriteStream(`./mission${missionNo}/latlong.csv`,{'flags': 'a'});
fastcsv
.write(latlonghead, { headers: false, includeEndRowDelimiter: true})
.pipe(ws);



 
const options = {
    key: fs.readFileSync('/Users/Nisal/server.key'),
    cert: fs.readFileSync('/Users/Nisal/server.crt')
  };






const server = https.createServer( options, app);
const PORT = process.env.PORT || 5000; 

server.listen(PORT, () => console.log("Server running on port " + PORT)); 

io = io.listen(server); 

io.sockets.on('connection', socket => {
    console.log('connected'); 
    
    socket.on('disconnect', () => {
        console.log('disconnected'); 
    }); 
    
    
}); 
      
app.post('/test', function(req,res) {
console.log(req.body);
} ); 

app.post('/details', function(req, res) {
    console.log(req.body); 
    let obj = [req.body]; 
    res.end("received details");
    infoWrite(obj); 
})


function latLongWrite(object) {
const ws = fs.createWriteStream(`./mission${missionNo}/latlong.csv`,{'flags': 'a'});
fastcsv
.write(object, { headers: false, includeEndRowDelimiter: true })
.pipe(ws);
//.on('end', () => {console.log('done')});

}


function infoWrite(object) {
const ws = fs.createWriteStream(`./mission${missionNo}/details.csv`,{'flags': 'a'});
fastcsv
.write(object, { headers: false, includeEndRowDelimiter: true })
.pipe(ws) ;
}

function planWrite(object) {
const ws = fs.createWriteStream(`./mission${missionNo}/plan.csv`,{'flags': 'a'});
fastcsv
.write(object, { headers: true, includeEndRowDelimiter: true })
.pipe(ws) ;
}

app.post('/loc',function(req,res){
    lat  =req.body.lat;
    long =req.body.long;
    console.log("lat = " +lat+ ", long = " +long);
    res.end("yes");
    let posObject = {lat: lat, long: long}; 
    let arrObj = [{ time: +new Date(), lat: lat, long: long}];
    
    latLongWrite(arrObj); 

   
    
     //ws.end();

    io.sockets.emit('new location', {lat: lat, long: long})
    req.on("close", function() {
        console.log("post ended close");
        // lat = undefined;
        // long = undefined; 
    });
      
      req.on("end", function() {
        console.log("post ended end");

        // lat = undefined;
        // long = undefined;     
    });
  });




  

app.get('/loc', function (req, res) {
    if (lat != undefined && long != undefined)
    res.send(lat+ " " + long);
    else 
    res.send("Not ready");
    req.on("close", function() {
        console.log("get ended close");

        // lat = undefined;
        // long = undefined;     
    });
      
    req.on("end", function() {
        console.log("get ended end");

        // lat = undefined;
        // long = undefined;     
    });
});


app.post('/plan', (req, res) => {
    console.log(req.body);
   // var text = String(req.body);
    //console.log(JSON.stringify(req.body));
    plan = req.body; 

    let string = JSON.stringify(plan); 
    let end = string.length - 4;
    let start = 1; 
    let mod = string.slice(start, end); 
    array = JSON.parse(JSON.parse(mod)); 
    console.log(array);
    planWrite(array);
    res.end("Plan received")
}); 

app.get('/plan', (req, res) => {
    if(plan)
    res.send(plan);
    else 
    res.send("{}");

});


app.post('/heading', (req,res) => {
    console.log(req.body); 

    io.sockets.emit('new heading', req.body);
    res.send('recieved heading'); 
});


