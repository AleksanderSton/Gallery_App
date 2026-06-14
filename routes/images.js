/**
 * @swagger
 * tags:
 *   - name: Images
 *     description: Operacje na zdjęciach i komentarzach
 */

/**
 * @swagger
 * /images:
 *   get:
 *     summary: Pobiera listę wszystkich obrazków
 *     tags: [Images]
 *     responses:
 *       200:
 *         description: Zwraca widok z listą obrazków
 */

/**
 * @swagger
 * /images/image_add:
 *   get:
 *     summary: Formularz dodawania zdjęcia
 *     tags: [Images]
 *     responses:
 *       200:
 *         description: Zwraca widok formularza uploadu
 *   post:
 *     summary: Upload nowego zdjęcia do galerii
 *     tags: [Images]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               i_name:
 *                 type: string
 *                 description: Nazwa zdjęcia
 *               i_description:
 *                 type: string
 *                 description: Opis zdjęcia
 *               i_gallery:
 *                 type: string
 *                 description: ID galerii, do której trafi zdjęcie
 *               i_path:
 *                 type: string
 *                 format: binary
 *                 description: Plik ze zdjęciem
 *     responses:
 *       200:
 *         description: Zwraca komunikat o dodaniu zdjęcia
 */

/**
 * @swagger
 * /images/image_update:
 *   get:
 *     summary: Formularz edycji zdjęcia
 *     tags: [Images]
 *     parameters:
 *       - in: query
 *         name: image_id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Widok edycji
 *   post:
 *     summary: Aktualizuje dane o zdjęciu
 *     tags: [Images]
 *     parameters:
 *       - in: query
 *         name: image_id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               i_name:
 *                 type: string
 *               i_description:
 *                 type: string
 *               i_gallery:
 *                 type: string
 *                 description: ID galerii
 *     responses:
 *       302:
 *         description: Przekierowanie do przeglądania galerii
 */

/**
 * @swagger
 * /images/image_delete:
 *   get:
 *     summary: Usuwa zdjęcie
 *     tags: [Images]
 *     parameters:
 *       - in: query
 *         name: image_id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       302:
 *         description: Przekierowuje wstecz po usunięciu
 */

/**
 * @swagger
 * /images/image_show:
 *   get:
 *     summary: Wyświetla pojedyncze zdjęcie wraz z komentarzami
 *     tags: [Images]
 *     parameters:
 *       - in: query
 *         name: image_id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Widok detali zdjęcia
 *   post:
 *     summary: Dodaje nowy komentarz do zdjęcia
 *     tags: [Images]
 *     parameters:
 *       - in: query
 *         name: image_id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - c_text
 *             properties:
 *               c_text:
 *                 type: string
 *                 maxLength: 500
 *                 description: Treść komentarza
 *     responses:
 *       302:
 *         description: Odświeża stronę zdjęcia z nowym komentarzem
 */

var express = require('express');
var router = express.Router();
const imageController = require("../controllers/imageController");
const authenticate = require('../middleware/authenticate');

router.get("/", authenticate, imageController.getImageList);
router.get("/image_add", authenticate, imageController.getImageAdd);
router.post("/image_add", authenticate, imageController.postImageAdd);
router.get("/image_update", authenticate, imageController.getImageUpdate);
router.post("/image_update", authenticate, imageController.postImageUpdate);
router.get("/image_delete", authenticate, imageController.getImageDelete);
router.get("/image_show", authenticate, imageController.getImageShow);
router.post("/image_show", authenticate, imageController.postImageComment);

module.exports = router;