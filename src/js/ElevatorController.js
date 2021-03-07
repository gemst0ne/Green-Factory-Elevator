/**
 * Created by wonseok on 2019. 3. 17..
 */
var ElevatorCollection = require("./ElevatorCollection");
var ElevatorView = require("./ElevatorView");

function ElevatorController(ElevatorNumber, floorNumber) {
    if (ElevatorNumber > 4 || ElevatorNumber < 2) {
        return;
    }
    if (floorNumber > 5 || floorNumber < 2) {
        return;
    }
    this._elevatorNumber = ElevatorNumber;
    this._floorNumber = floorNumber;
    this._init();
    this._cacheEventHandlers();
    this._assignEvent();
}

ElevatorController.prototype = {

    /**
     * floorNumber의 버튼을 활성화
     * @param floorNumber
     */
    activateButton: function (floorNumber) {
        var targetFloorNumber = parseInt(floorNumber);
        if (targetFloorNumber <= 0 || targetFloorNumber > this._floorNumber) {
            console.log("not valid number");
            return;
        }
        this._oView.activateButton(floorNumber);
    },

    /**
     * button의 활성화 여부 리턴
     * @param floorNumber
     * @returns {*}
     */
    isButtonActivated: function (floorNumber) {
        var targetFloorNumber = parseInt(floorNumber);
        if (targetFloorNumber <= 0 || targetFloorNumber > this._floorNumber) {
            console.log("not valid number");
            return false;
        }
        return this._oView.isButtonActivated(floorNumber);
    },

    /**
     * 초기화
     * @private
     */
    _init: function () {
        this._oCollection = new ElevatorCollection(this._elevatorNumber);
        this._oView = new ElevatorView(this._elevatorNumber, this._floorNumber);
        this._$View = $(this._oView);
        this._$Collection = $(this._oCollection);
        this._oView.renderElevator.call(this._oView, this._oCollection.getInitialPosition());
    },


    /**
     * eventHandler 캐싱
     * @private
     */
    _cacheEventHandlers: function () {
        this._eventHandlers = {};
        this._eventHandlers._onClickButton = this._onClickButton.bind(this)
        this._eventHandlers._onFindElevator = this._onFindElevator.bind(this);
        this._eventHandlers._onAlreadyArrivedElevator = this._onAlreadyArrivedElevator.bind(this);
        this._eventHandlers._onArriveToTargetFloor = this._onArriveToTargetFloor.bind(this);
    },


    /**
     * event assign
     * @private
     */
    _assignEvent: function () {
        this._$Collection.on("findElevator", this._eventHandlers._onFindElevator);
        this._$Collection.on("alreadyArrive", this._eventHandlers._onAlreadyArrivedElevator);
        this._$View.on("clickButton", this._eventHandlers._onClickButton);
        for (var i = 1; i <= this._elevatorNumber; i++) {
            this._$View.on("arrive" + i, this._eventHandlers._onArriveToTargetFloor);
        }
    },

    /**
     * collection으로 button의 floorNumber 전달
     * @param event
     * @private
     */
    _onClickButton: function (event) {
        this._oCollection.deliverTargetFloor(event.floor);
    },

    /**
     * view로 움직이려는 elevator 전달
     * @param event
     * @private
     */
    _onFindElevator: function (event) {
        this._oView.activateElevator(event.elevator, event.floor, event.current);
    },

    /**
     * targetFloor에 이미 elevator가 있다고 알림
     * @param event
     * @private
     */
    _onAlreadyArrivedElevator: function (event) {
        this._oView.deactivateTargetButton(event.floor);
    },

    /**
     * collection으로 elevator가 도착했다고 알림
     * @param event
     * @private
     */
    _onArriveToTargetFloor: function (event) {
        this._oCollection.setInactive({elevatorID: event.elevator});
    }

};

module.exports = ElevatorController;
