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
  EVENT_FETCH_ALL_PRODUCTS,
  EVENT_FETCH_ALL_CATEGORIES,
  EVENT_ADD_NEW_PRODUCT,
  EVENT_ADD_NEW_CATEGORY,
  EVENT_DELETE_PRODUCT,
  EVENT_DELETE_CATEGORY
} = require("./Constants.js");

const port = process.env.PORT || 3000;
const app = express();

const whitelist = ['http://localhost:3001', 'http://www.apirequest.io']
const corsOptions = {
  credentials: true,
   origin: function (origin, callback) {
     if (whitelist.indexOf(origin) !== -1) {
       callback(null, true)
     } else {
       callback(new Error(`${origin} not allowed by CORS`))
     }
   }
}
app.use(cors(corsOptions));
app.use(bodyParser.json())

const server = http.createServer(app);

// Create socket client
const io = socketIO(server);

io.on('connection', socket => {
  console.log('User connected')

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

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
        return res.json({
          message: `Failure! We couldn't bring products list.`
        });
      } else {
        io.emit(EVENT_FETCH_ALL_PRODUCTS, rows);
        return res.json(rows);
      }
    })
  });

  app.post("/api/productManagement", (req, res) => {
    const product = {...req.body};

    mysqlConnection.query(QUERY_INSERT_INTO_PRODUCTS_TABLE, product, function(err, result) {
      if(err) {
        console.error(err);
        res.json({
          message: `Failure! Product ${product.productName} couldnt be saved.`
        });
      } else {
          io.emit(EVENT_ADD_NEW_PRODUCT, product);
          res.json({
            status: 200,
            message: `Success! Product ${product.productName} with the insertId of ${result.insertId} is saved.`
          });
      }
    });
  });

  app.delete("/api/productManagement", (req, res) => {
    const productId = req.body.productId;

    mysqlConnection.query(QUERY_DELETE_FROM_PRODUCTS_TABLE + `${productId}`, function(err, result) {
      if(err) {
        console.error(err);
        res.json({
          message: `Failure! Product ${product.productName}  couldn't be deleted.`
        });
      } else {
          io.emit(EVENT_DELETE_PRODUCT, productId);
          res.json({
            status: 200,
            message: `Success! Product ${product.productName} with the insertId of ${result.insertId} is deleted.`
          });
      }
    });

  });


/* Category Management Methods */

app.get("/api/categories", (req, res) => {
  // Query the database for all the categories
  mysqlConnection.query(QUERY_SELECT_EVERYTHING_FROM_CATEGORIES, (err, rows, fields) => {
    if(err) {
      console.error(err);
      res.json({
        message: `Failure! We couldn't bring categories list.`
      });
    } else {
      io.emit(EVENT_FETCH_ALL_CATEGORIES, rows);
      res.json(rows);
    }
  })
});

app.post("/api/categoryManagement", (req, res) => {
  const category = {...req.body};

  mysqlConnection.query(QUERY_INSERT_INTO_CATEGORIES_TABLE, category, function(err, result) {
    if(err) {
      console.error(err);
      res.json({
        message: `Failure! Category ${category.categoryName}  couldn't be saved.`
      });
    } else {
        io.emit(EVENT_ADD_NEW_CATEGORY, { categoryId: result.insertId, categoryName: category.categoryName });
        res.json({
          status: 200,
          message: `Success! Category ${category.categoryName} with the insertId of ${result.insertId} is saved.`
        });
    }
  });
});

app.delete("/api/categoryManagement", (req, res) => {
  const categoryId = req.body.categoryId;

  mysqlConnection.query(QUERY_DELETE_FROM_CATEGORIES_TABLE + `${categoryId}`, function(err, result) {
    if(err) {
      console.error(err);
      res.json({
        message: `Failure! Category with the id of ${categoryId}  couldn't be deleted.`
      });
    } else {
        io.emit(EVENT_DELETE_CATEGORY, categoryId);
        res.json({
          status: 200,
          message: `Success! Category  with the insertId of ${result.insertId} is deleted.`
        });
    }
  });

});


/*  mysqlConnection.end(function(err) {
    if (err) {
      return console.log(err.message);
    }
  }); */
});



server.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});

/*
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
*/
