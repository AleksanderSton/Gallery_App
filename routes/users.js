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
 *         description: Zwraca widok HTML z listą użytkowników
 */
 
/**
 * @swagger
 * /users/user_add:
 *   get:
 *     summary: Formularz dodawania użytkownika
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Zwraca widok formularza rejestracji
 *   post:
 *     summary: Dodaje nowego użytkownika (Rejestracja)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - username
 *               - password
 *             properties:
 *               first_name:
 *                 type: string
 *                 minLength: 2
 *               last_name:
 *                 type: string
 *                 minLength: 2
 *               username:
 *                 type: string
 *                 minLength: 3
 *               password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Zwraca widok z komunikatem o sukcesie lub błędach walidacji
 */
 
/**
 * @swagger
 * /users/user_login:
 *   get:
 *     summary: Formularz logowania
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Zwraca widok formularza logowania
 *   post:
 *     summary: Logowanie użytkownika
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Loguje użytkownika i ustawia ciasteczko JWT
 */
 
/**
 * @swagger
 * /users/user_logout:
 *   get:
 *     summary: Wylogowanie użytkownika
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Czyści ciasteczko JWT i wraca na stronę główną
 */
 
/**
 * @swagger
 * /users/user_delete:
 *   get:
 *     summary: Usuwa użytkownika (Tylko Admin)
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID użytkownika do usunięcia
 *     responses:
 *       302:
 *         description: Przekierowuje na listę użytkowników po udanym usunięciu
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