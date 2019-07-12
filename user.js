import Path from './path.js';

export default class User {
    constructor(path) {
      this.path = path; 
      this.lat;
      this.long; 
      this.firstReading = true;  
      this.status;
      this.planPlath = new Path(); 
    }
  
    addFirst() {

      let latlng = {lat: this.lat, lng: this.long};
      let start  = new google.maps.Marker({
        position: latlng,
        map: this.path.map,
        title: '#1'
      
      });

      let end = this.planPlath.getFirst().getStart(); 
      this.planPlath.addFirst(start, end);
       
    }

    plotPath() {
      if(this.firstReading) {
        this.addFirst();
        this.firstReading = false; 
      }

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