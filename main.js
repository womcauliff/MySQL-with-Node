var Product = require("./Product.js");
var inquirer = require("inquirer");
var connection = require('./connection.js');

/**
 * main()
 *
 * Outermost function called at program start.
 */
function main() {
	//get Products from DB
	setUpInventory(handleInventory);

	function handleInventory (err, inventory) {
		console.log("handleInventory()");
		if (err) throw err;
		//begin interactions with customer
		customer(inventory);
	}
}

/**
 * setUpInventory()
 *
 * Creates Product objects from Database.
 *
 * @param {Function} callback - A function which will be invoked after connecting with
 * database. Response parameter will be an array of Product objects.
 */
function setUpInventory(callback) {
	console.log("setUpInventory()");
	var inventory = [];
	connection.connect();

	connection.query('SELECT * FROM `Products`', function(err, rows, fields) {
		if (err) throw err;

		//console.log('The solution is: ', rows);
		//console.log(fields);
		//parse row into Product object and add to inventory
		rows.forEach(function(row) {
			inventory[inventory.length] = new Product(
				row.ItemID, 
				row.ProductName, 
				row.DepartmentName,
				row.Price,
				row.StockQuantity
			);
		});

		connection.end();

		callback(null, inventory);
	});	
}

function displayInventory(inventory) {
	console.log("displayInventory()");
	inventory.forEach(function(Product) {
		console.log(
		"\n\t" + Product.getId() +
		"\n\t" + Product.getProductName() +
		"\n\t" + Product.getDepartmentName() +
		"\n\t" + Product.getPrice()
		)
	});
}

function customer(inventory) {
	console.log("customer()");
	displayInventory(inventory);
}



main();