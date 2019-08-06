const QUERY_SELECT_EVERYTHING_FROM_PRODUCTS = 'SELECT * FROM products';
const QUERY_SELECT_EVERYTHING_FROM_CATEGORIES = 'SELECT * FROM categories';
const QUERY_INSERT_INTO_PRODUCTS_TABLE = 'INSERT INTO products SET ?';
const QUERY_INSERT_INTO_CATEGORIES_TABLE = 'INSERT INTO categories SET ?';
const QUERY_DELETE_FROM_PRODUCTS_TABLE = 'DELETE FROM products WHERE productId =';
const QUERY_DELETE_FROM_CATEGORIES_TABLE = 'DELETE FROM categories WHERE categoryId =';

const QUERY_CREATE_PRODUCTS_TABLE = `create table if not exists products(
                        productId int primary key auto_increment,
                        productName varchar(255) not null,
                        productImage varchar(255) not null
                    )`;

const QUERY_CREATE_CATEGORIES_TABLE = `create table if not exists categories(
                        categoryId int primary key auto_increment,
                        categoryName varchar(255) not null
                    )`;
const mysqlAuth = {
  host: 'localhost',
  user: 'root',
  password: 'bumpintoyoU1_',
  database: 'productsDb'
};


module.exports = {
  QUERY_SELECT_EVERYTHING_FROM_PRODUCTS,
  QUERY_SELECT_EVERYTHING_FROM_CATEGORIES,
  QUERY_INSERT_INTO_PRODUCTS_TABLE,
  QUERY_INSERT_INTO_CATEGORIES_TABLE,
  QUERY_DELETE_FROM_PRODUCTS_TABLE,
  QUERY_DELETE_FROM_CATEGORIES_TABLE,
  QUERY_CREATE_PRODUCTS_TABLE,
  QUERY_CREATE_CATEGORIES_TABLE,
  mysqlAuth,
};
