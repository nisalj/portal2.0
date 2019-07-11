import User from './user.js'
export default class Sharer extends User {

    constructor(title, options, path) {
      super(path); 
      this.options = options; 
      this.title = title; 
      this.status = "share";
      this.locating = "Locating";
      this.tracking =  "Sharing";
      this.unable = "Unable to retrieve your location";
  
    }

  

    success(position) {
      //console.log(position.coords.latitude);
      //console.log(this); 
        this.lat  = position.coords.latitude;
        this.long = position.coords.longitude;
       
        this.sharePos();
        this.plotPath();
  
    };
  
    error(status) {
      this.title.textContent = unable;
  
    }; 
    
    getLocation() {
      console.log('view');
      console.log(this); 
       let status = this.title; 
        
      if (!navigator.geolocation) {
        status.textContent = 'Geolocation is not supported by your browser';
      } else {
        if(status.textContent != this.tracking && status.textContent != this.unable)
        status.textContent = this.locating;
        let success = this.success.bind(this); 
        let error = this.error.bind(this); 
        navigator.geolocation.watchPosition(success, error, this.options);
        status.textContent = this.tracking;
      }
    
    }
    
    start() {
      this.getLocation(); 
    }
  
    sharePos() {
      let params = "lat="+this.lat+"&long="+this.long; 
  
      let xhr;
      if (window.XMLHttpRequest) {
          xhr = new XMLHttpRequest();
      }
      else if (window.ActiveXObject) {
          xhr = new ActiveXObject("Msxml2.XMLHTTP");
      }
      else {
          throw new Error("Ajax is not supported by this browser");
      }
  
      xhr.onload = function() {
        if(xhr.status == 200){
        //  console.log(xhr.responseText); 
        }
      }
        console.log(params);
  
        xhr.open('POST', location.origin +'/loc');
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(params);  
      }
  
  };
  