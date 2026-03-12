const fs = require('fs');

const userService = {
    create(name, email) {
        fs.readFile('./users.json', (error, data) => {
            if (error) throw error;

            const users = JSON.parse(data)
            if (users.database.map(u => u.email).includes(email)) throw Error('ERROR: Email already in use')
            const id = users.database.length ? Math.max(...users.database.map(u => u.id)) + 1 : 1;
            users.database.push({
                "id": id,
                "name": name,
                "email": email,
            })
            const newData = JSON.stringify(users)
            fs.writeFile('./users.json', newData, 'utf-8', (err) => {
                if (err) throw err

                console.log(`User created (id:${id})`)
                return users
            } )
        })
    },
    list(){
        fs.readFile('./users.json', (error, data) => {
            if (error) throw error;

            const users = JSON.parse(data)
            console.log(users)
            return users
        })
    },
    update(id, email){
        fs.readFile('./users.json', (error, data) => {
            if (error) throw error;

            const users = JSON.parse(data)
            users.database = users.database.map(u => u.id == id ? {...u, "email": email} : u)
            const newData = JSON.stringify(users)
            fs.writeFile('./users.json', newData, 'utf-8', (err) => {
                if (err) throw err

                console.log(`User ${id} updated`)
                return users
            } )
        })
    },
    delete(id){
        fs.readFile('./users.json', (error, data) => {
            if (error) throw error;

            const users = JSON.parse(data)
            users.database = users.database.filter(u => u.id != id)
            const newData = JSON.stringify(users)
            fs.writeFile('./users.json', newData, 'utf-8', (err) => {
                if (err) throw err

                console.log(`User ${id} deleted`)
                return users
            } )
        })
    }
}

module.exports = userService