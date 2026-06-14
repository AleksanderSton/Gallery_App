const gallery = require("../models/gallery");
const user = require("../models/user");
const image = require("../models/image");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.galleryList = asyncHandler(async (req, res, next) => {
  const allGalleries = await gallery.find({}).populate("owner").exec();
  res.render("gallery_list", { title: "Wszystkie Galerie",
     gallery_list: allGalleries,
     loggedUser: req.loggedUser 
  });
});
exports.getGalleryAdd = asyncHandler(async (req, res, next) => {
  const isAdmin = req.loggedUser === 'admin';
  const all_users = await user.find().sort({ last_name: 1 }).exec();

  if (isAdmin) {
    res.render("gallery_form", {
      title: "Dodaj galerię",
      users: all_users,
      loggedUser: req.loggedUser,
    });
  } else {
    const loggedUserDoc = await user.findOne({ username: req.loggedUser }).exec();
    res.render("gallery_form_user", {
      title: "Dodaj galerię",
      owner: loggedUserDoc,
      loggedUser: req.loggedUser,
    });
  }
});

exports.postGalleryAdd = [
  body("g_name").trim().isLength({ min: 2 }).escape().withMessage("Gallery name too short."),
  body("g_description").trim().isLength({ min: 2 }).escape().withMessage("Description too short."),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const isAdmin = req.loggedUser === 'admin';

    let ownerId;
    if (isAdmin) {
      ownerId = req.body.g_user;
    } else {
      const loggedUserDoc = await user.findOne({ username: req.loggedUser }).exec();
      ownerId = loggedUserDoc._id;
    }

    const newgallery = new gallery({
      name: req.body.g_name,
      description: req.body.g_description,
      update_time: new Date(),
      owner: ownerId,
    });

    if (!errors.isEmpty()) {
      let myMessages = [];
      errors.array().forEach(err => myMessages.push(err.msg));
      const all_users = await user.find().sort({ last_name: 1 }).exec();

      if (isAdmin) {
        res.render("gallery_form", {
          title: "Dodaj galerię:",
          gallery: newgallery,
          users: all_users,
          loggedUser: req.loggedUser,
          messages: myMessages,
        });
      } else {
        const loggedUserDoc = await user.findOne({ username: req.loggedUser }).exec();
        res.render("gallery_form_user", {
          title: "Dodaj galerię:",
          gallery: newgallery,
          owner: loggedUserDoc,
          loggedUser: req.loggedUser,
          messages: myMessages,
        });
      }
      return;
    }

    const galleryExists = await gallery.findOne({
      name: req.body.g_name,
      owner: ownerId,
    }).exec();

    if (galleryExists) {
      const all_users = await user.find().sort({ last_name: 1 }).exec();
      if (isAdmin) {
        res.render("gallery_form", {
          title: "Dodaj galerię:",
          gallery: newgallery,
          users: all_users,
          loggedUser: req.loggedUser,
          messages: [`Gallery "${newgallery.name}" already exists for this user!`]
        });
      } else {
        const loggedUserDoc = await user.findOne({ username: req.loggedUser }).exec();
        res.render("gallery_form_user", {
          title: "Dodaj galerię:",
          gallery: newgallery,
          owner: loggedUserDoc,
          loggedUser: req.loggedUser,
          messages: [`Gallery "${newgallery.name}" already exists!`]
        });
      }
      return;
    }

    await newgallery.save();
    const all_users = await user.find().sort({ last_name: 1 }).exec();

    if (isAdmin) {
      res.render("gallery_form", {
        title: "Dodaj galerię:",
        gallery: null,
        users: all_users,
        loggedUser: req.loggedUser,
        messages: [`Gallery "${newgallery.name}" added!`]
      });
    } else {
      const loggedUserDoc = await user.findOne({ username: req.loggedUser }).exec();
      res.render("gallery_form_user", {
        title: "Dodaj galerię:",
        gallery: null,
        owner: loggedUserDoc,
        loggedUser: req.loggedUser,
        messages: [`Gallery "${newgallery.name}" added!`]
      });
    }
  }),
];
exports.getGalleryBrowse = asyncHandler(async (req, res, next) => {
  const all_galleries = await gallery.find({}).populate('owner').exec();

  const galleriesWithHighlights = await Promise.all(all_galleries.map(async (gal) => {
    const highlightImg = await image.findOne({ gallery: gal._id }).exec();
    
    return {
      _id: gal._id,
      name: gal.name,
      description: gal.description,
      owner: gal.owner,
      highlightImage: highlightImg ? highlightImg.path : null 
    };
  }));

  res.render("gallery_browse", { 
    title: "Przeglądaj galerie", 
    galleries: galleriesWithHighlights, 
    loggedUser: req.loggedUser 
  });
});

