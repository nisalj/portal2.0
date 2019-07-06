let map;
let status;
let path; 
let robotpath;
let locating = "Locating";
let tracking =  "Tracking";
let unable = "Unable to retrieve your location"
let options; 
function success(position){
  const lat  = position.coords.latitude;
  const long = position.coords.longitude;
 // console.log(latitude);
  plotPath(lat,long);
}

function plotPath(lat, long) {
  let path = robotpath.getPath();

  latlng= new google.maps.LatLng(lat, long);
 // latlng2 = new google.maps.LatLng(37.772, -122.214); 
  path.push(latlng);
//  path.push(latlng2);

  
}

function error() {
  status.textContent = unable;
}
function getLocation() {

  if (!navigator.geolocation) {
    status.textContent = 'Geolocation is not supported by your browser';
  } else {
    if(status.textContent != tracking && status.textContent != unable)
    status.textContent = locating;
    navigator.geolocation.watchPosition(success, error, options);
    status.textContent = tracking;

  }

}


function initMap() {


    map = new google.maps.Map(document.getElementById('map'), 
      {
        center: {lat:-33.814451, lng:151.171332},
        zoom: 14
      });

    path = new google.maps.MVCArray([
    ]);

    robotpath = new google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
    
    options = {
      enableHighAccuracy: true,
      timeout: Infinity,
      maximumAge: 0 
    }; 
    robotpath.setMap(map);

 //   setInterval(getLocation, 100)

}


window.onload = function() {
  status = document.getElementById('main-header')
  initMap(); 
  getLocation();
}

