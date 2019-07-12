const http = require('http'); 
let io = require('socket.io');
const path = require('path');
const ui = require('nouislider');
const fs  = require('fs'); 
const express = require('express'); 
var bodyParser = require('body-parser');
const app = express(); 
let plan; 
var lat; 
var long; 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('.'))


// const options = {
//     key: fs.readFileSync('/Users/Nisal/server.key'),
//     cert: fs.readFileSync('/Users/Nisal/server.crt')
//   };



const server = http.createServer(app);
const PORT = process.env.PORT || 5000; 
server.listen(PORT, () => console.log("Server running on port " + PORT)); 
io = io.listen(server); 

io.sockets.on('connection', socket => {
    console.log('connected'); 
    
    socket.on('disconnect', () => {
        console.log('disconnected'); 
    }); 
    
    
}); 
      


app.post('/loc',function(req,res){
    lat  =req.body.lat;
    long =req.body.long;
    console.log("lat = " +lat+ ", long = " +long);
    res.end("yes");
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
    console.log(JSON.stringify(req.body));
    plan = req.body; 
    res.end("Plan received")
}); 

app.get('/plan', (req, res) => {
    if(plan)
    res.send(plan);
    else 
    res.send("{}");

});


