const https = require('https'); 
let io = require('socket.io');
const path = require('path');
const ui = require('nouislider');
const fs  = require('fs'); 
const express = require('express'); 
var bodyParser = require('body-parser');
const GPS = require('gps-module');

let fastcsv = require('fast-csv'); 
const app = express(); 
let plan; 
var lat; 
var long; 
var uncert; 
var speed; 
let missionNo = 0;
let planNo = 0;  
let firstLatLong = true; 
let firstDetail = true; 
let firstAcc = true; 
let firstRot = true; 
let firstBearing = true; 
let firstPID = true; 
let loadedPlan; 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.raw({type: 'application/octet-stream', limit : '2mb'}));
app.use(express.static('.'));

 



//io.set("transports", ["xhr-polling","websocket","polling", "htmlfile"]);

// fs.readdir('./missions', (err,files) => {
//     console.log(files);
// })

if (!fs.existsSync('./configs')) {
  fs.mkdir(`./configs`, { recursive: true }, (err) => {
    if (err) throw err;
  });
  // Do something
}

if (!fs.existsSync('./missions')) {
  console.log('making');
  fs.mkdir(`./missions`, { recursive: true }, (err) => {
    if (err) throw err;
  });
  // Do something
}

if (!fs.existsSync('./plans')) {
  fs.mkdir(`./plans`, { recursive: true }, (err) => {
    if (err) throw err;
  });
  // Do something
}




missionNo = fs.readdirSync('./missions').length - 1; 
if (missionNo < 0)
missionNo = 0; 
planNo = fs.readdirSync('./plans').length - 1; 
console.log(missionNo, planNo);



const options = {
  key: fs.readFileSync('/home/nisal/server.key'),
  cert: fs.readFileSync('/home/nisal/server.crt')
};






const server = https.createServer(options,  app);
const PORT = process.env.PORT || 5000; 

server.listen(PORT, () => console.log("Server running on port " + PORT)); 

io = io.listen(server, {pingTimeout: 70000, pingInterval: 10000, rejectUnauthorized: false, upgradeTimeout:30000,   'force new connection': true
} ); 
//io.set( {rememberTransport : false, transports: ["xhr-polling","WebSocket","polling", "Flash Socket", "htmlfile"]});



io.sockets.on('connection', socket => {
    console.log('connected'); 
    
    socket.on('disconnect', () => {
        console.log('disconnected'); 
    }); 
    
    
}); 


io.sockets.on('error', err => {
  console.log('error', err);
});
      
