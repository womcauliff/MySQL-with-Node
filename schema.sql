CREATE SCHEMA `Famazon` ;

CREATE TABLE `Famazon`.`Products` (
  `ItemID` INT NOT NULL AUTO_INCREMENT,
  `ProductName` VARCHAR(45) NOT NULL,
  `DepartmentName` VARCHAR(45) NOT NULL,
  `Price` DECIMAL(10,2) NOT NULL,
  `StockQuantity` INT NOT NULL,
  PRIMARY KEY (`ItemID`));