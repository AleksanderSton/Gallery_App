var express = require('express');
var router = express.Router();

const statsController = require("../controllers/statsController");
const authenticate = require('../middleware/authenticate'); 
router.get("/", authenticate, statsController.getStats);

module.exports = router;