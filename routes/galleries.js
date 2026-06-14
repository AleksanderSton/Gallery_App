/**
 * @swagger
 * tags:
 *   - name: Galleries
 *     description: Operacje na galeriach
 */

/**
 * @swagger
 * /galleries:
 *   get:
 *     summary: Lista wszystkich galerii
 *     tags: [Galleries]
 *     responses:
 *       200:
 *         description: Zwraca widok z listą galerii
 */

/**
 * @swagger
 * /galleries/gallery_add:
 *   get:
 *     summary: Formularz dodawania galerii
 *     tags: [Galleries]
 *     responses:
 *       200:
 *         description: Zwraca widok formularza
 *   post:
 *     summary: Dodaje nową galerię
 *     tags: [Galleries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - g_name
 *               - g_description
 *             properties:
 *               g_name:
 *                 type: string
 *               g_description:
 *                 type: string
 *               g_user:
 *                 type: string
 *                 description: ID właściciela (dostępne tylko dla admina)
 *     responses:
 *       200:
 *         description: Zwraca widok z komunikatem
 */

/**
 * @swagger
 * /galleries/gallery_browse:
 *   get:
 *     summary: Przeglądaj galerie (miniatury)
 *     tags: [Galleries]
 *     responses:
 *       200:
 *         description: Zwraca widok przeglądania galerii
 *   post:
 *     summary: Filtrowanie obrazków po konkretnej galerii
 *     tags: [Galleries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               s_gallery:
 *                 type: string
 *                 description: ID wybranej galerii do filtrowania
 *     responses:
 *       200:
 *         description: Zwraca odfiltrowany widok
 */

/**
 * @swagger
 * /galleries/gallery_delete:
 *   get:
 *     summary: Usuwa galerię
 *     tags: [Galleries]
 *     parameters:
 *       - in: query
 *         name: gallery_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID galerii do usunięcia
 *     responses:
 *       302:
 *         description: Przekierowanie po usunięciu
 */

/**
 * @swagger
 * /galleries/gallery_update:
 *   get:
 *     summary: Formularz edycji galerii
 *     tags: [Galleries]
 *     parameters:
 *       - in: query
 *         name: gallery_id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Zwraca formularz z wczytanymi danymi
 *   post:
 *     summary: Aktualizuje dane galerii
 *     tags: [Galleries]
 *     parameters:
 *       - in: query
 *         name: gallery_id
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
 *               g_name:
 *                 type: string
 *               g_description:
 *                 type: string
 *     responses:
 *       302:
 *         description: Przekierowanie do listy galerii
 */

/**
 * @swagger
 * /galleries/gallery_show:
 *   get:
 *     summary: Wyświetla szczegóły galerii i jej zdjęcia
 *     tags: [Galleries]
 *     parameters:
 *       - in: query
 *         name: gallery_id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Zwraca widok szczegółów galerii
 */

var express = require('express');
var router = express.Router();
const galleryController = require("../controllers/galleryController");
const authenticate = require('../middleware/authenticate');

router.get("/", authenticate, galleryController.galleryList);
router.get("/gallery_add", authenticate, galleryController.getGalleryAdd);
router.post("/gallery_add", authenticate, galleryController.postGalleryAdd);
router.get("/gallery_browse", authenticate, galleryController.getGalleryBrowse);
router.post("/gallery_browse", authenticate, galleryController.postGalleryBrowse);
router.get("/gallery_delete", authenticate, galleryController.getGalleryDelete);
router.get("/gallery_update", authenticate, galleryController.getGalleryUpdate);
router.post("/gallery_update", authenticate, galleryController.postGalleryUpdate);
router.get('/gallery_show', authenticate, galleryController.getGalleryShow);

module.exports = router;