const Pool = require("pg").Pool;
const jwt = require("jsonwebtoken");
require("dotenv").config();

const pool = new Pool({
  user: process.env.USER,
  database: process.env.DB,
  password: process.env.PASSWORD,
  port: process.env.PRT,
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"]; //checks the users token in the header
  if (typeof bearerHeader !== "undefined") {
    //if its not undefined then it splits the token at the first space and seperates the token from the bearer
    const bearer = bearerHeader.split(" "); // this is the split
    const bearerToken = bearer[1]; //grabs the next element in the array and sets it as the bearer token
    req.token = bearerToken; //sets the bearer token to the request
    next(); //built in function that allows the middleware to run
  } else {
    res.sendStatus(403); //sends a forbidden if there is no token
  }
}

async function login(req, res) {
  let user = {
    email: req.body.user_email,
    password: req.body.user_password,
  };
  //query DB to verify user and password are correct
  pool.query(
    "SELECT * FROM users WHERE email = $1 AND user_password = $2",
    [user.email, user.password],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500);
      } else {
        if (result.rows.length > 0) {
          //if user is found, create a token
          jwt.sign(
            { user },
            "secretkey",
            { expiresIn: "1hr" },
            (err, token) => {
              res.json({
                token,
                user: {
                  user_email: result.rows[0].email,
                  user_dod_id: result.rows[0].dod_id,
                  user_first_name: result.rows[0].first_name,
                  user_last_name: result.rows[0].last_name
                }
              });
              console.log("token in app.js", token);
            });
        }
      }
    }
  );
}

module.exports = {
  verifyToken,
  login
};
