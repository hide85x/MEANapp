const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session= require('express-session')
const path = require('path');


const postRoutes = require('./Routes/posts');
const userRoutes = require('./Routes/users')

const app = express();
app.use(cors());
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headres",
//     "Authorization, Accept, Content-Type, Origin, X-Requested-With ");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PATCH, PUT, DELETE, OPTIONS");
//   next();
// })
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({secret: 'my secret'}));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

module.exports = app