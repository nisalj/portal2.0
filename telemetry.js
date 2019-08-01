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
let pMagSlider;
let iMagSlider;
let dMagSlider;
let pSpeedSlider; 
let iSpeedSlider; 
let dSpeedSlider; 
let button_; 
let zoomOn = false; 
let pidOn = true;
let graphOn = true; 

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
  let hide = document.getElementById("stats-robot");
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
            zoomCallback: zoomingGraph, 
            labelsDiv: document.getElementById("graph-legend"),
            axisLineColor: "white",
            legend: 'always',
            labels: ['Time', 'AccX (m/s)','AccY (m/s)', 'AccZ (m/s)', 'rotA (rad/s)', 'rotB (rad/s)', 'rotG (rad/s)'],
            labelsSeparateLines: true,
            visibility: [false, false, false, false, false, false],
            dateWindow: [Date.now(), Date.now() + 30000],
            // plugins : [
            //   Dygraph.Plugins.Unzoom
            // ]
         
        }          // options
      );
      console.log('creating graph');

     let g = g1;

     button_ = document.createElement('button');
     button_.innerHTML = '<i class="fa fa-search-minus" aria-hidden="true"></i>';
    button_.style.display = 'none';
    button_.classList.add('btn');
    button_.classList.add('btn-sm');

    button_.classList.add('btn-secondary');
     button_.style.position = 'absolute';
    var area = g.plotter_.area;
    button_.style.top = (area.y + 4) + 'px';
    button_.style.left = (area.x + 4) + 'px';
    button_.style.zIndex = 11;
    var parent = g.graphDiv;
    parent.insertBefore(button_, parent.firstChild);
    button_.style.display = "none";
    button_.addEventListener('click', () => {
      g1.resetZoom();
      g1.updateOptions ( {
        axes: {
          y: {
            valueRange: [-20,20],
          }
        }
      });
      button_.style.display = "none";
      zoomOn = false; 
    });


    g1.addAndTrackEvent(parent, 'mouseover', function() {
      if (zoomOn) {
        button_.style.display = "";      
      }
     
    });

    g1.addAndTrackEvent(parent, 'mouseout', function() {
      button_.style.display = "none";      
    });
  



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


 hide.addEventListener("click", () => {
   let graph = document.getElementById('graph-area');

  if (graph.style.display == "none" || graph.style.display == "") {
    graph.style.display = "block";
    hide.classList.remove("btn-primary");
    hide.classList.add("btn-success");

    //playGraph();
  } else {
    pauseGraph();
    graph.style.display = "none";
    hide.classList.remove("btn-success");
    hide.classList.add("btn-primary");


  }


 });    


 toggle.addEventListener( "click", () => {
    if (!started) {
      playGraph();
    
      // document.getElementById('play-icon').className = "fa fa-pause"
      // socket.on('new-acc', (data) => {
      //   g1.updateOptions({dateWindow: [Date.now() - 6000, Date.now()]}); 
      //   let arr = new Int16Array(data);
      //   //console.log('new data');
      //    // arr[0] = arr[0]/100;
      //    // arr[1] = arr[1]/100;
      //    // arr[2] = arr[2]/100;
      //   //console.log(arr);
      //  if(!updated) {
      //   //console.log('update');
      //   updated = true; 
      //   if(acc.length == 400) {
      //     acc.splice(0,150);
      //     //acc = []; 
      //     //g1.updateOptions({dateWindow: [Date.now(), Date.now() + 6000]}); 

      //   }
      //   let d = new Date(); 

      //   acc.push([d, arr[0]/100, arr[1]/100, arr[2]/100, arr[3]*Math.PI/180, arr[4]*Math.PI/180, arr[5]*Math.PI/180]);
      //  // console.log(row);
      //   g1.updateOptions({'file': acc }  
      //   //{dateWindow: [0, Date.now()]} 
      //   ); 
      //   updated = false; 
      //  }
       
  
      //   //console.log("new acc");
  
      // }); 
      // started = true; 
    } else {
      pauseGraph();

    }

  });



}

