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

async function getInventory(req, res) {
  verifyToken(req, res, (authData) => {
    jwt.verify(req.token, "secretkey", (err, authData) => {
      if (authData === undefined) return res.send(403);
      pool.query("SELECT * FROM inventory", (error, results) => {
        if (error) {
          res.sendStatus("error" + error);
        }
        res.send(results.rows);
        console.log(authData)
      });
    });
  });
}

async function addItemToInventory(req, res) {
  pool.query(
    `INSERT INTO inventory (item_name, brand, nsn, item_size, gender, building, aisle, item_count, minimum_count, count_status, ordered, intial_gear, returnable_item, courier, tracking, contact) values('${req.body.item.item_name}', '${req.body.item.brand}', '${req.body.item.nsn}', '${req.body.item.item_size}', '${req.body.item.gender}', '${req.body.item.building}', '${req.body.item.aisle}', ${req.body.item.item_count}, ${req.body.item.minimum_count}, '${req.body.item.count_status}', ${req.body.item.ordered}, ${req.body.item.intial_gear}, ${req.body.item.returnable_item}, '${req.body.item.courier}', '${req.body.item.tracking}', '${req.body.item.contact}')`,
    (error, results) => {
      if (error) {
        res.send("error" + error);
      }
      console.log("placed in DB");
      res.status(200);
      res.send("Success");
    }
  );
}

async function updateItemInInventory(req, res) {
  let params = {
    item_id: req.body.Delete,
    item_name: req.body.Name,
    brand: req.body.Brand,
    nsn: req.body.NSN,
    building: req.body.Bldg,
    aisle: req.body.Aisle,
    item_size: req.body.Size,
    item_count: req.body.Count,
    gender: req.body.Gender,
    initial_gear: req.body.Initial,
    minimum_count: req.body.MinCount,
    ordered: req.body.Ordered,
    returnable_item: req.body.Returnable,
    courier: req.body.Courier,
    tracking: req.body.Tracking,
    contact: req.body.Contact,
  };
  pool.query(
    `UPDATE inventory 
          SET item_name='${params.item_name}', brand='${params.brand}', nsn='${params.nsn}', item_size='${params.item_size}', gender='${params.gender}', building='${params.building}', aisle='${params.aisle}', item_count=${params.item_count}, minimum_count=${params.minimum_count}, count_status='${params.count_status}', ordered=${params.ordered}, intial_gear=${params.initial_gear}, returnable_item=${params.returnable_item}, courier='${params.courier}', tracking='${params.tracking}', contact='${params.contact}'
            WHERE item_id = '${params.item_id}'`,
    (error, results) => {
      if (error) {
        return res.send("error" + error);
      }
      console.log("updated in DB");
      res.status(204);
      res.send("Success");
    }
  );
}

async function deleteItemFromInventory(req, res) {
  const item_id = req.body.id;
  pool.query(
    `DELETE FROM inventory WHERE item_id='${item_id}'`,
    (error, results) => {
      if (error) {
        res.send("error" + error);
      }
      console.log("removed from DB");
      res.status(200);
      res.send("Success");
    }
  );
}

module.exports = {
  getInventory,
  addItemToInventory,
  updateItemInInventory,
  deleteItemFromInventory,
};
