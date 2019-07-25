import User from './user.js'
export default class Viewer extends User {

 
    constructor(path, socket) {

    super(path); 
    this.status = "view"; 
    this.socket = socket;
    this.firstloc = true; 
    
    }
  

    //methods for listening to updates on heading and location

    getHeading() {
      this.socket.on('new heading', data => {
        this.heading = Object.keys(data)[0];
       // console.log(Object.keys(this.heading)[0])
        //console.log(this.heading); 
        if(!this.firstloc)
        this.showHeading(); 
      })
    }
  
    getLocation() {
      this.socket.on('new location', data => {
          this.firstloc = false; 
          this.lat = parseFloat(data.lat); 
          this.long = parseFloat(data.long); 
          this.uncertRadius = parseFloat(data.uncert);
          this.speed = parseFloat(data.speed);
          console.log(this.firstReading);  

          this.plotPath();     
      });

      
  
    }


    getMotion() {
      this.socket.on("new motion", data => {
        this.accX = parseFloat(data.accX); 
        this.accY = parseFloat(data.accY); 
        this.accZ = parseFloat(data.accZ);
        this.rotAlpha = parseFloat(data.rotA); 
        this.rotBeta = parseFloat(data.rotB); 
        this.rotGamma = parseFloat(data.rotG); 
      });
    }
    
    start() {

        this.makePlan(); 
        setTimeout(this.getLocation.bind(this), 200); 
        setTimeout(this.getHeading.bind(this), 200); 

       // this.getSharerPos(); 
       // this.getHeading(); 
        
        
    }
  
  
  
  }; 
  