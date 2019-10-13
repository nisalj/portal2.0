import StateUpdater from './stateUpdater.js';


export default class PhoneUpdater extends StateUpdater{

    constructor(med, options) {
      super(med); 
      this.options = options; 
      this.status = "share";
      this.readno = 0;

    }

  

    success(position) {
      //console.log(position.coords.latitude);
      //console.log(this); 
      // this.readno++; 
      // if (this.readno < 20)
      // return; 

        let lat  = position.coords.latitude;
        let long = position.coords.longitude;
        let uncertRadius = position.coords.accuracy; 
        let speed = position.coords.speed; 
        this.updateLocation(lat, long, speed,uncertRadius, 0); 
        //this.shareLocation();
        //this.shareDetails(); 

  
    };
  
    error(status) {
  
    }; 
    
    getLocation() {
      console.log('view');
      console.log(this); 
        
      if (!navigator.geolocation) {
      } else {
    
        let success = this.success.bind(this); 
        let error = this.error.bind(this); 
        navigator.geolocation.watchPosition(success, error, this.options);

      }

    }


   

  getMotion() {
    let that = this; 

    if(window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', function(event) {
                let accX = event.accelerationIncludingGravity.x;
                let accY = event.accelerationIncludingGravity.y;
                let accZ = event.accelerationIncludingGravity.z;
                var r = event.rotationRate;
                let rotAlpha = r.alpha;
                let rotBeta = r.beta;
                let rotGamma = r.gamma; 
              that.updateMotion(accX, accY, accZ,rotAlpha, rotBeta, rotGamma); 
              
             // that.shareMotion();
          

                // var html = 'Acceleration:<br />';
                // html += 'x: ' + x +'<br />y: ' + y + '<br/>z: ' + z+ '<br />';
                // html += 'Rotation rate:<br />';
                // if(r!=null) html += 'alpha: ' + r.alpha +'<br />beta: ' + r.beta + '<br/>gamma: ' + r.gamma + '<br />';
                // dataContainerMotion.innerHTML = html;                  
              });
      }
  }   

  
    
    
    start() {
      $.post('/start', 'mission start');

      // if(document.getElementById('planNobox'))
      // this.makePlan(); 
      setTimeout(this.getLocation.bind(this), 200);
      setTimeout(this.getHeading.bind(this), 300);
      setTimeout(this.getMotion.bind(this),400);

     // setTimeout(this.getHeading.bind(this),200); 
     // this.getLocation(); 

    }
 

    deviceOrientationListener(event) {
     
     var alpha    = event.alpha; //z axis rotation [0,360)
     var heading; 

     //Check if absolute values have been sent
     if (typeof event.webkitCompassHeading !== "undefined") {
       alpha = event.webkitCompassHeading; //iOS non-standard
        heading = alpha.toFixed([0]);
        heading= parseFloat(heading); 
        heading = JSON.stringify(heading)
        heading = Object.keys(heading)[0]; 
        //this.shareHeading(this.heading);
     }
     else {
       alert("Your device is reporting relative alpha values, so this compass won't point north :(");
       heading = 360 - alpha; //heading [0, 360)
       heading = heading.toFixed([0]);
      // this.heading = Object.keys(this.heading)[0] 
      // this.shareHeading(this.heading);
     }
     this.updateHeading(heading); 
     //this.showHeading(); 

    }

    getHeading() {

      if (window.DeviceOrientationAbsoluteEvent) {
        window.addEventListener("DeviceOrientationAbsoluteEvent", this.deviceOrientationListener.bind(this));
      } // If not, check if the device sends any orientation data
      else if(window.DeviceOrientationEvent){
  
        window.addEventListener("deviceorientation", this.deviceOrientationListener.bind(this));
      } // Send an alert if the device isn't compatible
      else {
        alert("Sorry, try again on a compatible mobile device!");
      }
    }

 




  

  
  };
  