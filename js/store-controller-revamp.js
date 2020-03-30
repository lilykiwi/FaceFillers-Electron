const MySQL = require("mysql");

/* ----------------- Database System ----------------- */

const db = MySQL.createConnection({
  host: "localhost",
  user: "public",
  password: "publicpass",
  database: "facefillers_db"
});

const targetStoreID = "1";

/* ----------------- Async page load, done once ----------------- */
(async () => {
  db.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
  });
  const storeData = getGeneric("stores", "store_id", targetStoreID);
  update();
})();

async function update() {
  ordersData = getGeneric("orders", "store_id", targetStoreID);

}

/* ----------------- Async functions ----------------- */

function getGeneric(table, classifier, id) {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM " + table + " WHERE " + classifier + " = " + id + ";", function (err, result) {
      return err ? reject(err) : resolve(result);
    });
  });
}

function getOrderData(id) {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM orders WHERE store_id = " + id + ";", function (err, result) {
      return err ? reject(err) : resolve(result);
    });
  });
}

function getOrderItems(id) {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM order_items WHERE order_id = " + id + ";", function (err, result) {
      return err ? reject(err) : resolve(result);
    });
  });
}

function getMenuItems(id) {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM menu_items WHERE store_id = " + id + ";", function (err, result) {
      return err ? reject(err) : resolve(result);
    });
  });
}

/* ----------------- Synchronous functions ----------------- */
