const MySQL = require("mysql");

/* ----------------- Database System ----------------- */

const db = MySQL.createConnection({
  host: "localhost",
  user: "public",
  password: "publicpass",
  database: "facefillers_db"
});

const targetStoreID = "1";

async function update() {

  /* ----------------- Async DB operations ----------------- */

  db.connect(function (err) {
    if (err) throw err;
    console.log("Connected. Starting db operations...");
  });

  const storeData = await getStoreData(targetStoreID);
  const orderData = await getOrderData(storeData.store_id);
  const menuItems = await getMenuItems(storeData.store_id);
  const orderItems = await getOrderItems(orderData.order_id);
  const customerData = await getCustomerData(orderData.customer_id);

  console.log(dateToTime(orderData.date_of_order));
  console.log(customerData.customer_name);
  console.log(customerData.customer_address);

  for (const i in orderItems) {
    if (orderItems.hasOwnProperty(i)) {
      console.log(resolveItemInfo(orderItems, menuItems, i));
    }
  }

  changeHTML("header-title", storeData.store_name + " - Courier");
}

/* ----------------- Async DB functions ----------------- */

function getStoreData(id) {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM stores WHERE store_id = " + id + ";", function (err, result) {
      return err ? reject(err) : resolve(result[0]);
    });
  });
}

function getOrderData(id) {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM orders WHERE store_id = " + id + ";", function (err, result) {
      for (const i in result) {
        if (result.hasOwnProperty(i)) {
          const element = result[i];
          if (element.order_status == "complete") {
            //found first complete order
            return err ? reject(err) : resolve(element);
          }
        }
      }
    });
  });
}

function dateToTime(datetime) {
  return datetime.getHours() + ":" + datetime.getMinutes();
}

function getMenuItems(id) {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM menu_items WHERE store_id = " + id + ";", function (err, result) {
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

function resolveItemInfo(orderItems, menuItems, i) {
  return orderItems[i].quantity + "x " + menuItems[i].item_name;
}

function getCustomerData(id) {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM customers WHERE customer_id = " + id + ";", function (err, result) {
      return err ? reject(err) : resolve(result[0]);
    });
  });
}

function changeHTML(id, s) {
  document.getElementById(id).innerHTML = s;
}

/* ----------------- function calls ----------------- */

update();
