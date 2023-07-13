const express = require('express');
const session = require('express-session');
const path =  require('path');
const cors = require('cors')
const nippouroute = require('./nippou.js')
const userroute = require('./user.js')
const sagyouroute = require('./sagyou.js')
const coursesroute = require('./courses.js');

const app = express();
const bodyParser = require('body-parser')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use('/api/nippou', nippouroute);
app.use('/api/users', userroute);
app.use('/api/sagyou', sagyouroute);
app.use('/api/courses', coursesroute);

// app.configure(() => {
//     app.use(express.bodyParser())
// })

app.use(session({
    secret: 'abcd',
    resave: true,
    saveUninitialized: true
}));
app.use(express.json);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));


app.get('/', (req, res) => {
    console.log(__dirname);
    res.sendFile(path.join(__dirname, 'html/index.html'));
});

app.post('/auth', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    if (username && password) {
        if (users.indexOf({username, password}) == -1) {
            res.send('Incorrect Username and/or Password');
        }
        else {
            res.redirect('home');
        }
    }
    else {
        res.send('Please enter a Username and/or Password')
    }
    res.end();

});

app.get('/home', (req, res) => {
    if (req.session.loggedin) {
        res.send('Welcome back, ' + req.session.username + '!');
    }
    else {
        res.send('Please, login to view this page!');
    }
    res.end();
});

app.listen(8080, () => {
    console.log('Listening on port 8080')
});