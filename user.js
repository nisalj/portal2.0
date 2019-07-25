import Path from './path.js';

export default class User {

    constructor(path) {
      this.path = path; 
      this.lat;
      this.long; 
      this.accX;
      this.accY;
      this.accZ;
      this.rotAlpha;
      this.rotBeta;
      this.rotGamma;
      this.uncertRadius; 
      this.circle; 
      this.blinckCircle; 
      this.speed; 
      this.firstReading = true;  
      this.intfunc;
      this.status;
      this.planPlath = new Path(); 
      this.heading; 
      this.distance;
      this.correction;
      this.targetBearing;
      this.currentSeg = 0; 
      this.blinkColor = 0.8;
      this.targetWayPoint; 
      this.atSegStart = true; 
      this.sidebar = document.getElementById('over-map'); 
      this.headval = document.getElementById('heading-val');  
      this.distval = document.getElementById('dist-val');
      this.bearval = document.getElementById('bear-val');
      this.compass = document.gauges.get('compass');
      this.planNo = document.getElementById('planNobox');  
    }



    //checks if the currentSeg and targetWayPoint need to be updated 
    checkForNewSeg() {

      if(!this.planPlath.segNo())
      return; 

      let latlng = new google.maps.LatLng(this.lat, this.long);
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

    blink() {
      let latlng = {lat: this.lat, lng: this.long};

      if (!this.blinckCircle) {
        this.blinckCircle = new google.maps.Circle({
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
      this.blinckCircle.setCenter(latlng);

     
        $.get('/connection', (data) => {
     
          this.blinckCircle.setMap(this.path.map);
          this.blinckCircle.setRadius(0);
          this.blinckCircle.setOptions({fillOpacity: 0}); 
          this.blinckCircle.setOptions({strokeOpacity: 0}); 
          this.blinkColor = 0.8;
          this.intfunc = setInterval(this.timer.bind(this), 25);
          this.finishedPoll = true; 


        } );
    
      
    // this.intfunc = setInterval(this.timer.bind(this), 25)
      // let rad = 5;

      // for (let i = 0; i < 1000; i++) {

      //   if (i % 10 == 0) {
      //     this.blinckCircle.setRadius(rad)
      //     rad += 5; 

      //   }
      // }



    //  this.blinckCircle.setRadius(20);

      


    }

    timer() {
      let radius = this.blinckCircle.getRadius(); 

      if (radius >= this.uncertRadius*1.5) {
        this.blinckCircle.setMap(null);

        clearInterval(this.intfunc);
  

        return; 
      } else {

        this.blinkColor -= 0.01; 
        if (this.blinkColor <= 0) {
          this.blinkColor = 0; 
        }
        this.blinckCircle.setOptions({fillOpacity: this.blinkColor}); 
        this.blinckCircle.setOptions({strokeOpacity: this.blinkColor}); 
        this.blinckCircle.setRadius(radius + 1);

      }

    }

   
    renderCircle() {
      let radius = this.uncertRadius; 
      let latlng = {lat: this.lat, lng: this.long};
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

   
    updateCompass(heading, target, noplan) {
      if(noplan) {
        this.compass.value = heading;
        return;
      }

      let correction = (target - heading + 180 + 360)%360 - 180; 
      
      let color = "red"; 
      if (Math.abs(this.correction) <= 10)
      color = "lime";
      // let head = heading;
      // let target = target; 

      // if (head > 180) {
      //   head = head % 180
      // }

      // if (head < targ) {
      //   this.compass.update({
      //     highlights: [
      //       {from: target, to: heading, color: color}
      //     ]
      //   });
      // } else {
      //   this.compass.update({
      //     highlights: [
      //       {from: heading, to: target, color: color}
      //     ]
      //   });
      // }


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
      //let target = this.targetBearing; 
    
      // this.compass.update({
      //   highlights: [
      //     {from: heading, to: target, color: 'blue'}
      //   ]
      // });
     // console.log(head , targ);

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


    //changes the past segment color to blue 
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




   
    //adds a new segement to start of the plan from the location of the user 
    //to the first waypoint of the path 
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

  //shows heading, changes arrow rotation according to heading
  showHeading() {
  this.headval.innerText = this.heading; 
  this.updateCompass(this.heading, this.targetBearing, true); 
  //this.correction = ((this.targetBearing - this.heading + 180 + 360)%360 - 180).toFixed(0); 

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
    this.changeColor();
  
  //this.postDetails();
 // this.path.icon.rotation = this.heading; 
  }


//main method, adds segment, plots path, updates bearing, checks for new seg etc
    plotPath() {
      this.sidebar.style.display = "block"; 
      let latlng = new google.maps.LatLng(this.lat, this.long);
      let map = this.path.map; 

      if(this.firstReading && this.planPlath.segNo()) {
        setInterval(this.blink.bind(this), 4000);
        this.addFirst();
        this.targetWayPoint = this.getCurrentSeg().getStart(); 
        this.targetBearing = this.getCurrentSeg().getBearing(); 
        this.atSegStart = true; 
        this.firstReading = false; 
        this.correction = ((this.targetBearing - this.heading + 180 + 360)%360 - 180).toFixed(0); 
        this.updateTargetWayPoint();
        map.panTo(latlng);

      }
      //window.testfunc(); 
   //   let map = this.path.map; 
      //map.setZoom(17);
      let path = this.path.getPath();
    //  let latlng = new google.maps.LatLng(this.lat, this.long);
     // map.panTo(latlng);
      console.log("updating",latlng.lat(),latlng.lng() );

     // path.icons[0].icon.scale = 50; 

      console.log(path); 
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
    changeColor() {
      if(!this.planPlath.segNo()){
        return; 

      }
      this.correction = ((this.targetBearing - this.heading + 180 + 360)%360 - 180).toFixed(0); 

     // this.correction = (this.targetBearing - this.heading).toFixed(0);
      this.updateCompass(this.heading, this.targetBearing); 
     // this.bearval.innerText = (this.targetBearing - this.heading).toFixed(0); 
      this.bearval.innerText = this.correction; 
      //correction value
      if(Math.abs(this.targetBearing - this.heading) < 10) {
        this.getCurrentSeg().changeColor("lime")
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

    //renders the planned path
    makePlan() {

        console.log('making'); 
        this.planPlath.makePath(this.path.map, this.planNo.value); 
        let element = document.getElementById("planselect");
        element.parentElement.removeChild(element);

    }
   

    test() {
        console.log(this.planPlath.segNo()); 

    }

    
  
   
  
  
  }; 