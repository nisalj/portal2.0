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
let missionNo = 0;
let planNo = 0;  
let firstLatLong = true; 
let firstDetail = true; 
let firstAcc = true; 
let firstRot = true; 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('.'));


// fs.readdir('./missions', (err,files) => {
//     console.log(files);
// })

missionNo = fs.readdirSync('./missions').length; 
planNo = fs.readdirSync('./plans').length; 
console.log(missionNo, planNo);



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
      
app.post('/start', function(req,res) {
console.log(req.body);
missionNo = fs.readdirSync('./missions').length; 
fs.mkdir(`./missions/mission${missionNo}`, { recursive: true }, (err) => {
    if (err) throw err;
});
console.log("started. mission No ", missionNo);
//console.log("first connection!")
firstLatLong = true; 
firstDetail = true; 
firstAcc = true; 
firstRot = true; 
res.send("ack");

} ); 

app.post('/details', function(req, res) {
    console.log(req.body); 
    let obj = req.body; 
    res.end("received details");
    detailWrite(obj); 
})

let helper = function(arr) {
    

    let string = ''; 
    for (let i = 0; i < arr.length; i++) {
    if (i == arr.length-1) 
    string += `${arr[i]}\r\n`;
    else 
    string += `${arr[i]}, `;
    }  
    return string;  
 
}


function rotWrite(data) {

    if (firstRot) {
   
        fs.appendFileSync(`./missions/mission${missionNo}/rot.csv`, helper(Object.keys(data)), (err) => {
            if(err)
            console.log(err);
          //  console.log('done');
        });
        firstRot = false; 
    }
    
    
    fs.appendFile(`./missions/mission${missionNo}/rot.csv`, helper(Object.values(data)), (err) => {
        if(err)
        console.log(err);
      //  console.log('done');
    });   



}


function accWrite(data) {

    if (firstAcc) {
   
        fs.appendFileSync(`./missions/mission${missionNo}/acc.csv`, helper(Object.keys(data)), (err) => {
            if(err)
            console.log(err);
          //  console.log('done');
        });
        firstAcc = false; 
    }
    
    
    fs.appendFile(`./missions/mission${missionNo}/acc.csv`, helper(Object.values(data)), (err) => {
        if(err)
        console.log(err);
      //  console.log('done');
    });   



}


function latLongWrite(data) {

// fs.appendFile(`./mission${missionNo}/latlong.csv`, `${data.time}, ${data.lat}, ${data.long}\n`, (err) => {
//     if(err)
//     console.log('error');
//     console.log('done');
// });
if (firstLatLong) {
   
    fs.appendFileSync(`./missions/mission${missionNo}/latlong.csv`, helper(Object.keys(data)), (err) => {
        if(err)
        console.log(err);
      //  console.log('done');
    });
    firstLatLong = false; 
}


fs.appendFile(`./missions/mission${missionNo}/latlong.csv`, helper(Object.values(data)), (err) => {
    if(err)
    console.log(err);
  //  console.log('done');
});



 

// const ws = fs.createWriteStream(`./mission${missionNo}/latlong.csv`,{'flags': 'a'});
// fastcsv
// .write(object, { headers: false, includeEndRowDelimiter: true })
// .pipe(ws)

}




function detailWrite(data) {


if(firstDetail) {
fs.appendFileSync(`./missions/mission${missionNo}/details.csv`, helper(Object.keys(data)), (err) => {
        if(err)
        console.log('error');
        console.log('done');
}) 
firstDetail = false; 

}    

fs.appendFile(`./missions/mission${missionNo}/details.csv`, helper(Object.values(data)), (err) => {
        if(err)
        console.log('error');
        console.log('done');
});
    

// const ws = fs.createWriteStream(`./mission${missionNo}/details.csv`,{'flags': 'a'});
// fastcsv
// .write(object, { headers: false, includeEndRowDelimiter: true })
// .pipe(ws);
//ws.on('end', () => console.log('end'));
//ws.end();
}