exports.postGalleryBrowse = asyncHandler(async (req, res, next) => {
  const all_galleries = await gallery.find({}).populate('owner').exec();
  
  let gallery_images = [];
  let sel_gallery = null;

  if (req.body.s_gallery) {
    gallery_images = await image.find({ gallery: req.body.s_gallery }).exec();
    sel_gallery = req.body.s_gallery;
  }

  res.render("gallery_browse", { 
    title: "Przeglądaj galerię:", 
    galleries: all_galleries, 
    images: gallery_images, 
    sel_gallery: sel_gallery, 
    loggedUser: req.loggedUser 
  });
});
exports.getGalleryDelete = asyncHandler(async (req, res, next) => {
  const galObj = await gallery.findById(req.query.gallery_id).exec();
  
  const isAdmin = req.loggedUser === "admin";
  
  if (!galObj) {
    return res.redirect(isAdmin ? "/galleries" : "/galleries/gallery_browse");
  }

  const loggedUserDoc = await user.findOne({ username: req.loggedUser }).exec();

  if (isAdmin || (galObj.owner && galObj.owner.toString() === loggedUserDoc._id.toString())) {
    
    const imagesCount = await image.countDocuments({ gallery: req.query.gallery_id }).exec();
    
    if (imagesCount > 0) {
      return res.render("info", { 
        title: "Błąd usuwania", 
        messages: ["Nie można usunąć tej galerii! Galeria nie jest pusta (zawiera obrazki). Najpierw usuń jej zawartość."], 
        loggedUser: req.loggedUser 
      });
    }

    await gallery.findByIdAndDelete(req.query.gallery_id);
    
    res.redirect(isAdmin ? "/galleries" : "/galleries/gallery_browse");
    
  } else {
    res.render("info", { 
      title: "Odmowa dostępu", 
      messages: ["Nie masz uprawnień do usunięcia tej galerii!"], 
      loggedUser: req.loggedUser 
    });
  }
});
exports.getGalleryUpdate = asyncHandler(async (req, res, next) => {
  const galObj = await gallery.findById(req.query.gallery_id).exec();
  if (!galObj) return res.redirect("/galleries");

  const isAdmin = req.loggedUser === "admin";
  const loggedUserDoc = await user.findOne({ username: req.loggedUser }).exec();

  if (isAdmin || galObj.owner.toString() === loggedUserDoc._id.toString()) {
    res.render("gallery_update", {
      title: "Edytuj galerię",
      gallery: galObj,
      loggedUser: req.loggedUser
    });
  } else {
    res.render("info", { title: "Błąd", messages: ["Nie masz uprawnień do edycji."], loggedUser: req.loggedUser });
  }
});

exports.postGalleryUpdate = asyncHandler(async (req, res, next) => {
  const filter = { _id: req.query.gallery_id };
  const update = {
    name: req.body.g_name,
    description: req.body.g_description,
    update_time: new Date()
  };

  await gallery.findOneAndUpdate(filter, update);
  res.redirect("/galleries");
});
exports.getGalleryShow = asyncHandler(async (req, res, next) => {
  const galleryId = req.query.gallery_id;
  
  const galObj = await gallery.findById(galleryId).populate('owner').exec();
  
  if (!galObj) {
    return res.redirect('/galleries/gallery_browse');
  }

  const gallery_images = await image.find({ gallery: galleryId }).exec();

  res.render("gallery_show", {
    title: galObj.name,
    gallery: galObj,
    images: gallery_images,
    loggedUser: req.loggedUser
  });
});