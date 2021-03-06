import User from './user.js'
export default class Sharer extends User {

    constructor( options, path, plan) {
      super(path, plan); 
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

        this.lat  = position.coords.latitude;
        this.long = position.coords.longitude;
        this.uncertRadius = position.coords.accuracy; 
        this.speed = position.coords.speed; 
        this.shareLocation();
        this.plotPath();
        this.shareDetails(); 

  
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


    shareMotion() {
      // let obj = {
      //   time: new Date(),
      //   accX: this.accX,
      //   accY: this.accY,
      //   accZ: this.accZ,
      //   rotA: this.rotAlpha,
      //   rotB: this.rotBeta,
      //   rotG: this.rotGamma,
      // }
      // let bytesToSend = [Math.abs(this.accX), Math.abs(this.accY), Math.abs(this.accZ), 
      //   Math.abs(this.rotAlpha)/10, Math.abs(this.rotBeta)/10, Math.abs(this.rotGamma)/10 ];
       let bytesToSend = [this.accX*100, this.accY*100,this.accZ*100, 
         this.rotAlpha, this.rotBeta, this.rotGamma];
      let bytesArray = new Int16Array(bytesToSend);

      $.ajax({
        url: '/acc',
        type: 'POST',
        contentType: 'application/octet-stream',  
        data: bytesArray,
        processData: false
     });
       // $.post('/acc', obj);
   
    }
    

  getMotion() {
    let that = this; 

    if(window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', function(event) {
                that.accX = event.accelerationIncludingGravity.x;
                that.accY = event.accelerationIncludingGravity.y;
                that.accZ = event.accelerationIncludingGravity.z;
                var r = event.rotationRate;
                if (r) {
                  that.rotAlpha = r.alpha;
                  that.rotBeta = r.beta;
                  that.rotGamma = r.gamma; 
                }
              console.log(that);
              
              that.shareMotion();
          

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
     var beta     = event.beta; //x axis rotation [-180, 180]
     var gamma    = event.gamma; //y axis rotation [-90, 90]

     //Check if absolute values have been sent
     if (typeof event.webkitCompassHeading !== "undefined") {
       alpha = event.webkitCompassHeading; //iOS non-standard
        this.heading = alpha.toFixed([0]);
      
        //this.heading= parseFloat(this.heading); 
       // this.heading = JSON.stringify(this.heading)
        //this.heading = Object.keys(this.heading)[0]; 
        this.shareHeading(this.heading);
     }
     else {
       alert("Your device is reporting relative alpha values, so this compass won't point north :(");
       this.heading = 360 - alpha; //heading [0, 360)
       this.heading = this.heading.toFixed([0]);
      // this.heading = Object.keys(this.heading)[0] 
       this.shareHeading(this.heading);
     }
     this.showHeading(); 

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

    shareHeading(dir) {
      $.ajax({
        type: 'POST',
        url: location.origin+'/heading',
        data: dir,
        //success: success,
        dataType: "text",

  });

     // $.post(location.origin+'/heading', dir); 
    }


    shareDetails() {
      let detail;
      if (!this.planPath) {
        detail = {
          latitude: this.lat,
          longitude: this.long,
          heading: this.heading,
        }
      } else {
        detail = {
          currentSeg: this.currentSeg,
          targetWayPointLat: this.targetWayPoint.position.lat(),
          targetWayPointLong: this.targetWayPoint.position.lng(),
          latitude: this.lat,
          longitude: this.long,
          heading: this.heading,
          targetBearing: this.targetBearing,
          correction: this.correction,
          distance: this.distance,
        }
      }
      
    //  console.log(detail);
       $.post('/details', detail);

    
    }


  
    shareLocation() {
      let params = "lat="+this.lat+"&long="+this.long+"&uncert="+this.uncertRadius+"&speed="+this.speed; 
  
      let xhr;
      if (window.XMLHttpRequest) {
          xhr = new XMLHttpRequest();
      }
      else if (window.ActiveXObject) {
          xhr = new ActiveXObject("Msxml2.XMLHTTP");
      }
      else {
          throw new Error("Ajax is not supported by this browser");
      }
  
      xhr.onload = function() {
        if(xhr.status == 200){
        //  console.log(xhr.responseText); 
        }
      }
  
        xhr.open('POST', location.origin +'/loc');
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(params);  
      }
  
  };
  