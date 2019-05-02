const express = require('express');
const router = express.Router();
const sqlController = require('../modules/SQLController');

/* GET home page. */
router.get('/', (req, res) =>
{
    res.render('index', { title: 'Express' });
});
router.post('/login', (req, res) =>
    sqlController.getUserForLogin(req, res) );
router.post('/add/user', (req, res) =>
    sqlController.addUser(req, res) );
router.post('/get/user', (req, res) =>
{
    const id = req.body.id;
    const name = req.body.name;

    if (id !== undefined)
        sqlController.getUserById(req, res);
    else if (name !== undefined)
        sqlController.getUserByName(req, res);
    else
        res.send({message: "Envia parametros"})
});
router.post('/del/user', (req, res) =>
{
    if (req.body.id !== undefined)
        sqlController.delUserById(req, res)
    else
        sqlController.delUserByName(req, res)
});

module.exports = router;