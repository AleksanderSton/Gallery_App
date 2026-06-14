/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Autoryzacja i zarządzanie użytkownikami
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Pobiera listę wszystkich użytkowników
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista użytkowników
 */
var express = require('express');
var router = express.Router();

const userController = require("../controllers/userController");

const authenticate = require('../middleware/authenticate');
router.get("/user_delete", authenticate, userController.getUserDelete);
router.get("/", authenticate, userController.userList);
router.get("/user_add", userController.getUserAdd);
router.post("/user_add", userController.postUserAdd);

router.get("/user_login", userController.getUserLogin);
router.post("/user_login", userController.postUserLogin);
router.get("/user_logout", userController.getUserLogout);

module.exports = router;