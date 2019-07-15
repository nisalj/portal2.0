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


 
    dragSeg(marker) {
        let pos = marker; 
        let title = marker.title;

        if(title == 1) {
        let seg = this.getFirst(); 
        seg.setStart(pos);
        seg.changeLineStart();
        } else if (title == (this.segNo()+1)) {
        let seg = this.getLast(); 
        seg.setEnd(pos);
        seg.changeLineEnd(); 
        } else {
        let seg1 = this.getSegAt(title-2);
        let seg2 = this.getSegAt(title-1); 
        seg1.setEnd(pos);
        seg1.changeLineEnd();
        seg2.setStart(pos);
        seg2.changeLineStart();
        }
    }
    
    

    //renders the line and the end waypoint of the last segment 
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
        console.log('line');
         if (i == this.segNo() - 1)
         this.segments[i].renderEnd(map); 
        }
    }

    getFirst() {
        if (this.segments.length == 0)
        return; 
        else 
        return  this.segments[0]; 
           
    }

    addFirst(start, end) {
        let seg = new Segment(start, end); 
        this.segments.unshift(seg);
        seg.renderStart(start.map);
        seg.renderLine(start.map); 
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

    getSegAt(no) {
        return this.segments[no]; 
    }

    makePath(map) {
        let array; 
        this.segments = []; 

        $.get(location.origin + '/plan', (data) => {
            
            if (data != "{}") {

            
           let string = JSON.stringify(data); 
           let end = string.length - 4;
           let start = 1; 
           let mod = string.slice(start, end); 
           array = JSON.parse(JSON.parse(mod)); 

       

        
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

            
            this.segments.push(new Segment(start, end, array[i].maxSpeed, array[i].speed, array[i].bearing)); 

        }
        this.renderPath(map); 

    
    }
    
    });

    //console.log('line', this.segNo()); 

      
    
    }



    sendPath() {
        let array = [];
        for (let i = 0; i < this.segNo(); i++) {
            array.push(this.segments[i].convertSeg());
        }

        let text = JSON.stringify(array);
        console.log(text); 

        
     

        $.post(location.origin +'/plan', text, () => {}, text); 

       // console.log(this.segments);
    }
}