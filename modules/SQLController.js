const sqlController = {};
const mysql = require('mysql');
const config = require('./SQLConfig');
const connection = mysql.createConnection(config);

function getIdUserByName(name, cb)
{
    connection.query('SELECT id_usu FROM user WHERE nmc_usu = ? LIMIT 1', [name], (error, result) =>
    {
        if (error) throw error;
        else // execute callback 'cuz without cb return a undefined value (async)
            cb(result.id_usu)
    })
}
function getIdChipByNSerie(nSerie, cb)
{
    connection.query('SELECT id_chp FROM chip WHERE nse_chp = ? LIMIT 1', [nSerie], (error, result) =>
    {
        console.log(result);
        if (error) throw error;
        else // execute callback 'cuz without cb return a undefined value (async)
            cb(result.id_chp)
    })
}
function exitsUser(name, cb)
{
    connection.query('SELECT nmc_usu FROM user WHERE nmc_usu = ? LIMIT 1', [name], (error, result) =>
    {
        if (error) throw error;
        else // execute callback 'cuz without cb return a undefined value (async)
            cb(!(result.length === 0))
    })
}
function exitsChip(nSerie, cb)
{
    connection.query('SELECT nse_chp FROM chip WHERE nse_chp = ? LIMIT 1', [nSerie], (error, result) =>
    {
        if (error) throw error;
        else // execute callback 'cuz without cb return a undefined value (async)
            cb(!(result.length === 0))
    })
}
function exitsPermit(userId, chipId, typePermit, cb)
{
    connection.query('SELECT id_usu FROM permit WHERE id_usu = ? and id_chp = ? and pro_per = ? LIMIT 1', [userId, chipId, typePermit], (error, result) =>
    {
        if (error) throw error;
        else // execute callback 'cuz without cb return a undefined value (async)
            cb(!(result.length === 0))
    })
}

sqlController.addUser = (req, res) =>
{
    const name = req.body.name;
    const email = req.body.email;
    const tel = req.body.tel;
    const image = req.body.image;
    const pass = req.body.pass;

    exitsUser(name, (exits) =>
    {
        if (exits) res.send(false);
        else
            connection.query('INSERT INTO user VALUES(0, ?, ?, ?, ?, ?)', [name, email, tel, (image != null)? image:null, pass], error =>
            {
                if (error) throw error;
                else res.send(true)
            })
    })
};
sqlController.getUserById = (req, res) =>
{
    const id = req.body.id;
    connection.query('SELECT id_usu, nmc_usu, ema_usu, cel_usu, img_usu FROM user WHERE id_usu = ? LIMIT 1', [id], (error, result) =>
    {
        if (error) throw error;
        else res.send((result.length === 0) ? null : result[0])
    })
};
sqlController.getUserByName = (req, res) =>
{
    const name = req.body.name;
    connection.query('SELECT id_usu, nmc_usu, ema_usu, cel_usu, img_usu FROM user WHERE nmc_usu = ? LIMIT 1', [name], (error, result) =>
    {
        if (error) throw error;
        else res.send((result.length === 0) ? null : result[0])
    })
};
sqlController.getUserForLogin = (req, res) =>
{
    const name = req.body.name;
    connection.query('SELECT * FROM user WHERE nmc_usu = ? LIMIT 1', [name], (error, result) =>
    {
        if (error) throw error;
        else res.send((result.length === 0) ? null : result[0])
    })
};
sqlController.delUserById = (req, res) =>
{
    const id = req.body.id;
    connection.query('DELETE FROM user WHERE id_usu = ?', [id], error =>
    {
        if (error) throw error;
        else res.send(true)
    })
};
sqlController.delUserByName = (req, res) =>
{
    const name = req.body.name;
    connection.query('DELETE FROM user WHERE nmc_usu = ?', [name], error =>
    {
        if (error) throw error;
        else res.send(true)
    })
};

