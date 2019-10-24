// require inquirer & mysql modules. Require markdown-table module for ease of list organization
const inquirer = require('inquirer');
const mysql = require('mysql');
const table = require('markdown-table');

var connection;
// connect to MySQL database Bamazon, table 'products'
var connect = function() {
    // create connection to MySQL server
    connection = mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "root",
        database: "bamazon"
    });

    connection.connect(function(err) {
        if(err) throw err;
        console.log("\n");
        connection.query("SELECT * FROM bamazon.products", function(err, result) {
            if(err) throw err;
            // run functions gatherProducts() & Product.listProducts()
            gatherProducts(result);
            Product.listProducts();
        });
    });
};

// gathers products from database
var gatherProducts = function(data) {
    for(var i=0; i<data.length; i++) {
        productsArr.push(new Product(data[i]));
    }
};

// organize products & use constructor
var productsArr = [];

var Product = function(item) {
    this.id = parseInt(item.item_id);
    this.name = item.product_name;
    this.dept = item.department_name;
    this.price = parseFloat(item.price).toFixed(2);
    this.quantity = parseInt(item.stock_quantity);
};

// lists products using markdown-table module
Product.listProducts = function() {
    var tableData = [
        ["ID", "Product", "Department", "Price"]
    ];
    for(var i=0; i<productsArr.length; i++) {
        tableData.push([productsArr[i].id.toString(), productsArr[i].name, productsArr[i].dept, "$"+productsArr[i].price.toString()]);
    }
    console.log(table(tableData, {align: ['l','l','r','r']}));
    // run function userPrompt()
    userPrompt();
};

// automatically run function connect()
connect();

// function to prompt user
var userPrompt = function() {
    console.log("\n");
    // set up inquirer prompt
    inquirer.prompt([
        {
            type: 'number', 
            message: "Which item would you like to buy? (Please enter the item's ID number): ",
            name: 'id'
        }, {
            type: 'number',
            message: "How many would you like to buy? ",
            name: 'quantity',
            default: 1
        }, {
            type: 'confirm',
            message: "Confirm this purchase? ",
            name: 'confirm',
            default: true
        }
    ]).then(function(resp) {
        // if user confirmed
        if(resp.confirm) {
            console.log("\n");
            var item = productsArr[parseInt(Math.abs(resp.id))-1];
            var quantity = parseInt(Math.abs(resp.quantity));

            // if database has enough of item ordered
            if(quantity <= item.quantity) {
                console.log("Buying "+quantity+" "+item.name+"!\n");
                // update database
                connection.query(`update products set stock_quantity=stock_quantity-${quantity} where item_id=${resp.id}`, function(err,res,fields) {
                    if(err) throw err;
                    // reset connection & reset product array & objects
                    productsArr = [];
                    connection.end();
                    connect();
                });
                console.log("Success!\n");
            } else {
                // if user ordered too many
                console.log("Sorry. There are not enough of that item available!\n");
            }
            setTimeout(function() {
                Product.listProducts();
            },2000);
        } else {
            // if user did not confirm
            console.log("Oops!\n");
            Product.listProducts();
        }
    });
};