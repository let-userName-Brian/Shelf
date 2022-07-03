const Pool = require("pg").Pool;
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../auth_routes/authRoutes");
require("dotenv").config();

const pool = new Pool({
  user: process.env.USER,
  database: process.env.DB,
  password: process.env.PASSWORD,
  port: process.env.PRT,
});

//GET call that fetches the shopping_cart table in database in 
//order to display the items in the cart
async function getCart(req, res) {
  verifyToken(req, res, () => {
    jwt.verify(req.token, "secretkey", () => {
      if (req.token === undefined) return res.send(403);
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


//PATCH call to add item to JSON cell inside of users table in the shopping_cart column (jsob)
// based on the dod_id of the logged in user

async function addToCart(req, res) {
  let params = {
    id: req.body.id,
    Delete: req.body.Delete,
    Edit: req.body.Edit,
    Name: req.body.Name,
    Brand: req.body.Brand,
    NSN: req.body.NSN,
    Bldg: req.body.Bldg,
    Size: req.body.Size,
    Count: req.body.Count,
    Gender: req.body.Gender,
    Aisle: req.body.Aisle,
    Initial: req.body.Initial,
    MinCount: req.body.MinCount,
    Ordered: req.body.Ordered,
    Returnable: req.body.Returnable,
  };
  let user_id = req.params.dod_id;
  pool.query(
    `UPDATE users SET shopping_cart = COALESCE(shopping_cart, '[]'::jsonb) ||
    '{"Name": "${params.Name}",
      "UUID": "${params.Delete}",
      "Brand": "${params.Brand}"}' ::jsonb
    WHERE dod_id= '${user_id}'`,
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

//DELETES items from shopping_cart JSON cell
//based on items' UUID

async function deleteItemFromShoppingCart(req, res) {
  const item_id = req.params.id;
  let user_id = req.params.dod_id;
  pool.query(
    `UPDATE users SET shopping_cart = shopping_cart - 
    Cast((SELECT position - 1 FROM users, jsonb_array_elements(shopping_cart) with 
        ordinality arr(item_object, position) 
    WHERE dod_id='${user_id}' and item_object->>'UUID' = '${item_id}') as int)
    WHERE dod_id='${user_id}';`,
    (error, results) => {
      if (error) {
        res.send("error" + error);
      }
      console.log("removed from DB");
      res.status(200);
    }
  );
}

module.exports = {
  getCart,
  addToCart,
  deleteItemFromShoppingCart
};
