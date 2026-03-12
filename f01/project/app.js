// CLI interface: read the command and arguments, execute the corresponding function from userService, and print the result to the console

const fs = require('fs');

const userService = require('./userService');
const args = process.argv.slice(2);
const method = args[0];

switch (method) {
    case 'create':
        if (args.length < 3) {
            console.log('Usage: node app.js create <name> <email>');
            process.exit(1);
        } 
        userService.createUser(args[1], args[2]);
        break;
    case 'list':
        userService.getUsers();
        break;
    case 'delete':
        if (args.length < 2){
            console.log('Usage: node app.js delete <email>');
            process.exit(1);
        }
        userService.deleteUser(args[1]);
        break;
    case 'update':
        if (args.length < 3) {
            console.log('Usage: node app.js update <id> <newEmail>');
            process.exit(1);
        }
        userService.updateUser(args[1], args[2], args[3]);
        break;
    default:
        console.log('Unknown method. Available methods: create, list, delete, update');
        break;
}