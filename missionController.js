import MissionParams from './missionParams.js';
import MissionRenderer from './missionRenderer.js';

export default class MissionController {

    constructor(med, comms, path, plan) {
      this.path = path; 
      this.planPath = plan; 
      this.med = med; 
      this.firstReading = true;  
      this.location;
      this.heading; 
      this.motion; 
      this.linear = 0; 
      this.angular = 0; 
      this.params = new MissionParams(this.location, this.motion, this.heading,this.planPath); 
      this.render = new MissionRenderer(this.location, this.motion, this.heading, this.path, this.params); 
      this.serverComms = comms;  
      this.status;
      this.correction;
      this.sidebar = document.getElementById('over-map'); 
      this.planNo = document.getElementById('planNobox');  
      this.missionStarted = true; 
      this.waypointStarted = false; 
    }

    start() {
      if(this.planPath)
      $.post('/start'); 
      this.med.registerMissionController(this); 
      this.render.start(); 
    }

  
    notify() {
      this.med.newTargetBearing(this.params.getTargetBearing());
      this.med.newPerpDist(this.params.getPerpDist());  
    }

    receiveLocation(location) {
      this.location = location; 
      this.params.location = location; 
      this.render.location = location; 
      this.serverComms.location = location; 
      this.onLocationUpdate(); 
    }

    receiveHeading(heading) {
      this.heading = heading;
      this.params.heading = heading; 
      this.render.heading = heading;
      this.serverComms.heading = heading; 
      this.onHeadingUpdate();  
    }

    receiveWheelSpeed(linear, angular) {
      this.linear = linear; 
      this.angular = angular; 
      this.params.targetCalculator.linear = linear; 
      this.params.targetCalculator.angular = angular; 

    }

    recieveMotion(motion) {
      this.motion = motion; 
    }
  
    initialLocationUpdate() {
      this.sidebar.style.display = "block"; 
      this.zoomToLoc();
      this.firstReading = false; 
      if(this.planPath) {
        this.addFirst();
        this.params.start(); 
      }
    }


  

  

    onLocationUpdate() {
      if(this.firstReading) {
      this.initialLocationUpdate(); 
      this.firstReading = false; 
      } 
      if(this.planPath) {
        if (this.params.updateParamsLocation()) {
          this.serverComms.params = this.params; 
          this.render.renderPastLine(); 
        } 
        this.notify(); 
        this.render.renderMarkerTwo(this.params.targetCalculator.getFuturePoint()); 
        this.render.renderMarkerOne(this.params.targetCalculator.getTargetPoint());
        this.render.renderCurrentLine(); 
        this.render.renderDistVal(); 
        this.render.renderTargetVal(); 
        this.render.renderBearVal(); 
      
      }
  
      this.render.renderUncertCircle(); 
      this.render.renderRobotPath();
     

    }

    onHeadingUpdate() {
      if(this.planPath) {
        this.params.updateParamsHeading();
        this.serverComms.params = this.params; 
      //  this.serverComms.sendHeading(); 
      }
      this.notify(); 
      this.render.renderHeading(); 
      this.render.renderBearVal(); 
      this.render.renderCompass(); 
      this.render.renderGraph(); 

      
    }


  zoomToLoc() {
      let lat  = this.location.getLat(); 
      let long = this.location.getLong();
      if (!lat || !long)
      return; 
      let latlng = new google.maps.LatLng(lat, long);
      let map = this.path.map; 
      map.panTo(latlng);
      map.setZoom(17); 
    }
    

//adds a new segement to start of the plan from the location of the user 
//to the first waypoint of the path 
addFirst() {
  let lat = this.location.getLat(); 
  let long = this.location.getLong(); 
  let latlng = {lat: lat, lng: long};
  console.log(latlng);
  let start  = new google.maps.Marker({
    position: latlng,
    map: this.path.map,
    title: '#1'
  
  });

  let end = this.planPath.getFirst().getStart(); 
  this.planPath.addFirst(start, end);

}




//main method, adds segment, plots path, updates bearing, checks for new seg etc
plotPath() {
  let latlng = new google.maps.LatLng(this.lat, this.long);
  let map = this.path.map; 

  if(this.firstReading && this.planPath  && this.missionStarted) {
 //   setInterval(this.blink.bind(this), 4000);
    this.addFirst();
    this.targetWayPoint = this.getCurrentSeg().getStart(); 
    this.targetBearing = this.getCurrentSeg().getBearing(); 
    this.atSegStart = true; 
    this.firstReading = false; 
    this.updateTargetWayPoint();
    map.panTo(latlng);
  } else if (this.firstReading) {
  //  setInterval(this.blink.bind(this), 4000);
    map.panTo(latlng);
    this.firstReading = false; 
  }
  //window.testfunc(); 
//   let map = this.path.map; 
  //map.setZoom(17);
  let path = this.path.getPath();
//  let latlng = new google.maps.LatLng(this.lat, this.long);
 // map.panTo(latlng);

 // path.icons[0].icon.scale = 50; 

  path.push(latlng);
  this.renderCircle();

  this.updateBearing(latlng); 
  this.checkForNewSeg();
  this.changeColor();
//  this.blink();

//   this.postDetails(); 
}

//changes color of the line according to correction value
//displays correction value in UI




//renders the planned path
makePlan() {

    console.log('making'); 
    this.planPath.makePath(this.path.map, this.planNo.value); 
    let element = document.getElementById("planselect");
    element.parentElement.removeChild(element);

}


test() {
    console.log(this.planPath.segNo()); 

}






}