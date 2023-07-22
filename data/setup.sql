create database sneakers
use sneakers

CREATE TABLE Products (
  ProductID INT PRIMARY KEY IDENTITY(1,1),
  Title VARCHAR(255) NOT NULL,
  Category VARCHAR(50),
  Price DECIMAL(10, 2) NOT NULL,
  Description TEXT,
  ImageURL VARCHAR(255)
)
create table Users(
    user_id int PRIMARY KEY IDENTITY(1,1),
    username varchar(50),
    email varchar(100),
    password varchar(100),
)
 create table orders(
  userId int ,
  paymentIntent VARCHAR(50),
  productName VARCHAR(50),
  productID int,
  quantity int,
  shippingAddress VARCHAR(50),
  totalAmount int
 )