const express = require('express'),
      app = express(),
      mongoose = require('mongoose');
      bodyParser = require('body-parser')
      port = 3000,
      dbConnect = "mongodb+srv://user0032:pwdatlas7@clusterone-rsike.mongodb.net/test?retryWrites=true&w=majority",
      routes = require('./server/route'),
      cronJob = require('./timer/cron');

(async () => {

    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());
  
    await routes(app);

    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    })

    mongoose.connect(dbConnect)
        .then((res) => {
            console.log("Connection to db successful");
        })
    
    let cron = await cronJob();
    console.log(`Cron job started for cron-time: ${cron.cronTime}`);

})();  