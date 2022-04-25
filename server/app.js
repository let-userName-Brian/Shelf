const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const Pool = require('pg').Pool;
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.HOST,
  database: process.env.DB,
  password: process.env.PASSWORD,
  port: process.env.PRT,
  ssl: {
    rejectUnauthorized: false,
  },
  migrations: {
    tableName: 'knex_migrations'
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());

app.listen(PORT, () => {
  connectToDB();
  // setTimeout(() => {
  //   console.log('pwd', process.env.PASSWORD)
  // }, 600)
  console.log(`listening on ${PORT}`);
});

app.get('/', (_, res) => {
  res.send("Hey fucker's!");
});
//--------------------------------INVENTORY TABLE----------------------------------------------------------------------------------------------------------------
/**
 * @returns all the rows from the Inventory Table
 */
app.get('/inventory', (_, res) => {
  pool.query('SELECT * FROM inventory', (error, results) => {
    if (error) {
      res.send('error' + error)
    }
    res.send(results.rows)
  });
});

/**
 * Adds new items to the inventory table
 */
app.post('/inventory', (req, res) => {
  pool.query(`INSERT INTO inventory (item_name, brand, nsn, item_size, gender, building, aisle, item_count, minimum_count, count_status, ordered, intial_gear, returnable_item) values('${req.body.item.item_name}', '${req.body.item.brand}', '${req.body.item.nsn}', '${req.body.item.item_size}', '${req.body.item.gender}', '${req.body.item.building}', '${req.body.item.aisle}', ${req.body.item.item_count}, ${req.body.item.minimum_count}, '${req.body.item.count_status}', ${req.body.item.ordered}, ${req.body.item.intial_gear}, ${req.body.item.returnable_item})`, (error, results) => {
    if (error) {
      res.send('error' + error)
    }
    console.log('placed in DB')
    res.status(200)
    res.send("Success")
  })
});


/**
 * updates the inventory table with the new item matched at its ID
 */
app.patch('/inventory', (req, res) => {
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
    returnable_item: req.body.Returnable
  }
  console.log(params)
  pool.query(
    `UPDATE inventory 
      SET item_name='${params.item_name}', brand='${params.brand}', nsn='${params.nsn}', item_size='${params.item_size}', gender='${params.gender}', building='${params.building}', aisle='${params.aisle}', item_count=${params.item_count}, minimum_count=${params.minimum_count}, count_status='${params.count_status}', ordered=${params.ordered}, intial_gear=${params.initial_gear}, returnable_item=${params.returnable_item} 
        WHERE item_id = '${params.item_id}'`, (error, results) => {
    if (error) {
      res.send('error' + error)
    }
    console.log('updated in DB')
    res.status(204)
    res.send("Success")
  })
})




/**
 * Deletes item from the inventory table
 */
app.delete('/inventory', (req, res) => {
  const item_id = req.body.id;
  pool.query(`DELETE FROM inventory WHERE item_id='${item_id}'`,
    (error, results) => {
      if (error) {
        res.send('error' + error)
      }
      console.log('removed from DB')
      res.status(200)
      res.send("Success")
    })
})


//----------------------------------DEPLOYENT TABLE--------------------------------------------------------------------------------------------------------------

/**
 * 
 * @returns {Promise<void>}
 * getting deployment items
 */
// app.get('/deploymentinventory', (req, res) => {
//   pool.query('SELECT * FROM deployment', (error, results) => {
//     if (error) {
//       res.send('error' + error)
//     }
//     res.send(results.rows)
//   })
// })

async function connectToDB() {
  try {
    const client = await pool.connect();
    return console.log('connected to db');
  } catch (err) {
    console.log(err);
  }
};





