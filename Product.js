/**
 * Product
 *
 * Represents a Product object.
 *
 * @param {Number} id - the unique identifier from the database
 * @param {String} productName - the name of the Product
 * @param {String} departmentName - the name of the Department which sells the Product
 * @param {Number} price - the price for a single unit
 * @param {Number} stockQuantity - the amount of this Product in the database inventory
 */
var Product = function(id, productName, departmentName, price, stockQuantity) {
	console.log("Product()");

	if(id == undefined 
	|| productName == undefined
	|| departmentName == undefined
	|| price == undefined
	|| stockQuantity == undefined) {
		throw new Error();
	}

	/* 
	 * Internal Properties 
	 */
	var id = id;
	var productName = productName;
	var departmentName = departmentName;
	var price = price;
	var stockQuantity = stockQuantity;

	/* 
	 * Getter Methods
	 */
	this.getId = function() {
		return id;
	}
	this.getProductName = function() {
		return productName;
	}
	this.getDepartmentName = function() {
		return departmentName;
	}
	this.getPrice = function() {
		return price;
	}
	this.getStockQuantity = function () {
		return stockQuantity;
	}
}

module.exports = Product;