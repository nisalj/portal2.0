import Viewer from './viewer.js';
import Sharer from './sharer.js';
import Operator from './operator.js'
import Path from './path.js';

window.user; 
let robotpath;
let options; 
let socket; 
let test1; 
let lineSymbol; 
let ros; 
let user; 
let plan; 
let map; 
let homeButton;
let missionHome; 
window.operator; 
window.operatorClass = Operator; 
let g1; 
let acc  = [];
let updated = false; 
let started = false;
let pMag;
let iMag;
let dMag;
let pSpeed; 
let iSpeed; 
let dSpeed; 

function initMap() {

   lineSymbol = {
    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    scale: 5,

  };

  ros = new ROSLIB.Ros({
    url : 'wss://localhost:9090',
  });

  ros.on('connection', function() {
    console.log('Connected to websocket server.');
  });

  ros.on('error', function(error) {
    console.log('Error connecting to websocket server: ', error);
   // alert('error');
  });

  ros.on('close', function() {
    console.log('Connection to websocket server closed.');
  });
  map = new google.maps.Map(document.getElementById('map'), 
  {
    center: {lat:-33.814451, lng:151.171332},
    zoom: 14,
    fullscreenControl: false,
    gestureHandling: 'greedy',
  }),
    

    robotpath = new google.maps.Polyline({
      path: new google.maps.MVCArray([
      ]),
      icons: [{
        icon: lineSymbol,
        offset: '100%',
        fixedRotation: true
      }],
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2,
      map: map
    });


    
    options = {
      enableHighAccuracy: true,
      timeout: Infinity,
      maximumAge: 0 
    }; 
 

}


function initGraph() {

  let toggle = document.getElementById("toggle-graph");
  //let clear = document.getElementById("clear-graph");



    g1 = new Dygraph(
        document.getElementById("graph_1"),
        `${new Date()}, 0,0,0,0,0,0\n`, // path to CSV file
        {
            drawPoints: false,
            showRoller: false,
            rollPeriod: 0,
            axes: {
              x : {
                drawAxis: true, 
                drawGrid: false
              },
              y : {
                drawGrid: false,
                valueRange: [-20,20]
              
              },
            },
            labelsDiv: document.getElementById("graph-legend"),
            axisLineColor: "white",
            legend: 'always',
            labels: ['Time', 'AccX (m/s)','AccY (m/s)', 'AccZ (m/s)', 'rotA (rad/s)', 'rotB (rad/s)', 'rotG (rad/s)'],
            labelsSeparateLines: true,
            visibility: [false, false, false, false, false, false],
            dateWindow: [Date.now(), Date.now() + 30000]
        }          // options
      );

      document.getElementById('accX').addEventListener('click', toggleAccX); 
      document.getElementById('accY').addEventListener('click', toggleAccY); 
      document.getElementById('accZ').addEventListener('click', toggleAccZ);
      document.getElementById('rotA').addEventListener('click', toggleRotA); 
      document.getElementById('rotB').addEventListener('click', toggleRotB); 
      document.getElementById('rotG').addEventListener('click', toggleRotG); 
    




    // clear.addEventListener("click" , () => {
    //   //console.log("clear");
    //   document.getElementById('play-icon').className = "fa fa-play"
    //   started = false; 
    //   acc = []; 
    //   acc.push([new Date(), 0, 0, 0, 0,0,0]); 
    //   g1.updateOptions({'file': acc }); 
    //   socket.off('new-acc');


    // }); 


 toggle.addEventListener( "click", () => {
    if (!started) {
    
      document.getElementById('play-icon').className = "fa fa-pause"
      socket.on('new-acc', (data) => {
        g1.updateOptions({dateWindow: [Date.now() - 6000, Date.now()]}); 
        let arr = new Int16Array(data);
        //console.log('new data');
         // arr[0] = arr[0]/100;
         // arr[1] = arr[1]/100;
         // arr[2] = arr[2]/100;
        //console.log(arr);
       if(!updated) {
        //console.log('update');
        updated = true; 
        if(acc.length == 400) {
          acc.splice(0,150);
          //acc = []; 
          //g1.updateOptions({dateWindow: [Date.now(), Date.now() + 6000]}); 

        }
        let d = new Date(); 

        acc.push([d, arr[0]/100, arr[1]/100, arr[2]/100, arr[3]*Math.PI/180, arr[4]*Math.PI/180, arr[5]*Math.PI/180]);
       // console.log(row);
        g1.updateOptions({'file': acc }  
        //{dateWindow: [0, Date.now()]} 
        ); 
        updated = false; 
       }
       
  
        //console.log("new acc");
  
      }); 
      started = true; 
    } else {
      document.getElementById('play-icon').className = "fa fa-play"
      started = false; 
      socket.off('new-acc');
    }

  });



}

