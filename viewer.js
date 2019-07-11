import User from './user.js'
export default class Viewer extends User {

 
    constructor(path, socket) {

    super(path); 
    this.status = "view"; 
    this.socket = socket;
    
    }
  
  
    getSharerPos() {
      this.socket.on('new location', data => {
          this.lat = data.lat; 
          this.long = data.long;   
          this.plotPath();     
      });

      
  
    }
    
    start() {

        this.makePlan(); 
        this.getSharerPos(); 
        
    }
  
  
  
  }; 
  