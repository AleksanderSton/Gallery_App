/**
 * @swagger
 * tags:
 *   - name: Stats
 *     description: Statystyki serwisu
 */

/**
 * @swagger
 * /stats:
 *   get:
 *     summary: Zwraca statystyki bazy danych
 *     description: Zlicza całkowitą ilość użytkowników, galerii oraz dodanych zdjęć.
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Zwraca widok z wygenerowanymi statystykami
 */

var express = require('express');
var router = express.Router();
const statsController = require("../controllers/statsController");
const authenticate = require('../middleware/authenticate');

router.get("/", authenticate, statsController.getStats);

module.exports = router;