function initPID () {
pMag = document.getElementById('p-mag');
iMag = document.getElementById('i-mag');
dMag = document.getElementById('d-mag');
pSpeed = document.getElementById('p-speed'); 
iSpeed = document.getElementById('i-speed'); 
dSpeed = document.getElementById('d-speed'); 

noUiSlider.create(pMag, {

  start: 2,
  connect: [true, false],
  range: {
      'min': 0,
      'max': 100
  },
  step: 0.1, 
  tooltips: false,

});

noUiSlider.create(iMag, {

  start: 2,
  connect: [true, false],
  range: {
      'min': 0,
      'max': 100
  },
  step: 0.1, 
  tooltips: false,

});

noUiSlider.create(dMag, {

  start: 2,
  connect: [true, false],
  range: {
      'min': 0,
      'max': 100
  },
  step: 0.1, 
  tooltips: false,

});

noUiSlider.create(pSpeed, {

  start: 2,
  connect: [true, false],
  range: {
      'min': 0,
      'max': 100
  },
  step: 0.1, 
  tooltips: false,

});

noUiSlider.create(iSpeed, {

  start: 2,
  connect: [true, false],
  range: {
      'min': 0,
      'max': 100
  },
  step: 0.1, 
  tooltips: false,

});

noUiSlider.create(dSpeed, {

  start: 2,
  connect: [true, false],
  range: {
      'min': 0,
      'max': 100
  },
  step: 0.1, 
  tooltips: false,

});






}




function toggleAccX() {
var checkBox = document.getElementById("accX");
  if (checkBox.checked == true){
    g1.setVisibility(0, true);
  } else {
    g1.setVisibility(0, false);
  }
}

function toggleAccY() {

  var checkBox = document.getElementById("accY");
  if (checkBox.checked == true){
    g1.setVisibility(1, true);
  } else {
    g1.setVisibility(1, false);
  }
}

function toggleAccZ() {

  var checkBox = document.getElementById("accZ");
  if (checkBox.checked == true){
    g1.setVisibility(2, true);
  } else {
    g1.setVisibility(2, false);
  }
}
function toggleRotA () {
  console.log(this);
  console.log('tog');
  var checkBox = document.getElementById("rotA");
  if (checkBox.checked == true){
    g1.setVisibility(3, true);
  } else {
    g1.setVisibility(3, false);
  }
}
function toggleRotB () {
  var checkBox = document.getElementById("rotB");
  if (checkBox.checked == true){
    g1.setVisibility(4, true);
  } else {
    g1.setVisibility(4, false);
  }
}
function toggleRotG () {
  var checkBox = document.getElementById("rotG");
  if (checkBox.checked == true){
    g1.setVisibility(5, true);
  } else {
    g1.setVisibility(5, false);
  }
}






function shareClick() {

console.log('clicked share');
// let element = document.getElementById("view");
// element.parentNode.removeChild(element);
// element = document.getElementById("share");
// element.style.display = "none";
//element.parentNode.removeChild(element);
//element = document.getElementById("planselect");
//element.style.display = "none";

//element.parentElement.removeChild(element);
toggleSideBar();
user = new Sharer(options, robotpath, plan);
console.log(user); 
user.start(); 
//window.operator.start();


}

function viewClick() {
console.log('clicked view');

// let element = document.getElementById("view");
// element.parentNode.removeChild(element);
// element = document.getElementById("share");
// element.parentNode.removeChild(element);

//  element = document.getElementById("planselect");
//  element.style.display = "none";
// element.parentElement.removeChild(element);
toggleSideBar();

//window.user = new Viewer(robotpath, socket);
user = new Operator(robotpath, socket, ros, plan);
user.start();
//window.user.start();
}

function loadPlan() {
let planInput = document.getElementById("planNoBox").value
if(!planInput || planInput == "")
return; 
if(!plan) {
  plan = new Path(); 
  plan.makePath(map, planInput);
} else {
  plan.clear(map); 
  plan.makePath(map, planInput);
}

$('#plan-modal').modal('hide')
homeButton.disabled = false; 
setTimeout(zoomToWayPoint,500);


}

function zoomToWayPoint() {
  let position = plan.getFirst().getStart().position; 
  map.panTo(position);
  map.setZoom(14);

}


function zoomToLocation() {
  user.zoomToLoc();

}

function toggleSideBar() {
  let button = document.getElementById('side-buttons'); 
  if (button.style.display == "none") {
    button.style.display = "block"
  } else {
    button.style.display = "none";
  }
}


function toggleTopBar() {
  let button = document.getElementById('top-buttons'); 
  if (button.style.display == "none") {
    button.style.display = "block"
  } else {
    button.style.display = "none";
  }
}







window.onload = function() {
  socket = io.connect("https://localhost:5000", {secure:true, rejectUnauthorized: false}); 
  socket.on('connection', () => {
    console.log("connected to server socket"); 
  });
  socket.on('error', err => {
    console.log('error', err);
  });
        
  initMap(); 
  initGraph();
  initPID();
  
  document.getElementById('share').addEventListener('click', shareClick);
  document.getElementById('view').addEventListener('click', viewClick);
  document.getElementById('plan-load-button').addEventListener('click', loadPlan);
  homeButton = document.getElementById('home-button');
  homeButton.addEventListener('click', zoomToWayPoint); 
  missionHome = document.getElementById('home-mission');
  missionHome.addEventListener('click', zoomToLocation);






  //getLocation();
}

