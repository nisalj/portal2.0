
export default class MissionRenderer {
    constructor(location, motion, heading, path, params) {
        this.path = path; 
        this.location = location; 
        this.motion = motion; 
        this.heading = heading; 
        this.params = params; 
        //render server state
        this.blinkCircle; 
        this.intfunc;
        this.blinkColor = 0.8;
        //render uncert radius
        this.uncertCircle; 
        //dom elements to render
        this.compass = document.gauges.get('compass');
        this.headval = document.getElementById('heading-val');  
        this.distval = document.getElementById('dist-val');
        this.bearval = document.getElementById('bear-val');
        this.targetval = document.getElementById('target-val');
        this.markerOne = new google.maps.Marker({
          label: "P",
          position: null,
          map: null,
        });
        this.markerTwo = new google.maps.Marker({
          label: "F",
          position: null,
          map: null,
        });
        this.graphOn = false; 

        




    }


    start() {
      let toggle = document.getElementById("toggle-graph");
      toggle.addEventListener( "click", () => {
        if (!this.graphOn) {
          document.getElementById('play-icon').className = "fa fa-pause"
          this.graphOn = true; 
      
        } else {
          document.getElementById('play-icon').className = "fa fa-play"
          this.graphOn = false; 
    
        }
    
      });
    }
 



renderServerState() {
    let location = this.location; 
    let latlng = {lat: location.getLat(), lng: location.getLong()};
  
    if (!this.blinkCircle) {
      this.blinkCircle = new google.maps.Circle({
        strokeColor: 'blue',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: 'blue',
        fillOpacity: 0.35,
        map: this.path.map,
        center: latlng,
        radius: 0,
      });
    }
    this.blinkCircle.setCenter(latlng);
  
   
      $.get('/connection', (data) => {
   
        this.blinkCircle.setMap(this.path.map);
        this.blinkCircle.setRadius(0);
        this.blinkCircle.setOptions({fillOpacity: 0}); 
        this.blinkCircle.setOptions({strokeOpacity: 0}); 
        this.blinkColor = 0.8;
        this.intfunc = setInterval(this.serverStateHelper.bind(this), 25);
  
  
      } );

  
  }
  
  serverStateHelper() {
    let radius = this.blinkCircle.getRadius(); 
  
    if (radius >= 3) {
      this.blinkCircle.setMap(null);
      clearInterval(this.intfunc);
  
  
      return; 
    } else {
  
      this.blinkColor -= 0.01; 
      if (this.blinkColor <= 0) {
        this.blinkColor = 0; 
      }
      this.blinkCircle.setOptions({fillOpacity: this.blinkColor}); 
      this.blinkCircle.setOptions({strokeOpacity: this.blinkColor}); 
      this.blinkCircle.setRadius(radius + 1);
  
    }
  }


  renderUncertCircle() {
   // let params = this.params;
    let location = this.location; 
    let radius = location.getUncertRadius(); 
    let lat = location.getLat();
    let long = location.getLong(); 

    if (!radius)
    return; 

    let latlng = {lat: lat, lng: long};

    if(!this.uncertCircle && radius && latlng) {
       this.uncertCircle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: this.path.map,
        center: latlng,
        radius: radius,
      });
    } else {
      this.uncertCircle.setRadius(radius);
      this.uncertCircle.setCenter(latlng);
    }
  }

  renderMarkerOne(pos) {
      this.markerOne.setPosition(pos);
      this.markerOne.setMap(this.path.map);
  }

  renderMarkerTwo(pos) {
    this.markerTwo.setPosition(pos);
    this.markerTwo.setMap(this.path.map);
  }


  renderCompass() {
    let params = this.params; 
    let heading_s = this.heading; 
    let heading = heading_s.getHeading(); 
    let correction = params.getCorrection(); 
    let target = params.getTargetBearing(); 

  //  let correction = (target - heading + 180 + 360)%360 - 180; 

    if(!correction) {
      this.compass.value = heading;
      return;
    }
    
    
    this.compass.value = heading;
    
    let color = "red"; 
    if (Math.abs(correction) <= 10)
    color = "lime";
    
    if (correction > 0) {
      this.compass.update({
        highlights: [
          {from: heading, to: target, color: color}
        ]
      });
    } else {
      this.compass.update({
        highlights: [
          {from: target, to: heading, color: color}
        ]
      });
    }
   
  
  }


//shows heading, changes arrow rotation according to heading
renderHeading() {
    let heading_s = this.heading; 
    let heading = heading_s.getHeading();  
    this.headval.innerText = heading; 
    //this.correction = ((this.targetBearing - this.heading + 180 + 360)%360 - 180).toFixed(0); 
    
    let lineSymbol = {
    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    //path: google.maps.SymbolPath.CIRCLE,
    scale: 5,
    rotation: heading,
    };
    
    this.path.setOptions(
    {
    icons: [{
      icon: lineSymbol,
      offset: '100%',
      fixedRotation: true
    }],
    })
    
    
    //this.postDetails();
    // this.path.icon.rotation = this.heading; 
}

renderBearVal() {
let params = this.params;
let cor = params.getCorrection()
if (Math.abs(cor) > 10)
this.bearval.style.color = "red";
else
this.bearval.style.color = "lime";

this.bearval.innerText = cor;

}


renderTargetVal() {
  let params = this.params;
  this.targetval.innerText = params.getTargetBearing().toFixed(0);
}

renderCurrentLine() {
    let params = this.params;
    console.log(params);

    let correction = params.getCorrection(); 
    let currentSeg = params.getCurrentSeg(); 

    if(Math.abs(correction) < 10) {
      currentSeg.changeColor("lime")
    } else {
      currentSeg.changeColor("red")
    }
  
  }


  renderPastLine() {
    let params = this.params;
    params.getCurrentSeg().changeColor("blue"); 
  }

  renderDistVal() {
 let params = this.params;
  let dist = params.getDistance(); 
  this.distval.innerText = dist.toFixed(0); 
  }


  renderGraph() {
    if(this.graphOn) {

    let target = parseFloat(this.params.getTargetBearing());
    let heading = parseFloat(this.heading.getHeading()); 
    let correction = Math.abs(parseFloat(this.params.getCorrection())); 

    if(!target) {
      target = 0; 
      correction = 0;
    }

  
    window.updateGraph(heading, target, correction);
    }


  }

  renderRobotPath() {
    let latlng = new google.maps.LatLng(this.location.getLat(), this.location.getLong());
    this.path.getPath().push(latlng); 
    
  }
 

  

  






  
  




}