import User from './user.js'
export default class Viewer extends User {

 
    constructor(path, socket) {

    super(path); 
    this.status = "view"; 
    this.socket = socket;
    
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
        
        
    }
  
  
  
  }; 
  