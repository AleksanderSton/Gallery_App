var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken"); 

router.get('/', function(req, res, next) {
  let currentUser = null;
  
  if (req.cookies && req.cookies.mytoken) {
    try {
      const decode = jwt.verify(req.cookies.mytoken, 'kodSzyfrujacy');
      currentUser = decode.username; 
    } catch (err) {
    }
  }

  res.render('index', { 
    title: 'Express', 
    loggedUser: currentUser 
  });
});

module.exports = router;