const Pool = require("pg").Pool;
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../auth_routes/authRoutes");
require("dotenv").config();

const pool = new Pool({
  user: "postgres",
  host: "shelfdatabase.ca4lcabxs5eo.us-gov-west-1.rds.amazonaws.com",
  database: "shelfdatabase",
  password: "Shelfcodesucks!",
  port: "5432",
  ssl: {
    rejectUnauthorized: false,
  },
});

async function getFSS45BowlingInventory(req, res) {
  verifyToken(req, res, (authData) => {
    jwt.verify(req.token, "secretkey", (err, authData) => {
      if (authData === undefined) return res.send(403);
      pool.query("SELECT * FROM fss45bowling ", (error, results) => {
        if (error) {
          res.sendStatus("error" + error);
        }
        res.send(results.rows);
        // console.log(authData)
      });
    });
  });
}

async function addItemToFSS45BowlingInventory(req, res) {
  console.log("ADDDINNNGGG FSSSS", req.body)
  pool.query(
    `INSERT INTO fss45bowling (	item_name, brand, nsn, item_size, gender, 
      building, aisle, item_count, minimum_count, count_status, 
      ordered, courier, tracking, contact, 
      original_warehouse, notes) 
      values('${req.body.item.item_name}', '${req.body.item.brand}', '${req.body.item.nsn}', '${req.body.item.item_size}', '${req.body.item.gender}', 
      '${req.body.item.building}', '${req.body.item.aisle}', ${req.body.item.item_count}, ${req.body.item.minimum_count}, '${req.body.item.count_status}', 
      ${req.body.item.ordered}, '${req.body.item.courier}', '${req.body.item.tracking}', '${req.body.item.contact}', 
      'fss45bowling', '${req.body.item.notes}')`,
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

async function updateItemInFSS45BowlingInventory(req, res) {
  console.log("PARAMS IN FSS", req.body);
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
    minimum_count: req.body.MinCount,
    ordered: req.body.Ordered,
    courier: req.body.Courier,
    tracking: req.body.Tracking,
    contact: req.body.Contact,
    notes: req.body.Notes,
  };
  console.log("PATCH IN FSS", params);
  pool.query(
    `UPDATE fss45bowling
          SET item_name='${params.item_name}', brand='${params.brand}', nsn='${params.nsn}', item_size='${params.item_size}', gender='${params.gender}', building='${params.building}', aisle='${params.aisle}', item_count=${params.item_count}, minimum_count=${params.minimum_count}, count_status='${params.count_status}', ordered=${params.ordered}, courier='${params.courier}', tracking='${params.tracking}', contact='${params.contact}', notes='${params.notes}'
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

async function deleteItemFromFSS45BowlingInventory(req, res) {
  const item_id = req.body.id;
  pool.query(
    `DELETE FROM fss45bowling  WHERE item_id='${item_id}'`,
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
  getFSS45BowlingInventory,
  addItemToFSS45BowlingInventory,
  updateItemInFSS45BowlingInventory,
  deleteItemFromFSS45BowlingInventory,
};
