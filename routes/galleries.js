/**
 * @swagger
 * tags:
 *   - name: Galleries
 *     description: Operation on galleries
 */

/**
 * @swagger
 * /galleries:
 *   get:
 *     summary: Gallery list
 *     tags: [Galleries]
 *     responses:
 *       200:
 *         description: Returns list of galleries
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