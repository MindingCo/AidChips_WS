const sqlController = {};
const mysql = require('mysql');
const config = require('./SQLConfig');
const connection = mysql.createConnection(config);

// sqlController.finish = connection.end();
function exitsUser(name, cb)
{
   connection.query('SELECT  nmc_usu FROM user WHERE nmc_usu = ? LIMIT 1', [name], (error, result) =>
   {
      if (error) throw error;
      else // execute callback 'cuz without cb return a undefined value (async)
         cb(!(result.length === 0))
   });
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
            if (error) throw error
            else res.send(true)
         });
   });
};
sqlController.getUserById = (req, res) =>
{
   const id = req.body.id;
   connection.query('SELECT  id_usu, nmc_usu, ema_usu, cel_usu, img_usu FROM user WHERE id_usu = ? LIMIT 1', [id], (error, result) =>
   {
      if (error) throw error
      res.send((result.length === 0) ? null : result[0])
   });
};
sqlController.getUserByName = (req, res) =>
{
   const name = req.body.name;
   connection.query('SELECT  id_usu, nmc_usu, ema_usu, cel_usu, img_usu FROM user WHERE nmc_usu = ? LIMIT 1', [name], (error, result) =>
   {
      if (error) throw error
      res.send((result.length === 0) ? null : result[0])
   });
};
sqlController.getUserForLogin = (req, res) =>
{
   const name = req.body.name;
   connection.query('SELECT * FROM user WHERE nmc_usu = ? LIMIT 1', [name], (error, result) =>
   {
      if (error) throw error
      res.send((result.length === 0) ? null : result[0])
   });
};
sqlController.delUserById = (req, res) =>
{
   const id = req.body.id;
   connection.query('DELETE FROM user WHERE id_usu = ?', [id], error =>
   {
      if (error) throw error
      else res.send(true)
   });
};
sqlController.delUserByName = (req, res) =>
{
   const name = req.body.name;
   connection.query('DELETE FROM user WHERE nmc_usu = ?', [name], error =>
   {
      if (error) throw error
      else res.send(true)
   });
};

module.exports = sqlController;