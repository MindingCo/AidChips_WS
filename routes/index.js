const express = require('express');
const router = express.Router();
const sqlController = require('../modules/SQLController');

router.get('/', (req, res) =>
    res.render('index', { title: 'Express' })
);
//  User Crud
router.post('/login', (req, res) =>
    sqlController.getUserForLogin(req, res) );

router.post('/add/user', (req, res) =>
    sqlController.addUser(req, res) );
router.post('/get/user', (req, res) =>
{
    if (req.body.id !== undefined)
        sqlController.getUserById(req, res);
    else if (req.body.name !== undefined)
        sqlController.getUserByName(req, res);
    else
        res.send({message: "Envia parametros"})
});
router.post('/del/user', (req, res) =>
{
    if (req.body.id !== undefined)
        sqlController.delUserById(req, res);
    else
        sqlController.delUserByName(req, res)
});
//  Chip Crud
router.post('/add/chip', (req, res) =>
    sqlController.addChip(req, res) );
router.post('/get/chip', (req, res) =>
    sqlController.getChip(req, res) );
router.post('/del/chip', (req, res) =>
    sqlController.delChip(req, res) );
router.post('/get/chips', (req, res) =>
    sqlController.getChips(req, res) );

//  Permit Crud
router.post('/add/permit', (req, res) =>
    sqlController.addPermit(req, res) );
router.post('/get/permit', (req, res) =>
    sqlController.getPermit(req, res) );
router.post('/del/permit', (req, res) =>
    sqlController.delPermit(req, res) );

module.exports = router;