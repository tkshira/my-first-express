const express = require('express');
const router = express.Router();
const {client} = require('./database.js');

const database = client.db("user-admin");
const collection = database.collection("users");


async function getUser(filter){
    await client.connect();
    console.log(filter);
    let user = await collection.find(filter);
    console.log(user.toArray())
    return await user.toArray();
}

router.post('', (req, res) => {
    const basicauth = atob(req.headers.authorization.split(' ')[1]);
    const username = basicauth.split(':')[0]
    const pw = basicauth.split(':')[1]

    getUser({username: username, password: pw}).then(
        (user) => {
            console.log(user);
            if (user.length===0){ 
                return res.status(404).send('User not found / password is incorrect');
            }
            return res.send('Login Succeeded')
        },
        (reason) => {
            res.status(404).send(`Error: ${reason}`)
        }
    )
})


module.exports = router;