function getPlan(reqNo, res) {
    const csvFilePath= `./plans/plan${reqNo}.csv`
    const csv = require('csvtojson')
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
        console.log("hello from getplan");
        console.log(jsonObj);
        res.send(JSON.stringify(jsonObj));
        /**
         * [
         * 	{a:"1", b:"2", c:"3"},
         * 	{a:"4", b:"5". c:"6"}
         * ]
         */ 
    })


}



function planWrite(object) {

const ws = fs.createWriteStream(`./plans/plan${planNo}.csv`,{'flags': 'a'});
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
    let arrObj = { time: new Date(), lat: lat, long: long};
    
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
    console.log(plan); 
    let string = JSON.stringify(plan); 
    let end = string.length - 4;
    let start = 1; 
    let mod = string.slice(start, end); 
    array = JSON.parse(JSON.parse(mod)); 
    console.log(array);
    planNo = fs.readdirSync('./plans').length; 
    console.log(plan);
    res.send(String(planNo));
    planWrite(array);

}); 

app.get('/plan', (req, res) => {
    let reqNo = req.query.planNo; 
    //console.log("requested plan", req.query.planNo)

    if(planNo => 1) {
    
        if (reqNo == "undefined" || reqNo == planNo || reqNo == "")
        getPlan(planNo, res);
        else if ( reqNo >= 1 && reqNo <= planNo) {
        getPlan(reqNo, res);
        } else {
        getPlan(planNo, res);
        }
    }
    else 
    res.send("{}");

});

app.get("/latlong.csv", (req,res) => {  
    fs.readFile(`./missions/mission${missionNo}/latlong.csv`, function read(err, data) {
      if (err) {
          res.send('{}');
          throw err;
      }
     
      res.setHeader('Content-disposition', 'attachment; filename=motion.csv');
      res.set('Content-Type', 'text/csv');
      res.status(200).send(data);
  });
   
 
  });



app.get("/acc.csv", (req,res) => {  
    fs.readFile(`./missions/mission${missionNo}/acc.csv`, function read(err, data) {
      if (err) {
          res.send('{}');
          throw err;
      }
      console.log(missionNo);
      res.setHeader('Content-disposition', 'attachment; filename=acc.csv');
      res.set('Content-Type', 'text/csv');
      res.status(200).send(data);
  });
   
  });

  app.get("/rot.csv", (req,res) => {  
    fs.readFile(`./missions/mission${missionNo}/rot.csv`, function read(err, data) {
      if (err) {
          res.send('{}');
          throw err;
      }
      console.log(missionNo);
      res.setHeader('Content-disposition', 'attachment; filename=rot.csv');
      res.set('Content-Type', 'text/csv');
      res.status(200).send(data);
  });
   
  });

 




app.get("/details.csv", (req,res) => {
  //  console.log(res.attachment(`./missions/mission${missionNo-2}/details.csv`)); 

  fs.readFile(`./missions/mission${missionNo}/details.csv`, function read(err, data) {
    if (err) {
        res.send('{}');
        throw err;
    }
   
    res.setHeader('Content-disposition', 'attachment; filename=details.csv');
    res.set('Content-Type', 'text/csv');
    res.status(200).send(data);

    // Invoke the next step here however you like
       // Put all of the code here (not the best solution)


  //  processFile();          // Or put the next step in a function and invoke it
});
 
  //  console.log(missionNo);
   // res.send("hello");
});

app.post('/acc', (req,res) => {
    let acc = {
        time: req.body.time, 
        accX: req.body.accX, 
        accY: req.body.accY,
        accZ: req.body.accZ,
    }
    let rot = {
        time: req.body.time, 
        rotA: req.body.rotA, 
        rotB: req.body.rotB,
        rotG: req.body.rotG,
    }
    accWrite(acc);
    rotWrite(rot); 
    //latMotionWrite(req.body);

    res.send("recieved motion");
});


app.post('/heading', (req,res) => {
  //  console.log(req.body); 

    io.sockets.emit('new heading', req.body);
    res.send('recieved heading'); 
});


