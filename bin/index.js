#! /usr/bin/env node

const formatCommand = require('../client/command'),
      validationParams = require('../client/validationConsts'),
      timeCalcs = require('../client/timeCalc'),
      controller = require('../client/controller'),
      socketClient = require('socket.io-client');

const commandBody = formatCommand(process.argv);

if (commandBody.message === validationParams.VALIDATION_SUCCESS_MSG
    && commandBody.status === validationParams.VALIDATION_SUCCESS_STATUS) {

        const taskDateTime = timeCalcs.getTimeString(commandBody.add.date, commandBody.add.time);
        
        const postObj = {
            dateTime: taskDateTime,
            content: commandBody.add.task.body,
            userId: 1
        };

        controller.queueTask(postObj)
            .then((res) => {
                console.log(`Task added: ${res.data}`);
                const socket = socketClient('http://localhost:3000');
                socket.emit('add-task', res.data, function(data) {
                    console.log('added!');
                });
            })
            .catch((err) => {
                console.log(`Unable to add task: ${err}`);
            })
        
}
    