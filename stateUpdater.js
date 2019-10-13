
import RobotLocation from './robotLocation.js';
import RobotMotion from './robotMotion.js';
import RobotHeading from './robotHeading.js'; 


export default class StateUpdater {
    constructor(med) {
        this.location = new RobotLocation(); 
        this.motion = new RobotMotion();
        this.heading = new RobotHeading(); 
        this.angular; 
        this.linear; 
        this.med = med; 
    }

    start() {
        this.getLocation();
        this.getHeading(); 
       // setTimeout(this.getLocation.bind(this), 200);
       // setTimeout(this.getHeading.bind(this), 300);
    }

    updateHeading(heading) {
        this.heading.setHeading(heading);
        this.notifyHeading(); 
    }

    updateWheelSpeed(linear, angular) {
        this.linear = linear;
        this.angular = angular; 
        this.notifyWheelSpeed(); 
    }

    updateMotion(accX, accY, accZ, rotA, rotB, rotG) {
        this.motion.setAccX(accX);
        this.motion.setAccY(accY);
        this.motion.setAccZ(accZ);
        this.motion.setRotAlpha(rotA);
        this.motion.setRotBeta(rotB);
        this.motion.setRotGamma(rotG);
    }

    updateLocation(lat, long, speed, uncertRadius, fixmode) {
        this.location.setLat(lat);
        this.location.setLong(long);
        if(speed)
        this.location.setSpeed(speed);
        if(uncertRadius)
        this.location.setUncertRadius(uncertRadius);
        if(fixmode)
        this.location.setFixMode(fixmode);  
        this.notifyLocation(); 
    }

    notifyWheelSpeed(){
        this.med.newWheelSpeed(this.angular, this.linear); 
    }

    notifyHeading() {
        this.med.newHeading(this.heading); 
    }

    notifyMotion() {
        this.med.newMotion(this.motion);
    }

    notifyLocation() {
        this.med.newLocation(this.location); 
    }

    shareMotion() {
     
         let bytesToSend = [this.motion.getAccX()*100, this.motion.getAccY()*100,this.motion.getAccZ()*100, 
           this.motion.getRotAlpha(), this.motion.getRotBeta(), this.motion.getRotGamma()];
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

      shareLocation() {
        let params = "lat="+this.location.getLat()+"&long="+this.location.getLong()+"&uncert="+this.location.getUncertRadius()+
            "&speed="+this.location.getSpeed(); 
    
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

        shareHeading() {
            let data = this.heading.getHeading(); 
            $.ajax({
              type: 'POST',
              url: location.origin+'/heading',
              data: data,
              //success: success,
              dataType: "text",
      
        });
      
           // $.post(location.origin+'/heading', dir); 
        }
      



};
