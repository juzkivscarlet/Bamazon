// require inquirer & mysql modules. Require markdown-table module for ease of list organization
const inquirer = require('inquirer');
const data = require('./data.js');

var connection = data.connection;

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
            var item = data.products[parseInt(Math.abs(resp.id))-1];
            var quantity = parseInt(Math.abs(resp.quantity));

            // if database has enough of item ordered
            if(quantity <= item.quantity) {
                console.log("Buying "+quantity+" "+item.name+"!\n");
                // update database
                connection.query(`update products set stock_quantity=stock_quantity-${quantity} where item_id=${resp.id}`, function(err,res,fields) {
                    if(err) throw err;
                    // reset connection & reset product array & objects
                    connection.end();
                    data.connect();
                    data.listProducts();
                });
                console.log("Success!\n");
            } else {
                // if user ordered too many
                console.log("Sorry. There are not enough of that item available!\n");
            }
        } else {
            // if user did not confirm
            console.log("Oops!\n");
            data.listProducts();
        }
        setTimeout(function() {
            userPrompt();
        },500);
    });
};
setTimeout(function() {
    data.listProducts();
},500);
setTimeout(function() {
    userPrompt();
},1000);