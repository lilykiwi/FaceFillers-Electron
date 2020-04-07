const MySQL = require("mysql");

/* ----------------- Database System ----------------- */

const db = MySQL.createConnection({
  host: "localhost",
  user: "public",
  password: "publicpass",
  database: "facefillers_db",
});

const targetStoreID = "1";

/* ----------------- Async page load, done once ----------------- */

(async () => {
  db.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
  });
  update();
})();

/* ----------------- Async Update ----------------- */

async function update() {
  storeData = await getStoreData();
  data = await getData();

  console.log(data);
}

/* ----------------- Async Queries ----------------- */

function getData() {
  return new Promise((resolve, reject) => {
    db.query(
      `
      SELECT  stores.store_name    as s_name,
              menu_items.item_name as i_name,
              menu_items.item_cost as i_cost
        FROM menu_items
        INNER JOIN menu_items ON menu_items.store_id = stores.store_id
        WHERE stores.store_id = 1
      `,
      function (err, result) {
        return err ? reject(err) : resolve(result);
      }
    );
  });
}

/* ----------------- Regular functions ----------------- */
