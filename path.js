import Segment from "./segment.js";

export default class Path {
    constructor() {
        this.segments = []; 
    }


    addSeg(segment) {
        this.segments.push(segment);
    }

    deleteLast() {
        this.segments.pop(); 
    }

    newUpdate(map) {
        this.getLast().renderLineEnd(map); 
    }

    segNo() {
        return this.segments.length; 
    }

    undoPath(map) {
        if (this.segNo() != 0) {
            this.getLast().clearSeg(); 
            this.deleteLast(); 
        }
        console.log(this.segNo()); 
           
        
    }

    clear(map) {
        this.segments.forEach((seg) => {
            seg.clearSeg(); 
        })
        this.segments = []; 
        
    }

    renderPath(map) {
        for (let i = 0; i < this.segNo(); i++) {
         this.segments[i].renderStart(map); 
         this.segments[i].renderLine(map); 
         if (i == this.segNo() - 1)
         this.segments[i].renderEnd(map); 
        }
    }

    getLast() {
        if (this.segments.length == 0)
        return; 
        else {
            let last =  this.segments[this.segments.length -1]; 
            return last; 
        }
       
    }

    isEmpty() {
       return this.segments.length == 0 ? true : false; 
    }

    makePath(map) {
        let array; 
        this.segments = null; 

        $.get(location.origin + '/plan', (data) => {
            array = JSON.parse(data); 
        }); 

        for (let i = 0; i < array.length; i++) {
            start = new google.maps.Marker ({
                position: {lat: array[i].startLat, lng: array[i].startLong},
                map: map,
                title: '#' + i,
            });

            end = new google.maps.Marker ({
                position: {lat: array[i].endLat, lng: array[i].endLong},
                map: map,
                title: '#' + i,
            });
            this.segments.push(new Segment(start, end, array[i].maxSpeed, array[i].speed)); 
        }
    
    }



    sendPath() {
        let array = [];
        for (let i = 0; i < this.segNo(); i++) {
            array.push(this.segments[i].convertSeg());
        }

        let text = JSON.stringify(array);
        
        $.post(location.origin +'/plan', text); 

       // console.log(this.segments);
    }
}