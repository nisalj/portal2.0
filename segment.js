export default class Segment{

    constructor(start, end, maxSpeed=5, speed = 2) {
        this.start = start; 
        this.end = end; 
        this.maxSpeed = maxSpeed;
        this.speed = speed; 
        this.poly =  new google.maps.Polyline({
            strokeColor: "black",
            strokeOpacity: 1.0,
            strokeWeight: 3
          });
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
        }
        return seg; 
     //   return JSON.stringify(seg, null, 2);        
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
    //    this.clearStart();
        this.clearEnd(); 
        this.clearLine(); 
    }




    getEnd() {
        return this.end; 
    }

    setStart(start) {
        this.start = start; 
    }

    setEnd(end) {
        this.end = end; 
    }

    setSpeed (speed) {
        this.speed = speed; 
    }

    setMaxSpeed(maxSpeed) {
        this.maxSpeed = maxSpeed
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