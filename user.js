import Path from './path.js';

export default class User {

    constructor(path) {
      this.path = path; 
      this.lat;
      this.long; 
      this.firstReading = true;  
      this.status;
      this.planPlath = new Path(); 
      this.heading; 
      //get rid of these 
      this.sidebar = document.getElementById('sidebar'); 
      this.headval = document.getElementById('heading-val');  

    }






   
  
    addFirst() {
      console.log("lat", this.lat, "long", this.long); 
      let latlng = {lat: this.lat, lng: this.long};
      console.log(latlng);
      let start  = new google.maps.Marker({
        position: latlng,
        map: this.path.map,
        title: '#1'
      
      });

      let end = this.planPlath.getFirst().getStart(); 
      this.planPlath.addFirst(start, end);

    }


  showHeading() {
  sidebar.style.display = "block"; 
  this.headval.value = this.heading; 
  let lineSymbol = {
    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    //path: google.maps.SymbolPath.CIRCLE,
    scale: 5,
    rotation: this.heading,
  };

  this.path.setOptions(
  {
  icons: [{
      icon: lineSymbol,
      offset: '100%',
      fixedRotation: true
  }],
  })
 // this.path.icon.rotation = this.heading; 
  }
  

    plotPath() {
      if(this.firstReading && this.planPlath.segNo()) {
        this.addFirst();
        this.firstReading = false; 
      }
      window.testfunc(); 
      let map = this.path.map; 
      map.setZoom(17);
      let path = this.path.getPath();
      let latlng = new google.maps.LatLng(this.lat, this.long);
      map.panTo(latlng);
      console.log("updating",latlng.lat(),latlng.lng() );
     // path.icons[0].icon.scale = 50; 

      console.log(path); 
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