import Segment from "./segment.js";

export default class Path extends EventTarget {
    constructor() {
        super(); 
        this.segments = []; 
        this.selectedSeg; 
        this.addEventListener('insertSegment', window.insertSeg);
        this.addEventListener('removeSegment', window.removeSeg);

    }

    setSelected(segment) {
        if (!this.selectedSeg) {
        this.selectedSeg = segment;
        this.selectedSeg.changeColor("blue");
        return; 
        }

        this.selectedSeg.changeColor("black");
        this.selectedSeg = segment;
        this.selectedSeg.changeColor("blue");
        window.displayCurrentSeg();    //   window.highlightMarker(segment.getEnd()); 
    }

    getSelected() {
        return this.selectedSeg; 
    }

  

    addSeg(segment) {
   //     this.segments.push(segment);
    let length = this.segNo();
    this.insertAt(length, segment);
    
    }



    deleteLast() {
        let length = this.segNo()-1;
        this.removeAt(length); 

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
        this.segments.splice(no, 0, seg);
        let event = new CustomEvent('insertSegment', { detail: [no,seg] });
        this.dispatchEvent(event);
        
       // this.segments.insertAt(no,seg); 
    }

    removeAt(no) {
        this.segments.splice(no, 1);
        let event = new CustomEvent('removeSegment', { detail: no });
        this.dispatchEvent(event);

    }


    removeAtMarker(map) {
      console.log('initial', this.segNo());
      let selected = this.getSelected(); 
      let index = this.segments.indexOf(selected); 

      if (selected == this.getLast()) {
          this.undoPath(map); 
          return; 
      } 

      let seg1 = selected; 
      let seg2 = this.getSegAt(index+1); 
      seg2.changeColor("green"); 
      let start = seg1.getStart(); 
      let end = seg2.getEnd(); 
    //   seg1.clearWholeSeg();
    //   seg2.clearWholeSeg(); 

       this.removeAt(index); 
       this.removeAt(index); 
       seg1.clearWholeSeg();
       seg2.clearWholeSeg(); 
      
        let newSeg = new Segment(start, end); 
        this.insertAt(index,newSeg);
     //   console.log(index);
    //    console.log('final', this.segNo());
        newSeg.renderStart(map);
     //   newSeg.renderEnd(map);
        newSeg.renderLineEnd(map); 
      
   //     this.updateIds();
   //     this.updateLabels();
        // console.log(this.segments.length);
        // console.log(this.segments);
        // seg1.renderLineEnd()
        // seg1.renderStart();
        // seg2.renderLineEnd()
        // seg2.renderStart();
        // seg2.changeColor("red");
        // seg1.changeColor("green");

    }



