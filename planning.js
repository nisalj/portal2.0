import Segment from './segment.js';
import Path from './path.js';

let map;
let poly; 
let header; 
let path; 
let start; 
let current; 
let last; 
let click;
let undo; 
let firstMarker; 
let clear; 
let lat; 
let cruiseSlider;
let maxSlider; 
let long;
let save; 

window.onload = function() {
  initMap(); 
}
function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat:-33.814451, lng:151.171332},
          zoom: 14
        });
        
        cruiseSlider = document.getElementById("speed-range");
        maxSlider = document.getElementById("max-speed"); 

        noUiSlider.create(cruiseSlider, {

          start: 2.5,
          connect: [true, false],
          range: {
              'min': 0,
              'max': 10
          },
          step: 0.1, 
          tooltips: false, 
      });


      cruiseSlider.noUiSlider.on('end', function (values, handle) {
        cruiseSlider.noUiSlider.updateOptions({
        tooltips:  false,
      });

      });

      cruiseSlider.noUiSlider.on('start', function (values, handle) {
        cruiseSlider.noUiSlider.updateOptions({
        tooltips:  wNumb({decimals: 1}),
      });

      });


      cruiseSlider.noUiSlider.on('change', function (values, handle) {
        let val = parseFloat(values); 
        console.log(val); 
        path.getLast().setSpeed(val);


      });

      noUiSlider.create(maxSlider, {

        start: 5,
        connect: [true, false],
        range: {
            'min': 0,
            'max': 10
        },
        step: 0.1, 
        tooltips:  false,
      
    });


    maxSlider.noUiSlider.on('end', function (values, handle) {
      maxSlider.noUiSlider.updateOptions({
      tooltips:  false,
    });

    });

    maxSlider.noUiSlider.on('start', function (values, handle) {
      maxSlider.noUiSlider.updateOptions({
      tooltips:  wNumb({decimals: 1}),
    });

    });


    maxSlider.noUiSlider.on('change', function (values, handle) {
      let val = parseFloat(values); 
      console.log(val); 
      path.getLast().setMaxSpeed(val);


    });
    

    document.getElementById("insert").addEventListener("click", () => {
     // console.log("hey");
     click++; 
     path.splitSeg(2,map);
    }); 


        undo = document.getElementById("undo").addEventListener("click", () => {
          // make sure the path has been initialised, 
          click--;
          if (!path || click < 0) {
            click = 0; 
            return;
          } 
          else {
            if(click == 0) {
              last = null; 
              firstMarker.setMap(null);
              firstMarker = null; 
              start = true; 
              displayCurrent(null); 

            } else {
              path.undoPath(); 
              if (path.getLast()) {
                last = path.getLast().end; 
              } else {
                last = firstMarker; 
              }
              displayCurrent(last.position); 


            }
        } 
        if (click < 2) {
          cruiseSlider.setAttribute('disabled', true);
          maxSlider.setAttribute('disabled', true);
  
        }
        });

        clear = document.getElementById("clear-button").addEventListener("click", () => {
          if (start == true)
          return;
          else {
            click = 0; 
            path.clear(map); 
            start = true; 
            firstMarker.setMap(null); 
          }
          displayCurrent(null); 
          cruiseSlider.setAttribute('disabled', true);
          cruiseSlider.noUiSlider.set(2.5);
          maxSlider.noUiSlider.set(5);
          maxSlider.setAttribute('disabled', true);
  

        }); 
       
        lat = document.getElementById("lat");
        long = document.getElementById("long");

        cruiseSlider.setAttribute('disabled', true);
        maxSlider.setAttribute('disabled', true);
        save = document.getElementById("save-button").addEventListener('click', () => {
          if(path.segNo() == 0){
            $('#modaltext').text("Please select waypoints") 
            $('#modal').modal('show'); 
          } else{
            path.sendPath(); 
            $('#modaltext').text("Path saved") 
            $('#modal').modal('show'); 
          }

        }); 
     
       start = true; 
       $('#sidebar')[0].style.display = "none"


      $("#close-side").on('click', () => {
        $('#sidebar')[0].style.display = "none"
      } )
       path = new Path(); 
       click = 0; 
       map.addListener('click', addLatLng); 


}

function displayCurrent(position) {
  if (!position) {
    lat.value = null; 
    lat.placeholder = "Lat"
    long.value = null; 
    lat.placeholder = "Lat"
    return; 
  }

  lat.value = Number(position.lat()).toFixed(3); 
  long.value = Number(position.lng()).toFixed(3); 
}; 


window.dragListen = function markerDrag(event) {
 
  
    if(!path.segNo()) 
      return; 

  path.dragSeg(this); 
  


}

function addLatLng(event) {
  $('#sidebar')[0].style.display = "block"

  click++; 
  //header.remove(); 
  
  //let line = poly.getPath(); 
 // line.push(event.latLng); 

  current = new google.maps.Marker ({
    position: event.latLng,
    map: null,
    title: String(click),
    draggable: true,
  });

  current.addListener('drag', window.dragListen); 
  
  displayCurrent(current.position); 

  if (click >= 2) {
    console.log(click);
    maxSlider.removeAttribute('disabled'); 
    cruiseSlider.removeAttribute('disabled'); 
  }


  //current.setMap(map);
  if (start) {
    firstMarker = current; 
    last = current; 
    current.setMap(map); 
    start = false; 
  } else {
    let seg = new Segment(last, current);

    //console.log(seg.convertSeg()); 
    path.addSeg(seg);
    path.newUpdate(map); 
    last = current;
  }
  // if (!path.isEmpty())
  // path.getLast(); 
 // path.renderPath(map);
 // path.clear(map);
  console.log(path.segNo()); 
 // path.sendPath(); 
  

}