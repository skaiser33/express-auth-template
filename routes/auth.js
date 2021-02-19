const express = require('express');
const router = express.Router();
const db = require('../models');

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res) => {
  // find or create a user, providing the name and password as default values
  db.user.findOrCreate({
    where: { email: req.body.email },
    defaults: {
      name: req.body.name,
      password: req.body.password
    }
  }).then(([user, created]) => {
    if (created) {
      // if created, success and redirect home
      console.log(`${user.name} was created!`);
      res.redirect('/');
    } else {
      // if not created, the email already exists
      console.log('Email already exists');
      res.redirect('/auth/signup');
    }
  }).catch(error => {
    // if an error occurs, let's see what the error is
    console.log('An error occurred: ', error.message);
    res.redirect('/auth/signup');
  });
});

router.get('/login', (req, res) => {
  res.render('auth/login');
});

module.exports = router;
