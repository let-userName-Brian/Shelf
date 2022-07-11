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

//PATCH call to add entire shopping cart to JSON cell inside of users table in the issued_items column (jsob)
// based on the dod_id of the logged in user

async function addToIssuedItems(req, res) {
  let value = value;
  pool.query(
    `UPDATE users SET issued_items = COALESCE(issued_items, '[]'::jsonb) ||
    (shopping_cart) ::jsonb, shopping_cart = NULL 
    WHERE dod_id= '${value}'`,
      (error, results) => {
        if (error) {
          res.send("error" + error);
        }
        console.log("placed item into shopping cart");
        res.status(200);
        res.send("Success")
      }
    );
  }




module.exports = {
addToIssuedItems
};