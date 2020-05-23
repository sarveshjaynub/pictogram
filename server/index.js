const express = require('express');
const consola = require('consola');
const { Nuxt, Builder } = require('nuxt');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql');
const jwt = require('express-jwt')
const jsonwebtoken = require('jsonwebtoken')

const UPLOAD_DIR = './static/uploads';

// Initializing Database
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'pictogram'
});

connection.connect(function (err) {
  if (!err) {
    console.log("Database is connected");
  } else {
    console.log("Error while connecting with database");
  }
});

global.db = connection;

// Initializing Multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) { // Upload the file in the specify directory.
    cb(null, UPLOAD_DIR)
  },
  filename: function (req, file, cb) { // Format the filename of the uploaded file.
    cb(null, path.parse(file.originalname).name + '-' + Date.now() + path.extname(file.originalname))
  }
})

let upload = multer({
  storage: storage
});

const app = express();

// Instantiate socket server
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Configuring CORS
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, " +
    "Accept");
  next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host,
    port
  } = nuxt.options.server

  await nuxt.ready()
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()

app.get('/api/v1/profile', jwt({secret: 'dummy'}), function (req, res) {
  console.log(req.user)
  res.json({ user: req.user })
})

app.post('/api/v1/upload', upload.single('file'), function (req, res) {
  if (!req.file) {
    res.status(400).send({
      status: 400,
      message: "No file was provided."
    })
  } else {
    var fileDescription = "";

    if (req.body.description != undefined) {
      fileDescription = req.body.description;
    }

    var sql = "INSERT INTO `file`(`name`, `description`, `type`, `size`, `uploaded_by`) VALUES ('" + req.file.filename + "', '" + fileDescription + "', '" + req.file.mimetype + "', '" + req.file.size + "', '" + req.body.uploaded_by + "')";

    db.query(sql, function (err, result) {
      if (err) {
        res.status(401).send({
          status: 401,
          message: err
        })
      } else {
        res.status(200).send({
          status: 200,
          message: "File was successfully uploaded."
        })
      }
    });
  }
});

app.post('/api/v1/login', function (req, res) {
  var email = req.body.email;
  var password = req.body.password;

  connection.query('SELECT * FROM users WHERE email = ?', [email], function (error, results, fields) {
    if (error) {
      res.status(404).send({
        status: 404,
        message: "The user does not exist."
      })

      return;
    }

    if (results.length > 0) {
      if (results[0].password == password) {
        // var profile = {
        //   "data": results[0]
        // };

        // res.status(200).send(profile);

        const accessToken = jsonwebtoken.sign({ data: results[0] }, 'dummy')

        res.json({ token: accessToken })
      } else {
        res.status(204).send({
          status: 204,
          message: "Email and password does not match."
        });
      }
    } else {
      res.status(204).send({
        status: 204,
        message: "Email and password does not match."
      });
    }
  })
});

app.post('/api/v1/logout', function (req, res) {
  res.send(200);
})

app.post('/api/v1/register', function (req, res) {
  var email = req.body.email;
  var today = new Date();

  var users = {
    "firstname": req.body.firstname,
    "lastname": req.body.lastname,
    "email": req.body.email,
    "password": req.body.password,
    "created_at": today
  }

  connection.query('SELECT * FROM users WHERE email = ?', [email], function (error, results, fields) {
    if (error) {
      res.status(400).send({
        status: 400,
        message: "Unable to create account."
      })

      return;
    } 

    if (results.length > 0) {
      if (results[0].email == email) {
        return res.status(409).send({
          status: 409,
          message: "Account already exists with this mail. Please use another valid email address."
        });
      } 
    }

    connection.query('INSERT INTO users SET ?', users, function (error, results, fields) {
      if (error) {
        res.status(400).send({
          status: 400,
          message: "Unable to create account."
        })
  
        return;
      } 
  
      return res.status(201).send({
        status: 201,
        message: "Account created sucessfully."
      });
    });
  });
});

app.get('/api/v1/loadImages', function (req, res) {
  connection.query('SELECT * FROM file', function (error, results, fields) {
    if (error) {
      res.status(400).send({
        status: 400,
        message: "Unable to create account."
      })

      return;
    } 

    return res.status(201).send(results);
  });
});

app.post('/api/v1/deleteImages', function (req, res) {
  var imagesToDelete = req.body.imagesToDelete;
  // [1,2]

  connection.query('DELETE FROM file WHERE id IN (?)', imagesToDelete, function (error, results, fields) {
    if (error) {
      res.status(400).send({
        status: 400,
        message: "Unable to create account."
      })

      return;
    } 

    return res.status(201).send(results);
  });
});