const MySQL = require("mysql");

/* ----------------- Database System ----------------- */

var db = MySQL.createConnection({
  host: "localhost",
  user: "public",
  password: "publicpass",
  database: "facefillers_db"
});

const targetStoreID = "1";

db.connect(function (err) {
  if (err) throw err;
  console.log("Connected. Starting db operations...");

  // Check store exists and get the name, pushing it to the top
  db.query("SELECT * FROM stores WHERE store_id = " + targetStoreID + ";", function (err, result) {
    if (err) throw err;
    let store_data = result[0];
    document.getElementById("header-title").innerHTML = store_data.store_name + " - Orders";
  });
});

function updatePage() {
  //clear current page
  document.getElementById("ordersContainer").innerHTML = "";


  // get all information from DB
  db.query("SELECT * FROM orders WHERE store_id=" + targetStoreID + ";", function (err, result) {
    if (err) throw err;

    for (let i in result) {
      if (result.hasOwnProperty(i)) {
        const element = result[i];
        const key = element.order_id;

        // found order waiting for confirmation
        document.getElementById("ordersContainer").innerHTML += `
          <div class="orderBox">
            <div class="flexContainerRow controlContainer">
              <div class="flexContainerColumn orderInformation">
                <div id="orderNumberText` + key + `">order # unloaded</div>
                <div id="orderTimeText` + key + `">time placed unloaded</div>
                <div id="orderStatusText` + key + `">status unloaded</div>
              </div>
              <div id="orderBoxButtons` + key + `"></div>
            </div>
            <div id="orderBoxItems` + key + `" class="orderBoxItems"></div>
          </div>`

        // Messy block to update order information. I miss jquery.
        document.getElementById("orderNumberText" + key).innerHTML = "Order #" + element.order_id;
        let fullDate = element.date_of_order;
        document.getElementById("orderTimeText" + key).innerHTML = "Placed at " + fullDate.getHours() + ":" + fullDate.getMinutes();
        document.getElementById("orderStatusText" + key).innerHTML = "Status: " + element.order_status;

        // Block to add buttons for control
        if (element.order_status == "waiting") {
          document.getElementById("orderBoxButtons" + key).innerHTML = `
          <button class="pageButton" onclick="acceptOrder(` + key + `)">
            <div class="confirmButtonText inButton">Accept Order</div>
            <img class="confirmButtonImg inButton" src="../node_modules/octicons/build/svg/check.svg"></img>
          </button>
          <button class="pageButton" onclick="contactCustomer(` + key + `)">
            <div class="confirmButtonText inButton">Contact Customer</div>
            <img class="confirmButtonImg inButton" src="../node_modules/octicons/build/svg/issue-opened.svg"></img>
          </button>`
        } else if (element.order_status == "preparing") {
          document.getElementById("orderBoxButtons" + key).innerHTML = `
          <button class="pageButton" onclick="completeOrder(` + key + `)">
            <div class="confirmButtonText inButton">Order Ready</div>
            <img class="confirmButtonImg inButton" src="../node_modules/octicons/build/svg/check.svg"></img>
          </button>
          <button class="pageButton" onclick="contactCustomer(` + key + `)">
            <div class="confirmButtonText inButton">Contact Customer</div>
            <img class="confirmButtonImg inButton" src="../node_modules/octicons/build/svg/issue-opened.svg"></img>
          </button>`
        } else if (element.order_status == "toCollect") {
          document.getElementById("orderBoxButtons" + key).innerHTML = `
          <button class="pageButton" onclick="contactCustomer(` + key + `)">
            <div class="confirmButtonText inButton">Contact Customer</div>
            <img class="confirmButtonImg inButton" src="../node_modules/octicons/build/svg/issue-opened.svg"></img>
          </button>`
        }

        if (element.order_status != "toCollect") {
          // Block to get all the items in the order and display them
          db.query("SELECT * FROM menu_items WHERE store_id=" + targetStoreID, function (err, result) {
            if (err) throw err;
            let menuItems = result;
            db.query("SELECT * FROM order_items WHERE order_id=" + element.order_id, function (err, result) {
              if (err) throw err;
              for (const j in result) {
                if (result.hasOwnProperty(j)) {
                  const element = result[j];

                  document.getElementById("orderBoxItems" + key).innerHTML += `
                    <div id = "orderItem`+ key + `-` + j + `" class="orderItem">
                      ` + element.quantity + "x " + menuItems[j].item_name + `
                    </div > `
                }
              }
            });
          });
        }
      }
    }
  });
}

function completeOrder(orderNumber) {
  // TODO: order completion
  // Should update order in DB from "preparing" to "toCollect"
  db.query("UPDATE orders SET order_status='toCollect' WHERE order_id =" + orderNumber + ";", function (err, result) {
    if (err) throw err;
    updatePage();
  });
}

function acceptOrder(orderNumber) {
  // TODO: order acceptance
  // Should update order in DB from "waiting" to "preparing"
  db.query("UPDATE orders SET order_status='preparing' WHERE order_id =" + orderNumber + ";", function (err, result) {
    if (err) throw err;
    updatePage();
  });
}

function contactCustomer(orderNumber) {
  // TODO: contact customer through modal & DB operations
  // Modal to show contact information and button to accept order, edit order (ouy of scope?), or reject order.
  // Information should include
  // - Contact Info
  // - Order Items
  // - Time Placed
  document.getElementById("modalContainer").innerHTML = `
    <div class="modalBackground">
      <div class="modalContainer">
        <div id="modalText"></div>
        <div class="modalButtonContainer">
          <button onclick="cancelOrder(` + orderNumber + `)" class="modalButton">
            <div>Cancel Order</div>
            <img class="confirmButtonImg inButton" src="../node_modules/octicons/build/svg/alert.svg"></img>
          </button>
          <button onclick="closeModal()" class="modalButton">
            <div>Close</div>
            <img class="confirmButtonImg inButton" src="../node_modules/octicons/build/svg/check.svg"></img>
          </button>
        </div>
      </div>
    </div>
  `;

  db.query("SELECT * FROM orders WHERE order_id=" + orderNumber + ";", function (err, result) {
    if (err) throw err;
    let element = result[0];

    let fullDate = element.date_of_order;
    "Placed at " + fullDate.getHours() + ":" + fullDate.getMinutes();
    document.getElementById("modalText").innerHTML = `
    <div class="modalTitle">Order #` + orderNumber + `</div>`;

    db.query("SELECT * FROM customers WHERE customer_id=" + element.customer_id + ";", function (err, result) {
      if (err) throw err;

      document.getElementById("modalText").innerHTML += `
      <div class="modalText">Contact Number: ` + result[0].contact_number + `</div>`;
    });

    db.query("SELECT * FROM menu_items WHERE store_id=" + targetStoreID, function (err, result) {
      if (err) throw err;
      let menuItems = result;
      db.query("SELECT * FROM order_items WHERE order_id=" + orderNumber, function (err, result) {
        if (err) throw err;
        for (const i in result) {
          if (result.hasOwnProperty(i)) {
            const element = result[i];
            document.getElementById("modalText").innerHTML += `
          <div class="modalText">` + element.quantity + "x " + menuItems[i].item_name + `</div>`;
          }
        }
      });
    });
  });
}

function closeModal() {
  document.getElementById("modalContainer").innerHTML = "";
}

function cancelOrder(orderNumber) {
  closeModal();
  db.query("DELETE FROM orders WHERE order_id =" + orderNumber + ";", function (err, result) {
    if (err) throw err;
    updatePage();
  });
}

updatePage();
