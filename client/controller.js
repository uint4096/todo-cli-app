const axios = require('axios');
//axios.default.baseURL = 'http://localhost:3000/'

exports.queueTask = function(taskBody){
    return axios.post('http://localhost:3000/task', taskBody);
}   

exports.fetchTasks = function(){
    return axios.get('http://localhost:3000/task');
}