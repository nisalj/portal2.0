export default class ServerComms {
    constructor() {
        this.heading;
        this.location;
        this.params; 
     
    }


    sendHeading(){
        let heading = this.heading.getHeading();
        let target = this.params.getTargetBearing();
        let correction = this.params.getCorrection(); 
        let bytesToSend = [heading, target, correction];
        let bytesArray = new Int16Array(bytesToSend);
   
         $.ajax({
           url: '/bearing',
           type: 'POST',
           contentType: 'application/octet-stream',  
           data: bytesArray,
           processData: false
        });
    }

    sendPID(type, coeff, val) {
        let pid = {
            type: type, 
            coeff: coeff,
            val: val 
        }
        $.post('/pid', pid); 

    }


}

