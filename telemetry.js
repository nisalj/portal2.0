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
socket = io.connect("https://localhost:5000", {secure:true, rejectUnauthorized: false}); 

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

  initMap(); 
  
  document.getElementById('share').addEventListener('click', shareClick);
  document.getElementById('view').addEventListener('click', viewClick);
  document.getElementById('plan-load-button').addEventListener('click', loadPlan);
  homeButton = document.getElementById('home-button');
  homeButton.addEventListener('click', zoomToWayPoint); 
  missionHome = document.getElementById('home-mission');
  missionHome.addEventListener('click', zoomToLocation);
  //getLocation();
}

