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
       // console('dragging'); 
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
    
    insertAt(no, seg) {
        this.segments.splice(no, 0, seg)
       // this.segments.insertAt(no,seg); 
    }

    removeAt(no) {
        this.segments.splice(no, 1);
    }

    splitSeg(markerNo, map) {
        window.click = window.click + 2; 
        let segIndex = markerNo - 1; 
        let seg  = this.getSegAt(segIndex);
        let start = seg.getStart(); 
        let end = seg.getEnd(); 
        let midpoint = google.maps.geometry.spherical.interpolate(start.position, end.position, 0.5);
        let marker = new google.maps.Marker ({
            position: midpoint,
            map: null,
            title: '#',
            draggable: true,
        });

        marker.addListener('drag', window.dragListen); 

        //add midpoint to end 
        let seg1 = new Segment(marker, end);
        this.insertAt(segIndex, seg1);
        //add start to midpoint
        let seg2 = new Segment(start, marker);
        this.insertAt(segIndex, seg2);
        //remove index + 2
        seg.clearWholeSeg(); 
        this.removeAt(segIndex+2); 
        this.updateIds();
       // this.renderPath(map);
    
       // console.log(map);
      //  seg1.renderStart(map);

        seg1.renderLineEnd(map);
        seg1.renderStart(map);
        seg2.renderStart(map);
       // seg2.renderEnd(map);
        seg2.renderLine(map);
       // seg2.renderLineEnd(map); 
    }
    

    updateIds() {
        let no = this.segNo(); 
        for (let i = 0; i<no; i++) {
            let start = this.getSegAt(i).getStart();
            let end = this.getSegAt(i).getEnd();
            start.title = String(i + 1);
            end.title = String(i + 2);  

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