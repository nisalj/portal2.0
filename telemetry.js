import Viewer from './viewer.js';
import Sharer from './sharer.js';
import Operator from './operator.js'

let status;
window.user; 
let robotpath;
let options; 
let socket; 
let test1; 
let lineSymbol; 
let ros; 
let user; 
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
    alert(error);
  });

  ros.on('close', function() {
    console.log('Connection to websocket server closed.');
  });
    

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
      map: new google.maps.Map(document.getElementById('map'), 
      {
        center: {lat:-33.814451, lng:151.171332},
        zoom: 14,
        gestureHandling: 'greedy',
      }),
    });


    
    options = {
      enableHighAccuracy: true,
      timeout: Infinity,
      maximumAge: 0 
    }; 
 

}





function shareClick() {

console.log('clicked share');
let element = document.getElementById("view");
element.parentNode.removeChild(element);
element = document.getElementById("share");
element.style.display = "none";
//element.parentNode.removeChild(element);
element = document.getElementById("planselect");
//element.style.display = "none";

//element.parentElement.removeChild(element);
status.textContent = "Sharing location"; 

user = new Sharer(status, options, robotpath); 
user.start(); 
//window.operator.start();


}

function viewClick() {
console.log('clicked view');

let element = document.getElementById("view");
element.parentNode.removeChild(element);
element = document.getElementById("share");
element.parentNode.removeChild(element);

 element = document.getElementById("planselect");
 element.style.display = "none";
// element.parentElement.removeChild(element);
status.textContent = "Viewing location"; 
status.style.display = "none";
socket = io.connect(); 
//window.user = new Viewer(robotpath, socket);
window.operator = new Operator(robotpath, socket, ros);
window.operator.start();
//window.user.start();
}

window.onload = function() {

  initMap(); 
  status = document.getElementById('main-header')
  document.getElementById('share').addEventListener('click', shareClick);
  document.getElementById('view').addEventListener('click', viewClick);


  //getLocation();
}