function initPID () {
pMagSlider = document.getElementById('p-mag');
iMagSlider = document.getElementById('i-mag');
dMagSlider = document.getElementById('d-mag');
pSpeedSlider = document.getElementById('p-speed'); 
iSpeedSlider = document.getElementById('i-speed'); 
dSpeedSlider = document.getElementById('d-speed'); 
pMag = document.getElementById('p-mag-text');
iMag = document.getElementById('i-mag-text');
dMag = document.getElementById('d-mag-text');
pSpeed = document.getElementById('p-speed-text');
iSpeed = document.getElementById('i-speed-text');
dSpeed = document.getElementById('d-speed-text');
let pidHide = document.getElementById('pid-robot');




noUiSlider.create(pMagSlider, {

  start: 2,
  connect: [true, false],
  range: {
      'min': 0,
      'max': 100
  },
  step: 1, 
  tooltips: false,

});



noUiSlider.create(iMagSlider, {

  start: 2,
  connect: [true, false],
  range: {
      'min': 0,
      'max': 100
  },
  step: 1, 
  tooltips: false,

});

noUiSlider.create(dMagSlider, {

  start: 2,
  connect: [true, false],
  range: {
      'min': 0,
      'max': 100
  },
  step: 1, 
  tooltips: false,

});

noUiSlider.create(pSpeedSlider, {

  start: 2,
  connect: [true, false],
  range: {
      'min': 0,
      'max': 100
  },
  step: 1, 
  tooltips: false,

});

noUiSlider.create(iSpeedSlider, {

  start: 2,
  connect: [true, false],
  range: {
      'min': 0,
      'max': 100
  },
  step: 1, 
  tooltips: false,

});

noUiSlider.create(dSpeedSlider, {

  start: 2,
  connect: [true, false],
  range: {
      'min': 0,
      'max': 100
  },
  step: 1, 
  tooltips: false,

});


pMagSlider.noUiSlider.on('update', (value) => {
  pMag.value = parseInt(value); 
  });
  
  iMagSlider.noUiSlider.on('update', (value) => {
  iMag.value = parseInt(value); 
  });
  
  dMagSlider.noUiSlider.on('update', (value) => {
  dMag.value = parseInt(value); 
  });
   
  pSpeedSlider.noUiSlider.on('update', (value) => {
  pSpeed.value = parseInt(value); 
  });
  
   
  iSpeedSlider.noUiSlider.on('update', (value) => {
  iSpeed.value = parseInt(value); 
  });
  
   
  dSpeedSlider.noUiSlider.on('update', (value) => {
  dSpeed.value = parseInt(value); 
  });
 
  pMag.addEventListener("blur", () => {
    let val = pMag.value;
    if (val >= 0 && val <= 100) {
      pMagSlider.noUiSlider.set(val);
    }
      
  }); 

  iMag.addEventListener("blur", () => {
    let val = iMag.value;
    if (val >= 0 && val <= 100) {
      iMagSlider.noUiSlider.set(val);
    }
      
  }); 

  dMag.addEventListener("blur", () => {
    let val = dMag.value;
    if (val >= 0 && val <= 100) {
      dMagSlider.noUiSlider.set(val);
    }
      
  }); 

  pSpeed.addEventListener("blur", () => {
    let val = pSpeed.value;
    if (val >= 0 && val <= 100) {
      pSpeedSlider.noUiSlider.set(val);
    }
  });

  iSpeed.addEventListener("blur", () => {
    let val = iSpeed.value;
    if (val >= 0 && val <= 100) {
      iSpeedSlider.noUiSlider.set(val);
    }
  });

  dSpeed.addEventListener("blur", () => {
    let val = dSpeed.value;
    if (val >= 0 && val <= 100) {
      dSpeedSlider.noUiSlider.set(val);
    }
  });

  pidHide.addEventListener('click', () => {
    console.log('clicked');
    let area = document.getElementById('pid-area');
    if(area.style.display == "none" || area.style.display == "") {
      area.style.display = "block";  
      pidHide.classList.remove("btn-primary");
      pidHide.classList.add("btn-success");
    } else {
      area.style.display = "none"; 
      pidHide.classList.remove("btn-success");
      pidHide.classList.add("btn-primary");

    }
  });







}


function zoomingGraph(minDate, maxDate, yRange) {
  g1.updateOptions ( {
    axes: {
      y: {
        valueRange: null,
      }
    }
  });
  button_.style.display = "";
  zoomOn = true; 

}; 

function playGraph() {
     
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
    if(acc.length == 600) {
      acc.splice(0,100);
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
}


function pauseGraph() {
  document.getElementById('play-icon').className = "fa fa-play"
  started = false; 
  socket.off('new-acc');
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


function initChart() {
  var ctx = document.getElementById('chart-canvas').getContext('2d');
  var myDoughnutChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
          data: [10, 10, 10,10],
          backgroundColor: [
            getColor(0),
            getColor(0),
            getColor(0),
            getColor(0),
          ],
          hoverBackgroundColor: [
            getColor(0,1),
            getColor(0,1),
            getColor(0,1),
            getColor(0,1),
          ],
        }, {
        data: [10, 10, 10,10],
        backgroundColor: [
           getColor(0.5),
           getColor(0.5),
           getColor(0.5),
           getColor(0.5),
        ],

        hoverBackgroundColor: [
          getColor(0.5,1),
          getColor(0.5,1),
          getColor(0.5,1),
          getColor(0.5,1),
        ]
      },
      {
        data: [10, 10, 10,10],
        backgroundColor: [
          getColor(0.75),
          getColor(0.75),
          getColor(0.75),
          getColor(0.75),
        ],
        hoverBackgroundColor: [
          getColor(0.75,1),
          getColor(0.75,1),
          getColor(0.75,1),
          getColor(0.75,1),
        ]
      },
      {
        data: [10, 10, 10,10],
        backgroundColor: [
          getColor(1),
          getColor(1),
          getColor(1),
          getColor(1),
        ],

        hoverBackgroundColor: [
          getColor(1,1),
          getColor(1,1),
          getColor(1,1),
          getColor(1,1),
        ]
      }
      ],


  
      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: [
          'Right',
          'Back',
          'Left',
          'Front',
      ],

  
  },

  options: {
    rotation: -0.25*Math.PI,
    legend: {
      display: false,
    },

    backgroundColor: "#F5DEB3",
  },
});

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
toggleCompass(true);
toggleTopBar(true);
toggleChart(true);
//window.user = new Viewer(robotpath, socket);
user = new Operator(robotpath, socket, ros, plan);
user.start();
//toggleTopBar(true);
//toggleCompass(true);
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
  map.setZoom(17);

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


