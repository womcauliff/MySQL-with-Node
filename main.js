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
			inventory[row.ItemID] = new Product(
				row.ItemID, 
				row.ProductName, 
				row.DepartmentName,
				row.Price,
				row.StockQuantity
			);
		});

		callback(null, inventory);
	});	
}

function displayInventory(inventory, callback) {
	console.log("displayInventory()");

	inventory.forEach(function(Product) {
		console.log(
		"\n\t" + Product.getId() +
		"\n\t" + Product.getProductName() +
		"\n\t" + Product.getDepartmentName() +
		"\n\t" + Product.getPrice()
		);
	});

	callback(null);
}

function customer(inventory) {
	console.log("customer()");
	displayInventory(inventory, shop);

	function shop(err) {
		console.log("shop()");
		if(err) throw err;

		inquirer.prompt([
			{
				name: 'productChoice',
				type: 'list',
				message: 'Which product would you like to buy?',
				choices: function() {
					var choices = [];
					inventory.forEach(function(Product){
						choices.push("[" + Product.getId().toString() + "] | " + Product.getProductName());
					});
					choices.push(new inquirer.Separator());
					return choices;
				}
			},
			{
				name: 'quantity',
				type: 'input',
				message: 'How many of units of this product?',
				default: function() {
					return 1;
				},
				validate: function(value) {
					if (isNaN(value) == false 
						&& parseInt(value) > 0 
						//&& parseInt(value) <= inventory[answers.productChoice].getStockQuantity()
					){
                    	return true;
		            } 
		            else {
		                return false;
		            }
				}
			}
		]).then(function (answers) {
			//console.log(answers.productChoice);
			//console.log(answers.quantity);
			var rx = /\d+/g;
			var arr = rx.exec(answers.productChoice);
			makeOrder(parseInt(arr[0]), answers.quantity, calculateTotal);
		});
	}
	function makeOrder(pid, q, callback) {
		console.log('makeOrder()');

		if (q > inventory[pid].getStockQuantity()) {
			console.log('Insufficient quantity!');
			connection.end();
			return;
		}

		console.log('pid' + pid);

		connection.query(
			'SELECT * FROM `Products` WHERE `ItemID` = ?',
			[
			    pid
			],
			function(err, rows, fields) {
				if (err) throw err;

				//console.log('The solution is: ', rows);
				//console.log(fields);
				//parse row into Product object and add to inventory
				rows.forEach(function(row) {
					console.log(row);
				});

				callback(null, pid, q);
			}
		);	
	}
	function calculateTotal(err, pid, q) {
		console.log('calculateTotal()');
		if (err) throw err;

		console.log(
			"Total transaction:"
			+ "\n\t$" + parseFloat(Math.round((inventory[pid].getPrice() * q) * 100) / 100).toFixed(2) 
		);

		connection.end();
	}
}



main();