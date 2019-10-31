const mysql = require('mysql');
const table = require('markdown-table');

var connection;
var productsArr = [];
var deptArr = [];

var connect = function() {
    // productsArr = [];

    connection = mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "root",
        database: "bamazon"
    });

    connection.connect(function(err) {
        if(err) throw err;
        connection.query("SELECT * FROM bamazon.products", function(err, result) {
            if(err) throw err;
            // run functions gatherProducts() & Product.listProducts()
			gatherProducts(result);
			gatherDepts();
        });
    });
};

// gathers products from database
var gatherProducts = function(res) {
    for(var i=0; i<res.length; i++) {
		productsArr.push(new Product(res[i]));
    }
};

var gatherDepts = function() {
	var depts = Array.from(new Set(productsArr.map(item => item.dept))).map(dept => {
		return new Department(dept);
	});
};

var Product = function(item) {
    this.id = parseInt(item.item_id);
    this.name = item.product_name;
    this.dept = item.department_name;
    this.price = parseFloat(item.price).toFixed(2);
    this.quantity = parseInt(item.stock_quantity);
};

// lists products using markdown-table module
Product.listProducts = function(arr) {
    if(!arr) var products = productsArr;
    else var products = arr;
    var tableData = [
        ["ID", "Product", "Department", "Price"]
    ];
    for(var i=0; i<products.length; i++) {
        tableData.push([products[i].id.toString(), products[i].name, products[i].dept, "$"+products[i].price.toString()]);
    }
    console.log(table(tableData, {align: ['l','l','r','r']}));
};

var Department = function(dept) {
    this.name = dept;
    this.products = [];
    for(var i=0; i<productsArr.length; i++) {
		if(productsArr[i].dept==this.name) this.products.push(productsArr[i]);
	}
	deptArr.push(this);
};

Department.listDepts = function() {
	for(var i=0; i<deptArr.length; i++) {
		var deptTableData = [
			["ID", deptArr[i].name, "Stock Quantity", "Price"]
		];
		for(var j=0; j<deptArr[i].products.length; j++) {
			var item = deptArr[i].products[j];
			deptTableData.push([item.id.toString(), item.name, item.quantity, "$"+item.price])
		}
		console.log(table(deptTableData, {align: ['l','l','c','r']}));
		console.log("======================================\n");
	}
};

connect();

module.exports = {
    products: productsArr,
    deptartments: deptArr,
    listProducts: Product.listProducts,
    listDepartments: Department.listDepts,
    gatherProducts: gatherProducts,
    connection: connection,
    connect: connect
};