/**
 * @class Validator
 */
function Validator() {
}

Validator.validateInteger = function(value) {
    let regNum = /^\d+$/;
    if(!regNum.test(value)) {
        return false;
    }

    let floatValue = parseFloat(value);
    if(floatValue > Number.MAX_VALUE || floatValue > Number.MAX_SAFE_INTEGER) {
        return false;
    }

    let intValue = parseInt(value, 10);
    if(isNaN(intValue)) {
        return false;
    }
    return intValue;
};

module.exports = Validator;