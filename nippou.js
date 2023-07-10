const express = require('express');
const {database, client} = require('./database.js');
const router = express.Router();

// const nippou = [
//     {empcod: '001', nipdate: new Date("2022-06-12"), start: '09:00', end: '12:00'},
//     {empcod: '001', nipdate: new Date("2022-06-12"), start: '13:00', end: '15:00'},
//     {empcod: '001', nipdate: new Date("2022-06-12"), start: '15:00', end: '18:00'},
//     {empcod: '002', nipdate: new Date("2022-06-12"), start: '09:00', end: '10:00'},
// ];

const collection = database.collection("nippou");


async function getNippou(filter){
    await client.connect();
    console.log(filter);
    let nippou = await collection.find(filter);
    return await nippou.toArray();
}

router.get('/', (req, res) => {
    getNippou({}).then((nippou) => {
        res.send(nippou)
    },
    (reason) => {
        res.status(400).send(`error: ${reason}`);
    });
})

router.get('/:empcod/:date', (req,res) => {
    let empcod = req.params.empcod;
    let date = new Date(req.params.date);
    getNippou({empcod: empcod, nipdate: date}).then(
        (nippou) => {
            res.send(nippou)
        },
        (reason) => {
            res.status(400).send(`Error: ${reason}`);
        }
    )
    // const dat = new Date(req.params.date);
    // const nip = nippou.filter(nip => nip.empcod === req.params.empcod  && nip.nipdate.getDate === dat.getDate);
    // if (!nip) {
    //     return res.status(404).send('Not found');
    // }
    // res.send(nip);
})

router.post('/', (req,res) => {
    console.log(req);
    const nip = {
        empcod: req.body.empcod,
        date: req.body.date,
        start: req.body.start,
        end: req.body.end
    }
    try {
        let insertManyResult = collection.insertMany(nip)
        console.log(`${insertManyResult.insertedId} added successfully.`)
    }
    catch(err){
        console.log(`Something went very wrong: ${err}`);
    }
    // nippou.push(nip);
    res.send(nip);
})

module.exports=router;