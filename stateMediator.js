export default class StateMediator {
    constructor() {
        this.operator; 
        this.missionController; 
    }

    registerOperator(operator) {
        this.operator = operator;
    }

    registerMissionController(controller) {
        this.missionController = controller; 
    }


    //send new state updates to mission controller
    newHeading(heading) {
        if (this.missionController)
        this.missionController.receiveHeading(heading); 
    }

    newLocation(location) {
        if (this.missionController)
        this.missionController.receiveLocation(location);

    }

    newWheelSpeed(linear, angular) {
        this.missionController.receiveWheelSpeed(linear, angular); 
    }

    newMotion(motion) {
        if (this.missionController)
        this.missionController.receiveMotion(motion); 
    }


    newTargetBearing(bearing) {
        if(this.operator)
        this.operator.receiveFromMed(bearing); 
    }


    newPerpDist(distance) {
        if(this.operator)
        this.operator.receiveDistFromMed(distance); 
    }
}