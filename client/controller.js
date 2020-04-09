const axios = require('axios');

exports.queueTask = function(taskBody){
    return axios.post('http://localhost:3000/task', taskBody);
}   

exports.fetchTasks = function(){
    return axios.get('http://localhost:3000/task');
}

exports.fetchTasksByDate = function(currDate, nextDate){
    return axios.get(`http://localhost:3000/task/date?curr=${currDate}&next=${nextDate}`);
}