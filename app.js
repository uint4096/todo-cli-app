require('dotenv').config();
const server = require('./server/server'),
      mongoose = require('mongoose'),
      dbConnect = process.env.DB_STRING + "&w=majority",
      cronJob = require('./timer/cron'),
      socket = require('socket.io'),
      timer = require('./timer/timer');


(async () => {

    mongoose.connect(dbConnect)
        .then((res) => {
            console.log("Connection to db successful");
        })
    
    const serverExp = await server();
    console.log('Server started.');

    const io = socket.listen(serverExp);

    io.on('connection', function(socket){
        console.log('A client connected.');

        socket.on('add-task', function(task){
            console.log('Task added!');
            timer.addTaskToQueue(task);
            socket.disconnect();
        });

        socket.on('disconnect', function(task){
            console.log('The client disconnected!');
        });
    });

    const cron = await cronJob();
    console.log(`Cron job started for cron-time: ${cron.cronTime}`);

})();  