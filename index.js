const express = require("express");
const http = require("http");
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const socketIO = require("socket.io");

const {
  QUERY_SELECT_EVERYTHING_FROM_PRODUCTS,
  QUERY_SELECT_EVERYTHING_FROM_CATEGORIES,
  QUERY_INSERT_INTO_PRODUCTS_TABLE,
  QUERY_INSERT_INTO_CATEGORIES_TABLE,
  QUERY_DELETE_FROM_PRODUCTS_TABLE,
  QUERY_DELETE_FROM_CATEGORIES_TABLE,
  QUERY_CREATE_PRODUCTS_TABLE,
  QUERY_CREATE_CATEGORIES_TABLE,
  mysqlAuth,
} = require("./Constants.js");

const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(bodyParser.json())

const server = http.createServer(app);

// Create socket client
const io = socketIO(server);

io.on("connection", socket => {
  console.log("socker connect")
});

// Create MySQL connection
const mysqlConnection = mysql.createConnection({ ...mysqlAuth });

// Connect to MySQL database
mysqlConnection.connect(err => {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  mysqlConnection.query(QUERY_CREATE_PRODUCTS_TABLE, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });

  mysqlConnection.query(QUERY_CREATE_CATEGORIES_TABLE, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });

/* Product Management Methods */
  app.get("/api/products", (req, res) => {
    // Query the database for all the products
    mysqlConnection.query(QUERY_SELECT_EVERYTHING_FROM_PRODUCTS, (err, rows, fields) => {
      if(err) {
        console.error(err);
      } else {
        res.send(rows);
      }
    })
  });

  app.post("/api/productManagement", (req, res) => {
    const product = {...req.body};

    mysqlConnection.query(QUERY_INSERT_INTO_PRODUCTS_TABLE, product, function(err, result) {
      if(err) {
        console.error(err);
      } else {
          res.send(req.body)
      }
    });
  });

  app.delete("/api/productManagement", (req, res) => {
    const productId = req.body.productId;

    mysqlConnection.query(QUERY_DELETE_FROM_PRODUCTS_TABLE + `${productId}`, function(err, result) {
      if(err) {
        console.error(err);
      } else {
          res.send(req.body)
      }
    });

  });


/* Category Management Methods */

app.get("/api/categories", (req, res) => {
  // Query the database for all the categories
  mysqlConnection.query(QUERY_SELECT_EVERYTHING_FROM_CATEGORIES, (err, rows, fields) => {
    if(err) {
      console.error(err);
    } else {
      res.send(rows);
    }
  })
});

app.post("/api/categoryManagement", (req, res) => {
  const category = {...req.body};

  mysqlConnection.query(QUERY_INSERT_INTO_CATEGORIES_TABLE, category, function(err, result) {
    if(err) {
      console.error(err);
    } else {
        res.send(req.body)
    }
  });
});

app.delete("/api/categoryManagement", (req, res) => {
  const categoryId = req.body.categoryId;

  mysqlConnection.query(QUERY_DELETE_FROM_CATEGORIES_TABLE + `${categoryId}`, function(err, result) {
    if(err) {
      console.error(err);
    } else {
        res.send(req.body)
    }
  });

});


/*  mysqlConnection.end(function(err) {
    if (err) {
      return console.log(err.message);
    }
  }); */
});



app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});

module.exports = mysqlConnection;
