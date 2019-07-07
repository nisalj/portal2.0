let map;
let status;
let path; 
let state; 
let user; 
let robotpath;
let locating = "Locating";
let tracking =  "Sharing";
let viewing = "Viewing";
let unable = "Unable to retrieve your location";
let options; 
let socket; 


function plotPath(lat, long) {
  let path = robotpath.getPath();
 
  latlng = new google.maps.LatLng(lat, long);
  console.log("updating",latlng.lat(),latlng.lng() );

 // latlng2 = new google.maps.LatLng(37.772, -122.214); 
  path.push(latlng);
  
//  path.push(latlng2);

  
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

class Viewer {

 

  constructor() {
  this.status = "view"; 
  this.shareLat;
  this.shareLong; 
  }

  getSharerPos() {

  
    socket.on('new location', data => {
        user.shareLat = data.lat; 
        user.shareLong = data.long;   
        user.updateMap();     
    });




    // let xhr;
    // if (window.XMLHttpRequest) {
    //     xhr = new XMLHttpRequest();
    // }
    // else if (window.ActiveXObject) {
    //     xhr = new ActiveXObject("Msxml2.XMLHTTP");
    // }
    // else {
    //     throw new Error("Ajax is not supported by this browser");
    // }
    // xhr.onload = function() {
    //   if(xhr.status == 200){

    //     let latlong = xhr.responseText; 
    //     let lat = latlong.split(' ')[0]; 
    //     let long = latlong.split(' ')[1]; 
    //     console.log(latlong);
    //     if (latlong != "Not ready") { 
    //       console.log(lat + " h " + long);
    //       user.shareLat = lat; 
    //       user.shareLong = long; 
    //       user.updateMap(); 
            
    //     }
      
    //   }
    // }

    // xhr.open("GET", "/loc", true);
    // xhr.send();
 
  }

  updateMap() {

    plotPath(user.shareLat, user.shareLong); 
  }

  start() {
    setInterval(this.getSharerPos.bind(user), 500);
  }

}; 

class Sharer {

  constructor() {

    this.lat;
 
    this.long; 
    this.status = "share";

  }

  success(position) {
    //console.log(position.coords.latitude);
    //console.log(this); 

      this.lat  = position.coords.latitude;
      this.long = position.coords.longitude;
      this.sharePos();
      plotPath(this.lat,this.long);

  };

  error() {
    status.textContent = unable;

  }; 
  
  getLocation() {
    console.log('view');
    console.log(this); 

    if (!navigator.geolocation) {
      status.textContent = 'Geolocation is not supported by your browser';
    } else {
      if(status.textContent != tracking && status.textContent != unable)
      status.textContent = locating;
     ; 
      navigator.geolocation.watchPosition(this.success.bind(user), this.error.bind(user), options);
      status.textContent = tracking;
  
    }
  
  }
  
  start() {

    this.getLocation(); 
  }

  sharePos() {

    let params = "lat="+this.lat+"&long="+this.long; 

    let xhr;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
        xhr = new ActiveXObject("Msxml2.XMLHTTP");
    }
    else {
        throw new Error("Ajax is not supported by this browser");
    }

    xhr.onload = function() {
      if(xhr.status == 200){
      //  console.log(xhr.responseText); 
      }
    }
      console.log(params);

      xhr.open('POST', location.origin +'/loc');
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send(params); 
  
    }

};




function shareClick() {
console.log('clicked share');
let element = document.getElementById("view");
element.parentNode.removeChild(element);
element = document.getElementById("share");
element.parentNode.removeChild(element);
status.textContent = "Sharing location"; 
user = new Sharer(); 
user.start(); 


}

function viewClick() {
console.log('clicked view');

let element = document.getElementById("view");
element.parentNode.removeChild(element);
element = document.getElementById("share");
element.parentNode.removeChild(element);
status.textContent = "Viewing location"; 

user = new Viewer(); 
socket = io.connect(); 
user.start(); 

}

window.onload = function() {
  initMap(); 
  status = document.getElementById('main-header')
  document.getElementById('share').addEventListener('click', shareClick);
  document.getElementById('view').addEventListener('click', viewClick);


  //getLocation();
}

