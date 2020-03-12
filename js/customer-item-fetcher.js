const MySQL = require("mysql");

/* ----------------- Database System ----------------- */

var db = MySQL.createConnection({
  host: "localhost",
  user: "public",
  password: "publicpass",
  database: "facefillers_db"
});

db.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  console.log("Starting db operations...");

  // Initialise some stuff
  var targetStoreID = "1";

  // Check store exists and get the name, pushing it to the top
  db.query("SELECT * FROM stores WHERE store_id = " + targetStoreID + ";", function (err, result) {
    if (err) throw err;
    let store_data = result[0];
    console.log(store_data);
    console.log("Store accessed: " + store_data.store_name);
    document.getElementById("header-title").innerHTML = store_data.store_name;
  });

  // Get and create inner elements for each menu item in the store
  db.query("SELECT * FROM menu_items WHERE store_id = " + targetStoreID + ";", function (err, result) {
    if (err) throw err;
    console.log(result);

    window.menu_items = result;

    menu_items.forEach(element => {
      console.log(element.item_name);

      innerElementID = "innerElement" + (element.menu_item_id - 1);
      innerElementQuantity = "innerElementQuantity" + (element.menu_item_id - 1);
      itemCost = "£" + (element.item_cost / 100.0).toFixed(2);
      document.getElementById("menu_items_holder").innerHTML += `
        <div id='`+ innerElementID + `' class="menu-listing-container">
          <div class="flexContainer">
            <div class="menu-listing-name-container">
              `+ element.item_name + `
            </div>
            <div class="menu-listing-cost-container">
              `+ itemCost + `
            </div>
          </div>
          <div class="menu-listing-quantity" id=` + innerElementQuantity + `>0</div>
          <div class="buttonContainer">
            <a onClick="addItem(` + (element.menu_item_id - 1) + `)" class="menu-listing-button">
              <img class="menu-listing-button-img" src="../node_modules/octicons/build/svg/plus.svg"></span>
            </a>
            <a onClick="removeItem(` + (element.menu_item_id - 1) + `)" class="menu-listing-button">
              <img class="menu-listing-button-img" src="../node_modules/octicons/build/svg/dash.svg"></span>
            </a>
          </div>
        </div>
      `;
    });
  });

});

/* ----------------- Cart System ----------------- */

var cart = [];

function addItem(itemIDToAdd) {
  if (cart[itemIDToAdd] == null) {
    cart[itemIDToAdd] = 0;
  }
  if (cart[itemIDToAdd] < 10) {
    cart[itemIDToAdd]++;
    document.getElementById("innerElementQuantity" + itemIDToAdd).innerHTML = cart[itemIDToAdd];
  }
}

function removeItem(itemIDToAdd) {
  if (cart[itemIDToAdd] == null) {
    cart[itemIDToAdd] = 0;
  }
  if (cart[itemIDToAdd] > 0) {
    cart[itemIDToAdd]--;
    document.getElementById("innerElementQuantity" + itemIDToAdd).innerHTML = cart[itemIDToAdd];
  }
}
