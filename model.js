const mongoose = require('mongoose'),
      schema = mongoose.Schema;

const taskSchema = new schema({

    dateTime: {
        type: Date
    },
    content: {
        type: String
    },
    userId: {
        type: String
    }
});

const taskModel = mongoose.model('task', taskSchema);

module.exports = taskModel;