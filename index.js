const http = require('http'); 
const path = require('path');
const fs  = require('fs'); 
const express = require('express'); 
var bodyParser = require('body-parser');
const app = express(); 
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

app.post('/loc',function(req,res){
    lat  =req.body.lat;
    long =req.body.long;
    console.log("lat = " +lat+ ", long = " +long);
    res.end("yes");
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
})
  
server.listen(PORT, () => console.log("Server running on port " + PORT)); 