const Pool = require("pg").Pool;
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../auth_routes/authRoutes");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.HOST,
  database: process.env.DB,
  password: process.env.PASSWORD,
  port: process.env.PRT,
  ssl: {
    rejectUnauthorized: false,
  },
});


async function getSelectedUser(req, res) {
  verifyToken(req, res, (authData) => {
    console.log(authData);
    jwt.verify(req.token, "secretkey", (err, authData) => {
      if (authData === undefined) return res.send(403);
      let user_id = req.params.dod_id;
      pool.query(`SELECT * FROM users WHERE dod_id = '${user_id}'`, (error, results) => {
        if (error) {
          return res.send("error" + error);
        }
        res.send(results.rows);
      });
    });
  });
}



module.exports = {
  getSelectedUser,
};