sqlController.addChip = (req, res) =>
{
    const nserie = req.body.nserie;
    const ownName = req.body.ownName;
    const tel = req.body.tel;

    exitsChip(nserie, (exits) =>
    {
        if (exits) res.send(false);
        else
            connection.query('INSERT INTO chip VALUES(0, ?, ?, ?, 1)', [nserie, ownName, tel], error =>
            {
                if (error) throw error;
                else res.send(true)
            })
    })
};
sqlController.getChip = (req, res) =>
{
    connection.query('SELECT id_chp, nse_chp, npr_chp, cel_chp FROM chip WHERE nse_chp = ? and act_chp = 1 LIMIT 1', [req.body.nserie], (error, result) =>
    {
        if (error) throw error;
        else res.send((result.length === 0) ? null : result[0])
    })
};
sqlController.delChip = (req, res) =>
{
    connection.query('DELETE FROM chip WHERE nse_chp = ?', [req.body.nserie], error =>
    {
        if (error) throw error;
        else res.send(true)
    })
};
sqlController.getChips = (req, res) =>
{
    // SELECT id_chp, nse_chp, npr_chp, cel_chp FROM permit NATURAL JOIN chip NATURAL JOIN user WHERE id_usu = ? and pro_per = ? and act_per = 1
    connection.query('SELECT id_chp, nse_chp, npr_chp, cel_chp FROM permit NATURAL JOIN chip WHERE id_usu = ? and pro_per = ? and act_per = 1', [req.body.id, req.body.owner==="true"? 1:0], (error, result)  =>
    {
        if (error) throw error;
        else res.send((result.length === 0) ? null : result)
    })
};

sqlController.addPermit = (req, res) =>
{
    const id = req.body.id;
    const nSerie = req.body.nserie;
    const owner = req.body.owner; //    should be boolean

    console.log("Numero de serie:");
    console.log(nSerie);

    getIdChipByNSerie(nSerie, idChip =>
    {
        exitsPermit(id, idChip, owner==="true"? 1:0, (exits) =>
        {
            if (exits) res.send(false);
            else
                connection.query('INSERT INTO permit VALUES(0, ?, ?, ?, 1)', [id, idChip, owner==="true"? 1:0], error =>
                {
                    if (error) throw error;
                    else res.send(true)
                })
        })
    })
};
sqlController.getPermit = (req, res) =>
{
    connection.query('SELECT id_per, id_usu, id_chp, pro_per FROM permit WHERE id_usu = ? and id_chp = ? and pro_per = ? LIMIT 1', [req.body.id, req.body.nserie, req.body.owner==="true"? 1:0], (error, result) =>
    {
        if (error) throw error;
        else res.send((result.length === 0) ? null : result[0])
    })
};
sqlController.delPermit = (req, res) =>
{
    getIdChipByNSerie(req.body.nserie, idChip =>
    {
        connection.query('DELETE FROM permit WHERE id_usu = ? and id_chp = ? and pro_per = ?', [req.body.id, idChip, req.body.owner==="true"? 1:0], error =>
        {
            if (error) throw error;
            else res.send(true)
        })
    })
};

sqlController.getReceivedPermits = (req, res) =>
{
    connection.query('call recivedPermits(?)', [req.body.id], (error, result) =>
    {
        if (error) throw error;
        else res.send((result.length === 0) ? null : result)
    })
};
sqlController.getGivenPermits = (req, res) =>
{
    connection.query('call givedPermits(?)', [req.body.id], (error, result) =>
    {
        if (error) throw error;
        else res.send((result.length === 0) ? null : result)
    })
};

sqlController.getRequestAlerts = (req, res) =>
{
    connection.query('call not_sol(?)', [req.body.id], (error, result) =>
    {
        if (error) throw error;
        else res.send((result.length === 0) ? null : result)
    })
};
sqlController.getAccessAlerts = (req, res) =>
{
    connection.query('call not_sol(?)', [req.body.id], (error, result) =>
    {
        if (error) throw error;
        else res.send((result.length === 0) ? null : result)
    })
};

module.exports = sqlController;
