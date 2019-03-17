/**
 * Created by wonseok on 2019. 3. 17..
 */
function ElevatorModel(elevatorID) {
    this._elevatorID = elevatorID;
    this._currentPosition = null;
    this._status = null;
    this._init()
}

ElevatorModel.prototype = {

    /**
     * setter
     * @param dataObject
     */
    set: function (dataObject) {
        for (var property in dataObject) {
            this["_" + property] = dataObject[property];
        }
    },

    /**
     * getter
     * @param dataArray
     * @returns {{}}
     */
    get: function (dataArray) {
        var dataProperty = {};
        for (var i = 0; i < dataArray.length; i++) {
            dataProperty[dataArray[i]] = this["_" + dataArray[i]]
        }
        return dataProperty;
    },

    /**
     * 초기화
     * @private
     */
    _init: function () {
        this._currentPosition = 1;
        this._status = 'inactive';
    }
};

module.exports = ElevatorModel;