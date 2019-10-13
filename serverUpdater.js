import  StateUpdater from './stateUpdater.js';

export default class ServerUpdater extends StateUpdater{

 
    constructor(med, socket) {
    super(med); 
    this.status = "view"; 
    this.socket = socket;
    
    }
  

    //methods for listening to updates on heading and location

    getHeading() {
      this.socket.on('new heading', data => {
        let heading = Object.keys(data)[0];
       // console.log(Object.keys(this.heading)[0])
        //console.log(this.heading); 
        this.updateHeading(heading);
      })
    }
  
    getLocation() {
      this.socket.on('new location', data => {
          let lat = parseFloat(data.lat); 
          let long = parseFloat(data.long); 
          let uncertRadius = parseFloat(data.uncert);
          let speed = parseFloat(data.speed);
          this.updateLocation(lat, long, uncertRadius, speed, 0);

     //     this.plotPath();     
      });

      
  
    }


    getMotion() {
      this.socket.on("new motion", data => {
        let accX = parseFloat(data.accX); 
        let accY = parseFloat(data.accY); 
        let accZ = parseFloat(data.accZ);
        let rotAlpha = parseFloat(data.rotA); 
        let rotBeta = parseFloat(data.rotB); 
        let rotGamma = parseFloat(data.rotG); 
        this.updateMotion(accX, accY, accZ, rotAlpha, rotBeta, rotGamma); 
      });
    }
    
    start() {

       // this.makePlan(); 
        setTimeout(this.getLocation.bind(this), 200); 
        setTimeout(this.getHeading.bind(this), 200); 

       // this.getSharerPos(); 
       // this.getHeading(); 
        
        
    }
  
  
  
  }; 
  