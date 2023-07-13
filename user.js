const express = require('express');
const router = express.Router();
const {databaseAdmin, client} = require('./database.js');
const { generateToken } = require('./utils/jwt-token-authenticator.js');

const collection = databaseAdmin.collection("users");


async function getUser(filter){
    console.log(filter);
    await client.connect();
    let user = await collection.find(filter);
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
            return res.send(generateToken(username));
        },
        (reason) => {
            res.status(404).send(`Error: ${reason}`)
        }
    )
})


module.exports = router;