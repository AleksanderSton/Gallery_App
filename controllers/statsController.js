const user = require("../models/user");
const gallery = require("../models/gallery");
const image = require("../models/image");
const asyncHandler = require("express-async-handler");

exports.getStats = asyncHandler(async (req, res, next) => {
  const [userCount, galleryCount, imageCount] = await Promise.all([
    user.countDocuments().exec(),
    gallery.countDocuments().exec(),
    image.countDocuments().exec()
  ]);
  res.render("stats", {
    title: "Statystyki Galerii:",
    user_count: userCount,
    gallery_count: galleryCount,
    image_count: imageCount,
    loggedUser: req.loggedUser
  });
});
