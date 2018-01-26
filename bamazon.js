var mysql = require('mysql');
var inquirer = require('inquirer');
var prompt = require('promt');

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
      connection.query('SELECT * from')
  }