    splitSeg(no, seg, map) {

        let segIndex = this.segments.indexOf(seg);  
        //  let seg  = this.getSegAt(segIndex);
        let start = seg.getStart(); 
        let end = seg.getEnd(); 
       // console.log(start); 
       // console.log(end); 
        let prevEnd = start; 

        seg.clearWholeSeg(); 

        this.removeAt(segIndex); 
      //  console.log(start.position); 
       // console.log(end.position); 

        let fraction = 1/no; 
        let movement = fraction; 
        for (let i = 0; i < no; i++) {
          //  console.log(start.position, fraction); 
            console.log(fraction);
            let mid = google.maps.geometry.spherical.interpolate(start.position, end.position, movement)
            let endMarker = new google.maps.Marker ({
                position: mid,
                map: map,
                title: '#',
                draggable: true,
            });
            endMarker.addListener('click', window.markerClick); 
            endMarker.addListener('drag', window.dragListen); 
            let seg  = new Segment(prevEnd, endMarker);
            this.insertAt(segIndex+i, seg);
            prevEnd = endMarker; 
            seg.renderStart(map);
            seg.renderLineEnd(map); 
         //   start = endMarker; 
            movement = movement + fraction; 
        //    this.updateIds(); 

        }
       // this.removeAt(segIndex+no); 




    //    // window.click = window.click + 2; 
    //     let segIndex = this.segments.indexOf(seg);  
    //   //  let seg  = this.getSegAt(segIndex);
    //     let start = seg.getStart(); 
    //     let end = seg.getEnd(); 
    //     let midpoint = google.maps.geometry.spherical.interpolate(start.position, end.position, 0.5);
    //     let marker = new google.maps.Marker ({
    //         position: midpoint,
    //         map: null,
    //         title: '#',
    //         draggable: true,
    //     });
    //     marker.addListener('click', window.markerClick); 
        
    //     marker.addListener('drag', window.dragListen); 
    //     seg.clearWholeSeg(); 
    //     this.removeAt(segIndex); 
    //     //add midpoint to end 
    //     let seg1 = new Segment(marker, end);
    //     this.insertAt(segIndex, seg1);
    //     //add start to midpoint
    //     let seg2 = new Segment(start, marker);
    //     this.insertAt(segIndex, seg2);
    //     //remove index + 2
      
    //     this.updateIds();
    //    // this.renderPath(map);
    
    //    // console.log(map);
    //   //  seg1.renderStart(map);

    //     seg1.renderLineEnd(map);
    //     seg1.renderStart(map);
    //     seg2.renderStart(map);
    //    // seg2.renderEnd(map);
    //     seg2.renderLine(map);
    //    // seg2.renderLineEnd(map); 
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

    updateLabels() {
        let no = this.segNo(); 
        for (let i = 0; i<no; i++) {
            let start = this.getSegAt(i).getStart();
            let end = this.getSegAt(i).getEnd();
            start.setLabel(String(i + 1));
            end.setLabel(String(i + 2));  
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
            seg.clearWholeSeg(); 
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

    makePath(map, planNo) {

        let array; 
        this.segments = []; 
        let that = this; 
        console.log(planNo);
        var request = $.ajax({
            url: '/plan',
            type: 'GET',
            data: { planNo: planNo} ,
            contentType: 'text; charset=utf-8'
        });


        request.done(function (data) {
           

         if (data != "{}") {
            console.log(data);
            array = JSON.parse(data);
        //    let string = JSON.stringify(data); 
        //    let end = string.length - 4;
        //    let start = 1; 
        //    let mod = string.slice(start, end); 
        //    array = JSON.parse(JSON.parse(mod)); 

       
            let start; 
            let end; 
        
        for (let i = 0; i < array.length; i++) {
            start = new google.maps.Marker ({
                position: {lat: Number(array[i].startLat), lng: Number(array[i].startLong)},
                map: map,
                title: String(i),
            });

            end = new google.maps.Marker ({
                position: {lat: Number(array[i].endLat), lng: Number(array[i].endLong)},
                map: map,
                title: String(i),
            });

            console.log(that.segments);
            
            that.segments.push(new Segment(start, end, Number(array[i].maxSpeed), Number(array[i].speed), Number(array[i].bearing))); 

        }
        that.renderPath(map); 
        that.updateLabels(); 

    
    }


    });
    //     $.get(location.origin + '/plan', (data) => {
            
    //         if (data != "{}") {

            
    //        let string = JSON.stringify(data); 
    //        let end = string.length - 4;
    //        let start = 1; 
    //        let mod = string.slice(start, end); 
    //        array = JSON.parse(JSON.parse(mod)); 

       

        
    //     for (let i = 0; i < array.length; i++) {
    //         start = new google.maps.Marker ({
    //             position: {lat: array[i].startLat, lng: array[i].startLong},
    //             map: map,
    //             title: String(i),
    //         });

    //         end = new google.maps.Marker ({
    //             position: {lat: array[i].endLat, lng: array[i].endLong},
    //             map: map,
    //             title: String(i),
    //         });

            
    //         this.segments.push(new Segment(start, end, array[i].maxSpeed, array[i].speed, array[i].bearing)); 

    //     }
    //     this.renderPath(map); 
    //     this.updateLabels(); 

    
    // }
    
    // });

    //console.log('line', this.segNo()); 

      
    
    }



    sendPath() {
        let array = [];
        for (let i = 0; i < this.segNo(); i++) {
            array.push(this.segments[i].convertSeg());
        }


       let text = JSON.stringify(array);
      // console.log(text); 
      
     

        $.post('/plan', text, function (data) {
            window.showModal(data);
            console.log(this.planNo);
        }, "text"); 


       // console.log(this.segments);
    }
}