export default class Segment{

    constructor(start, end, maxSpeed=5, speed = 2) {
        this.start = start; 
        this.end = end; 
        this.maxSpeed = maxSpeed;
        this.speed = speed; 
        this.bearing = google.maps.geometry.spherical.computeHeading(this.start.position, this.end.position);
        this.distance =  google.maps.geometry.spherical.computeDistanceBetween(this.start.position, this.end.position);
        this.poly =  new google.maps.Polyline({
            strokeColor: "black",
            strokeOpacity: 1.0,
            strokeWeight: 3
          });
        this.speedDef = true; 
        this.maxSpeedDef = true; 
    }


    isSpeedDef() {
        return this.speedDef;
    }

    isMaxDef() {
        return this.maxSpeedDef;
    }

    setSpeedDef(bool) {
        if (bool)
        this.speedDef = true; 
        else 
        this.speedDef = false; 
    }


    setMaxDef (bool) {
        if (bool)
        this.maxSpeedDef = true;
        else 
        this.maxSpeedDef = false; 
    }




    updateBearing() {
    let bearing = google.maps.geometry.spherical.computeHeading(this.start.position, this.end.position);
    if (bearing < 0)
    this.bearing = 360 + bearing;
    else 
    this.bearing = bearing;

    }

    getBearing() {
        return this.bearing; 
    }

    getStart() {
        return this.start; 
    }

    convertSeg(){
        let seg = {
            startLat : this.start.position.lat(), 
            startLong : this.start.position.lng(), 
            endLat : this.end.position.lat(), 
            endLong : this.end.position.lng(),
            maxSpeed : this.maxSpeed,
            speed : this.speed, 
            bearing: this.bearing
        }
        return seg; 
     //   return JSON.stringify(seg, null, 2);        
    }


    changeColor(color) {
        this.poly.setOptions({
            strokeColor: color
        })
    }
    
    clearStart() {
        this.start.setMap(null);
    }

    clearEnd() {
        this.end.setMap(null);
    }

    clearLine() {
        this.poly.setMap(null); 
    }

    renderStart(map) {
        this.start.setMap(map); 
    }

    renderEnd(map) {
        this.end.setMap(map); 
    }

    changeLineEnd() {
        let line = this.poly.getPath(); 
        if (line) {
            line.pop()
            line.push(this.getEnd().position)      
        }
    }

    changeLineStart() {
        //this.poly.setMap(null); 
        let line = this.poly.getPath(); 
        if (line) {
            line.removeAt(0);
            line.insertAt(0, this.getStart().position)      
        }
   
        
    }

    renderLine(map) {

    this.poly.setMap(map);
    let line = this.poly.getPath(); 
    line.push(this.getStart().position);
    line.push(this.getEnd().position);
    }

    


    renderLineEnd(map) {
        this.renderLine(map);
        this.renderEnd(map); 
    }

    clearSeg() {
       // this.clearStart();
        this.clearEnd(); 
        this.clearLine(); 
    }

    clearWholeSeg() {
         this.clearStart();
         this.clearEnd(); 
         this.clearLine(); 
     }




    getEnd() {
        return this.end; 
    }

    setStart(start) {
        this.start = start; 
        this.updateBearing(); 
    }

    setEnd(end) {
        this.end = end; 
        this.updateBearing(); 
    }

    setSpeed (speed) {
        this.speed = speed; 
    }

    setMaxSpeed(maxSpeed) {
        this.maxSpeed = maxSpeed
    }

    getDist() {
        return this.distance;
    }

    getMaxSpeed() {
        return this.maxSpeed; 
    }

    getSpeed() {
        return this.speed; 
    }

   

    test() {
  
    }

}; 