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
  console.log("Connected. Starting db operations...");

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
      args = (element.menu_item_id - 1) + ", '" + element.item_name + "', " + element.item_cost;
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
            <button onClick="addItem(` + args + `)" class="menu-listing-button">
              <img class="menu-listing-button-img" src="../node_modules/octicons/build/svg/plus.svg"></span>
            </button>
            <button onClick="removeItem(` + args + `)" class="menu-listing-button">
              <img class="menu-listing-button-img" src="../node_modules/octicons/build/svg/dash.svg"></span>
            </button>
          </div>
        </div>
      `;
    });
  });
});

/* ----------------- Cart System ----------------- */

var cart = {
  "item_id": [],
  "itemname": [],
  "itemcost": [],
  "itemquantity": []
};

/* TODO: move get-cart stuff in here
function getCartOffset(id) {


  return 0;
}
*/

function addItem(itemIDToAdd, itemNameToAdd, itemCostToAdd) {
  addinData = [itemIDToAdd, itemNameToAdd, itemCostToAdd];

  // block to identify if item already exists
  //let cartOffset = getCartOffset(itemIDToAdd); TODO: move get-cart stuff
  let cartOffset = 0; // add to first item if list empty
  for (let i in cart.item_id) {
    if (cart.item_id.hasOwnProperty(i)) {
      let element = cart.item_id[i];
      if (element === itemIDToAdd) {
        cartOffset = i; // found item!
        break;
      } else {
        cartOffset = cart.item_id.length; //didn't find item, append
      }
    }
  }

  // fill cart listing with content from addinData object
  let cartKeys = Object.keys(cart);
  for (const i in cartKeys) {
    const element = cart[cartKeys[i]];
    if (i != 3) { // only do math on the quantity object
      element[cartOffset] = addinData[i];
    } else {
      if (element[cartOffset] != null) {
        if (element[cartOffset] < 10) {
          element[cartOffset]++;
        }
      } else {
        element[cartOffset] = 1;
      }
    }
  }

  // Redraw cart & element
  document.getElementById("innerElementQuantity" + itemIDToAdd).innerHTML =
    cart.itemquantity[cartOffset];
  updateCart();
}

function removeItem(itemIDToAdd, itemNameToAdd, itemCostToAdd) {
  addinData = [itemIDToAdd, itemNameToAdd, itemCostToAdd];

  // block to identify if item already exists
  //let cartOffset = getCartOffset(itemIDToAdd); TODO: move get-cart stuff
  let cartOffset = 0; // add to first item if list empty
  for (let i in cart.item_id) {
    if (cart.item_id.hasOwnProperty(i)) {
      let element = cart.item_id[i];
      if (element === itemIDToAdd) {
        cartOffset = i; // found item!
        break;
      } else {
        cartOffset = cart.item_id.length; //didn't find item, append
      }
    }
  }

  // fill cart listing with content from addinData object
  let cartKeys = Object.keys(cart);
  for (const i in cartKeys) {
    const element = cart[cartKeys[i]];
    if (i != 3) {
      element[cartOffset] = addinData[i];
    } else { // only do math on the quantity object
      if (element[cartOffset] != null) {
        if (element[cartOffset] > 0) {
          element[cartOffset]--;
        }
      } else {
        element[cartOffset] = 0;
      }
    }
  }

  // Redraw cart & element
  document.getElementById("innerElementQuantity" + itemIDToAdd).innerHTML =
    cart.itemquantity[cartOffset];
  updateCart();
}

function updateCart() {
  // clear subtotal list
  document.getElementById("subtotal-item-container").innerHTML = "";

  // Cart info area
  let cartEmpty = true;
  for (const i in cart.item_id) {
    if (cart.item_id.hasOwnProperty(i)) {
      if (cart.itemquantity[i] != 0) {
        document.getElementById("subtotal-item-container").innerHTML +=
          "<div class='subtotal-item'>" + cart.itemquantity[i] + "x " + cart.itemname[i] + "</div>";
        cartEmpty = false;
      }
    }
  }
  if (cartEmpty) {
    document.getElementById("subtotal-item-container").innerHTML = "<div class='subtotal-item'>Cart Empty!</div>";
    document.getElementById("subtotal-order-button").disabled = true;
  } else {
    document.getElementById("subtotal-order-button").disabled = false;
  }

  // Cart cost & Button stuff
  let totalCost = 0;
  for (const value in cart.itemquantity) {
    if (cart.itemquantity.hasOwnProperty(value)) {
      const element = cart.itemquantity[value];
      if ((element) != 0) {
        totalCost += cart.itemcost[value] * cart.itemquantity[value];
      }
    }
  }
  let outputCost = "£" + (totalCost / 100.0).toFixed(2);
  document.getElementById("subtotal-cost").innerHTML = "Total Cost: " + outputCost;
}

/* ----------------- Order Confirmation Modal ----------------- */

function homebuttonModal() {
  document.getElementById("modalContainer").innerHTML = `
    <div class="modalBackground">
      <div class="modalContainer">
        <div class="modalText">Order placed successfully! Click the button to return to the home menu.</div>
        <a href="index.html" class="modalHomeButton">Home</a>
      </div>
    </div>
  `;
}

function placeOrder() {
  // Double check that the cart isn't empty, then connect to the db and do stuff
  let cartEmpty = true;
  for (const i in cart.item_id) {
    if (cart.item_id.hasOwnProperty(i)) {
      if (cart.itemquantity[i] != 0) {
        cartEmpty = false;
      }
    }
  }
  if (!cartEmpty) {
    db.connect(function (err) {
      if (err) throw err;
      console.log("Connected to db for order placement");
      var targetStoreID = "1";

      // sum cost (TODO: could be a function)
      let totalCost = 0;
      for (const value in cart.itemquantity) {
        if (cart.itemquantity.hasOwnProperty(value)) {
          const element = cart.itemquantity[value];
          if ((element) != 0) {
            totalCost += cart.itemcost[value] * cart.itemquantity[value];
          }
        }
      }

      // add order to orders table
      orderKey = db.query("INSERT INTO orders(store_id, customer_id, date_of_order, cost_of_order, payment_method, payment_auth_code) OUTPUT INSERTED.order_id VALUES (" + targetStoreID + ", 0, " + new Date().toISOString().slice(0, 19).replace('T', ' ') + ", " + totalCost + "'Visa', 37285930182975930294);");

      // add order items to order_items tables with reference to order
      for (const i in cart.item_id) {
        if (cart.item_id.hasOwnProperty(i)) {
          const cartItemID = cart.item_id[i];
          const cartItemQuantity = cart.itemquantity[i];
          db.query("INSERT INTO order_items(menu_item_id, order_id, quantity) VALUES (" + cartItemID + ", " + orderKey + ", " + cartItemQuantity + ");");
        }
      }

      cart = { // clear cart after input
        "item_id": [],
        "itemname": [],
        "itemcost": [],
        "itemquantity": []
      };

      homebuttonModal(); // present confirmation and home button
      updateCart(); // redraw
    });
  }
}
