import TargetCalculator from "./targetCalculator.js";

export default class MissionParams {
    constructor(location, motion, heading, planPath) {
        this.planPath = planPath; 
        this.location = location; 
        this.motion = motion; 
        this.heading = heading; 
        this.distance;
        this.currentSegNo = 0; 
        this.currentSeg; 
        this.targetWayPoint;
        this.targetBearing;
        this.correction; 
        this.atSegStart = true;  
        this.targetCalculator = new TargetCalculator(location, heading);

    }

    getPerpDist() {
      return this.targetCalculator.perpDistance; 
    }

    getDistance() {
        return this.distance;
    }

    getCurrentSeg() {
        return this.currentSeg;
    }

    getTargetWayPoint() {
        return this.targetWayPoint;
    }

    getTargetBearing() {
        return this.targetBearing; 
    }

    getCorrection() {
        return this.correction; 
    }

    start() {

        this.updateCurrentSeg();
        this.targetWayPoint = this.getCurrentSeg().getStart(); 
        this.targetBearing = this.getCurrentSeg().getBearing(); 
    }

  




    updateParamsLocation() {
        this.targetCalculator.location = this.location; 
        if(this.updateDistance()) {
            //we reached a waypoint 
            this.updateTargetWayPoint(); 
            this.updateCurrentSeg(); 
          //  return;
        }
   //     this.updateBearing(); 
        this.targetBearing = this.targetCalculator.onLocUpdate(this.currentSeg, this.targetWayPoint); 
        console.log("target", this.targetBearing); 

  //      return waypointReached; 
    }

    updateParamsHeading() {
     this.targetCalculator.heading = this.heading; 
 //     this.targetBearing = this.targetCalculator.onLocUpdate(this.currentSeg); 
   // console.log("target", this.targetBearing); 
     //this.updateBearing(); 
     this.updateCorrection(); 
    }

    //checks if the currentSegNo and targetWayPoint need to be updated 
    updateDistance() {
    let location = this.location; 
    let lat = location.getLat();
    let long = location.getLong(); 


  
    let latlng = new google.maps.LatLng(lat, long);
  
    this.distance = google.maps.geometry.spherical.computeDistanceBetween(latlng, this.targetWayPoint.position);
  
    console.log("distance to target waypoint", this.distance); 
  
    //if user is within 5m we have reached target
    if (this.distance <= 2) {
        return 1; 
    } else {
      return 0; 
    }
  
  }


updateCorrection() {
    this.correction = ((this.targetBearing - this.heading.getHeading() + 180 + 360)%360 - 180).toFixed(0); 

}


  //if we are at the start of segment, next waypoint is the end
//of the same segment. Otherwise its the start of the next segment
updateTargetWayPoint() {
   
    if (this.atSegStart) {
      this.targetWayPoint = this.getCurrentSeg().getEnd(); 
      this.atSegStart = false;       
    } else if(this.currentSegNo != this.planPath.segNo()) {
    this.currentSegNo++; 
    this.updateCurrentSeg();
   // this.targetBearing = this.getCurrentSeg().getBearing();       
    this.targetWayPoint = this.getCurrentSeg().getStart(); 
    this.atSegStart = true; 
    } else {
      console.log("Mission complete"); 
    }
  }
  
  
  //changes the past segment color to blue 


  //need to modify this so that it uses the current orientation??
  updateBearing() {
    let location = this.location; 
    //TODO move out to controller
    if(!this.planPath  || !this.missionStarted)
    return; 

    let lat = location.getLat();
    let long = location.getLong(); 

    let latlng = new google.maps.LatLng(lat, long);
    
  
    let bearing = google.maps.geometry.spherical.computeHeading(latlng, this.targetWayPoint.position);
      if (bearing < 0)
      bearing =  360 + bearing;
  
     this.targetBearing =  bearing;  
  
  }

  updateCurrentSeg() {
    this.currentSeg =  this.planPath.getSegAt(this.currentSegNo); 
  }

  
  
}