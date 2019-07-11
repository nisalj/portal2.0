import Path from './path.js';

export default class User {
    constructor(path) {
      this.path = path; 
      this.lat;
      this.long; 
      this.status;
      this.planPlath = new Path(); 
    }
  
    plotPath() {
      let map = this.path.map; 
      map.setZoom(17);
      let path = this.path.getPath();
      let latlng = new google.maps.LatLng(this.lat, this.long);
      map.panTo(latlng);
      console.log("updating",latlng.lat(),latlng.lng() );
      path.push(latlng);
    }

    makePlan() {

        console.log('making');
      
        this.planPlath.makePath(this.path.map); 
           
            

   

    }
   

    test() {
        console.log(this.planPlath.segNo()); 

    }

    
  
   
  
  
  }; 