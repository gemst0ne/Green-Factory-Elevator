/**
 * Created by wonseok on 2019. 3. 17..
 */
var ElevatorModel = require("./ElevatorModel");

function ElevatorCollection(ElevatorNumber) {
    this._elevatorNumber = ElevatorNumber;
    this._elevators = {};
    this._targetFloors = [];
    this._init();
}

ElevatorCollection.prototype = {

    /**
     * 초기 엘리베이터 위치값 리턴
     * @returns {{}}
     */
    getInitialPosition: function () {
        var position = {};
        var modelData;
        for (var ID in this._elevators) {
            modelData = this._elevators[ID].get(['currentPosition']);
            position[ID] = modelData.currentPosition;
        }
        return position;
    },

    /**
     * targetFloor로 이동할수 있는 elevator를 찾는다.
     * @param targetFloorNum
     */
    deliverTargetFloor: function (targetFloorNum) {
        if (this._getNearestDistance(targetFloorNum, true) === 0) {
            this._notifyAlreadyElevatorArrived(targetFloorNum);
            return;
        }
        this._targetFloors.push(targetFloorNum);
        this._findNearestElevator(this._targetFloors[0]);
    },

    /**
     * 도착한 elevator의 status값 변경
     * @param event
     */
    setInactive: function (event) {
        setTimeout(this._setInactiveElevator.bind(this, event.elevatorID), 3000);
    },

    /**
     * 초기화
     * @private
     */
    _init: function () {
        for (var ID = 1; ID <= this._elevatorNumber; ID++) {
            this._elevators[ID] = new ElevatorModel(ID);
        }
    },

    /**
     * 비활성화 상태의 elevator가 더이상 없을때, 1초마다 비활성화 상태의 elevator를 찾는다.
     * @private
     */
    _findElevatorPerSecond: function () {
        var intervalID = setInterval(function () {  // TODO model로 부터 event를 받아서 활성화 상태의 엘리베이터 찾는것으로 바꿀예정
            var targetFloor = this._targetFloors[0];
            var nearestDistance = this._getNearestDistance(targetFloor, false);
            var targetElevatorID = this._getTargetElevatorID(targetFloor, nearestDistance);
            if (targetElevatorID !== null) {
                clearInterval(intervalID);
                this._notifyTargetElevator(targetElevatorID, targetFloor);
                this._targetFloors.shift();
            }
        }.bind(this), 1000);
    },


    /**
     * targetFloor와 가까운 elevator의 거리를 구한다.
     * @param targetFloor
     * @param criterion
     * @returns {number}
     * @private
     */
    _getNearestDistance: function (targetFloor, criterion) {
        var distanceValues = [];
        var modelData;
        for (var ID in this._elevators) {
            modelData = this._elevators[ID].get(['status', 'currentPosition']);
            if (criterion) {
                distanceValues.push(Math.abs(targetFloor - modelData.currentPosition));
            } else if (modelData.status === 'inactive') {
                distanceValues.push(Math.abs(targetFloor - modelData.currentPosition));
            }
        }
        return Math.min.apply(null, distanceValues);
    },

    /**
     * 가장 가까운 거리의 elevator의 ID를 구한다.
     * @param targetFloor
     * @param nearestDistance
     * @returns {any}
     * @private
     */
    _getTargetElevatorID: function (targetFloor, nearestDistance) {
        var movableElevators = [];
        var modelData;
        for (var ID in this._elevators) {
            modelData = this._elevators[ID].get(['status', 'currentPosition', 'elevatorID']);
            if (Math.abs(targetFloor - modelData.currentPosition) === nearestDistance && modelData.status === 'inactive') {
                movableElevators.push(modelData.elevatorID);
            }
        }
        return (movableElevators.length > 0) ? Math.min.apply(null, movableElevators) : null;
    },

    /**
     * 가장 가까운 elevator를 찾는다.
     * @private
     */
    _findNearestElevator: function () {
        var targetFloor = this._targetFloors[0];
        var nearestDistance = this._getNearestDistance(targetFloor, false);
        var targetElevatorID = this._getTargetElevatorID(targetFloor, nearestDistance);
        if (targetElevatorID !== null) {
            this._notifyTargetElevator(targetElevatorID, targetFloor);
            this._targetFloors.shift();
        } else {
            this._findElevatorPerSecond();
        }
    },

    /**
     * targetFloor에 이미 elevator 있다고 알림
     * @param targetFloor
     * @private
     */
    _notifyAlreadyElevatorArrived: function (targetFloor) {
        $(this).trigger({
            type: 'alreadyArrive',
            floor: targetFloor
        });
    },

    /**
     * 움직이려는 elevator를 알려주고, model의 status active로 변경
     * @param targetElevatorID
     * @param targetFloor
     * @private
     */
    _notifyTargetElevator: function (targetElevatorID, targetFloor) {
        var modelData = this._elevators[targetElevatorID].get(['currentPosition']);
        $(this).trigger({
            type: 'findElevator',
            elevator: targetElevatorID,
            floor: targetFloor,
            current: modelData.currentPosition
        });
        this._elevators[targetElevatorID].set({currentPosition: targetFloor, status: 'active'});
    },

    /**
     * elevatorModel status를 inactive로 변경
     * @param elevatorNum
     * @private
     */
    _setInactiveElevator: function (elevatorNum) {
        this._elevators[elevatorNum].set({status: 'inactive'})
    }

};

module.exports = ElevatorCollection;

