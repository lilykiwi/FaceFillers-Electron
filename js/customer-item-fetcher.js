const MySQL = require("mysql");



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

  // Check store exists and get the name, pushing it to the top
  db.query("SELECT * FROM stores WHERE store_id = '1';", function (err, result) {
    if (err) throw err;
    let store_data = result[0];
    console.log(store_data);
    console.log("Store accessed: " + store_data.store_name);
    document.getElementById("header-title").innerHTML = store_data.store_name;
  });



  db.query("SELECT * FROM menu_items WHERE store_id = '1';", function (err, result) {
    if (err) throw err;
    console.log(result);

    let menu_items = result;

    menu_items.forEach(element => {
      console.log(element.item_name);

      innerElementID = "innerElement-" + element.item_id;
      itemCost = "£" + (element.item_cost / 100.0).toFixed(2);
      document.getElementById("menu_items_holder").innerHTML += `
                                                                <div id='`+ innerElementID + `' class="menu-listing-container">
                                                                  <div class="menu-listing-name-container">
                                                                    `+ element.item_name + `
                                                                  </div>
                                                                  <div class="menu-listing-cost-container">
                                                                    `+ itemCost + `
                                                                  </div>
                                                                  <div class="menu-listing-add-button">
                                                                    +
                                                                  </div>
                                                                  <div class="menu-listing-remove-button">
                                                                    X
                                                                  </div>
                                                                </div>
                                                                `;
    });
  });

});
