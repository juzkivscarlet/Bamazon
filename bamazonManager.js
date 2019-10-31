const inquirer = require('inquirer');
const data = require('./data.js');

var connection = data.connection;

var managerPrompt = function() {
    console.log("=============================================================\n")
    inquirer.prompt([
        {
            type: 'list',
            message: "What would you like to do?",
            choices: ["View All Products for Sale", "View Items in Low Inventory", "Add to Inventory", "Add New Product"],
            name: 'action',
            default: "View All Products for Sale"
        }
    ]).then(function(resp) {
        if(resp.action=="View All Products for Sale") {
            data.listProducts();
            setTimeout(function() {
                managerPrompt();
            },500);
        } else if(resp.action=="View Items in Low Inventory") {
            viewLowItems();
        } else if(resp.action=="Add to Inventory") {
            addInventory();
        } else if(resp.action=="Add New Product") {
            addProducts();
        }
    });
};

var viewLowItems = function() {
    var lowItems = [];
    for(var i=0; i<data.products.length; i++) {
        if(data.products[i].quantity<=10) lowItems.push(data.products[i]);
    }

    data.listProducts(lowItems);

    setTimeout(function() {
        managerPrompt();
    },500);
};

var addInventory = function() {
    var items = [];
    for(var i=0; i<data.products.length; i++) {
        items.push(data.products[i].name);
    }

    inquirer.prompt([
        {
            type: 'list',
            message: "Change quantity of which item?: ",
            choices: items,
            name: 'item'
        }, {
            type: 'input',
            message: "How many?: ",
            name: 'amount'
        }
    ]).then(function(resp) {
        var num, query, log;
        for(var i=0; i<data.products.length; i++) {
            if(resp.item==data.products[i].name) var stockQuantity = data.products[i].quantity;
        }

        if(resp.amount.startsWith("+")) {
            num = parseInt(resp.amount.slice(1));
            console.log(num);
            query = [
                {stock_quantity: (stockQuantity+num)},
                {product_name: resp.item}
            ];
            log = "Added "+num+" items!";
        } else if(resp.amount.startsWith("-")) {
            num = parseInt(resp.amount.slice(1));
            query = [
                {stock_quantity: (stockQuantity-num)},
                {product_name: resp.item}
            ];
            log = "Subtracted "+num+" items!";
        } else {
            num = parseInt(resp.amount);
            query = [
                {stock_quantity: num},
                {product_name: resp.item}
            ];
            log = "New quantity is "+num+"!";
        }

        connection.query("update products set ? where ?",query, function(err,res,fields) {
            if(err) throw err;
            connection.end();
            data.connect();
        });
        console.log(log);
        setTimeout(function() {
            managerPrompt();
        },500);
    });

};

var addProducts = function() {
    var listOfDepts = [];
    for(var i=0; i<data.deptartments.length; i++) {
        listOfDepts.push(data.deptartments[i].name);
    }

    inquirer.prompt([
        {
            type: 'input',
            message: "Product name: ",
            name: 'product'
        }, {
            type: 'number',
            message: "Unit price?", 
            name: 'price'
        }, {
            type: 'list', 
            message: "Department: ", 
            choices: listOfDepts, 
            name: 'dept'
        }, {
            type: 'number',
            message: "How much is currently in stock?",
            name: "quantity"
        }
    ]).then(function(resp) {
        var query = [resp.product, resp.dept, parseFloat(resp.price.toFixed(2)), parseInt(resp.quantity)];
        connection.query("insert into products (product_name, department_name, price, stock_quantity) values (?,?,?,?)", query, function(err,res,fields) {
            if(err) throw err;
            connection.end();
            data.connect();
        });
        console.log("Added "+parseInt(resp.quantity)+" items ("+resp.product+") for $"+parseFloat(resp.price.toFixed(2))+" each, in department: "+resp.dept+"\n");
        setTimeout(function() {
            managerPrompt();
        },500);
    });

};

managerPrompt();