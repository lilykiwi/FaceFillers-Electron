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
  update();
})();

async function update() {
  // due to this being async, the html here will be shown -unless- an order is returned, due to the promise.
  // Future plans would involve changing this with a periodic update, however that's out of scope here as there likely wouldn't be multiple clients running at once, so order discovery isn't important.
  changeHTML("courierOrderContainer", "<div class='title'>No order found</div>");
  addHTML("courierOrderContainer", "<button onclick='reload()' class='reloadButton'>Reload</div>")
  /* ----------------- Async DB operations ----------------- */
  const storeData = await getStoreData(targetStoreID);
  changeHTML("header-title", storeData.store_name + " - Courier");

  // Need to get order data before anything else can be filled
  const orderData = await getOrderData(storeData.store_id);
  const menuItems = await getMenuItems(storeData.store_id);
  const orderItems = await getOrderItems(orderData.order_id);
  const customerData = await getCustomerData(orderData.customer_id);

  changeHTML("courierOrderContainer", `
  <!--remove everything in here-->
  <div class="title" id="orderTitle">Order [!]</div>
  <div class="title" id="orderTime">Placed at [!]</div>
  <div class="orderPanel">
    <div class="flexInline">
      <div id="storeInfo">
        <div class="subtitle">Store Info</div>
        <div class="infoListing" id="storeName">Name [!]</div>
        <div class="infoListing" id="storeAddress">Address [!]</div>
      </div>
      <div id="customerInfo">
        <div class="subtitle">Customer Info</div>
        <div class="infoListing" id="customerName">Name [!]</div>
        <div class="infoListing" id="customerAddress">Address [!]</div>
      </div>
    </div>
    <div class="orderInfo">
      <div class="subtitle">Order Info</div>
      <div id="orderInfoBox">

      </div>
    </div>
    <div id="buttonContainer"></div>
  </div>`);

  // Titles
  changeHTML("orderTitle", "Order #" + orderData.order_id)
  changeHTML("orderTime", "Placed at " + dateToTime(orderData.date_of_order))

  // Store Info Box
  changeHTML("storeName", storeData.store_name);
  changeHTML("storeAddress", storeData.store_address);

  // Customer Info Box
  changeHTML("customerName", customerData.customer_name);
  changeHTML("customerAddress", customerData.customer_address);

  // Order Info box
  changeHTML("orderInfoBox", "");
  for (const i in orderItems) {
    if (orderItems.hasOwnProperty(i)) {
      element = orderItems[i];
      addHTML("orderInfoBox", "<div class='infoListing'>" + resolveItemInfo(orderItems, menuItems, i) + "</div>");
    }
  }

  // Button Config
  if (orderData.order_status == "toCollect") {
    changeHTML("buttonContainer", "<button onclick='pickedUp(" + orderData.order_id + ")' id='updateOrderButton'>Picked Up Order</button>");
    document.getElementById("customerInfo").classList.add("disabled");
    document.getElementById("storeInfo").classList.remove("disabled");
  } else {
    changeHTML("buttonContainer", "<button onclick='delivered(" + orderData.order_id + ")' id='updateOrderButton'> Delivered Order</button>");
    document.getElementById("customerInfo").classList.remove("disabled");
    document.getElementById("storeInfo").classList.add("disabled");
  }
}

/* ----------------- Async functions ----------------- */

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
          if (element.order_status == "toCollect" || element.order_status == "toDeliver") {
            //found first toDeliver order
            return err ? reject(err) : resolve(element);
          }
        }
      }
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

function getOrderItems(id) {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM order_items WHERE order_id = " + id + ";", function (err, result) {
      return err ? reject(err) : resolve(result);
    });
  });
}

function getCustomerData(id) {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM customers WHERE customer_id = " + id + ";", function (err, result) {
      return err ? reject(err) : resolve(result[0]);
    });
  });
}

/* ----------------- Synchronous functions ----------------- */

function resolveItemInfo(orderItems, menuItems, i) {
  return orderItems[i].quantity + "x " + menuItems[i].item_name;
}

function dateToTime(datetime) {
  return datetime.getHours() + ":" + datetime.getMinutes();
}

function changeHTML(id, s) {
  document.getElementById(id).innerHTML = s;
}

function addHTML(id, s) {
  document.getElementById(id).innerHTML += s;
}

function reload() {
  window.location.reload();
}

function pickedUp(id) {
  db.query("UPDATE orders SET order_status = 'toDeliver' WHERE order_id = " + id + ";");
  update();
}

function delivered(id) {
  db.query("DELETE FROM orders WHERE order_id =" + id + ";");
  update();
}
