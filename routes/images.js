/**
 * @swagger
 * tags:
 *   - name: Images
 *     description: Operacje na zdjęciach
 */

/**
 * @swagger
 * /images:
 *   get:
 *     summary: Pobiera listę wszystkich obrazków
 *     tags: [Images]
 *     responses:
 *       200:
 *         description: Lista obrazków
 */
var express = require('express');
var router = express.Router();

const imageController = require("../controllers/imageController");
const authenticate = require('../middleware/authenticate'); // Import strażnika

router.get("/", authenticate, imageController.getImageList);
router.get("/image_add", authenticate, imageController.getImageAdd);
router.post("/image_add", authenticate, imageController.postImageAdd);
router.get("/image_update", authenticate, imageController.getImageUpdate); 
router.post("/image_update", authenticate, imageController.postImageUpdate); 
router.get("/image_delete", authenticate, imageController.getImageDelete);
router.get("/image_show", authenticate, imageController.getImageShow); 
router.post("/image_show", authenticate, imageController.postImageComment);

module.exports = router;