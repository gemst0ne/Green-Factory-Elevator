/**
 * Created by wonseok on 2019. 3. 17..
 */
require("./css/elevatorStyle.css");

var ElevatorController = require("./js/ElevatorController");
document.addEventListener('DOMContentLoaded',function () {
  var elevator = null;
  $("#render").on("click", function () {
    var elevatorNum = parseInt($("#_elevator").val());
    var floorNum = parseInt($("#_floor").val());
    elevator = new ElevatorController(elevatorNum, floorNum);
  });

  window.activateButton = function (i) {
    return elevator ? elevator.activateButton(i): false;
  };

  window.isButtonActivated = function (i) {
    return elevator ? elevator.isButtonActivated(i): false;
  };
})


