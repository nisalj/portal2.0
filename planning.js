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
let defCruiseSlider;
let defMaxSlider;
let tolSlider; 
let defCruise; 
let defMax;
let defTol;
let conf; 


window.onload = function() {
  initDefaultModal(); 
  initMap(); 
  updateConfig();



}


function updateConfig() {
  conf = 
  {
    time : new Date(), 
    cruisingSpeed : parseFloat(defCruise.value),
    maxSpeed : parseFloat(defMax.value),
    tolerance: parseFloat(defTol.value), 
    pSpeed : parseInt(pSpeed.value), 
    iSpeed : parseInt(iSpeed.value), 
    dSpeed : parseInt(dSpeed.value), 
    pMag : parseInt(pMag.value), 
    iMag : parseInt(iMag.value), 
    dMag : parseInt(dMag.value),
  }
  updateDefSegs();

}

function updateDefSegs() {

  path.segments.forEach(segment => {
    console.log('updating');
    if (segment.isMaxDef())
    segment.setMaxSpeed(defMax.value);
    if (segment.isSpeedDef())
    segment.setSpeed(defCruise.value);
    
  });


}






function sendConfig(planName) {
  conf.name = planName; 


$.post('/conf', conf, (res, req) => {
console.log('Sent config');
}); 


//console.log(conf);

}






function initDefaultModal() {
defCruiseSlider = document.getElementById("defCruiseSlider"); 
defMaxSlider = document.getElementById("defMaxSlider"); 
tolSlider = document.getElementById("tolSlider"); 
defCruise = document.getElementById("defCruiseText");
defMax = document.getElementById("defMaxText");
defTol = document.getElementById("tolText");

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


noUiSlider.create(defCruiseSlider, {
  start: 2,
  connect: [true, false],
  range: {
      'min': 0,
      'max': 10
  },
  step: 0.1, 
  tooltips: false,
}); 

noUiSlider.create(defMaxSlider, {
  start: 2,
  connect: [true, false],
  range: {
      'min': 0,
      'max': 10
  },
  step: 0.1, 
  tooltips: false,
}); 

noUiSlider.create(tolSlider, {
  start: 50,
  connect: [true, false],
  range: {
      'min': 0,
      'max': 100
  },
  step: 0.1, 
  tooltips: false,
}); 


defCruise.addEventListener("blur", () => {
  let val = defCruise.value;
 

  if (val >= 0 && val <= 10) {
    defCruiseSlider.noUiSlider.set(val);
  }
    
}); 

defMax.addEventListener("blur", () => {
  let val = defMax.value;
  if (val >= 0 && val <= 10) {
    defMaxSlider.noUiSlider.set(val);
  }
  console.log(defMax);
}); 


defTol.addEventListener("blur", () => {
  let val = defTol.value;
  if (val >= 0 && val <= 100) {
    tolSlider.noUiSlider.set(val);
  }
    
}); 


defCruiseSlider.noUiSlider.on('update', (value) => {
  defCruise.value = parseFloat(value); 
});

defMaxSlider.noUiSlider.on('update', (value) => {
  defMax.value = parseFloat(value); 
});

tolSlider.noUiSlider.on('update', (value) => {
  defTol.value = parseFloat(value); 
});






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

          start: 0,
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
      if (val == 0) {
        cruiseSlider.noUiSlider.set(val);
        speedText.value = "cruise";
        let seg = path.getSelected(); 
        seg.setSpeedDef(true); 
        seg.setSpeed(defCruise.value);
      }
        


      if (val > 0 && val <= 10) {
        cruiseSlider.noUiSlider.set(val);
        let seg = path.getSelected(); 
        seg.setSpeedDef(false); 
        seg.setSpeed(val);
      }
        
    } );


      cruiseSlider.noUiSlider.on('change', function (values, handle) {
        let val = parseFloat(values); 
        console.log(val); 
        let seg = path.getSelected(); 
        if (val != 0) {
          seg.setSpeedDef(false); 
          seg.setSpeed(val);
        }
        else {
          seg.setSpeedDef(true); 
          seg.setSpeed(defCruise.value);
        }

      });
   

      cruiseSlider.noUiSlider.on('update', function (values, handle) {
        let val = parseFloat(values); 
        if (val != 0)
        speedText.value = val;
        else 
        speedText.value = "cruise";

        //console.log(val); 
        //let seg = path.getSelected(); 
       // seg.setSpeed(val);


      });

      noUiSlider.create(maxSlider, {

        start: 0,
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
      let seg = path.getSelected(); 
      if (val == 0) {
        maxSlider.noUiSlider.set(val);
        maxText.value = "max";
        seg.setMaxDef(true); 
        seg.setMaxSpeed(defMax.value);
      }

      if (val > 0 && val <= 10) {
        maxSlider.noUiSlider.set(val);
        let seg = path.getSelected(); 
        seg.setMaxDef(false); 
        seg.setMaxSpeed(val);
      }
        
    } );

    maxSlider.noUiSlider.on('update', function (values, handle) {
      let val = parseFloat(values); 
      if (val != 0)
      maxText.value = val;
      else
      maxText.value = "max"; 

    });

    maxSlider.noUiSlider.on('change', function (values, handle) {
      let val = parseFloat(values); 
      console.log(val);
      let seg = path.getSelected(); 
      if (val != 0) {
        seg.setMaxDef(false);
        seg.setMaxSpeed(val);
      } else {
        seg.setMaxDef(true);
        seg.setMaxSpeed(defMax.value);
      }

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
          cruiseSlider.noUiSlider.set(0);
          maxSlider.noUiSlider.set(0);
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
            //$('#modaltext').text("Please select waypoints") 
            document.getElementById('modaltext').style.display = "block"; 
            document.getElementById('planName').style.display = "none"; 
            document.getElementById('planSaveButton').style.display = "none"; 
            $('#modal').modal('show'); 

          } else{
            document.getElementById('modaltext').style.display = "none"; 
            document.getElementById('planName').style.display = ""; 
            document.getElementById('planSaveButton').style.display = ""; 

            // $('#modaltext').style.display = "none"; 
            // $('#planName').style.display = "";
            $('#modal').modal('show'); 


        //   path.sendPath(); 
         //   setTimeout(showModal, 500); 
          //  console.log(path.planNo);
          }

        }); 


       
        $('#setting-modal').on('hidden.bs.modal', function (e) {
          console.log('hiding');
          resetDefSliders();
          // do something...
        })


        document.getElementById("setting-save").addEventListener('click', updateConfig); 
       // document.getElementById('setting-close').addEventListener('click', resetDefSliders);
       // document.getElementById('setting-x').addEventListener('click',resetDefSliders); 




        document.getElementById('planSaveButton').addEventListener('click', () => {
          $('#modal').modal('hide'); 
          let planName  = document.getElementById('planName').value;
          console.log(planName);
          path.sendPath(planName);
          sendConfig(planName); 

        })
     
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

