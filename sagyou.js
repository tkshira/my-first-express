const express = require('express');
const router = express.Router();

const sagyou = [
    {code: '001', sagName: '打合せ'},
    {code: '002', sagName: 'xe'},
    {code: '003', sagName: '社内作業'},
    {code: '004', sagName: 'その他'}
];

router.get('/sagyou', (req, res) => {
    res.send(sagyou);
})

module.exports = router;