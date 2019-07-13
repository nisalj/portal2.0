import User from './user.js'
export default class Viewer extends User {

 
    constructor(path, socket) {

    super(path); 
    this.status = "view"; 
    this.socket = socket;
    
    }
  

    getHeading() {
      this.socket.on('new heading', data => {
        this.heading = Object.keys(data)[0];
       // console.log(Object.keys(this.heading)[0])
        //console.log(this.heading); 
        this.showHeading(); 
      })
    }
  
    getSharerPos() {
      this.socket.on('new location', data => {
          this.lat = parseFloat(data.lat); 
          this.long = parseFloat(data.long); 
          console.log(this.firstReading);  
          this.plotPath();     
      });

      
  
    }
    
    start() {

        this.makePlan(); 
        this.getSharerPos(); 
        this.getHeading(); 
        
        
    }
  
  
  
  }; 
  