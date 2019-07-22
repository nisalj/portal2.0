import Viewer from './viewer.js';
import Sharer from './sharer.js';

let status;
let user; 
let robotpath;
let options; 
let socket; 
let test1; 
let lineSymbol; 


function initMap() {

   lineSymbol = {
    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    scale: 5,

  };
    

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
user = new Viewer(robotpath, socket);
user.start();
}

window.onload = function() {

  initMap(); 
  status = document.getElementById('main-header')
  document.getElementById('share').addEventListener('click', shareClick);
  document.getElementById('view').addEventListener('click', viewClick);


  //getLocation();
}

