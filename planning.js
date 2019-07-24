import Segment from './segment.js';
import Path from './path.js';

let map;
let poly; 
let header; 
let path; 
let start; 
let current;
let clickedMarker;  
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
let home;
let speedText;
let maxText;  
let planNo; 

window.onload = function() {
  initMap(); 
}
function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          //center: {lat:-33.814451, lng:151.171332},
          zoom: 14,
          gestureHandling: 'greedy',
          clickableIcons: false
        });
        
        panToLoc();

        cruiseSlider = document.getElementById("speed-range");
        maxSlider = document.getElementById("max-speed"); 
        home = document.getElementById("home-button"); 
        speedText = document.getElementById("speed-text");
        maxText = document.getElementById("max-text"); 
        noUiSlider.create(cruiseSlider, {

          start: 2,
          connect: [true, false],
          range: {
              'min': 0,
              'max': 10
          },
          step: 0.1, 
          tooltips: false, 
      });


  speedText.addEventListener("blur", () => {
      let val = speedText.value;
      if (val >= 0 && val <= 10) {
        cruiseSlider.noUiSlider.set(val);
        let seg = path.getSelected(); 
        seg.setSpeed(val);
      }
        
    } );


      cruiseSlider.noUiSlider.on('change', function (values, handle) {
        let val = parseFloat(values); 
        console.log(val); 
        let seg = path.getSelected(); 
        seg.setSpeed(val);
      });
   

      cruiseSlider.noUiSlider.on('update', function (values, handle) {
        let val = parseFloat(values); 
        speedText.value = val;
        //console.log(val); 
        //let seg = path.getSelected(); 
       // seg.setSpeed(val);


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


    // maxSlider.noUiSlider.on('end', function (values, handle) {
    //   maxSlider.noUiSlider.updateOptions({
    //   tooltips:  false,
    // });

    // });

    // maxSlider.noUiSlider.on('start', function (values, handle) {
    //   maxSlider.noUiSlider.updateOptions({
    //   tooltips:  wNumb({decimals: 1}),
    // });

    // });

    maxText.addEventListener("blur", () => {
      let val = maxText.value;
      if (val >= 0 && val <= 10) {
        maxSlider.noUiSlider.set(val);
        let seg = path.getSelected(); 
        seg.setMaxSpeed(val);
      }
        
    } );

    maxSlider.noUiSlider.on('update', function (values, handle) {
      let val = parseFloat(values); 
      maxText.value = val;

    });

    maxSlider.noUiSlider.on('change', function (values, handle) {
      let val = parseFloat(values); 
      console.log(val); 
      let seg = path.getSelected(); 
      seg.setMaxSpeed(val);
    });
    

    document.getElementById("insert").addEventListener("click", () => {
      if (!path.segNo())
      return; 
     // console.log("hey");
     let no = document.getElementById("seg_no").value;
     if (no == 1)
     return; 

     let seg = path.getSelected(); 
     click += no - 1;  
    
     path.splitSeg(no, seg,map);
    }); 


        undo = document.getElementById("undo").addEventListener("click", () => {

          click--; 
          if (click < 0) {
            click = 0;
            
          }
          else if(click == 0) {
            document.getElementById("undo").setAttribute('disabled',true);
            last = null; 
            firstMarker.setMap(null);
            firstMarker = null; 
            start = true; 
            displayCurrentLatLng(null); 
            return;
          }

          
          

          path.removeAtMarker(map);
        
        if (click < 2) {
     
          cruiseSlider.setAttribute('disabled', true);
          maxSlider.setAttribute('disabled', true);
          speedText.setAttribute('disabled', true);
          maxText.setAttribute('disabled', true);
          
          //document.getElementById("undo").setAttribute('disabled',true)
          document.getElementById("insert").setAttribute('disabled',true)
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
            firstMarker = null; 
          }
          displayCurrentLatLng(null); 
          cruiseSlider.setAttribute('disabled', true);
          cruiseSlider.noUiSlider.set(2);
          maxSlider.noUiSlider.set(5);
          maxSlider.setAttribute('disabled', true);
          maxText.setAttribute('disabled', true);
          speedText.setAttribute('disabled', true);
          document.getElementById("insert").setAttribute('disabled',true)
          document.getElementById("undo").setAttribute('disabled',true)


        }); 
       
        lat = document.getElementById("lat");
        long = document.getElementById("long");
        maxText.setAttribute('disabled', true);
        speedText.setAttribute('disabled', true);
        cruiseSlider.setAttribute('disabled', true);
        maxSlider.setAttribute('disabled', true);
        save = document.getElementById("save-button").addEventListener('click', () => {
          if(path.segNo() == 0){
            $('#modaltext').text("Please select waypoints") 
            $('#modal').modal('show'); 
          } else{
            path.sendPath(); 
         //   setTimeout(showModal, 500); 
          //  console.log(path.planNo);
          }

        }); 
     
       start = true; 
       $('#sidebar')[0].style.display = "none"


      $("#close-side").on('click', () => {
        $('#sidebar')[0].style.display = "none"
      } )
      document.getElementById("insert").setAttribute('disabled',true)

      home.addEventListener("click" , () => {
        $('#sidebar')[0].style.display = "none"

        if(!firstMarker) {
          console.log("panning to loc");
          panToLoc();
         // let loc = setTimeout(get)
         // panMapTo(getUserLoc()); 
        } else {
          panMapTo(firstMarker.position); 
        }


      }); 
     // console.log(getUserLoc());
   //  panToLoc();

     // panMapTo(getUserLoc()); 
      path = new Path(); 


     
       click = 0; 
       map.addListener('click', addLatLng); 


}

window.showModal = function (num) {
 
  planNo = num; 
  $('#modaltext').text("Path saved") 
  $('#planno').text(`Plan number is: ${planNo}`);
  $('#planno').css("display", "block");
  $('#modal').modal('show'); 
}

function panToLoc() {
  if (!navigator.geolocation) {
    return; 
  } else {
    navigator.geolocation.getCurrentPosition((pos) => { 
      console.log('success');
     let loc =  new google.maps.LatLng({lat: pos.coords.latitude, lng: pos.coords.longitude})
    panMapTo(loc); 
  });
  }
  
}

function panMapTo(position) {
  if (!position)
  return null; 
   
  map.panTo(position); 
  map.setZoom(14);
}



window.displayCurrentSeg = function () {
  let seg = path.getSelected(); 
  maxSlider.noUiSlider.set(seg.getMaxSpeed());
  cruiseSlider.noUiSlider.set(seg.getSpeed());
  //when the sliders get set the text values also get set 
};



window.markerClick = function () {
//console.log('clicked'); 
//console.log(this);
$('#sidebar')[0].style.display = "block"

highlightMarker(this); 
displayCurrentLatLng(this); 
let segNo = path.segNo();  
let title = this.title;

if(segNo == 0) {
//  window.highlightMarker(firstMarker);
  return; 
}

if (title == 1) {
  path.setSelected(path.getFirst()); 
} else {
  path.setSelected(path.getSegAt(title - 2))
}


//highlightMarker(this); 
}

window.insertSeg = function (event) {
  document.getElementById("undo").disabled = false; 
  document.getElementById("insert").disabled = false; 
  maxText.disabled = false;
  speedText.disabled = false;
  let index = event.detail[0];
  let seg = event.detail[1];
  console.log(index, path.segNo());
  

  //console.log(this);
 // console.log(seg);
 // console.log('added seg');
 // console.log(path);
  
  path.setSelected(seg);
  highlightMarker(seg.getEnd()); 
  path.updateIds(); 
  path.updateLabels(); 
  if (index == path.segNo() - 1) {
    last = seg.getEnd(); 
  }
  //console.log('hey')
  //let start = seg.getStart();
  //let end = seg.getEnd();
  //start.setLabel(start.getTitle()); 
  //end.setLabel(start.getTitle()); 

  displayCurrentLatLng(seg.getEnd()); 

  
}



window.removeSeg = (event) => {

  if (path.segNo() == 0) {
    highlightMarker(firstMarker);
    maxSlider.noUiSlider.set(5);
    cruiseSlider.noUiSlider.set(2);
  }

  if (event.detail == path.segNo()) {

    //last element has been removed

   if (path.getLast()) {
        last = path.getLast().end; 
            } else {
              last = firstMarker; 
            }
      
  displayCurrentLatLng(last); 
    
  }


  

  let seg = path.getLast(); 

  if (seg) {
    path.setSelected(seg);
    highlightMarker(seg.getEnd()); 
  }

  path.updateIds(); 
  path.updateLabels(); 

  //console.log(event);
  console.log('remove seg', path.segNo());

}

function displayCurrentLatLng(marker) {
  if (!marker)  {
    lat.value = null;
    lat.placeholder = "Lat"
    long.placeholder = "Long"
    long.value = null; 
    return;
  }
  //return; 
  
  let position = marker.position; 

  lat.value = Number(position.lat()).toFixed(3); 
  long.value = Number(position.lng()).toFixed(3); 
}; 


window.dragListen = function markerDrag(event) {
 
  
    if(!path.segNo()) 
      return; 

  path.dragSeg(this); 
  


}

function highlightMarker(marker) {

  if(clickedMarker != undefined)
  clickedMarker.setIcon(null);

  marker.setIcon('https://maps.google.com/mapfiles/kml/paddle/blu-circle.png');

 // marker.setIcon("http://maps.google.com/mapfiles/ms/icons/blue-dot.png");
  clickedMarker = marker;
}
 
function test() {
  console.log(this);
}

function addLatLng(event) {
  $('#sidebar')[0].style.display = "block"
  document.getElementById("undo").disabled = false; 

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
  current.addListener('click', window.markerClick);

  displayCurrentLatLng(current); 

  if (click >= 2) {
    maxSlider.removeAttribute('disabled'); 
    cruiseSlider.removeAttribute('disabled'); 
  }


  //current.setMap(map);
  if (start) {
    firstMarker = current; 
    firstMarker.setIcon('https://maps.google.com/mapfiles/kml/paddle/blu-circle.png');
    firstMarker.setLabel('1');
    last = current; 
    current.setMap(map); 
    start = false; 
  } else {
    firstMarker.setIcon(null);
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