function toggleTopBar(enabled) {
  // let button = document.getElementById('top-buttons'); 
  // if (button.style.display == "none") {
  //   button.style.display = "block"
  // } else {
  //   button.style.display = "none";
  // }
  console.log('turning on');
  document.getElementById('top-background').style.display = enabled ? "block" : 'none';

}


function toggleGraph(enabled) {
  document.getElementById('graph-area').style.display = enabled ? "block" : 'none';
}

function toggleStats(enabled) {
  document.getElementById('pid-area').style.display = enabled ? "block": 'none';
}

function toggleJoystick(enabled) {
  document.getElementById('joystick').style.display = enabled ? "block" : 'none';

}

function toggleChart(enabled) {
  document.getElementById('pie-chart').style.display = enabled ? "block" : 'none';

}

function toggleCompass(enabled) {
  document.getElementById('dist-eta-background').style.display = enabled ? "block" : 'none';
  document.getElementById('compass-div').style.display = enabled ? "block" : 'none';


}

function getColor(value, opacity){
  //value from 0 to 1
  var hue=((1-value)*120).toString(10);
  if(opacity)
  return ["hsla(",hue,",100%,50%,100%)"].join("")
  else
  return ["hsla(",hue,",100%,50%,40%)"].join("");

}

function switchToVid() {
if (document.getElementById('pid-area').style.display == "none" || document.getElementById('pid-area').style.display == "") {
  pidOn = false;
} else {
  pidOn = true;

}
if (document.getElementById('graph-area').style.display == "none" || document.getElementById('graph-area').style.display == "") {
  graphOn = false;
} else {
  graphOn = true; 
}
console.log(pidOn, graphOn);
toggleGraph(false);
toggleCompass(false);
toggleJoystick(false);
toggleChart(false); 
toggleStats(false); 
toggleTopBar(false);

document.getElementById('map').classList.remove('map-big');
document.getElementById('map').classList.add('map-small');
document.getElementById('robotFrontCamera').classList.remove('video-small');
document.getElementById('robotFrontCamera').classList.add('video-big');


}

function switchToMap() {
  console.log(pidOn, graphOn);

  if(pidOn)
  toggleStats(true);
  if(graphOn)
  toggleGraph(true);  

  toggleCompass(true);
  toggleJoystick(true);
  toggleChart(true); 
  toggleTopBar(true);


  document.getElementById('map').classList.remove('map-small');
  document.getElementById('map').classList.add('map-big');
  document.getElementById('robotFrontCamera').classList.remove('video-big');
  document.getElementById('robotFrontCamera').classList.add('video-small');


}







window.onload = function() {

  toggleCompass(false);
  toggleGraph(false);
  toggleStats(false);

  socket = io.connect("https://localhost:5000", {secure:true, rejectUnauthorized: false}); 
  socket.on('connection', () => {
    console.log("connected to server socket"); 
  });
  socket.on('error', err => {
    console.log('error', err);
  });
  initGraph();
  initMap(); 
  initPID();
  initChart();
  g1.resize(480,320);


  document.getElementById('share').addEventListener('click', shareClick);
  document.getElementById('view').addEventListener('click', viewClick);
  document.getElementById('plan-load-button').addEventListener('click', loadPlan);
  homeButton = document.getElementById('home-button');
  homeButton.addEventListener('click', zoomToWayPoint); 
  missionHome = document.getElementById('home-mission');
  missionHome.addEventListener('click', zoomToLocation);

  document.getElementById('robotFrontCamera').addEventListener('click', switchToVid);
  map.addListener('click', () => {
    console.log('clicked');
    if(document.getElementById('robotFrontCamera').classList.contains('video-big'))
    switchToMap(); 

  })






  //getLocation();
}

