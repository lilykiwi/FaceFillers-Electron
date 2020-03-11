# MySQL (MariaDB) setup

[Back to Readme](README.md)

## Initialisation

First, enter into the MySQL using `sudo mysql`. You need to use sudo as there are no users yet available in the service.

```sql
CREATE USER IF NOT EXISTS 'public'@'%' IDENTIFIED BY 'publicpass';
CREATE DATABASE facefillers_db;
GRANT ALL PRIVILEGES ON facefillers_db.* TO 'public'@'%';
```

## Database Setup

```sql
USE facefillers_db;

CREATE TABLE customers (
  customer_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  customer_name varchar(50) NOT NULL,
  customer_address varchar(100) NOT NULL,
  email_address varchar(64) NOT NULL,
  customer_password varchar(256) NOT NULL,
  PRIMARY KEY (customer_id)
);

CREATE TABLE stores (
  store_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  store_name varchar (50) NOT NULL,
  store_location varchar (100) NOT NULL,
  PRIMARY KEY (store_id)
);

CREATE TABLE food_types(
  food_type_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  food_type_name varchar (50) NOT NULL,
  PRIMARY KEY (food_type_id)
);

CREATE TABLE orders(
  order_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  store_id INT UNSIGNED NOT NULL ,
  customer_id INT UNSIGNED NOT NULL,
  date_of_order DATETIME NOT NULL,
  cost_of_order INT UNSIGNED NOT NULL,
  payment_method varchar(30) NOT NULL,
  payment_auth_code INT UNSIGNED NOT NULL,
  PRIMARY KEY (order_id),
  FOREIGN KEY (store_id) REFERENCES stores(store_id),
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE menu_items (
  menu_item_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  store_id INT UNSIGNED NOT NULL,
  food_type_id INT UNSIGNED NOT NULL,
  item_name varchar(50) NOT NULL,
  item_cost INT UNSIGNED NOT NULL,
  item_allergen_info varchar (100) NOT NULL,
  food_item_supplier varchar (50) NOT NULL,
  food_item_address varchar (100) NOT NULL,
  PRIMARY KEY (menu_item_id),
  FOREIGN KEY (store_id) REFERENCES stores(store_id),
  FOREIGN KEY (food_type_id) REFERENCES food_types(food_type_id)
);

CREATE TABLE order_items(
  order_item_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  menu_item_id INT UNSIGNED NOT NULL,
  order_id INT UNSIGNED NOT NULL,
  quantity INT UNSIGNED NOT NULL,
  PRIMARY KEY (order_item_id),
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(menu_item_id)
);
```

## Adding Data

Use these queries to create a food type, a store, and 4 placeholder menu items:

```sql
USE facefillers_db;

INSERT INTO food_types (food_type_name) VALUES ("Vegan");

INSERT INTO stores (store_name, store_location) VALUES ("Plant B", "23 High Street, BN11 1PE");

INSERT INTO menu_items (store_id, food_type_id, item_name, item_cost, item_allergen_info, food_item_supplier, food_item_address) VALUES (1, 1, "Asparagus & Lemon Spaghetti", 1210, "Gluten", "Plant B", "23 High Street, BN11 1PE");

INSERT INTO menu_items (store_id, food_type_id, item_name, item_cost, item_allergen_info, food_item_supplier, food_item_address) VALUES (1, 1, "Sticky Hoisin Noodles", 990, "None", "Plant B", "23 High Street, BN11 1PE");

INSERT INTO menu_items (store_id, food_type_id, item_name, item_cost, item_allergen_info, food_item_supplier, food_item_address) VALUES (1, 1, "Rainbow Spring Rolls", 1150, "Gluten, Soya", "Plant B", "23 High Street, BN11 1PE");

INSERT INTO menu_items ( store_id, food_type_id, item_name, item_cost, item_allergen_info, food_item_supplier, food_item_address) VALUES (1, 1, "Pad Thai", 1300, "Soya", "Plant B", "23 High Street, BN11 1PE");

INSERT INTO customers (customer_name, customer_address, email_address, customer_password) VALUES ("Jane Doe", "5, BN11 4EA", "jane.doe@email.email", "4F9A3F1F35376F9E02CA79E8343381F5EDC1BBF4C1995CF592B4FAE3CDA9A587");
```

If you got here, your database should all be set up!