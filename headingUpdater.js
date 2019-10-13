

export default class HeadingUpdater  {
    constructor(plan) {
        this.planPlath; 
        this.heading; 
        this.robotState; 
        this.correction;
        this.targetBearing;
        this.headval = document.getElementById('heading-val');  
        this.compass = document.gauges.get('compass');
        this.blinkColor = 0.8;
        this.bearval = document.getElementById('bear-val');
        this.missionStarted = false; 
    }

    start() {
      this.missionStarted = true; 
    }



    newRobotState(state) {
      this.robotState = state; 
      this.heading = this.robotState.getHeading(); 
    }   
   

    setCorrection(correction) {
        this.correction = correction; 
    }
  
  
  
    updateCompass(heading, target, noplan) {
          if(noplan || !this.missionStarted) {
            this.compass.value = heading;
            return;
          }
    
          let correction = (target - heading + 180 + 360)%360 - 180; 
          
          let color = "red"; 
          if (Math.abs(this.correction) <= 10)
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
  
        changeColor() {
              if(!this.planPlath  || !this.missionStarted) {
                this.blinkColor = 0.8;
                this.bearval = document.getElementById('bear-val')
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
              if(!this.planPlath  || !this.missionStarted)
              return; 
        
              let bearing = google.maps.geometry.spherical.computeHeading(latlng, this.targetWayPoint.position);
                if (bearing < 0)
                bearing =  360 + bearing;
        
               this.targetBearing =  bearing;  
      }
  

      getTargetBearing() {
        return this.targetBearing;
      }
  
      setTargetBearing(bearing) {
        this.targetBearing = bearing; 
      }
  
      getCorrection() {
        return this.correction; 
      }
        
};