const moment = require('moment');

exports.getTimeString = function(dateObj, timeObj){

    const currDate = new Date();
    const year = dateObj.year === null ? currDate.getFullYear() : dateObj.year;
    const month = dateObj.month === null ? currDate.getMonth() : dateObj.month - 1;
    const day = dateObj.day === null ? currDate.getDate() : dateObj.day;
    
    const hour = timeObj.hours;
    const minutes = timeObj.minutes;
    const seconds = timeObj.seconds;
    
    const taskMoment = moment([year, month, day, hour, minutes, seconds]);
    
    return taskMoment.toISOString();
}