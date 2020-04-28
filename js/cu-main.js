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
  data = await getData();

  console.log(data);

  cart.addItem(itemID);
}

/* ----------------- Async Queries ----------------- */

function getData() {
  return new Promise((resolve, reject) => {
    db.query(
      `
      SELECT  stores.store_name       as s_name,
              menu_items.menu_item_id as i_id,
              menu_items.item_name    as i_name,
              menu_items.item_cost    as i_cost
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

function changeHTML(id, s) {
  document.getElementById(id).innerHTML = s;
}

function addHTML(id, s) {
  document.getElementById(id).innerHTML += s;
}

function getTime() {
  return new Date().toISOString().slice(0, 19).replace("T", " ");
}

function reload() {
  window.location.reload();
}

/* ----------------- Cart System ----------------- */

var cart = (function () {
  var array = [];

  function item(id, name, cost, count) {
    this.id = id;
    this.name = name;
    this.cost = cost;
    this.count = count;
  }

  return {
    addItem: function (itemID, itemName, itemCost) {
      let foundItem = false;
      array.forEach((element) => {
        if (element.id == itemID) {
          element.count++;
          foundItem = true;
        }
      });
      if (!foundItem) {
        array.push(new item(itemID, itemName, itemCost, 1));
      }
    },

    subItem: function (itemID) {
      array.forEach((element) => {
        if (element.id == itemID) {
          if (element.count > 1) {
            element.count--;
          } else {
            cart.clearItem(itemID);
          }
        }
      });
    },

    clearItem: function (itemID) {
      array.forEach((element) => {
        if (element.id == itemID) {
          i = array.indexOf(element);
          array.splice(i, 1);
        }
      });
    },

    get: function () {
      return array;
    },
  };
})();
