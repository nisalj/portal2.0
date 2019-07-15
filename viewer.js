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
  
    getSharerPos() {
      this.socket.on('new location', data => {
          this.firstloc = false; 
          this.lat = parseFloat(data.lat); 
          this.long = parseFloat(data.long); 
          console.log(this.firstReading);  

          this.plotPath();     
      });

      
  
    }
    
    start() {

        this.makePlan(); 
        setTimeout(this.getSharerPos.bind(this), 200); 
        setTimeout(this.getHeading.bind(this), 200); 

       // this.getSharerPos(); 
       // this.getHeading(); 
        
        
    }
  
  
  
  }; 
  