app.post('/start', function(req,res) {

console.log(req.body);
missionNo = fs.readdirSync('./missions').length; 

let writeDir = `./missions/mission${missionNo}/`; 
fs.mkdir(writeDir, { recursive: true }, (err) => {
    if (err) throw err;
    console.log(writeDir);
});

if(loadedPlan != undefined) {
fs.copyFile(`./plans/${loadedPlan}.csv`, `${writeDir}/plan-${loadedPlan}.csv`, (err) => {
    if (err) throw err;
});

fs.copyFile(`./configs/${loadedPlan}.json`, `${writeDir}/settings-${loadedPlan}.json`, (err) => {
  if (err) throw err;
});
  
}


// fs.copyFile(`./configs/${loadedPlan}.json`, writeDir, (err) => {
//   if (err) throw err;
// });








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

function logPID(data) {

  if (firstPID) {
   
    fs.appendFileSync(`./missions/mission${missionNo}/pid.csv`, helper(Object.keys(data)), (err) => {
        if(err)
        console.log(err);
      //  console.log('done');
    });
    firstPID = false; 
}


fs.appendFile(`./missions/mission${missionNo}/pid.csv`, helper(Object.values(data)), (err) => {
    if(err)
    console.log(err);
  //  console.log('done');
});   



}


function logBearing(data) {
  console.log("logging"); 
  console.log(missionNo); 

  if (firstBearing) {
   
    fs.appendFileSync(`./missions/mission${missionNo}/bearing.csv`, helper(Object.keys(data)), (err) => {
        if(err)
        console.log(err);
      //  console.log('done');
    });
    firstBearing = false; 
}


fs.appendFile(`./missions/mission${missionNo}/bearing.csv`, helper(Object.values(data)), (err) => {
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




function getPlan(planName, res) {
    //console.log("reqNo", reqNo);
    const csvFilePath= `./plans/${planName}.csv`
    //check if file exists here 
    loadedPlan = planName;
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



function planWrite(object, name) {



const ws = fs.createWriteStream(`./plans/${name}.csv`,);
fastcsv
.write(object, { headers: true, includeEndRowDelimiter: true })
.pipe(ws) ;
}

app.post('/loc',function(req,res){
    lat  =req.body.lat;
    long =req.body.long;
    uncert = req.body.uncert;
    speed = req.body.speed; 
    console.log("lat = " +lat+ ", long = " +long);
    res.end("yes");
    let posObject = {lat: lat, long: long, uncert: uncert, speed: speed}; 
    let arrObj = { time: new Date(), lat: lat, long: long, uncert: uncert, speed: speed };
    
    latLongWrite(arrObj); 
   

     //ws.end();

    io.sockets.emit('new location', {lat: lat, long: long, uncert: uncert, speed: speed })
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
   // console.log(plan); 
    let string = JSON.stringify(plan); 
    let end = string.length - 4;
    let start = 1; 
    let mod = string.slice(start, end); 
    array = JSON.parse(JSON.parse(mod)); 
    let planName = array.pop();
    console.log(planName);
    console.log(array);
    planNo = fs.readdirSync('./plans').length; 
    res.send(String(planNo));
    planWrite(array,planName);

}); 

app.get('/plan', (req, res) => {
    let planName = req.query.planName; 
    //console.log("requested plan", req.query.planNo)

    if(planNo => 1) {
        getPlan(planName, res);


        // if (reqNo == undefined || reqNo == planNo || reqNo == "" || reqNo == null)
        // getPlan(planNo, res);
        // else if ( reqNo >= 1 && reqNo <= planNo) {
        // getPlan(reqNo, res);
        // } else {
        // getPlan(planNo, res);
        // }
    }
    else 
    res.send("{}");

});


app.post("/conf", (req,res) => {
  let planName = req.body.name; 
  fs.writeFile(`./configs/${planName}.json`, JSON.stringify(req.body) , (err) => {
    if(err)
    throw err; 

    console.log("Written config file"); 
  }); 
  res.send("Config recieved"); 

});


app.get("/conf", (req,res) => {
  let planName = req.query.planName; 
  data = require(`./configs/${planName}.json`);
//   fs.readFile(`./configs/${planName}.json`, function read(err, data) {
//     if (err) {
//         res.send('{}');
//         throw err;
//     }
//     res.header('Content-Type', 'application/json');
//     console.log(JSON.stringify(data));
//     res.status(200).send(JSON.stringify(data));
// });

res.header('Content-Type', 'application/json');
console.log(JSON.stringify(data));
res.status(200).send(JSON.stringify(data));


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

//app.use(bodyParser.raw({type: 'application/octet-stream', limit : '2mb'}));
let i = 0;


app.post('/pid', (req, res) => {
  console.log("PID"); 
  logPID(req.body); 
  res.send("rp"); 
})


app.post('/bearing', (req, res) => {
 let buf = req.body; 
 let heading  = buf.readInt16LE(0); 
 let target = buf. readInt16LE(2); 
 let correction =  buf.readInt16LE(4); 
 let obj = {
   time: Date.now(), 
   heading: heading, 
   target: target,
   correction: correction, 
 }
 logBearing(obj); 
 res.send("rh"); 

}); 



app.post('/acc', (req,res) => {
//    var buffer = Buffer.from( new Uint8Array(req.body) );
    let buf = req.body; 
    i++;
    const copiedBuf = Uint8Array.prototype.slice.call(req.body, 0, 2);
    //console.log(copiedBuf);
    io.binary(true).emit('new-acc', buf);
    console.log('emitting', i);
    // console.log(buf.readInt16LE(0)/100, buf.readInt16LE(2)/100, buf.readInt16LE(4)/100, 
    // buf.readInt16LE(6), buf.readInt16LE(8), buf.readInt16LE(10));
    //console.log(req.body[0]);
    // let acc = {
    //     time: req.body.time, 
    //     accX: req.body.accX, 
    //     accY: req.body.accY,
    //     accZ: req.body.accZ,
    // }
    // let rot = {
    //     time: req.body.time, 
    //     rotA: req.body.rotA, 
    //     rotB: req.body.rotB,
    //     rotG: req.body.rotG,
    // }
    // accWrite(acc);
    // rotWrite(rot); 
    // io.sockets.emit('new acc', acc);
    // io.sockets.emit('new rot', rot);

    //latMotionWrite(req.body);

    res.send("recieved motion");
});


app.post('/heading', (req,res) => {
  //  console.log(req.body); 

    io.sockets.emit('new heading', req.body);
    res.send('recieved heading'); 
});


app.get('/connection', (req, res) => {
    res.send("connected");
}); 


