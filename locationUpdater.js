
export default class LocationUpdater {
    constructor(path, planPlath) {
      this.path = path; 
      this.planPlath = planPlath; 
      this.robotState; 
      this.firstReading = true; 
      this.distval = document.getElementById('dist-val');
      this.circle; 
      this.distance;
      this.targetWayPoint; 
      this.currentSeg = 0; 
      this.atSegStart = true; 
    }

 newRobotState(state) {
   this.robotState = state; 
 }   




zoomToLoc() {
    let lat = this.robotState.getLat(); 
    let long = this.robotState.getLong();
    if (!lat || !long)
    return; 
    let latlng = new google.maps.LatLng(lat, long);
    let map = this.path.map; 
    map.panTo(latlng);
    map.setZoom(17); 
  }

 
  renderCircle() {
    let uncertRadius = this.robotState.getUncertRadius(); 
    let lat = this.robotState.getLat(); 
    let long = this.robotState.getLong();
    if (!uncertRadius)
    return; 
    let radius = uncertRadius; 
    let latlng = {lat: lat, lng: long};
    if(!this.circle && radius && latlng) {
       this.circle = new google.maps.Circle({
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
      this.circle.setRadius(radius);
      this.circle.setCenter(latlng);
    }
  }


  //TODO: when calling this, do the check outside

  checkForNewSeg() {

    if(!this.planPlath || !this.missionStarted)
    return; 
    let lat = this.robotState.getLat(); 
    let long = this.robotState.getLong();
    let latlng = new google.maps.LatLng(lat, long);
    console.log(this.targetWayPoint);
    this.distance = google.maps.geometry.spherical.computeDistanceBetween(latlng, this.targetWayPoint.position);
    let dist = this.distance; 
    //displays distance value on map
    this.distval.innerText = dist.toFixed(0); 
    console.log("distance to target waypoint", dist); 

    //if user is within 5m we have reached target
    if (dist <= 5) {
      this.updateTargetWayPoint(); 
    } else {
      return; 
    }

  }


  
      //if we are at the start of segment, next waypoint is the end
      //of the same segment. Otherwise its the start of the next segment
      updateTargetWayPoint() {
         
        if (this.atSegStart) {
          this.targetWayPoint = this.getCurrentSeg().getEnd(); 
          this.atSegStart = false; 
          console.log(this.planPlath.segNo())
          
        } else if(this.currentSeg != this.planPlath.segNo()) {
          this.updateCurrentSeg(); 
          this.targetWayPoint = this.getCurrentSeg().getStart(); 
          this.atSegStart = true; 
        } else {
          console.log("Mission complete"); 
        }
        console.log(this.targetBearing); 
      }
  
  
      updateCurrentSeg() {
        this.getCurrentSeg().changeColor("blue"); 
        this.currentSeg++; 
        this.targetBearing = this.getCurrentSeg().getBearing(); 
        //console.log(this.targetBearing);
        //update color
      }
  
      getCurrentSeg() {
        return this.planPlath.getSegAt(this.currentSeg); 
      }

  
  

 
};