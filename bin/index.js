#! /usr/bin/env node

const formatCommand = require('../client/command'),
      validationParams = require('../client/validationConsts'),
      timeCalcs = require('../client/timeCalc'),
      controller = require('../client/controller'),
      socketClient = require('socket.io-client'),
      moment = require('moment'),
      chalk = require('chalk');

const commandBody = formatCommand(process.argv);

(async () => {

    if (commandBody.message === validationParams.VALIDATION_SUCCESS_MSG
        && commandBody.status === validationParams.VALIDATION_SUCCESS_STATUS) {

            if (commandBody.help) {

                console.log(chalk.yellow(validationParams.HELP_MESSAGE));
                return;

            } else if (commandBody.display) {

                const currDateTime = moment();
                const nextDateTime = moment();
                const nextDate = nextDateTime.startOf('day').add(1,'days');
                const currDate = currDateTime.startOf('day');

                const tasks = await controller.fetchTasksByDate(currDate.toISOString(), nextDate.toISOString());

                for (let data of tasks.data) {

                    const hours = new Date(data.dateTime).getHours();
                    const mins = new Date(data.dateTime).getMinutes();
                    console.log(`${chalk.yellow(data.content)} at ${chalk.yellow(hours)}:${chalk.yellow(mins)}`);

                }

                return;
            }

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

})();
    