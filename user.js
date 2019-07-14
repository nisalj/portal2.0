import Path from './path.js';

export default class User {

    constructor(path) {
      this.path = path; 
      this.lat;
      this.long; 
      this.firstReading = true;  
      this.status;
      this.planPlath = new Path(); 
      this.heading; 
      this.targetBearing;
      this.currentSeg = 0; 
      this.targetWayPoint; 
      this.atSegStart = true; 
      //get rid of these 
      this.sidebar = document.getElementById('over-map'); 
      this.headval = document.getElementById('heading-val');  
      this.distval = document.getElementById('dist-val');
      this.bearval = document.getElementById('bear-val');


    }

    checkForNewSeg() {

        
      /* if the user is within a 1m radius of the end point of current segment, update the target waypoint to the 
      start point of the current segment.

      if the user is within a 1m radius of the start point of the current segement, update the current seg to the next
      one, unless it is the last segment -> then mission complete. 
       */

     
        //check distance between user loc and targetway point 
      if(!this.planPlath.segNo())
      return; 

      let latlng = new google.maps.LatLng(this.lat, this.long);
      console.log(this.targetWayPoint);

      let dist = google.maps.geometry.spherical.computeDistanceBetween(latlng, this.targetWayPoint.position);
      this.distval.innerText = dist.toFixed(0); 
      console.log("distance to target waypoint", dist); 
      //if within 
      if (dist <= 1) {
        this.updateTargetWayPoint(); 
      } else {
        return; 
      }

    }

   


    updateTargetWayPoint() {
      // 
      if (this.atSegStart) {
        this.targetWayPoint = this.getCurrentSeg().getEnd(); 
        this.atSegStart = false; 
        console.log(this.planPlath.segNo())
        
        //not the last segment
      } else if(this.currentSeg != this.planPlath.segNo()) {
        this.updateCurrentSeg(); 
        this.targetWayPoint = this.getCurrentSeg().getStart(); 
      } else {
        console.log("Mission complete"); 
      }
      console.log(this.targetBearing); 
    }

    updateCurrentSeg() {
      this.currentSeg++; 
      this.targetBearing = this.getCurrentSeg().getBearing(); 
      //console.log(this.targetBearing);
      //update color
    }

    getCurrentSeg() {
      return this.planPlath.getSegAt(this.currentSeg); 
    }




   
  
    addFirst() {
      console.log("lat", this.lat, "long", this.long); 
      let latlng = {lat: this.lat, lng: this.long};
      console.log(latlng);
      let start  = new google.maps.Marker({
        position: latlng,
        map: this.path.map,
        title: '#1'
      
      });

      let end = this.planPlath.getFirst().getStart(); 
      this.planPlath.addFirst(start, end);

    }


  showHeading() {
  this.headval.innerText = this.heading; 
  let lineSymbol = {
    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    //path: google.maps.SymbolPath.CIRCLE,
    scale: 5,
    rotation: this.heading,
  };

  this.path.setOptions(
  {
  icons: [{
      icon: lineSymbol,
      offset: '100%',
      fixedRotation: true
  }],
  })

  if(!this.firstReading)
    this.changeColor()

 // this.path.icon.rotation = this.heading; 
  }
  

    plotPath() {
      this.sidebar.style.display = "block"; 

      if(this.firstReading && this.planPlath.segNo()) {
        this.addFirst();
        this.targetWayPoint = this.getCurrentSeg().getStart(); 
        this.targetBearing = this.getCurrentSeg().getBearing(); 
        this.atSegStart = true; 
        this.firstReading = false; 
      }
      //window.testfunc(); 
      let map = this.path.map; 
      map.setZoom(17);
      let path = this.path.getPath();
      let latlng = new google.maps.LatLng(this.lat, this.long);
      map.panTo(latlng);
      console.log("updating",latlng.lat(),latlng.lng() );

     // path.icons[0].icon.scale = 50; 

      console.log(path); 
      path.push(latlng);
      this.updateBearing(latlng); 
      this.checkForNewSeg();
      this.changeColor()
    }

    changeColor() {
      if(!this.planPlath.segNo())
      return; 
      this.bearval.innerText = (this.targetBearing - this.heading).toFixed(0); 
      if(Math.abs(this.targetBearing - this.heading) < 10) {
        this.getCurrentSeg().changeColor("green")
      } else {
        this.getCurrentSeg().changeColor("red")
      }

    }


    updateBearing(latlng) {
      if(!this.planPlath.segNo())
      return; 

      let bearing = google.maps.geometry.spherical.computeHeading(latlng, this.targetWayPoint.position);
        if (bearing < 0)
        bearing =  360 + bearing;

       this.targetBearing =  bearing;  
    }
    makePlan() {

        console.log('making'); 
        this.planPlath.makePath(this.path.map); 
    }
   

    test() {
        console.log(this.planPlath.segNo()); 

    }

    
  
   
  
  
  }; 