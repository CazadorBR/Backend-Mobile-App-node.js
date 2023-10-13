console.log("Backend Mobile App");

const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const app = express();
const morgan = require("morgan")
app.use(morgan('dev'))
 
app.use(express.static('public'));
app.use(express.json())
  
// Use cookie-parser middleware
app.use(cookieParser());
// view engine
app.set('view engine', 'ejs');

const port = 3000;
// Connexion à la base de données MongoDB
const dbURI = 'mongodb+srv://fedibr:fedibr28@cluster0.38xgvkm.mongodb.net/mongodb';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true ,useCreateIndex:true })
  .then((result) => {
    console.log('Connecté à la base de données MongoDB');
    app.listen(port, () => {
      console.log(`Serveur en cours d'exécution sur le port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Erreur de connexion à la base de données MongoDB :', err);
  });
// routes


 app.get('/api', (req, res) => {
    res.send('hello');
  });
// app.get('/', (req, res) => res.render('home'));
// app.get('/smoothies', (req, res) => res.render('smoothies'));
 app.use(authRoutes);