function resetDefSliders() {
  if(!conf) {
    defCruiseSlider.noUiSlider.reset();
    defMaxSlider.noUiSlider.reset();
    tolSlider.noUiSlider.reset();
    pMagSlider.noUiSlider.reset();
    pSpeedSlider.noUiSlider.reset();
    iMagSlider.noUiSlider.reset();
    iSpeedSlider.noUiSlider.reset();
    dMagSlider.noUiSlider.reset();
    dSpeedSlider.noUiSlider.reset();
  } else {
    defCruiseSlider.noUiSlider.set(conf.cruisingSpeed);
    defMaxSlider.noUiSlider.set(conf.maxSpeed);
    tolSlider.noUiSlider.set(conf.tolerance);
    pMagSlider.noUiSlider.set(conf.pMag);
    pSpeedSlider.noUiSlider.set(conf.pSpeed);
    iMagSlider.noUiSlider.set(conf.iMag);
    iSpeedSlider.noUiSlider.set(conf.iSpeed);
    dMagSlider.noUiSlider.set(conf.dMag);
    dSpeedSlider.noUiSlider.set(conf.dSpeed);
  }
  
  $('#setting-modal').modal('hide'); 

}



window.displayCurrentSeg = function () {
  let seg = path.getSelected(); 
  if(seg.isMaxDef()) 
  maxSlider.noUiSlider.set(0);
  else 
  maxSlider.noUiSlider.set(seg.getMaxSpeed());


  if(seg.isSpeedDef())
  cruiseSlider.noUiSlider.set(0);
  else
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
    maxSlider.noUiSlider.set(0);
    cruiseSlider.noUiSlider.set(0);
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
    let seg = new Segment(last, current, defMax.value, defCruise.value);
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