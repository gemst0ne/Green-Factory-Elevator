/**
 * Created by wonseok on 2019. 3. 17..
 */
require("./css/elevatorStyle.css");

var ElevatorController = require("./js/ElevatorController");

$(document).ready(function () {
    var elevator = null;
    $("#render").on("click", function () {
        var elevatorNum = parseInt($("#_elevator").val());
        var floorNum = parseInt($("#_floor").val());
        elevator = new ElevatorController(elevatorNum, floorNum);
    });

    window.activateButton = function (i) {
        elevator.activateButton(i);
    };

    window.isButtonActivated = function (i) {
        return elevator.isButtonActivated(i);
    };
});


