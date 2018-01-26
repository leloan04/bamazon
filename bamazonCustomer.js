var mysql = require('mysql');
var inquirer = require('inquirer');
// var prompt = require('prompt');

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
  
    user: "root",
  
    password: "root",
    database: "bamazon"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    start();
  });

  var start = function() {
      connection.query('SELECT * from products', function(err, data) {
        if (err) throw err;
            console.log("Welcome to Bamazon");
            console.log("Products Available:");
        for (var i = 0; i < data.length; i++) {
            console.log("item_id:" + data[i].item_id + "|" + "product_name" + data[i].product_name + "|" + "price: $" + data[i].price);
        }

        firstPrompt();
      })
  }

  var firstPrompt = function() {
      inquirer.prompt([
        {
            name: "Item",
            type: "input",
            message: "Enter the ID of the product you would like to buy"
        },
        {
            name: "Quantity",
            type: "input",
            message: "How many would you like to buy?",
        }
      ])
      .then(function(answer) {
          connection.query('SELECT stock_quantity, price FROM products WHERE item_id=' + answer.products, function(err, data) {
              var price = parseFloat(data[0].price);
              var stock = parseInt(data[0].stock_quantity);
              var units = parseInt(answer.units);
            
              if(stock >= units) {
                  var orderTotal = (units * price).toFixed(2);
                  console.log("Order Total = $" + orderTotal);

                  var updateInventory = stock - units;
                  console.log("There are " + updateInventory + "left in stock");
                  
                  updateStockQuantity(updateInventory, answer.products);

                  newSearch();
              }

              else if (stock < units) {
                  console.log("Out of Stock");
                  firstPrompt();
              }
          })
      })
  }

  function updateStockQuantity(stock, item_id) {
      connection.query('UPDATE products SET stock_quantity = ' + stock + 'WHERE item_id = "' + item_id + '"', function(err, data) {
      })
  }

  var newSearch = function() {
      inquirer.prompt([{
          name: "newItem",
          type: "input",
          message: "Would you like to buy item?"
      }])
      .then(function(answer) {
          if (answer.newItem === true) {
              firstPrompt();
          }
          else {
              connection.end();
              console.log("Thank you for shopping with Bamazon");
          }
      })
  }