// handle “database” CRUD logic: receives data from main application and performs the necessary file operations

const fs = require('fs');
const filePath = './users.json';

const userService = {
    createUser: (name, email) => {
        if (!name || !email) {
            console.log('USAGE: node app.js create <name> <email>');
            return;
        }
        let data = { users: [] };
        try {
            if (fs.existsSync(filePath)) {
                const raw = fs.readFileSync(filePath, 'utf8');
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) data.users = parsed;
                    else if (parsed && Array.isArray(parsed.users)) data = parsed;
                }
            }
        } catch (err) {
            console.log('ERROR: unable to read users file.');
            process.exit(1);
        }

        const nextId = data.users.length ? Math.max(...data.users.map(u => u.id || 0)) + 1 : 1;
        data.users.push({ id: nextId, name, email });

        try {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        } catch (err) {
            console.log('ERROR: unable to write users file.');
            process.exit(1);
        }

        console.log('User created');
    },

    getUsers: () => {
        try {
            if (!fs.existsSync(filePath)) {
                console.log('[]');
                return;
            }
            const raw = fs.readFileSync(filePath, 'utf8') || '[]';
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) console.log(JSON.stringify(parsed, null, 2));
            else if (parsed && Array.isArray(parsed.users)) console.log(JSON.stringify(parsed.users, null, 2));
            else console.log('[]');
        } catch (err) {
            console.log('ERROR: unable to read users file.');
            process.exit(1);
        }
    },

    deleteUser: (identifier) => {
        if (!identifier) {
            console.log('USAGE: node app.js delete <id|email>');
            return;
        }
        let data = { users: [] };
        try {
            if (fs.existsSync(filePath)) {
                const raw = fs.readFileSync(filePath, 'utf8') || '{}';
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) data.users = parsed;
                else if (parsed && Array.isArray(parsed.users)) data = parsed;
            }
        } catch (err) {
            console.log('ERROR: unable to read users file.');
            process.exit(1);
        }

        const numeric = Number(identifier);
        let index = -1;
        if (!Number.isNaN(numeric)) index = data.users.findIndex(u => u.id === numeric);
        if (index === -1) index = data.users.findIndex(u => u.email === identifier);
        if (index === -1) {
            console.log('User not found');
            return;
        }

        data.users.splice(index, 1);

        try {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        } catch (err) {
            console.log('ERROR: unable to write users file.');
            process.exit(1);
        }

        console.log('User deleted');
    },

    updateUser: (id, email) => {
        if (!id || !email) {
            console.log('USAGE: node app.js update <id> <newEmail>');
            return;
        }
        const numericId = Number(id);
        if (Number.isNaN(numericId)) {
            console.log('ERROR: id must be a number.');
            return;
        }

        let data = { users: [] };
        try {
            if (fs.existsSync(filePath)) {
                const raw = fs.readFileSync(filePath, 'utf8') || '{}';
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) data.users = parsed;
                else if (parsed && Array.isArray(parsed.users)) data = parsed;
            }
        } catch (err) {
            console.log('ERROR: unable to read users file.');
            process.exit(1);
        }

        const user = data.users.find(u => u.id === numericId);
        if (!user) {
            console.log(`User with id ${numericId} not found.`);
            return;
        }

        user.email = email;

        try {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        } catch (err) {
            console.log('ERROR: unable to write users file.');
            process.exit(1);
        }

        console.log('User updated');
    }
};

module.exports = userService;