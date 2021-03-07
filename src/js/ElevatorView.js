/**
 * Created by wonseok on 2019. 3. 17..
 */
var ElevatorTemplate = require("./template/template.html");

function ElevatorView(ElevatorNumber, floorNumber) {
    this._elevatorNumber = ElevatorNumber;
    this._floorNumber = floorNumber;
    this._renderContent();
    this._init();
}

ElevatorView.prototype = {

    /**
     * 초기 elevator의 위치 그리는 method
     * @param data
     */
    renderElevator: function (data) {
        var reversedData;
        for (var elevatorID in data) {
            reversedData = this._$elevatorElements[elevatorID].find(".floor").get().reverse();
            $(reversedData).eq(data[elevatorID] - 1).addClass("elevator");
        }
    },

    /**
     * elevator 활성화
     * @param elevatorID
     * @param targetFloor
     * @param currentFloor
     */
    activateElevator: function (elevatorID, targetFloor, currentFloor) {
        var distance = (currentFloor - targetFloor);
        this._moveElevatorToTargetFloor(currentFloor, distance, elevatorID)
    },

    /**
     * targetFloor의 button 비활성화
     * @param targetFloor
     */
    deactivateTargetButton: function (targetFloor) {
        setTimeout(function () {
            this._$buttonElements[targetFloor].removeClass("active")
        }.bind(this), 0);
    },

    /**
     * 버튼의 활성화 여부 return
     * @param targetFloor
     * @returns {*}
     */
    isButtonActivated: function (targetFloor) {
        return this._$buttonElements[targetFloor].hasClass("active");
    },

    /**
     * targetFloor의 버튼 활성화
     * @param targetFloor
     * @returns {boolean}
     */
    activateButton: function (targetFloor) {
        if (this._$buttonElements[targetFloor].hasClass("active")) {
            return false;
        }
        $(this).trigger({type: "clickButton", floor: targetFloor});
        this._$buttonElements[targetFloor].addClass("active");
    },

    /**
     * template render
     * @private
     */
    _renderContent: function () {
        var template = {
            elevator: _.template(ElevatorTemplate)
        };
        $(".content").html(template.elevator({floorLength: this._floorNumber, elevatorNumber: this._elevatorNumber}));
    },

    /**
     * 초기화
     * @private
     */
    _init: function () {
        this._assignElement();
        this._cacheEventHandlers();
        this._assignEvent();
    },

    /**
     * element 캐싱
     * @private
     */
    _assignElement: function () {
        this._$button = $("[data-elevator-btn]");
        this._$elevatorWrapper = $("[data-elevator-wrapper]");
        this._$buttonWrapper = $("[data-btn-wrapper]");
        this._$elevatorElements = {};
        this._$buttonElements = {};
        for (var i = 1; i <= this._elevatorNumber; i++) {
            this._$elevatorElements[i] = this._$elevatorWrapper.find("#elevator" + i);
        }
        for (var j = 1; j <= this._floorNumber; j++) {
            this._$buttonElements[j] = this._$buttonWrapper.find("[data-btn=" + j + "]");
        }
    },

    /**
     * eventHandler 캐싱
     * @private
     */
    _cacheEventHandlers: function () {
        this._eventHandlers = {};
        this._eventHandlers._onClickButton = this._onClickButton.bind(this)
    },

    /**
     * event assign
     * @private
     */
    _assignEvent: function () {
        this._$button.on("click", this._eventHandlers._onClickButton);
    },

    /**
     * button 클릭시 실행
     * @param event
     * @private
     */
    _onClickButton: function (event) {
        var $eventTarget = $(event.target);
        if ($eventTarget.hasClass("active")) {
            return;
        }
        var floorNumber = $eventTarget.data("btn");
        $(this).trigger({type: "clickButton", floor: floorNumber});
        $eventTarget.addClass("active");
    },

    /**
     * elevator를 움직이는 method
     * @param currentFloor
     * @param distance
     * @param elevatorID
     */
    _moveElevatorToTargetFloor: function (currentFloor, distance, elevatorID) {
        var current = currentFloor;
        var absoluteDistance = Math.abs(distance);
        var repetitions = 0;
        var criterion = distance > 0 ? -1 : 1;
        this._$elevatorElements[elevatorID].find("[data-floor=" + current + "]").addClass("active");
        var intervalID = setInterval(function () {   //TODO requestAnimationFrame 으로 바꿀예정
            current += criterion;
            this._$elevatorElements[elevatorID].find("div").removeClass("elevator active");
            this._$elevatorElements[elevatorID].find("[data-floor=" + current + "]").addClass("elevator active");
            if (++repetitions === absoluteDistance) {
                clearInterval(intervalID);
                this._onArriveToTargetFloor(elevatorID, current);
            }
        }.bind(this), 1000);
    },

    /**
     * elevator가 targetFloor로 도착시 알림
     * @param elevatorID
     * @param targetFloor
     * @private
     */
    _onArriveToTargetFloor: function (elevatorID, targetFloor) {
        $(this).trigger({type: "arrive" + elevatorID, elevator: elevatorID});
        this._$buttonElements[targetFloor].removeClass("active");
        this._$elevatorElements[elevatorID].find("[data-floor=" + targetFloor + "]").removeClass("active");
    }
};

module.exports = ElevatorView;