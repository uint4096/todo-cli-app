const validationParams = require('./validationConsts'),
      moment = require('moment');

const HELP_COMMAND_FUNC     = (element) => {return element == '--help' || element == '-h'},
      ADD_COMMAND_FUNC      = (element) => {return element == '--add' || element == '-a'},
      DISPLAY_COMMAND_FUNC  = (element) => {return element == '--show' || element == '-s'},
      DATE_COMMAND_FUNC     = (element) => {return element == '--on' || element == '-o'},
      TIME_COMMAND_FUNC     = (element) => {return element == '--at'};

const validationMessage = Symbol("validationMessage");

/*
* Parses and validates the command passed by the user.
* Returns an object with the valdidation status and details
* of the command args.
*/
module.exports = function(args){

    const argsSliced = args.slice(2);

    const validateObj = {

        status: validationParams.VALIDATION_FAILED_STATUS,
        message: 'Something went wrong!',
        add: {
            task: {body: null, [validationMessage]: null},
            date: {day: null, month: null, year: null, [validationMessage]: null},
            time: {hours: null, minutes: null, seconds: null, [validationMessage]: null}
        },
        display: null,
        help: null  
    };

    try {
        
        if (argsSliced.findIndex(DISPLAY_COMMAND_FUNC) !== -1) {

            validateObj.display = true;
            validateObj.message = validationParams.VALIDATION_SUCCESS_MSG;
            validateObj.status = validationParams.VALIDATION_SUCCESS_STATUS;
            
            return validateObj;
        }

        if (argsSliced.findIndex(HELP_COMMAND_FUNC) !== -1) {

            validateObj.help = true;
            validateObj.message = validationParams.VALIDATION_SUCCESS_MSG;
            validateObj.status = validationParams.VALIDATION_SUCCESS_STATUS;

            return validateObj;
        }

        const validatedTask = validateTask(argsSliced[argsSliced.findIndex(ADD_COMMAND_FUNC) + 1]);
        Object.assign(validateObj.add.task, validatedTask);
        if (argsSliced.findIndex(ADD_COMMAND_FUNC) === -1
                || validatedTask[validationMessage] !== validationParams.VALIDATION_SUCCESS_MSG) {

            validateObj.message = validationParams.TASK_ERROR_MESSAGE;
            return validateObj;
        }
        
        const timeObj =  validateTime(argsSliced[argsSliced.findIndex(TIME_COMMAND_FUNC) + 1]);
        Object.assign(validateObj.add.time, timeObj);
        if (argsSliced.findIndex(TIME_COMMAND_FUNC) === -1 
                || (argsSliced.findIndex(TIME_COMMAND_FUNC) - 1) === argsSliced.findIndex(ADD_COMMAND_FUNC)
                || (argsSliced.findIndex(TIME_COMMAND_FUNC) - 1) === argsSliced.findIndex(DATE_COMMAND_FUNC) 
                || timeObj[validationMessage] !== validationParams.VALIDATION_SUCCESS_MSG){
            
            validateObj.message = validationParams.TIME_ERROR_MESSAGE;
            return validateObj;  
        } 

        // Date may or may not be defined. The command is valid either way.
        const dateObj = validateDate(argsSliced[argsSliced.findIndex(DATE_COMMAND_FUNC) + 1]);
        Object.assign(validateObj.add.date, dateObj);
        if(argsSliced.findIndex(DATE_COMMAND_FUNC) !== -1
                && (((argsSliced.findIndex(DATE_COMMAND_FUNC) - 1) === argsSliced.findIndex(TIME_COMMAND_FUNC))
                || ((argsSliced.findIndex(DATE_COMMAND_FUNC) - 1) === argsSliced.findIndex(ADD_COMMAND_FUNC))
                || (dateObj[validationMessage] !== validationParams.VALIDATION_SUCCESS_MSG))){

            validateObj.message = validationParams.DATE_ERROR_MESSAGE;
            return validateObj; 
        } else  {
            validateObj.add.date[validationMessage] = validationParams.VALIDATION_SUCCESS_MSG;
        }

        validateObj.status = validationParams.VALIDATION_SUCCESS_STATUS;
        validateObj.message = validationParams.VALIDATION_SUCCESS_MSG;
        return validateObj;

    } catch {

        return validateObj;

    }
}


/*
* Validates the time string passed by the user.
* If validated succesfully, returns an object containing 
* 'hours', 'minutes' and 'seconds' values with a successful 
* validation message.
*/

const validateTime = function(timeString){

    const timeObj = {
        hours: null, 
        minutes: null,
        seconds: null, 
        [validationMessage]: validationParams.TIME_ERROR_MESSAGE 
    };

    if (timeString !== undefined) {

        let splitTimeString = timeString.split(' ');
        let period = splitTimeString[1];
        let time = splitTimeString[0];
        let splitTime = time.split(':');
        let hours = +splitTime[0];
        let minutes = +splitTime[1];
        let seconds = +splitTime[2];

        if (period.toLowerCase() === 'pm') {

            if (!isNaN(hours) && hours < 12) {
                hours += 12;
            } else if (isNaN(hours) || hours > 12 || hours <= 0) {
                return timeObj
            }

        } else if (period.toLowerCase() === 'am') {
            
            if (!isNaN(hours) && hours == 12) {
                hours = 0
            } else if (isNaN(hours)) {
                return timeObj
            }

        } else {
            return timeObj
        }

        if (!isNaN(minutes) && minutes !== undefined && (minutes > 59 || minutes < 0)) {
            return timeObj
        } 

        if (!isNaN(seconds) && seconds !== undefined && (seconds > 59 || seconds < 0)){
            return timeObj
        } 
        
        timeObj[validationMessage] = validationParams.VALIDATION_SUCCESS_MSG
        timeObj.hours = hours;
        timeObj.minutes = isNaN(minutes) ? 0 : minutes;
        timeObj.seconds = isNaN(seconds) ? 0 : minutes;

        return timeObj;
    } 

    return timeObj;
};


/*
* Validates the task string passed by the user.
* If validated successfully, returns an object containing
* the task 'body' and a successfull validation message.
*/

const validateTask = function(taskString){

    const taskObj = {
        body: null,
        [validationMessage]: validationParams.TASK_ERROR_MESSAGE 
    };

    if (taskString.length && taskString != "") {
        taskObj.body = taskString;
        taskObj[validationMessage] = validationParams.VALIDATION_SUCCESS_MSG;
    }

    return taskObj;
}

/*
* Validates the date string passed by the user.
* If validated successfully, returns an object containing
* the task 'day', 'month', and 'year' values and a successfull 
* validation message.
*/
const validateDate = function(dateString){
    const dateObj = {
        day: null,
        month:null,
        year: null,
        [validationMessage]: validationParams.DATE_ERROR_MESSAGE 
    };

    if (dateString != undefined) {

        let splitDate = dateString.split('/');
        let day = splitDate[0];
        let month = splitDate[1];
        let year = splitDate[2];

        const currDate = moment();

        const userDate = moment(day+'/'+month+'/'+year, 'DD/MM/YYYY');
        
        if (!userDate.isValid() || !userDate.isAfter(currDate, 'day')) {
            return dateObj; 
        } 

        dateObj.day = +day;
        dateObj.month = +month;
        dateObj.year = +year;

    } 
    
    dateObj[validationMessage] = validationParams.VALIDATION_SUCCESS_MSG;

    return dateObj;
}