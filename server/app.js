const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const Pool = require("pg").Pool;
const jwt = require("jsonwebtoken");
const { getInventory, addItemToInventory, updateItemInInventory, deleteItemFromInventory } = require('./inventory_routes/inventoryRoutes');
const { getUsers, addUser, deleteUser, updateUser} = require('./user_routes/userRoutes');
const { addToIssuedItems } = require('./user_routes/userInventory');
const { getCart, addToCart, deleteItemFromShoppingCart } = require('./shoppingcart_routes/shoppingcartRoutes');
const { verifyToken, login } = require('./auth_routes/authRoutes');
require("dotenv").config();

const pool = new Pool({
  user: process.env.USER,
  database: process.env.DB,
  password: process.env.PASSWORD,
  port: process.env.PRT,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());

//------------------------SERVER SETUP----------------------------------------------------------------------------------------------------------------------
app.listen(PORT, () => {
  connectToDB();
  console.log(`listening on ${PORT}`);
});

async function connectToDB() {
  try {
    const client = await pool.connect();
    return console.log("connected to db");
  } catch (err) {
    console.log(err);
  };
};

//--------------------------------LOGIN AUTH----------------------------------------------------------------------------------------------------------------
app.post('/login', login)

////// TESTING ROUTE ONLY //////
//line 52 - 57 will be added to all routes to verify auth token is in the header. 
// app.get("/testingJWT", verifyToken, (req, res) => {
//   jwt.verify(req.token, "secretkey", (err, authData) => {
//     if (err) {
//       res.send("idiot", err);
//       console.log(err);
//     } else {
//       res.json({
//         message: "it fucking worked bitch",
//         authData,
//       });
//     }
//   });
// });
/// TESTING ROUTE ONLY //////

//--------------------------------INVENTORY TABLE----------------------------------------------------------------------------------------------------------------

app.get('/inventory', getInventory)
app.post('/inventory', addItemToInventory)
app.patch('/inventory', updateItemInInventory)
app.delete('/inventory', deleteItemFromInventory)

//--------------------------------USERS TABLE----------------------------------------------------------------------------------------------------------------

app.get('/users', getUsers)
app.post('/users', addUser)
app.delete('/users', deleteUser)
app.patch('/users', updateUser)

//--------------------------------USERS TABLE FOR ISSUED ITEMS----------------------------------------------------------------------------------------------------------------

app.patch('/issued-items', addToIssuedItems)


//--------------------------------SHOPPING CART TABLE----------------------------------------------------------------------------------------------------------------

app.get('/shopping-cart', getCart)
app.delete('/shopping-cart/:id', deleteItemFromShoppingCart)
app.patch('/shopping-cart', addToCart)


/*

heroku git:remote -a postgres-apr
git push heroku main:main
docker run -d -p 5432:5432 --name postgres -e POSTGRES_PASSWORD=postgres postgres
//import sql file
\i /Users/brianhardy/Desktop/shelfbackup.sql

*/
