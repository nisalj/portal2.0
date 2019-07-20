import User from './user.js'
export default class Sharer extends User {

    constructor(title, options, path) {
      super(path); 
      this.options = options; 
      this.title = title; 
      this.status = "share";
      this.locating = "Locating";
      this.tracking =  "Sharing";
      this.unable = "Unable to retrieve your location";
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
       
        this.sharePos();
        this.plotPath();
        this.postDetails(); 

  
    };
  
    error(status) {
      this.title.textContent = unable;
  
    }; 
    
    getLocation() {
      console.log('view');
      console.log(this); 
       let status = this.title; 
        
      if (!navigator.geolocation) {
        status.textContent = 'Geolocation is not supported by your browser';
      } else {
        if(status.textContent != this.tracking && status.textContent != this.unable)
        status.textContent = this.locating;
        let success = this.success.bind(this); 
        let error = this.error.bind(this); 
        navigator.geolocation.watchPosition(success, error, this.options);
        status.textContent = this.tracking;

      }
      status.style.display = "none"; 

    }

  getMotion() {
    if(window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', function(event) {
                this.accX = event.accelerationIncludingGravity.x;
                this.accY = event.accelerationIncludingGravity.y;
                this.accZ = event.accelerationIncludingGravity.z;
                var r = event.rotationRate;
                if (r) {
                  this.rotAlpha = r.alpha;
                  this.rotBeta = r.beta;
                  this.rotGamma = r.gamma; 
                }

              let obj = {
                accX: this.accX,
                accY: this.accY,
                accZ: this.accZ,
                rotA: this.rotAlpha,
                rotB: this.rotBeta,
                rotG: this.rotGamma,
              }

                $.post('/acc', obj);
           

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

      this.makePlan(); 
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


    postDetails() {
      let detail;
      if (this.planPlath.segNo() == 0) {
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


  
    sharePos() {
      let params = "lat="+this.lat+"&long="+this.long; 
  
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
        console.log(params);
  
        xhr.open('POST', location.origin +'/loc');
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(params);  
      }
  
  };
  