export default class MotionGraph {
    constructor() {
        this.g;
        this.acc = [];  
       
        updated = false; 
        started = false;
        button_; 
        zoomOn = false; 
    }


    
initGraph() {

    let toggle = document.getElementById("toggle-graph");
    let hide = document.getElementById("stats-robot");
    //let clear = document.getElementById("clear-graph");
    let g1 = this.g; 
    let button_ = this.button_; 
    let zoomOn = this.zoomOn; 
    let start = this.started; 
    let updated = this.updated; 
    let acc =this.acc; 

  
  
      g1 = new Dygraph(
          document.getElementById("graph_1"),
          `${new Date()}, 0,0,0,0,0,0\n`, // path to CSV file
          {
              drawPoints: false,
              showRoller: false,
              rollPeriod: 0,
              axes: {
                x : {
                  drawAxis: true, 
                  drawGrid: false
                },
                y : {
                  drawGrid: false,
                  valueRange: [0,360]
                
                },
              },
              zoomCallback: zoomingGraph, 
              labelsDiv: document.getElementById("graph-legend"),
              axisLineColor: "white",
              legend: 'always',
              labels: ['Time', 'Target Heading (deg)','Sensed Heading (deg)', 'Heading Error (deg)', 'rotA (rad/s)', 'rotB (rad/s)', 'rotG (rad/s)'],
              labelsSeparateLines: true,
              visibility: [false, false, false, false, false, false],
              dateWindow: [Date.now(), Date.now() + 30000],
           
           
          }         
        );
        console.log('creating graph');
  
       let g = g1;
  
       button_ = document.createElement('button');
       button_.innerHTML = '<i class="fa fa-search-minus" aria-hidden="true"></i>';
      button_.style.display = 'none';
      button_.classList.add('btn');
      button_.classList.add('btn-sm');
  
      button_.classList.add('btn-secondary');
       button_.style.position = 'absolute';
      var area = g.plotter_.area;
      button_.style.top = (area.y + 4) + 'px';
      button_.style.left = (area.x + 4) + 'px';
      button_.style.zIndex = 11;
      var parent = g.graphDiv;
      parent.insertBefore(button_, parent.firstChild);
      button_.style.display = "none";
      button_.addEventListener('click', () => {
        g1.resetZoom();
        g1.updateOptions ( {
          axes: {
            y: {
              valueRange: [-20,20],
            }
          }
        });
        button_.style.display = "none";
        zoomOn = false; 
      });
  
  
      g1.addAndTrackEvent(parent, 'mouseover', function() {
        if (zoomOn) {
          button_.style.display = "";      
        }
       
      });
  
      g1.addAndTrackEvent(parent, 'mouseout', function() {
        button_.style.display = "none";      
      });
    
  
  
  
        document.getElementById('accX').addEventListener('click', this.toggleAccX.bind(this)); 
        document.getElementById('accY').addEventListener('click', this.toggleAccY.bind(this)); 
        document.getElementById('accZ').addEventListener('click', this.toggleAccZ.bind(this));
    //    document.getElementById('rotA').addEventListener('click', toggleRotA); 
    //    document.getElementById('rotB').addEventListener('click', toggleRotB); 
     //   document.getElementById('rotG').addEventListener('click', toggleRotG); 
      
  
  
    let that = this; 
  
   hide.addEventListener("click", () => {
     let graph = document.getElementById('graph-area');
  
    if (graph.style.display == "none" || graph.style.display == "") {
      graph.style.display = "block";
      hide.classList.remove("btn-primary");
      hide.classList.add("btn-success");
  
      //playGraph();
    } else {
      that.pauseGraph();
      graph.style.display = "none";
      hide.classList.remove("btn-success");
      hide.classList.add("btn-primary");
  
  
    }
  
  
   });    
  
  
   toggle.addEventListener( "click", () => {
      if (!started) {
        that.playGraph();
      
      } else {
        that.pauseGraph();
  
      }
  
    });
  
  
  
  }



 zoomingGraph(minDate, maxDate, yRange) {
    let g1 = this.g; 
    let button_ = this.button_; 
  
    g1.updateOptions ( {
      axes: {
        y: {
          valueRange: null,
        }
      }
    });
    button_.style.display = "";
    zoomOn = true; 
  
  }; 
  
playGraph() {
    let g1 = this.g; 
    let updated = this.updated; 
    let acc =this.acc; 
       
    document.getElementById('play-icon').className = "fa fa-pause"
    socket.on('new-acc', (data) => {
      g1.updateOptions({dateWindow: [Date.now() - 6000, Date.now()]}); 
      let arr = new Int16Array(data);
      //console.log('new data');
       // arr[0] = arr[0]/100;
       // arr[1] = arr[1]/100;
       // arr[2] = arr[2]/100;
      //console.log(arr);
     if(!updated) {
      //console.log('update');
      updated = true; 
      if(acc.length == 600) {
        acc.splice(0,100);
        //acc = []; 
        //g1.updateOptions({dateWindow: [Date.now(), Date.now() + 6000]}); 
  
      }
      let d = new Date(); 
  
      acc.push([d, arr[0]/100, arr[1]/100, arr[2]/100, arr[3]*Math.PI/180, arr[4]*Math.PI/180, arr[5]*Math.PI/180]);
     // console.log(row);
      g1.updateOptions({'file': acc }  
      //{dateWindow: [0, Date.now()]} 
      ); 
      updated = false; 
     }
     
  
      //console.log("new acc");
  
    }); 
    started = true;  
  }
  
  pauseGraph() {

 
    document.getElementById('play-icon').className = "fa fa-play"
    this.started = false; 
    socket.off('new-acc');
  }
  
  
 toggleAccX() {
    let g1 = this.g; 

  var checkBox = document.getElementById("accX");
    if (checkBox.checked == true){
      g1.setVisibility(0, true);
    } else {
      g1.setVisibility(0, false);
    }
  }
  
  toggleTarget() {
    let g1 = this.g; 

  
    var checkBox = document.getElementById("accY");
    if (checkBox.checked == true){
      g1.setVisibility(1, true);
    } else {
      g1.setVisibility(1, false);
    }
  }
  
 toggleSensed() {
    let g1 = this.g; 
  
    var checkBox = document.getElementById("accZ");
    if (checkBox.checked == true){
      g1.setVisibility(2, true);
    } else {
      g1.setVisibility(2, false);
    }
  }
 toggleError () {
    let g1 = this.g; 
  
    console.log(this);
    console.log('tog');
    var checkBox = document.getElementById("rotA");
    if (checkBox.checked == true){
      g1.setVisibility(3, true);
    } else {
      g1.setVisibility(3, false);
    }
  }
 




}


