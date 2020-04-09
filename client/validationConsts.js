exports.HELP_MESSAGE = `Welcome to TodoCLI! 

To add a task use the following command:
todo --add <task> --at <time> --on <date>

Here's an example request:
todo --add "Some dumb thing I'll miss if not reminded" --at "12:15 PM" --on "12/10/2020"

Please note that '--on' is optional. If not provided it is assumed that the task is to be added for the current date.
Also note the quotes("") around the task body, time and the date. These are mandatory.

To list all the tasks for the current day use the following command:
todo --show 

To see the help message use the following command:
todo --help`;

exports.TIME_ERROR_MESSAGE        = 'Time incorrectly formatted!';
exports.TASK_ERROR_MESSAGE        = 'Task not specified!';
exports.DATE_ERROR_MESSAGE        = 'Date incorrectly formatted!';
exports.VALIDATION_SUCCESS_MSG    = 'Validated successfully!';
exports.VALIDATION_SUCCESS_STATUS = 'Validated';
exports.VALIDATION_FAILED_STATUS  = 'Rejected';