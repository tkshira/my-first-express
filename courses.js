const express = require('express');
const router = express.Router();
const {MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = 'mongodb+srv://myuser:47ZQro9Pt5zp7Ala@my-first-mongodb.wv6yush.mongodb.net/?retryWrites=true&w=majority';

// const nippou = [
//     {empcod: '001', nipdate: new Date("2022-06-12"), start: '09:00', end: '12:00'},
//     {empcod: '001', nipdate: new Date("2022-06-12"), start: '13:00', end: '15:00'},
//     {empcod: '001', nipdate: new Date("2022-06-12"), start: '15:00', end: '18:00'},
//     {empcod: '002', nipdate: new Date("2022-06-12"), start: '09:00', end: '10:00'},
// ];

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

const database = client.db("my-first-mongodb");
const collection = database.collection("courses");

async function run(){
    try {
        await client.connect();

        await client.db("admin").command({ ping: 1});
        console.log("Pinged your deployment. You successfully connected to MongoDB");

        // try {
        //     const insertManyResult = await collection.insertMany(nippou)
        //     console.log(`${insertManyResult.insertedCount} documents successfully inserted`)
        // }
        // catch(err){
        //     console.log(`Something went very wrong: ${err}`);
        // }
    }
    finally{
        await client.close();
    }
}

run().catch(console.dir);


async function getCourses(filter){
    await client.connect();
    console.log(filter);
    let course = await collection.find(filter);
    return await course.toArray();
}

router.get('/', (req, res) => {
    getCourses({}).then((courses) => {
        res.send(courses)
    },
    (reason) => {
        res.status(400).send(`error: ${reason}`);
    });
})

router.get('/:studentId/:day', (req,res) => {
    let studentid = req.params.studentId;
    let day = new Date(req.params.day);
    getCourses({
        studentid: studentid, day: {
            "$gte": day.toISOString(),
            "$lte": addDays(day, 7).toISOString(),
        }
    }).then(
        (courses) => {
            res.send(courses)
        },
        (reason) => {
            res.status(400).send(`Error: ${reason}`);
        }
    )
})

async function postCourse(course){
    await client.connect();
    try {   
        let insertManyResult = await collection.insertOne(course)
        console.log(insertManyResult);
        console.log(`${insertManyResult.insertedId} added successfully.`)
        course._id = insertManyResult.insertedId;
        return course;
    }
    catch(err){
        console.log(`Something went very wrong: ${err}`);
    }
}

router.post('/', (req,res) => {
    console.log(req.body);
    const course = {            
        studentid: req.body.studentid,
        name: req.body.name,
        day: req.body.day,
        startTime: req.body.startTime,
        endTime: req.body.endTime
    }
    postCourse(course).then(
        (course) => res.send(course),
        (reason) => res.status(404).send(`Error: ${reason}`)
    )
})

async function putCourse(course){
    await client.connect();
    try {
        let _objid = new ObjectId(course._id);
        console.log(course);
        let updateOne = await collection.updateOne({
            "_id": _objid
        }, 
        {
            $set: {
                studentId: course.studentId,
                day: course.day,
                name: course.name,
                startTime: course.startTime,
                endTime: course.endTime,
            }
        })
        console.log(updateOne);
        return course
    }
    catch(err){
        console.log(`Something went very wrong: ${err}`);
    }
}

router.put('/', (req,res) => {
    const course = {            
        _id: req.body._id,
        studentid: req.body.studentid,
        name: req.body.name,
        day: req.body.day,
        startTime: req.body.startTime,
        endTime: req.body.endTime
    }
    putCourse(course).then(
        (course) => res.send(course),
        (reason) => res.status(404).send(`Error: ${reason}`)
    )
})

module.exports=router;