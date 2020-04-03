const controller = require('../client/controller'),
      moment = require('moment'),
      notifier = require('node-notifier');

module.exports = async function(){
    
    const tasksRequest = await controller.fetchTasks();
    const tasks = tasksRequest.data;
    const currDateTime = moment();
    const filteredTasks = tasks.filter(val => moment(val.dateTime).local() > currDateTime);

    for (task of filteredTasks) {

        const timediff = moment(task.dateTime).local().diff(currDateTime);
        console.log(timediff);
        setTimeout(() => {

            notifier.notify(
				{
					title: 'Todo notification!',
					message: task.content,
					sound: true
				},
			);

        }, timediff);
    }

    return filteredTasks;
}