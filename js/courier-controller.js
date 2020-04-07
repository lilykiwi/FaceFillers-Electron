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
  let orderData = await getOrderData();
  if (orderData == undefined) {
    changeHTML(
      "courierOrderContainer",
      `<div class='title'>No order found</div>
      <button onclick ='reload()' class='reloadButton'>Reload</div>`
    );
    document.getElementById("courierOrderContainer").style.display = "block";
    return;
  } else {
    document.getElementById("courierOrderContainer").style.display = "block";
  }
  changeHTML("header-title", orderData.s_name + " - Courier");
  let itemsData = await getItemsData(orderData.o_id);

  // Titles
  changeHTML("orderTitle", "Order #" + orderData.o_id);
  changeHTML("orderTime", "Placed at " + dateToTime(orderData.o_date));

  // Store Info Box
  changeHTML("storeName", orderData.s_name);
  changeHTML("storeAddress", orderData.s_address);

  // Customer Info Box
  changeHTML("customerName", orderData.c_name);
  changeHTML("customerAddress", orderData.c_address);

  // Order Info box
  changeHTML("orderInfoBox", "");
  for (const i in itemsData) {
    addHTML(
      "orderInfoBox",
      "<div class='infoListing'>" + resolveItemInfo(itemsData, i) + "</div>"
    );
  }

  // Button Stuff
  if (orderData.o_status == "toCollect") {
    changeHTML("updateOrderButton", "Collected Order");
    changeButtonAttr(
      "updateOrderButton",
      "progress('toCollect', " + orderData.o_id + ")"
    );
    document.getElementById("customerInfo").classList.add("disabled");
    document.getElementById("storeInfo").classList.remove("disabled");
  } else {
    changeHTML("updateOrderButton", "Delivered Order");
    changeButtonAttr(
      "updateOrderButton",
      "progress('toDeliver', " + orderData.o_id + ")"
    );
    document.getElementById("customerInfo").classList.remove("disabled");
    document.getElementById("storeInfo").classList.add("disabled");
  }
}

/* ----------------- Async Queries ----------------- */

function getOrderData() {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT stores.store_id             as s_id,
              stores.store_name           as s_name,
              stores.store_address        as s_address,
              orders.order_id             as o_id,
              orders.date_of_order        as o_date,
              orders.order_status         as o_status,
              customers.customer_name     as c_name,
              customers.customer_address  as c_address
        FROM        stores
        INNER JOIN  orders    ON orders.store_id    = stores.store_id
        INNER JOIN  customers ON customers.customer_id = orders.customer_id
        WHERE       orders.order_id = (SELECT MIN(order_id) from orders)
        AND         orders.order_status = "toCollect"
        OR          orders.order_status = "toDeliver"
        AND         stores.store_id = 1`,
      function (err, result) {
        return err ? reject(err) : resolve(result[0]);
      }
    );
  });
}

function getItemsData(id) {
  // more complex join query to get all the relevant data
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT order_items.order_item_id as oi_id,
              order_items.quantity      as oi_quantity,
              menu_items.item_name      as oi_name
        FROM order_items
        INNER JOIN menu_items ON menu_items.menu_item_id = order_items.menu_item_id
        WHERE order_items.order_id = ` + id,
      function (err, result) {
        return err ? reject(err) : resolve(result);
      }
    );
  });
}

/* ----------------- Regular functions ----------------- */

function resolveItemInfo(r, i) {
  return r[i].oi_quantity + "x " + r[i].oi_name;
}

function dateToTime(d) {
  return d.getHours() + ":" + d.getMinutes();
}

function changeHTML(id, s) {
  document.getElementById(id).innerHTML = s;
}

function addHTML(id, s) {
  document.getElementById(id).innerHTML += s;
}

function changeButtonAttr(id, s) {
  document.getElementById(id).setAttribute("onclick", s);
}

function reload() {
  window.location.reload();
}

function progress(status, id) {
  if (status == "toCollect") {
    db.query(
      "UPDATE orders SET order_status = 'toDeliver' WHERE order_id = " +
        id +
        ";"
    );
  } else {
    db.query("DELETE FROM orders WHERE order_id =" + id + ";");
  }
  update();
}

update();
