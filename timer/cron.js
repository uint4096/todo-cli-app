const {CronJob}  = require('cron'),
      timer = require('./timer');

const CRON_CONFIG = {
    cronTime: '0 0 * * *',
    runOnInit: true,
    onTick: timer.timeTasks,
}

module.exports = function(){

    let jobObj = {
        status: 'pending',
        cronTime: ''
    };

    return new Promise((resolve, reject) => {

        const job = new CronJob(CRON_CONFIG);
        job.start();
        
        jobObj.status = 'started';
        jobObj.cronTime = '0 0 * * *'
        resolve(jobObj);
    });
}