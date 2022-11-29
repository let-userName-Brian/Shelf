const Pool = require("pg").Pool;
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../auth_routes/authRoutes");
const bcrypt = require('bcrypt');
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

async function getUsers(req, res) {
  verifyToken(req, res, (authData) => {
    jwt.verify(req.token, "secretkey", (err, authData) => {
      if (authData === undefined) return res.send(403);
      pool.query("SELECT * FROM users", (error, results) => {
        if (error) {
          res.send("error" + error);
        }
        res.send(results.rows);
      });
    });
  });
};

async function addUser(req, res) {
  console.log("ADD USER BODY", req.body);

  const password = await bcrypt.hash(req.body.users.password, 10);

  console.log("PASSWORD", password)
  pool.query(
    `INSERT INTO users (dod_id, first_name, last_name, email, ima, organization, user_password) values('${req.body.users.dod_id}', '${req.body.users.first_name}', '${req.body.users.last_name}', '${req.body.users.email}', '${req.body.users.ima}', '${req.body.users.organization}', '${password}')`,
    (error, results) => {
      if (error) {
        return res.send("error" + error);
      }
      console.log("Added User to Database");
      res.status(200);
      res.send("Success");
    }
  );
};

async function deleteUser(req, res) {
  const dod_id = req.body.id;
  pool.query(`DELETE FROM users WHERE dod_id='${dod_id}'`, (error, results) => {
    if (error) {
      res.send("error" + error);
    }
    console.log("Deleted User");
    res.status(200);
    res.send("Success");
  });
};

//////REFACTOR TO UPDATE SHOPPING CART
async function updateUser(req, res) {
  let params = {
    dod_id: req.body.DoD,
    first_name: req.body.First,
    last_name: req.body.Last,
    email: req.body.Email,
    ima: req.body.IMA
  };
  pool.query(
    `UPDATE users
          SET dod_id='${params.dod_id}', first_name='${params.first_name}', last_name='${params.last_name}', email='${params.email}', ima='${params.ima}'
          WHERE dod_id = '${params.dod_id}'`,
    (error, results) => {
      if (error) {
        return res.send("error" + error);
      }
      console.log("Updated User Info in Database");
      res.status(204);
      res.send("Success");
    }
  );
}

// //POST call to add item to JSON cell inside of users table in the shopping_cart column (jsob)
// // based on the dod_id of the logged in user

// async function addToCart(req, res) {
//   let params = {
//     id: req.body.id,
//     Delete: req.body.Delete,
//     Edit: req.body.Edit,
//     Name: req.body.Name,
//     Brand: req.body.Brand,
//     NSN: req.body.NSN,
//     Bldg: req.body.Bldg,
//     Size: req.body.Size,
//     Count: req.body.Count,
//     Gender: req.body.Gender,
//     Aisle: req.body.Aisle,
//     Initial: req.body.Initial,
//     MinCount: req.body.MinCount,
//     Ordered: req.body.Ordered,
//     Returnable: req.body.Returnable,
//   };
  
//   pool.query(
//     `UPDATE users SET shopping_cart = COALESCE(shopping_cart, '[]'::jsonb) ||
//     '{"Name":"TEST",
//       "Brand":"${params.Brand}",
//       "NSN":"${params.NSN}",
//       "Size":"${params.Size}",
//       "Count":"${params.Count}",
//       "Gender":"${params.Gender}",
//       "UUID":"${params.Delete}"}' ::jsonb
//       WHERE dod_id = '263748598'`,
//       (error, results) => {
//         if (error) {
//           res.send("error" + error);
//         }
//         console.log("placed item into shopping cart");
//         res.status(200);
//       }
//     );
//   }



module.exports = {
  getUsers,
  addUser,
  deleteUser,
  updateUser,
  // addToCart
};


// values('${req.body.users.dod_id}', '${req.body.users.first_name}', '${req.body.users.last_name}', '${req.body.users.email}', '${req.body.users.ima}', '${req.body.users.organization}', '{"a": 1}'::jsonb)`,