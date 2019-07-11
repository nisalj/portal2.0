
export default class User {
    constructor(path) {
      this.path = path; 
      this.lat;
      this.long; 
      this.status;
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
  
   
  
  
  }; 