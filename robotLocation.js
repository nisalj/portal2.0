
export default class RobotLocation{
    constructor() {
        this.lat;
        this.long; 
        this.uncertRadius; 
        this.speed; 
        this.dgps = false;
        this.fixMode = 0;
    }


getLat() {
    return this.lat;
}
  
getLong() {
    return this.long; 
}
  
getSpeed() {
    return this.speed; 
}
setLat(lat) {
    this.lat = lat; 
}

setFixMode(fix) {
    this.fixMode = fix; 
}
  
setLong(long) {
    this.long = long; 
}
  
  
getUncertRadius() {
    return this.uncertRadius; 
}
  
setUncertRadius(radius) {
  this.uncertRadius = radius;
}
  
setSpeed(speed) {
    this.speed = speed; 
}

}