
export default class TargetCalculator {
    constructor(location, heading) {
        this.linear; 
        this.angular; 
        this.vec1 = new Victor(1, 1); 
        this.vec2 = new Victor(1, 1); 
        this.sampleTime = 2;  
        this.location = location; 
        this.heading = heading; 
        this.currentSeg;
        this.targetPerp;
        this.targetWaypoint; 
        this.predictedPoint; 
        this.targetBearing;  
        this.tolerance = 1;
        this.offSetDist = 5; 
        this.offsetPoint;

    }

 getTargetPoint() {
return this.targetWaypoint; 
 }   

 getTargetBearing() {
     return this.targetBearing; 
 }

 getPerpPoint() {
 return this.targetPerp; 
}

getFuturePoint() {
return this.predictedPoint; 
}

calcTargetPoint() {
    this.makeRobotVector(); 
    this.makePathVector(); 
    this.targetPerp = this.calcPerpPoint(); 
}



makeOffsetPoint(pos, dist, ang) {
    this.offsetPoint = google.maps.geometry.spherical.computeOffset(pos, dist, ang); 
}
onLocUpdate(currentSeg, point) {
    if(!this.currentSeg || currentSeg != this.currentSeg) {
        this.currentSeg = currentSeg; 
        let lat = this.location.getLat(); 
        let long = this.location.getLong(); 
        let latlng = new google.maps.LatLng({lat: lat, lng: long}); 
        this.calcTargetPoint(); 

    let dist = this.calcDistance(latlng, this.targetPerp); 

    if (dist > this.tolerance) {
       this.targetWaypoint = this.offsetPoint; 
       this.targetBearing = this.calcBearing(latlng, this.offsetPoint)
    } else {
        this.targetWaypoint = this.currentSeg.getEnd().position;
        this.targetBearing =  this.calcBearing(latlng, point.position);  
    }  
    return this.targetBearing; 
    } 
    
    this.currentSeg = currentSeg; 
    let lat = this.location.getLat(); 
    let long = this.location.getLong(); 
    let latlng = new google.maps.LatLng({lat: lat, lng: long}); 
    
    if(this.offsetPoint ) {
  //      this.prevseg = this.currentSeg;
        if(this.calcDistance(latlng, this.offsetPoint) > 4)
        this.targetWaypoint = this.offsetPoint; 
        this.targetBearing = this.calcBearing(latlng, this.offsetPoint)
        return this.targetBearing;
    }


    this.calcTargetPoint(); 

    let dist = this.calcDistance(latlng, this.targetPerp); 

    if (dist > this.tolerance) {
       this.targetWaypoint = this.offsetPoint; 
       this.targetBearing = this.calcBearing(latlng, this.offsetPoint)
    } else {
        this.targetWaypoint = this.currentSeg.getEnd().position;
        this.targetBearing =  this.calcBearing(latlng, point.position);  
    }  
    return this.targetBearing; 
}  



predictPos() {
    let lat = this.location.getLat(); 
    let long = this.location.getLong(); 

    let latlng = new google.maps.LatLng({lat: lat, lng: long}); 
    let dist = this.linear*this.sampleTime; 
    console.log("dist", dist); 
    var ang; 
    ang = this.toDegrees(this.angular*this.sampleTime); 
    if (this.angular > 0) {
    ang = this.heading.getHeading() - ang;
    }
    else {
    ang = Math.abs(ang) + this.heading.getHeading();
    }
    if (ang < 0) 
    ang = 360 + ang; 
    if (ang > 360)
    ang = 360 - ang; 
    this.predictedPoint = google.maps.geometry.spherical.computeOffset(latlng, dist, ang)
    return this.predictedPoint; 
}

makeVector(start, end) {
    let dist = this.calcDistance(start, end);
    let angle = this.bearingToAngle(this.calcBearing(start, end)); 
    let vecx = Math.cos(this.toRadians(angle))*dist;
    let vecy = Math.sin(this.toRadians(angle))*dist; 

    return  [vecx, vecy]; 
  
}


makeRobotVector() {
    let start = this.currentSeg.getStart().position; 
    let end = this.predictPos();  
    let vec = this.makeVector(start, end); 
    this.vec1.x = vec[0]; 
    this.vec1.y = vec[1];
}

makePathVector() {
    let start = this.currentSeg.getStart().position; 
    let end = this.currentSeg.getEnd().position; 
    let vec = this.makeVector(start, end); 
    this.vec2.x = vec[0]; 
    this.vec2.y = vec[1];
}


calcPerpPoint() {
    this.vec2.normalize(); 
    let a  = this.vec2.multiplyScalar(this.vec1.dot(this.vec2)); 
    let dist = a.length(); 
//  let ang = this.bearingToAngle(a.horizontalAngleDeg());
    let ang = this.currentSeg.getBearing(); 
    this.makeOffsetPoint(this.currentSeg.getStart().position, dist+this.offSetDist, ang)
 //   let ang = a.horizontalAngleDeg(); 
    return google.maps.geometry.spherical.computeOffset(this.currentSeg.getStart().position, dist, ang);
}


toDegrees(angle) {
    return angle * (180 / Math.PI);
}

toRadians (angle) {
    return angle * (Math.PI / 180);
}



calcDistance(start, end) {
 return google.maps.geometry.spherical.computeDistanceBetween(start, end);

}

calcBearing(start, end) {
    let bearing =  google.maps.geometry.spherical.computeHeading(start, end);   
    if (bearing < 0)
    bearing =  360 + bearing;

    //this.bearing = bearing; 
    return bearing; 

}


bearingToAngle(bearing) {
    if (!bearing)
    return; 

    if (bearing <= 0 && bearing >= 90) {
       return 90 - bearing;
    } else {
        return 450 - bearing; 
    }

}


}
